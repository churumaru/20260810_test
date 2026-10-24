import Link from "next/link";
import { ChevronRight, MapPin, Users } from "lucide-react";
import type { CourtEvent } from "@/lib/types";
import { addDays, weekdayEn } from "@/lib/date";
import { joinedCount } from "@/lib/event";

type Props = { event: CourtEvent; today: Date; joined?: boolean };

export function EventCard({ event, today, joined = false }: Props) {
  const date = addDays(today, event.dayOffset);
  const count = joinedCount(event, joined);
  const left = event.capacity - count;
  const full = left <= 0;
  return (
    <Link
      href={`/events/${event.id}`}
      className={`flex items-center gap-4 rounded-2xl border bg-white p-4 active:bg-cream/60 ${
        joined ? "border-lawn" : "border-line"
      }`}
    >
      <div className="flex w-12 shrink-0 flex-col items-center justify-center self-start rounded-xl bg-court py-2 text-white">
        <span className="text-[10px] uppercase tracking-wider text-white/70">{weekdayEn(date)}</span>
        <span className="font-serif text-xl font-semibold leading-tight">{date.getDate()}</span>
        <span className="text-[10px] text-white/70">{date.getMonth() + 1}月</span>
      </div>
      <div className="min-w-0 flex-1">
        {joined && (
          <span className="mb-1 inline-block rounded-full bg-lawn px-2 py-0.5 text-[10px] font-bold text-court">
            参加予定
          </span>
        )}
        <h3 className="truncate font-serif text-base font-semibold text-court">{event.title}</h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          {event.time}・{event.level}・¥{event.fee.toLocaleString()}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </p>
        <p
          className={`mt-1 flex items-center gap-1 text-xs ${
            left <= 2 && !joined ? "font-medium text-court" : "text-ink-muted"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          {count}/{event.capacity}名
          {full ? "・満員" : left <= 2 && `・残り${left}枠`}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted" />
    </Link>
  );
}
