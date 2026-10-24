import { MapPin, Users } from "lucide-react";
import type { CourtEvent } from "@/lib/types";
import { addDays, weekdayEn } from "@/lib/date";

export function EventCard({ event, today }: { event: CourtEvent; today: Date }) {
  const date = addDays(today, event.dayOffset);
  const left = event.capacity - event.joined;
  const fewLeft = left <= 2;
  return (
    <article className="flex gap-4 rounded-2xl border border-line bg-white p-4">
      <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-court py-2 text-white">
        <span className="text-[10px] uppercase tracking-wider text-white/70">{weekdayEn(date)}</span>
        <span className="font-serif text-xl font-semibold leading-tight">{date.getDate()}</span>
        <span className="text-[10px] text-white/70">{date.getMonth() + 1}月</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-base font-semibold text-court">{event.title}</h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          {event.time}・{event.level}・¥{event.fee.toLocaleString()}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </p>
        <p className={`mt-1 flex items-center gap-1 text-xs ${fewLeft ? "font-medium text-court" : "text-ink-muted"}`}>
          <Users className="h-3.5 w-3.5" />
          {event.joined}/{event.capacity}名{fewLeft && `・残り${left}枠`}
        </p>
      </div>
    </article>
  );
}
