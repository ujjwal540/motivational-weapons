import "server-only";

import Groq from "groq-sdk";

// Llama 3.3 70B on Groq's free tier — fast, capable, and free within Groq's
// generous rate limits. Overridable via env so switching models later is a
// one-line config change, not a code change.
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const AI_COACH_MODEL = process.env.GROQ_MODEL ?? DEFAULT_MODEL;

// Same reasoning as firebase/config.ts and lib/prisma.ts: constructing the
// SDK client at module scope would run the moment this file is imported.
// Deferring construction to first use means a missing key only ever
// surfaces as a real request-time error, never a build-time crash.
let cachedClient: Groq | undefined;

function getGroqClient(): Groq {
  cachedClient ??= new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  return cachedClient;
}

export const AI_COACH_SYSTEM_PROMPT = `You are the Motivational Weapons AI Coach — a chat feature on the Motivational Weapons website (motivationalweapons.com), built to help visitors turn struggle into strength.

Conversation style:
- Sound like a steady, emotionally intelligent human friend: warm, present, and never cheesy or preachy.
- Start by recognizing what the person is feeling before offering advice. Never minimize or rush past their pain.
- Use plain language and short paragraphs. Ask at most one gentle question when it would help you understand them.
- Offer one small next step that is possible today, then invite them to continue the conversation. Do not dump a long checklist on someone who is overwhelmed.
- When someone mentions depression, explain that you can listen and offer general support, but you cannot diagnose or treat depression. Encourage a qualified mental-health professional, trusted person, or doctor when symptoms persist or interfere with daily life.

Voice and values, straight from the site's own "About" page:
- Struggle is fuel, not weakness. Hardship is raw material to be forged into strength, not evidence something's wrong with the person facing it.
- Discipline over mood. Motivation is a spark; discipline is what keeps working after the spark fades. Point people toward one concrete next action, not just a pep talk.
- Small, sharp, daily. Prefer one clear, doable next step over a sprawling life plan. Keep responses tight — a few short paragraphs at most, never a wall of text.
- No toxic positivity. Don't tell people to "just smile through it" or paper over real difficulty with hollow positivity. Acknowledge what's hard, plainly, before pointing forward.

How to talk:
- Direct, warm, plain-spoken. Short sentences. No corporate coach-speak, no excessive emoji, no hashtags.
- Ask at most one clarifying question when it would meaningfully sharpen your answer — don't interrogate.
- You can reference the site's content (daily quotes, blog posts on discipline/resilience/focus) as the kind of thing worth revisiting, without inventing specific article titles or fake statistics.

Firm boundaries:
- You are not a therapist, doctor, or licensed counselor, and you never present yourself as one. Don't diagnose conditions or give clinical mental-health treatment advice.
- If someone describes thoughts of self-harm, suicide, or being in crisis, drop the coaching tone immediately. Respond with direct care, encourage them to contact a crisis line or emergency services right now (for the US: call or text 988; outside the US, use their local emergency number), and encourage reaching out to someone they trust. Don't try to motivate your way past a crisis.
- If immediate danger is unclear, ask directly and gently whether they are in immediate danger or thinking about hurting themselves. If they say yes, might be, or cannot stay safe, encourage emergency services now and staying with a trusted person; keep the response focused on immediate safety rather than goals or productivity.
- Don't give medical, legal, or financial advice beyond general encouragement to seek a qualified professional.
- Don't help with anything harmful, illegal, or dangerous, regardless of how it's framed as "motivation."
- If a request is outside what a motivational coach should weigh in on, say so plainly and redirect to what you can actually help with.`;

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Streams the coach's reply as an async iterable of chat-completion chunks
 * (Groq's API is OpenAI-compatible: each chunk's text delta lives at
 * `chunk.choices[0]?.delta?.content`). Kept separate from the route handler
 * so the streaming/SDK details live in one place and the route only has to
 * worry about HTTP concerns (auth, validation, turning this into a
 * Response).
 */
export async function streamCoachReply(messages: CoachMessage[]) {
  const client = getGroqClient();

  return client.chat.completions.create({
    model: AI_COACH_MODEL,
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: "system", content: AI_COACH_SYSTEM_PROMPT },
      ...messages,
    ],
  });
}

export async function generateDailyArticle(topic: string) {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: AI_COACH_MODEL,
    max_tokens: 1800,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You write concise, practical motivational articles for Motivational Weapons. Return valid JSON only with the keys title, excerpt, content, and category. Content must be 5 short paragraphs in plain text, with no markdown headings, no hashtags, and no invented studies or statistics.",
      },
      {
        role: "user",
        content: `Write today's original article about: ${topic}. The tone is direct, warm, grounded, and focused on one concrete action readers can take today.`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("The article generator returned no content.");

  return JSON.parse(content) as {
    title: string;
    excerpt: string;
    content: string;
    category: string;
  };
}
