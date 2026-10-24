import Link from "next/link";
import { Clock, MapPin, Pencil } from "lucide-react";
import { areaLabel, timeSlotLabel } from "@/lib/constants";
import type { PlayRequest } from "@/lib/types";
import { IntentBadge } from "./IntentBadge";

export function MyRequestCard({ request }: { request: PlayRequest }) {
  return (
    <article className="rounded-2xl border-2 border-lawn bg-lawn-light/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm font-semibold italic text-court">You</span>
          <IntentBadge intent={request.intent} />
        </div>
        <Link
          href="/register"
          className="flex items-center gap-1 text-xs font-medium text-court"
          aria-label="プレー希望を編集"
        >
          <Pencil className="h-3.5 w-3.5" />
          編集
        </Link>
      </div>
      <div className="mt-2.5 space-y-1 text-xs text-ink">
        <p className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-court" />
          {request.timeSlots.map(timeSlotLabel).join("・")}
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-court" />
          {request.areas.map(areaLabel).join(" / ")}
        </p>
      </div>
    </article>
  );
}
