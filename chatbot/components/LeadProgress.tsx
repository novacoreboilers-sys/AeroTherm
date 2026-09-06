import { Check } from "lucide-react";
import type { QuestionProgress } from "../types";

export default function LeadProgress({ progress }: { progress: QuestionProgress[] }) {
  const complete = progress.filter((item) => item.complete).length;

  return (
    <div className="border-b border-bordercol bg-white px-4 py-2.5">
      <div className="mb-2 flex items-center justify-between text-[10px] font-medium text-steel">
        <span>Your enquiry</span>
        <span>{complete} of {progress.length} details</span>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(progress.length, 1)}, minmax(0, 1fr))` }} aria-label={`${complete} of ${progress.length} required details collected`}>
        {progress.map((item) => (
          <div
            key={item.id}
            className={`flex min-w-0 items-center justify-center gap-1 rounded-full px-1.5 py-1 text-[9px] font-medium transition-colors ${
              item.complete
                ? "bg-primary-1 text-white"
                : "border border-bordercol bg-panel text-steel"
            }`}
            title={item.label}
          >
            {item.complete && <Check className="h-2.5 w-2.5 shrink-0" strokeWidth={3} />}
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
