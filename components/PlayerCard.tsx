"use client";

import { Clock, MapPin, MessageCircle } from "lucide-react";
import { areaLabel, timeSlotLabel } from "@/lib/constants";
import type { Player } from "@/lib/types";
import { useStore } from "@/lib/store";
import { IntentBadge } from "./IntentBadge";

export function PlayerCard({ player }: { player: Player }) {
  const { showToast } = useStore();
  return (
    <article className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-court-light font-serif text-sm font-semibold text-court">
          {player.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[15px] font-medium">{player.name}</h3>
            <IntentBadge intent={player.intent} />
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">{player.level}</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed">{player.comment}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="space-y-1 text-xs text-ink-muted">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {player.timeSlots.map(timeSlotLabel).join("・")}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {player.areas.map(areaLabel).join(" / ")}
          </p>
        </div>
        <button
          onClick={() => showToast(`${player.name}さんに声をかけました（デモ）`)}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-court px-3.5 text-xs font-medium text-court active:bg-court-light"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          声をかける
        </button>
      </div>
    </article>
  );
}
