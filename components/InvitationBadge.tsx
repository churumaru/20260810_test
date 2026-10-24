import { CheckCheck, Hourglass } from "lucide-react";
import type { InvitationStatus } from "@/lib/types";

export function InvitationBadge({ status }: { status: InvitationStatus }) {
  return status === "accepted" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-lawn px-2 py-0.5 text-[11px] font-bold text-court">
      <CheckCheck className="h-3 w-3" />
      確定
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[11px] text-ink-muted ring-1 ring-line">
      <Hourglass className="h-3 w-3" />
      返事待ち
    </span>
  );
}
