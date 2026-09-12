"use client";

import * as React from "react";
import { Flame, Loader2, Send } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "I keep putting off the thing I know I need to do.",
  "How do I stay disciplined when I don't feel motivated?",
  "I feel low and stuck after a difficult week.",
  "I feel like a failure and don't know where to start.",
] as const;

export function CoachChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong.");
      }

      // Push an empty assistant message, then stream text into it chunk by
      // chunk as it arrives, rather than waiting for the full reply.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + chunk,
          };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-panel flex min-h-[30rem] min-w-0 flex-col gap-5 rounded-3xl p-3 sm:p-6 lg:p-8">
        {messages.length === 0 ? (
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow-lg shadow-primary/10"><Flame className="h-7 w-7" /></div>
            <p className="max-w-sm text-base leading-7 text-muted-foreground">
              You do not have to explain everything perfectly. Tell the coach
              what hurts, what feels stuck, or what you need help carrying
              today. Start with one of these:
            </p>
            <div className="grid w-full gap-3 sm:grid-cols-2">
              {STARTER_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className="h-full min-w-0 justify-start whitespace-normal break-words rounded-xl px-4 py-3 text-left text-xs leading-5"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isStreaming}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            {messages.map((message, index) => (
              <li
                key={index}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  {message.role === "assistant" ? (
                    <AvatarFallback>
                      <Flame className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback>YOU</AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={cn(
                    "min-w-0 max-w-[88%] break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%]",
                    message.role === "assistant"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.content || (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div ref={scrollRef} />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <form onSubmit={handleSubmit} className="glass-panel flex items-end gap-2 rounded-2xl p-2 sm:gap-3">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage(input);
            }
          }}
          placeholder="What are you working through today?"
          className="min-h-[3rem] min-w-0 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          maxLength={4000}
        />
        <Button
          type="submit"
          variant="ember"
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </Button>
      </form>
    </div>
  );
}
