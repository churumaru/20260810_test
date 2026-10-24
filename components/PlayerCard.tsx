"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCheck, ChevronRight, Clock, Hourglass, MapPin, MessageCircle } from "lucide-react";
import { areaLabel, timeSlotLabel } from "@/lib/constants";
import type { Player } from "@/lib/types";
import { useStore } from "@/lib/store";
import { IntentBadge } from "./IntentBadge";
import { InviteSheet } from "./InviteSheet";

export function PlayerCard({ player, date }: { player: Player; date?: string }) {
  const { invitationFor } = useStore();
  const [open, setOpen] = useState(false);
  const invitation = invitationFor(player.id);

  return (
    <article className="rounded-2xl border border-line bg-white">
      <Link href={`/players/${player.id}`} className="block p-4 pb-0 active:bg-cream/60">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-court-light font-serif text-sm font-semibold text-court">
            {player.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex min-w-0 items-center text-[15px] font-medium">
                <span className="truncate">{player.name}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted" />
              </h3>
              <IntentBadge intent={player.intent} />
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">{player.level}</p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed">{player.comment}</p>
      </Link>
      <div className="flex items-end justify-between gap-3 p-4 pt-3">
        <div className="min-w-0 space-y-1 text-xs text-ink-muted">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {player.timeSlots.map(timeSlotLabel).join("・")}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{player.areas.map(areaLabel).join(" / ")}</span>
          </p>
        </div>
        {invitation?.status === "accepted" ? (
          <Link
            href={`/players/${player.id}`}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-lawn px-3.5 text-xs font-bold text-court"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            確定
          </Link>
        ) : invitation ? (
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-lawn-light px-3.5 text-xs font-medium text-court"
          >
            <Hourglass className="h-3.5 w-3.5" />
            返事待ち
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-court px-3.5 text-xs font-medium text-court active:bg-court-light"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            声をかける
          </button>
        )}
      </div>
      <InviteSheet player={player} open={open} onClose={() => setOpen(false)} initialDate={date} />
    </article>
  );
}
