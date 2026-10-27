"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";

export default function MessageComposer({
  onSend,
}: {
  onSend: (body: string) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedLength = draft.trim().length;

  const submit = async () => {
    const body = draft.trim();

    if (!body || body.length > 2000 || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const sent = await onSend(body);

      if (sent) {
        setDraft((current) => (current === draft ? "" : current));
      }
    } finally {
      setSubmitting(false);
      textareaRef.current?.focus();
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-border bg-background px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
        <label className="sr-only" htmlFor="chat-message">
          Write a message
        </label>
        <textarea
          ref={textareaRef}
          id="chat-message"
          name="body"
          value={draft}
          onChange={(event) => setDraft(event.target.value.slice(0, 2000))}
          onKeyDown={onKeyDown}
          maxLength={2000}
          rows={1}
          placeholder="Write a message…"
          className="max-h-40 min-h-11 min-w-0 flex-1 resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          type="submit"
          disabled={!draft.trim() || trimmedLength > 2000 || submitting}
          aria-label="Send message"
          className="h-11 px-4"
        >
          Send
        </Button>
      </div>
      {trimmedLength >= 1800 && (
        <p
          className="mx-auto mt-1 max-w-3xl text-right text-xs text-muted-foreground"
          aria-live="polite"
        >
          {trimmedLength}/2000
        </p>
      )}
    </form>
  );
}
