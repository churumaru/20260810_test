"use client";

import { useMemo, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { EventCard } from "@/components/EventCard";
import { TabHeader } from "@/components/PageHeader";
import { EVENTS } from "@/lib/mock";
import { useStore } from "@/lib/store";

const TABS = [
  { id: "all", label: "すべて" },
  { id: "joined", label: "参加予定" },
] as const;

export default function EventsPage() {
  const { ready, joinedEvents } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const today = useMemo(() => new Date(), []);

  const events = [...EVENTS]
    .sort((a, b) => a.dayOffset - b.dayOffset)
    .filter((e) => tab === "all" || joinedEvents.includes(e.id));

  return (
    <>
      <TabHeader en="Events" ja="イベント" />
      <main className="px-5 pb-28 pt-2">
        <div className="mb-4 grid grid-cols-2 rounded-full bg-white p-1 ring-1 ring-line" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`h-9 rounded-full text-sm font-medium transition-colors ${
                tab === t.id ? "bg-court text-white" : "text-ink-muted"
              }`}
            >
              {t.label}
              {t.id === "joined" && ready && joinedEvents.length > 0 && (
                <span className="ml-1 text-xs opacity-80">{joinedEvents.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {ready &&
            events.map((e) => (
              <EventCard key={e.id} event={e} today={today} joined={joinedEvents.includes(e.id)} />
            ))}
          {ready && events.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
              参加予定のイベントはまだありません。
            </p>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
