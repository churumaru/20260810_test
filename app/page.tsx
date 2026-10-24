"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarCheck, ChevronRight, PenLine } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DateStrip } from "@/components/DateStrip";
import { PlayerCard } from "@/components/PlayerCard";
import { MyRequestCard } from "@/components/MyRequestCard";
import { EventCard } from "@/components/EventCard";
import { BottomNav } from "@/components/BottomNav";
import { NotificationBell } from "@/components/NotificationBell";
import { EVENTS, PLAYERS } from "@/lib/mock";
import { formatJa, formatShort, fromKey, offsetToKey, toKey, upcomingDays } from "@/lib/date";
import { TIME_SLOTS } from "@/lib/constants";
import { useStore } from "@/lib/store";

const DAYS_AHEAD = 14;

export default function HomePage() {
  const { ready, request, selectedDate, setSelectedDate, invitations, joinedEvents } = useStore();

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

  // 次の予定：確定した声かけ + 参加予定のイベント（日付順・最大3件）
  const todayKey = toKey(today);
  const plans = [
    ...invitations
      .filter((x) => x.status === "accepted" && x.date >= todayKey)
      .map((x) => {
        const p = PLAYERS.find((pl) => pl.id === x.playerId);
        return {
          key: x.id,
          date: x.date,
          href: `/players/${x.playerId}`,
          title: `${p?.name ?? ""}さんとテニス`,
          sub: TIME_SLOTS.filter((t) => t.id === x.timeSlot).map((t) => `${t.label} ${t.range}`)[0] ?? "",
        };
      }),
    ...EVENTS.filter((e) => joinedEvents.includes(e.id)).map((e) => ({
      key: e.id,
      date: offsetToKey(e.dayOffset, today),
      href: `/events/${e.id}`,
      title: e.title,
      sub: e.time,
    })),
  ]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const upcomingEvents = [...EVENTS].sort((a, b) => a.dayOffset - b.dayOffset).slice(0, 3);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-cream/95 px-5 backdrop-blur">
        <Logo />
        <NotificationBell />
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

        {/* 次の予定 */}
        {ready && plans.length > 0 && (
          <section>
            <div className="mb-3 flex items-end justify-between">
              <h2 className="font-serif text-xl font-semibold text-court">Next Up</h2>
              <span className="text-xs text-ink-muted">次の予定</span>
            </div>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
              {plans.map((plan) => (
                <li key={plan.key}>
                  <Link href={plan.href} className="flex items-center gap-3 px-4 py-3 active:bg-cream/60">
                    <CalendarCheck className="h-4 w-4 shrink-0 text-court" />
                    <span className="w-[72px] shrink-0 text-xs font-medium text-court">
                      {formatShort(fromKey(plan.date))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{plan.title}</span>
                      <span className="block text-[11px] text-ink-muted">{plan.sub}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
            {ready && players.map((p) => <PlayerCard key={p.id} player={p} date={selectedDate} />)}
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
            <Link href="/events" className="flex items-center text-xs text-ink-muted">
              すべて見る
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {ready &&
              upcomingEvents.map((e) => (
                <EventCard key={e.id} event={e} today={today} joined={joinedEvents.includes(e.id)} />
              ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
