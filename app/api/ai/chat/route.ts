import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { streamCoachReply, type CoachMessage } from "@/lib/ai-coach";
import { getFallbackMotivation } from "@/lib/motivation-fallback";

// Keep both the conversation length and each message's size bounded — this
// is a per-request cost (a real Groq API call), so an unbounded body is a
// real abuse vector, not just a theoretical one.
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
      })
    )
    .min(1)
    .max(MAX_MESSAGES),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  // The most recent message must be from the user — otherwise there's
  // nothing for the coach to respond to.
  const messages: CoachMessage[] = parsed.data.messages;
  if (messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "The last message must be from you." },
      { status: 400 }
    );
  }

  let groqStream;
  try {
    groqStream = await streamCoachReply(messages);
  } catch (error) {
    console.error("Failed to start AI Coach stream:", error);
    return new Response(
      getFallbackMotivation(messages[messages.length - 1].content),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Groq's API is OpenAI-compatible: each chunk carries its text
        // delta at choices[0].delta.content (often undefined on the final
        // chunk, which just carries the finish_reason).
        for await (const chunk of groqStream) {
          const textDelta = chunk.choices[0]?.delta?.content;
          if (textDelta) {
            controller.enqueue(encoder.encode(textDelta));
          }
        }
        controller.close();
      } catch (error) {
        console.error("AI Coach stream error:", error);
        controller.error(error);
      }
    },
    cancel() {
      groqStream.controller.abort();
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
