"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TabHeader } from "@/components/PageHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { AREAS, TIME_SLOTS } from "@/lib/constants";
import { PLAYERS } from "@/lib/mock";
import { useStore } from "@/lib/store";
import type { Area, Intent, Player, TimeSlot } from "@/lib/types";

const LEVELS = [
  { id: "beginner", label: "〜3.0", test: (n: number) => n <= 3.0 },
  { id: "middle", label: "3.5", test: (n: number) => n === 3.5 },
  { id: "advanced", label: "4.0〜", test: (n: number) => n >= 4.0 },
] as const;
type LevelId = (typeof LEVELS)[number]["id"];

const levelOf = (p: Player) => parseFloat(p.level.replace(/[^\d.]/g, ""));

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export default function SearchPage() {
  const { ready } = useStore();
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [levels, setLevels] = useState<LevelId[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const q = query.trim().toLowerCase();
  const results = PLAYERS.filter((p) => {
    if (q && !`${p.name} ${p.comment} ${p.homeCourt}`.toLowerCase().includes(q)) return false;
    if (intent && p.intent !== intent) return false;
    if (levels.length && !LEVELS.some((l) => levels.includes(l.id) && l.test(levelOf(p)))) return false;
    if (slots.length && !p.timeSlots.some((t) => slots.includes(t))) return false;
    if (areas.length && !p.areas.some((a) => areas.includes(a))) return false;
    return true;
  });

  const filtered = Boolean(q || intent || levels.length || slots.length || areas.length);
  const clear = () => {
    setQuery("");
    setIntent(null);
    setLevels([]);
    setSlots([]);
    setAreas([]);
  };

  return (
    <>
      <TabHeader en="Search" ja="さがす" />
      <main className="pb-28 pt-2">
        <div className="px-5">
          <label className="flex h-12 items-center gap-2 rounded-full bg-white px-4 ring-1 ring-line focus-within:ring-court">
            <Search className="h-4 w-4 shrink-0 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="名前・コメント・コートで検索"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-sm placeholder:text-ink-muted"
              type="search"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="検索語を消す" className="text-ink-muted">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        <div className="mt-4 space-y-2.5">
          <FilterRow label="意欲">
            <Pill selected={intent === "must"} onClick={() => setIntent(intent === "must" ? null : "must")}>
              絶対やりたい
            </Pill>
            <Pill selected={intent === "maybe"} onClick={() => setIntent(intent === "maybe" ? null : "maybe")}>
              条件次第
            </Pill>
          </FilterRow>
          <FilterRow label="レベル">
            {LEVELS.map((l) => (
              <Pill key={l.id} selected={levels.includes(l.id)} onClick={() => setLevels((v) => toggle(v, l.id))}>
                NTRP {l.label}
              </Pill>
            ))}
          </FilterRow>
          <FilterRow label="時間帯">
            {TIME_SLOTS.map((t) => (
              <Pill key={t.id} selected={slots.includes(t.id)} onClick={() => setSlots((v) => toggle(v, t.id))}>
                {t.label}
              </Pill>
            ))}
          </FilterRow>
          <FilterRow label="地域">
            {AREAS.map((a) => (
              <Pill key={a.id} selected={areas.includes(a.id)} onClick={() => setAreas((v) => toggle(v, a.id))}>
                {a.label}
              </Pill>
            ))}
          </FilterRow>
        </div>

        <div className="mt-5 flex items-baseline justify-between px-5">
          <p className="text-xs text-ink-muted">
            <span className="font-serif text-base font-semibold text-court">{results.length}</span> 人が見つかりました
          </p>
          {filtered && (
            <button onClick={clear} className="text-xs font-medium text-court underline underline-offset-4">
              条件をクリア
            </button>
          )}
        </div>

        <div className="mt-3 space-y-3 px-5">
          {ready && results.map((p) => <PlayerCard key={p.id} player={p} />)}
          {results.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
              条件に合う人が見つかりませんでした。
              <br />
              条件を少しゆるめてみてください。
            </p>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 pl-5 text-[11px] font-medium text-ink-muted">{label}</span>
      <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto pr-5">{children}</div>
    </div>
  );
}

function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`h-9 shrink-0 rounded-full px-3.5 text-xs transition-colors ${
        selected ? "bg-court font-medium text-white" : "bg-white text-ink ring-1 ring-line"
      }`}
    >
      {children}
    </button>
  );
}
