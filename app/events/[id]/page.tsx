"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Backpack, CalendarDays, CircleDollarSign, Clock, MapPin, Signal } from "lucide-react";
import { BottomSheet } from "@/components/BottomSheet";
import { PageHeader } from "@/components/PageHeader";
import { areaLabel } from "@/lib/constants";
import { addDays, formatJa } from "@/lib/date";
import { joinedCount, participantInitials } from "@/lib/event";
import { findEvent } from "@/lib/mock";
import { useStore } from "@/lib/store";

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const { ready, joinedEvents, joinEvent, leaveEvent, showToast } = useStore();
  const [sheet, setSheet] = useState<"join" | "leave" | null>(null);
  const today = useMemo(() => new Date(), []);

  const event = findEvent(id);
  if (!event) {
    return (
      <main className="px-5 pt-24 text-center">
        <p className="text-sm text-ink-muted">イベントが見つかりませんでした。</p>
        <Link href="/events" className="mt-3 inline-block text-sm font-medium text-court underline underline-offset-4">
          イベント一覧へ
        </Link>
      </main>
    );
  }

  const joined = joinedEvents.includes(event.id);
  const date = addDays(today, event.dayOffset);
  const count = joinedCount(event, joined);
  const full = count >= event.capacity;
  const initials = participantInitials(event);

  const handleJoin = () => {
    joinEvent(event.id);
    setSheet(null);
    showToast("参加を申し込みました");
  };
  const handleLeave = () => {
    leaveEvent(event.id);
    setSheet(null);
    showToast("参加をキャンセルしました");
  };

  return (
    <>
      <PageHeader title="Event" serif />

      <main className="space-y-6 px-5 pb-36 pt-2">
        <section className="rounded-3xl bg-court p-5 text-white">
          <p className="font-serif text-sm italic text-lawn">{ready && formatJa(date)}</p>
          <h1 className="mt-1 font-serif text-2xl font-semibold leading-tight">{event.title}</h1>
          <p className="mt-2 text-xs text-white/70">主催：{event.organizer}</p>
          {joined && (
            <span className="mt-3 inline-block rounded-full bg-lawn px-2.5 py-1 text-[11px] font-bold text-court">
              参加予定です
            </span>
          )}
        </section>

        <section className="divide-y divide-line rounded-2xl border border-line bg-white">
          <Row icon={CalendarDays} label="日にち">
            {ready && formatJa(date)}
          </Row>
          <Row icon={Clock} label="時間">
            {event.time}
          </Row>
          <Row icon={MapPin} label="場所">
            {event.venue}
            <span className="block text-[11px] text-ink-muted">{areaLabel(event.area)}エリア</span>
          </Row>
          <Row icon={Signal} label="レベル">
            {event.level}
          </Row>
          <Row icon={CircleDollarSign} label="参加費">
            ¥{event.fee.toLocaleString()}（当日現地払い）
          </Row>
        </section>

        <section>
          <SectionTitle en="About" ja="内容" />
          <p className="text-[13px] leading-relaxed">{event.description}</p>
        </section>

        <section>
          <SectionTitle en="Bring" ja="持ち物" />
          <ul className="flex flex-wrap gap-2">
            {event.bring.map((b) => (
              <li key={b} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-line">
                <Backpack className="h-3.5 w-3.5 text-court" />
                {b}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle en="Players" ja={`参加者 ${count}/${event.capacity}名`} />
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-lawn" style={{ width: `${(count / event.capacity) * 100}%` }} />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {initials.map((ini, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-court-light font-serif text-xs font-semibold text-court"
              >
                {ini}
              </span>
            ))}
            {joined && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-court font-serif text-xs font-semibold text-lawn">
                You
              </span>
            )}
          </div>
        </section>
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-cream/95 px-5 pt-3 backdrop-blur">
        {joined ? (
          <button
            onClick={() => setSheet("leave")}
            className="mb-3 h-12 w-full rounded-full border border-court bg-white text-sm font-bold text-court"
          >
            参加をキャンセルする
          </button>
        ) : (
          <button
            onClick={() => setSheet("join")}
            disabled={!ready || full}
            className="mb-3 h-12 w-full rounded-full bg-court text-sm font-bold text-white active:opacity-90 disabled:opacity-35"
          >
            {full ? "満員です" : `参加する（¥${event.fee.toLocaleString()}）`}
          </button>
        )}
      </div>

      <BottomSheet
        open={sheet === "join"}
        onClose={() => setSheet(null)}
        title="参加を申し込む"
        footer={
          <button onClick={handleJoin} className="h-12 w-full rounded-full bg-court text-sm font-bold text-white active:opacity-90">
            申し込む
          </button>
        }
      >
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="font-serif text-lg font-semibold text-court">{event.title}</p>
          <p className="mt-1 text-xs text-ink-muted">
            {ready && formatJa(date)} {event.time}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">{event.venue}</p>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
            <span>参加費</span>
            <span className="font-bold">¥{event.fee.toLocaleString()}</span>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
          参加費は当日、主催者に直接お支払いください。キャンセルはマイページまたはこの画面からいつでもできます。（プロトタイプのため実際の申込は行われません）
        </p>
      </BottomSheet>

      <BottomSheet
        open={sheet === "leave"}
        onClose={() => setSheet(null)}
        title="参加をキャンセルしますか？"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setSheet(null)} className="h-12 rounded-full border border-line bg-white text-sm font-medium">
              戻る
            </button>
            <button onClick={handleLeave} className="h-12 rounded-full bg-court text-sm font-bold text-white">
              キャンセルする
            </button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed">
          「{event.title}」への参加をキャンセルします。枠が空いていれば、あとから再度申し込めます。
        </p>
      </BottomSheet>
    </>
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

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 text-[13px]">
      <span className="flex shrink-0 items-center gap-2 text-ink-muted">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-right">{children}</span>
    </div>
  );
}
