import { Bot, RotateCcw, X } from "lucide-react";
import { chatbotConfig } from "../config";

export default function ChatHeader({
  onClose,
  onReset,
  busy,
}: {
  onClose: () => void;
  onReset: () => void;
  busy: boolean;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-bordercol bg-[linear-gradient(135deg,#f7fafc_0%,#eef4f8_100%)] px-4 py-3.5">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-1 text-white shadow-[0_8px_20px_rgba(10,77,143,0.2)]">
        <Bot className="h-5 w-5" strokeWidth={2.2} />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 id="aerotherm-chat-title" className="text-[13px] font-semibold text-navy">
            {chatbotConfig.assistantName} from {chatbotConfig.brandName}
          </h2>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700">
            Online
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-steel">
          {chatbotConfig.headerSubtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={busy}
        className="flex h-9 w-9 items-center justify-center rounded-full text-steel transition-colors hover:bg-white hover:text-primary-1 disabled:opacity-40"
        aria-label="Start a new conversation"
        title="Start over"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-full text-steel transition-colors hover:bg-white hover:text-navy"
        aria-label="Close chat"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );
}
