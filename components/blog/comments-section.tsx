"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, MessageSquare, Send } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PublicComment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorImage: string | null;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CommentsSection({ slug }: { slug: string }) {
  const pathname = usePathname();
  const loginNext = pathname ?? "/";
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = React.useState<PublicComment[] | null>(null);
  const [content, setContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data: { comments: PublicComment[] }) => {
        if (!cancelled) setComments(data.comments ?? []);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setFeedback(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Couldn't post that comment.");
        return;
      }

      setFeedback(data.message);
      setContent("");
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-16 flex flex-col gap-6 border-t border-border pt-10">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl tracking-wide">
          COMMENTS
          {comments && comments.length > 0 ? (
            <span className="text-primary"> ({comments.length})</span>
          ) : null}
        </h2>
      </div>

      {!authLoading && user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your take..."
            required
            minLength={3}
            maxLength={2000}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" variant="ember" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Post Comment
            </Button>
            {feedback ? (
              <p className="text-sm text-primary">{feedback}</p>
            ) : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
      ) : !authLoading ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/login?next=${encodeURIComponent(loginNext)}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>{" "}
            to join the conversation.
          </p>
        </div>
      ) : null}

      {comments === null ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet — be the first to weigh in.
        </p>
      ) : (
        <ul className="flex flex-col gap-5">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                {comment.authorImage ? (
                  <AvatarImage src={comment.authorImage} alt="" />
                ) : null}
                <AvatarFallback>
                  {initialsOf(comment.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {comment.authorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="mt-1 text-sm text-foreground/90">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
