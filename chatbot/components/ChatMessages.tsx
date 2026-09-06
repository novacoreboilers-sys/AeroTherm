import { Bot, LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { chatbotConfig } from "../config";
import type { ChatMessage } from "../types";
import styles from "./ChatMessages.module.css";

export default function ChatMessages({
  messages,
  busy,
}: {
  messages: ChatMessage[];
  busy: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const waitingForFirstChunk = busy && messages.at(-1)?.content === "";
  const submitting = busy && messages.at(-1)?.role === "user";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  return (
    <div
      className={`${styles.scrollArea} min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(42,167,223,0.08),transparent_35%),linear-gradient(180deg,#f7fafc_0%,#eef4f8_100%)] px-4 py-4`}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="space-y-3">
        {messages.filter((message) => message.content).map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-bordercol bg-white text-primary-1 shadow-sm">
                <Bot className="h-3.5 w-3.5" />
              </span>
            )}
            <div
              className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[12px] leading-[1.55] shadow-[0_6px_18px_rgba(17,17,17,0.05)] ${
                message.role === "user"
                  ? "rounded-br-[5px] bg-primary-1 text-white"
                  : "rounded-bl-[5px] border border-bordercol bg-white text-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {(waitingForFirstChunk || submitting) && (
          <div className="flex items-end gap-2" aria-label={`${chatbotConfig.assistantName} is thinking`}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-bordercol bg-white text-primary-1">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-[5px] border border-bordercol bg-white px-3.5 py-2.5 text-[11px] text-steel">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary-2" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
