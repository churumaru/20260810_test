"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Leaf } from "lucide-react";
import { Chip } from "@/components/Chip";
import { PageHeader } from "@/components/PageHeader";
import { AREAS, INTENTS, TIME_SLOTS } from "@/lib/constants";
import { toKey, upcomingDays, weekdayJa } from "@/lib/date";
import { useStore } from "@/lib/store";
import type { Area, Intent, TimeSlot } from "@/lib/types";

const DAYS_AHEAD = 14;

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export default function RegisterPage() {
  const router = useRouter();
  const { ready, request, saveRequest, clearRequest, setSelectedDate, showToast } = useStore();

  const [intent, setIntent] = useState<Intent | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const days = useMemo(() => (ready ? upcomingDays(DAYS_AHEAD) : []), [ready]);

  // 登録済みの希望があればフォームに反映（過去日は除外）
  useEffect(() => {
    if (!ready || !request) return;
    const valid = new Set(days.map(toKey));
    setIntent(request.intent);
    setDates(request.dates.filter((d) => valid.has(d)));
    setTimeSlots(request.timeSlots);
    setAreas(request.areas);
  }, [ready, request, days]);

  const missing = [
    !intent && "意欲",
    dates.length === 0 && "希望日",
    timeSlots.length === 0 && "時間帯",
    areas.length === 0 && "地域",
  ].filter(Boolean) as string[];
  const canSave = missing.length === 0;

  const handleSave = () => {
    if (!intent || !canSave) return;
    saveRequest({ intent, dates, timeSlots, areas });
    setSelectedDate([...dates].sort()[0]);
    showToast("プレー希望を保存しました");
    router.push("/");
  };

  const handleClear = () => {
    clearRequest();
    showToast("プレー希望を取り消しました");
    router.push("/");
  };

  return (
    <>
      <PageHeader title="プレー希望の登録" />

      <main className="space-y-8 px-5 pb-40 pt-3">
        <section>
          <SectionTitle en="Your Spirit" ja="プレー意欲" />
          <div className="grid gap-3">
            {INTENTS.map((opt) => {
              const selected = intent === opt.id;
              const Icon = opt.id === "must" ? Flame : Leaf;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIntent(opt.id)}
                  aria-pressed={selected}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                    selected ? "border-court bg-court text-white" : "border-line bg-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      selected ? "bg-white/10 text-lawn" : "bg-court-light text-court"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15px] font-bold">{opt.label}</span>
                    <span className={`mt-0.5 block text-xs ${selected ? "text-white/70" : "text-ink-muted"}`}>
                      {opt.description}
                    </span>
                  </span>
                  <span
                    className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                      selected ? "border-lawn bg-lawn shadow-[inset_0_0_0_3px_#184332]" : "border-line"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <SectionTitle en="Dates" ja="希望日" note="複数選択可" />
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => {
              const key = toKey(d);
              const selected = dates.includes(key);
              const weekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDates((v) => toggle(v, key))}
                  aria-pressed={selected}
                  aria-label={`${d.getMonth() + 1}月${d.getDate()}日`}
                  className={`flex aspect-[4/5] flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                    selected ? "border-court bg-court text-white" : "border-line bg-white"
                  }`}
                >
                  <span
                    className={`text-[10px] ${
                      selected ? "text-white/70" : weekend ? "font-medium text-court" : "text-ink-muted"
                    }`}
                  >
                    {i === 0 ? "今日" : weekdayJa(d)}
                  </span>
                  <span className="font-serif text-base font-semibold leading-tight">{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <SectionTitle en="Time" ja="時間帯" note="複数選択可" />
          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((t) => (
              <Chip
                key={t.id}
                selected={timeSlots.includes(t.id)}
                onClick={() => setTimeSlots((v) => toggle(v, t.id))}
                className="h-12"
              >
                <span className="font-medium">{t.label}</span>
                <span className="text-xs opacity-70">{t.range}</span>
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle en="Area" ja="地域" note="複数選択可" />
          <div className="grid grid-cols-2 gap-2">
            {AREAS.map((a) => (
              <Chip key={a.id} selected={areas.includes(a.id)} onClick={() => setAreas((v) => toggle(v, a.id))}>
                {a.label}
              </Chip>
            ))}
          </div>
        </section>

        {request && (
          <button
            type="button"
            onClick={handleClear}
            className="w-full py-2 text-center text-xs text-ink-muted underline underline-offset-4"
          >
            登録済みの希望を取り消す
          </button>
        )}
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-cream/95 px-5 pt-3 backdrop-blur">
        <p className="mb-2 h-4 text-center text-[11px] text-ink-muted">
          {canSave ? `${dates.length}日・${timeSlots.length}時間帯・${areas.length}地域` : `未選択：${missing.join("・")}`}
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="mb-3 h-12 w-full rounded-full bg-court text-sm font-bold text-white transition-opacity active:opacity-90 disabled:opacity-35"
        >
          {request ? "変更を保存する" : "保存する"}
        </button>
      </div>
    </>
  );
}

function SectionTitle({ en, ja, note }: { en: string; ja: string; note?: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-2">
      <h2 className="font-serif text-lg font-semibold text-court">{en}</h2>
      <span className="text-sm font-medium">{ja}</span>
      {note && <span className="ml-auto text-[11px] text-ink-muted">{note}</span>}
    </div>
  );
}
