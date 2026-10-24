"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Clock, Home, MapPin, MessageCircle, Pencil, Trophy } from "lucide-react";
import { IntentBadge } from "@/components/IntentBadge";
import { InviteSheet } from "@/components/InviteSheet";
import { PLAY_STYLES, areaLabel, timeSlotLabel } from "@/lib/constants";
import { formatJa, fromKey } from "@/lib/date";
import { findPlayer } from "@/lib/mock";
import { playerDates } from "@/lib/player";
import { useStore } from "@/lib/store";

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { ready, request, invitationFor } = useStore();
  const [open, setOpen] = useState(false);

  const player = findPlayer(id);
  const dates = useMemo(() => (ready && player ? playerDates(player) : []), [ready, player]);

  if (!player) {
    return (
      <main className="px-5 pt-24 text-center">
        <p className="text-sm text-ink-muted">プレーヤーが見つかりませんでした。</p>
        <Link href="/" className="mt-3 inline-block text-sm font-medium text-court underline underline-offset-4">
          ホームに戻る
        </Link>
      </main>
    );
  }

  const invitation = ready ? invitationFor(player.id) : undefined;
  const myDates = request?.dates ?? [];

  const goBack = () => (window.history.length > 1 ? router.back() : router.push("/"));

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center bg-cream/95 px-2 backdrop-blur">
        <button onClick={goBack} aria-label="戻る" className="flex h-10 w-10 items-center justify-center text-court">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="flex-1 text-center font-serif text-base font-semibold text-court">Player</span>
        <span className="w-10" />
      </header>

      <main className="space-y-6 px-5 pb-36 pt-2">
        {/* プロフィール */}
        <section className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-court font-serif text-2xl font-semibold text-white ring-4 ring-lawn-light">
            {player.initials}
          </div>
          <h1 className="mt-3 text-xl font-bold">{player.name}</h1>
          <p className="mt-1 text-xs text-ink-muted">
            {player.level}・{player.experience}
          </p>
          <div className="mt-2.5">
            <IntentBadge intent={player.intent} />
          </div>
          <p className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-left text-[13px] leading-relaxed">
            <span className="mr-1 font-serif text-lg leading-none text-lawn">“</span>
            {player.comment}
          </p>
        </section>

        {/* 基本情報 */}
        <section className="divide-y divide-line rounded-2xl border border-line bg-white">
          <InfoRow icon={Trophy} label="スタイル">
            <div className="flex flex-wrap justify-end gap-1.5">
              {player.styles.map((s) => (
                <span key={s} className="rounded-full bg-court-light px-2 py-0.5 text-[11px] text-court">
                  {PLAY_STYLES[s]}
                </span>
              ))}
            </div>
          </InfoRow>
          <InfoRow icon={Clock} label="時間帯">
            {player.timeSlots.map(timeSlotLabel).join("・")}
          </InfoRow>
          <InfoRow icon={MapPin} label="地域">
            {player.areas.map(areaLabel).join(" / ")}
          </InfoRow>
          <InfoRow icon={Home} label="よく行くコート">
            {player.homeCourt}
          </InfoRow>
        </section>

        {/* プレーしたい日 */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-serif text-xl font-semibold text-court">Available</h2>
            <span className="text-xs text-ink-muted">プレーしたい日</span>
          </div>
          <ul className="space-y-2">
            {dates.map((d) => {
              const common = myDates.includes(d);
              return (
                <li
                  key={d}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    common ? "border-lawn bg-lawn-light/60" : "border-line bg-white"
                  }`}
                >
                  <span className="text-sm font-medium">{formatJa(fromKey(d))}</span>
                  {common && <span className="text-[11px] font-medium text-court">あなたも空いています</span>}
                </li>
              );
            })}
          </ul>
        </section>

        {/* 送ったメッセージ */}
        {invitation && (
          <section>
            <div className="mb-3 flex items-end justify-between">
              <h2 className="font-serif text-xl font-semibold text-court">Your Invite</h2>
              <span className="text-xs text-ink-muted">送ったメッセージ</span>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-court">
                  {formatJa(fromKey(invitation.date))}・{timeSlotLabel(invitation.timeSlot)}
                </span>
                <span className="rounded-full bg-cream px-2 py-0.5 text-ink-muted">返事待ち</span>
              </div>
              <p className="mt-3 rounded-2xl rounded-tr-sm bg-court px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
                {invitation.message}
              </p>
            </div>
          </section>
        )}
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-cream/95 px-5 pt-3 backdrop-blur">
        <button
          onClick={() => setOpen(true)}
          disabled={!ready}
          className={`mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold active:opacity-90 ${
            invitation ? "border border-court bg-white text-court" : "bg-court text-white"
          }`}
        >
          {invitation ? (
            <>
              <Pencil className="h-4 w-4" />
              声かけの内容を変更する
            </>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              声をかける
            </>
          )}
        </button>
      </div>

      {ready && <InviteSheet player={player} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 text-[13px]">
      <span className="flex shrink-0 items-center gap-2 text-ink-muted">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-right">{children}</span>
    </div>
  );
}
