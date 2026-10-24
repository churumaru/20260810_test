"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell, ChevronRight, PenLine } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DateStrip } from "@/components/DateStrip";
import { PlayerCard } from "@/components/PlayerCard";
import { MyRequestCard } from "@/components/MyRequestCard";
import { EventCard } from "@/components/EventCard";
import { BottomNav } from "@/components/BottomNav";
import { EVENTS, PLAYERS } from "@/lib/mock";
import { formatJa, fromKey, offsetToKey, toKey, upcomingDays } from "@/lib/date";
import { useStore } from "@/lib/store";

const DAYS_AHEAD = 14;

export default function HomePage() {
  const { ready, request, selectedDate, setSelectedDate } = useStore();

  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => upcomingDays(DAYS_AHEAD, today), [today]);

  // 日付キー → その日にプレーしたい人
  const playersByDate = useMemo(() => {
    const map: Record<string, typeof PLAYERS> = {};
    for (const p of PLAYERS) {
      for (const offset of p.dayOffsets) {
        const key = offsetToKey(offset, today);
        (map[key] ??= []).push(p);
      }
    }
    return map;
  }, [today]);

  const counts = useMemo(
    () => Object.fromEntries(Object.entries(playersByDate).map(([k, v]) => [k, v.length])),
    [playersByDate],
  );

  const players = [...(playersByDate[selectedDate] ?? [])].sort((a, b) =>
    a.intent === b.intent ? 0 : a.intent === "must" ? -1 : 1,
  );
  const myDates = request?.dates ?? [];
  const iWantToPlay = myDates.includes(selectedDate);
  const isToday = selectedDate === toKey(today);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-cream/95 px-5 backdrop-blur">
        <Logo />
        <button aria-label="お知らせ" className="flex h-10 w-10 items-center justify-center rounded-full text-court">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <main className="space-y-8 px-5 pb-28 pt-2">
        {/* プレー意欲登録 */}
        <section className="rounded-3xl bg-court p-5 text-white">
          <p className="font-serif text-sm italic text-lawn">Ready to play?</p>
          <h1 className="mt-1 text-lg font-bold leading-snug">
            {request ? "プレー希望を登録済みです" : "今週、テニスしませんか。"}
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-white/70">
            {request
              ? `${request.dates.length}日分の希望が公開中。いつでも変更できます。`
              : "希望日と地域を登録すると、同じ気持ちの人とつながれます。"}
          </p>
          <Link
            href="/register"
            className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-lawn text-sm font-bold text-court active:opacity-90"
          >
            <PenLine className="h-4 w-4" />
            {request ? "プレー希望を編集する" : "プレー意欲を登録する"}
          </Link>
        </section>

        {/* カレンダー + プレーしたい人 */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-serif text-xl font-semibold text-court">Who&apos;s Playing</h2>
            <span className="text-xs text-ink-muted">プレーしたい人</span>
          </div>

          {ready ? (
            <DateStrip
              days={days}
              selected={selectedDate}
              onSelect={setSelectedDate}
              counts={counts}
              myDates={myDates}
            />
          ) : (
            <div className="h-[86px]" />
          )}

          <div className="mt-5 flex items-baseline justify-between">
            <p className="text-sm font-medium">
              {ready && formatJa(fromKey(selectedDate))}
              {isToday && <span className="ml-1.5 text-xs text-court">今日</span>}
            </p>
            <p className="text-xs text-ink-muted">
              <span className="font-serif text-base font-semibold text-court">{players.length}</span> 人
            </p>
          </div>

          <div className="mt-3 space-y-3">
            {ready && iWantToPlay && request && <MyRequestCard request={request} />}
            {ready && players.map((p) => <PlayerCard key={p.id} player={p} />)}
            {ready && players.length === 0 && !iWantToPlay && (
              <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
                <p className="text-sm text-ink-muted">この日はまだ誰も登録していません。</p>
                <Link href="/register" className="mt-2 inline-block text-sm font-medium text-court underline underline-offset-4">
                  最初の一人になる
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 開催予定イベント */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-serif text-xl font-semibold text-court">Upcoming Events</h2>
            <button className="flex items-center text-xs text-ink-muted">
              すべて見る
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {ready && EVENTS.map((e) => <EventCard key={e.id} event={e} today={today} />)}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
