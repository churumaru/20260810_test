import { Flame, Leaf } from "lucide-react";
import type { Intent } from "@/lib/types";

export function IntentBadge({ intent }: { intent: Intent }) {
  return intent === "must" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-court px-2 py-0.5 text-[11px] font-medium text-white">
      <Flame className="h-3 w-3 text-lawn" />
      絶対やりたい
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-lawn-light px-2 py-0.5 text-[11px] font-medium text-court">
      <Leaf className="h-3 w-3" />
      条件次第
    </span>
  );
}
