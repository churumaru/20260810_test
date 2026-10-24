"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, CircleHelp, Clock, MapPin, Pencil, RotateCcw, UserRound } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BottomSheet } from "@/components/BottomSheet";
import { IntentBadge } from "@/components/IntentBadge";
import { InvitationBadge } from "@/components/InvitationBadge";
import { NotificationBell } from "@/components/NotificationBell";
import { TabHeader } from "@/components/PageHeader";
import { areaLabel, timeSlotLabel } from "@/lib/constants";
import { addDays, formatShort, fromKey, toKey } from "@/lib/date";
import { EVENTS, findPlayer } from "@/lib/mock";
import { useStore } from "@/lib/store";

export default function MyPage() {
  const { ready, request, invitations, joinedEvents, resetAll, showToast } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const today = useMemo(() => new Date(), []);

  const todayKey = toKey(today);
  const upcomingDates = (request?.dates ?? []).filter((d) => d >= todayKey);
  const confirmed = invitations.filter((x) => x.status === "accepted").length;
  const myEvents = EVENTS.filter((e) => joinedEvents.includes(e.id)).sort((a, b) => a.dayOffset - b.dayOffset);
  const sortedInvites = [...invitations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleReset = () => {
    resetAll();
    setConfirmReset(false);
    showToast("デモデータをリセットしました");
  };

  return (
    <>
      <TabHeader en="My Page" ja="マイページ" right={<NotificationBell />} />
      <main className="space-y-7 px-5 pb-28 pt-2">
        {/* プロフィール */}
        <section className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-court font-serif text-lg font-semibold text-lawn">
            You
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">ゲストさん</p>
            <p className="mt-0.5 text-xs text-ink-muted">NTRP 3.5・渋谷区在住</p>
          </div>
          <button
            onClick={() => showToast("プロフィール編集は準備中です")}
            className="flex h-9 items-center gap-1 rounded-full px-3 text-xs font-medium text-court ring-1 ring-court"
          >
            <Pencil className="h-3.5 w-3.5" />
            編集
          </button>
        </section>

        {/* 数字 */}
        <section className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-white py-3 text-center">
          <Stat value={ready ? invitations.length : 0} label="声かけ" />
          <Stat value={ready ? confirmed : 0} label="確定" />
          <Stat value={ready ? myEvents.length : 0} label="参加予定" />
        </section>

        {/* プレー希望 */}
        <section>
          <SectionTitle en="My Request" ja="プレー希望" />
          {ready && request ? (
            <Link href="/register" className="block rounded-2xl border-2 border-lawn bg-lawn-light/60 p-4">
              <div className="flex items-center justify-between">
                <IntentBadge intent={request.intent} />
                <span className="flex items-center gap-1 text-xs font-medium text-court">
                  編集
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {upcomingDates.length > 0 ? (
                  upcomingDates.map((d) => (
                    <span key={d} className="rounded-full bg-white px-2.5 py-1 text-xs ring-1 ring-line">
                      {formatShort(fromKey(d))}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ink-muted">希望日がすべて過ぎています。更新しましょう。</span>
                )}
              </div>
              <div className="mt-3 space-y-1 text-xs">
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-court" />
                  {request.timeSlots.map(timeSlotLabel).join("・")}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-court" />
                  {request.areas.map(areaLabel).join(" / ")}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/register"
              className="flex items-center justify-between rounded-2xl border border-dashed border-court/40 px-4 py-4 text-sm"
            >
              <span>まだプレー希望を登録していません</span>
              <span className="flex items-center text-xs font-medium text-court">
                登録する
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </section>

        {/* 声かけ */}
        <section>
          <SectionTitle en="Invites" ja="声をかけた人" />
          {ready && sortedInvites.length > 0 ? (
            <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
              {sortedInvites.map((inv) => {
                const p = findPlayer(inv.playerId);
                if (!p) return null;
                return (
                  <li key={inv.id}>
                    <Link href={`/players/${p.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-cream/60">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-light font-serif text-xs font-semibold text-court">
                        {p.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{p.name}</span>
                        <span className="block text-xs text-ink-muted">
                          {formatShort(fromKey(inv.date))}・{timeSlotLabel(inv.timeSlot)}
                        </span>
                      </span>
                      <InvitationBadge status={inv.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty>
              気になる人に声をかけてみましょう。
              <Link href="/search" className="ml-1 font-medium text-court underline underline-offset-4">
                さがす
              </Link>
            </Empty>
          )}
        </section>

        {/* 参加予定のイベント */}
        <section>
          <SectionTitle en="Joined Events" ja="参加予定のイベント" />
          {ready && myEvents.length > 0 ? (
            <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
              {myEvents.map((e) => (
                <li key={e.id}>
                  <Link href={`/events/${e.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-cream/60">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-[15px] font-semibold text-court">{e.title}</span>
                      <span className="block text-xs text-ink-muted">
                        {formatShort(addDays(today, e.dayOffset))} {e.time}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>
              参加予定のイベントはありません。
              <Link href="/events" className="ml-1 font-medium text-court underline underline-offset-4">
                イベントを見る
              </Link>
            </Empty>
          )}
        </section>

        {/* 設定 */}
        <section>
          <SectionTitle en="Settings" ja="設定" />
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            <SettingItem icon={UserRound} label="アカウント" onClick={() => showToast("アカウント設定は準備中です")} />
            <SettingItem icon={Bell} label="通知設定" onClick={() => showToast("通知設定は準備中です")} />
            <SettingItem icon={CircleHelp} label="ヘルプ・お問い合わせ" onClick={() => showToast("ヘルプは準備中です")} />
            <SettingItem icon={RotateCcw} label="デモデータをリセット" onClick={() => setConfirmReset(true)} />
          </ul>
          <p className="mt-6 text-center font-serif text-xs italic text-ink-muted">Courtly — prototype</p>
        </section>
      </main>
      <BottomNav />

      <BottomSheet
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="デモデータをリセットしますか？"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setConfirmReset(false)} className="h-12 rounded-full border border-line bg-white text-sm font-medium">
              戻る
            </button>
            <button onClick={handleReset} className="h-12 rounded-full bg-court text-sm font-bold text-white">
              リセットする
            </button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed">
          このブラウザに保存されたプレー希望・声かけ・イベント参加・既読状態をすべて消して、初期状態に戻します。
        </p>
      </BottomSheet>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-serif text-2xl font-semibold text-court">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  );
}

function SectionTitle({ en, ja }: { en: string; ja: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="font-serif text-xl font-semibold text-court">{en}</h2>
      <span className="text-xs text-ink-muted">{ja}</span>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-muted">{children}</p>;
}

function SettingItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button onClick={onClick} className="flex h-12 w-full items-center gap-3 px-4 text-left text-sm active:bg-cream/60">
        <Icon className="h-4 w-4 text-court" />
        <span className="flex-1">{label}</span>
        <ChevronRight className="h-4 w-4 text-ink-muted" />
      </button>
    </li>
  );
}
