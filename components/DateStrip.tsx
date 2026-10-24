"use client";

import { useEffect, useRef } from "react";
import { toKey, weekdayEn } from "@/lib/date";

type Props = {
  days: Date[];
  selected: string;
  onSelect: (key: string) => void;
  /** 日付ごとの「プレーしたい人」の数 */
  counts: Record<string, number>;
  myDates: string[];
};

export function DateStrip({ days, selected, onSelect, counts, myDates }: Props) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="no-scrollbar -mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1">
      {days.map((d, i) => {
        const key = toKey(d);
        const isSelected = key === selected;
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const count = counts[key] ?? 0;
        const mine = myDates.includes(key);
        return (
          <button
            key={key}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => onSelect(key)}
            aria-pressed={isSelected}
            className={`flex w-[54px] shrink-0 snap-start flex-col items-center rounded-2xl border py-2.5 transition-colors ${
              isSelected ? "border-court bg-court text-white" : "border-line bg-white text-ink"
            }`}
          >
            <span
              className={`text-[10px] font-medium uppercase tracking-wider ${
                isSelected ? "text-white/70" : isWeekend ? "text-court" : "text-ink-muted"
              }`}
            >
              {i === 0 ? "Today" : weekdayEn(d)}
            </span>
            <span className="mt-0.5 font-serif text-xl font-semibold leading-tight">{d.getDate()}</span>
            <span className="mt-1 flex h-1.5 items-center gap-0.5">
              {count > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-lawn" />
              )}
              {mine && (
                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-court"}`} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
