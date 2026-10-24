"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BellOff, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { timeSlotLabel } from "@/lib/constants";
import { formatShort, fromKey, timeAgo } from "@/lib/date";
import { findPlayer } from "@/lib/mock";
import { useStore } from "@/lib/store";

export default function NotificationsPage() {
  const { ready, invitations, notificationsSeenAt, markNotificationsSeen } = useStore();
  // 開いた時点の既読時刻を覚えておき、今回新しく届いたものを強調する
  const [seenAt, setSeenAt] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || seenAt !== null) return;
    setSeenAt(notificationsSeenAt);
    markNotificationsSeen();
  }, [ready, seenAt, notificationsSeenAt, markNotificationsSeen]);

  // 開いている間に届いた返信もすぐ既読にする
  const replies = useMemo(
    () =>
      invitations
        .filter((x) => x.status === "accepted" && x.repliedAt)
        .sort((a, b) => (b.repliedAt ?? "").localeCompare(a.repliedAt ?? "")),
    [invitations],
  );
  useEffect(() => {
    if (seenAt !== null && replies.some((x) => (x.repliedAt ?? "") > notificationsSeenAt)) markNotificationsSeen();
  }, [replies, seenAt, notificationsSeenAt, markNotificationsSeen]);

  return (
    <>
      <PageHeader title="お知らせ" />
      <main className="px-5 pb-16 pt-2">
        <ul className="space-y-2">
          {ready &&
            replies.map((inv) => {
              const p = findPlayer(inv.playerId);
              if (!p) return null;
              const unread = seenAt !== null && (inv.repliedAt ?? "") > seenAt;
              return (
                <li key={inv.id}>
                  <Link
                    href={`/players/${p.id}`}
                    className={`flex gap-3 rounded-2xl border p-4 active:bg-cream/60 ${
                      unread ? "border-lawn bg-lawn-light/60" : "border-line bg-white"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-light font-serif text-xs font-semibold text-court">
                      {p.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm">
                          <b>{p.name}</b>さんが承諾しました
                        </span>
                        {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-lawn" aria-label="未読" />}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-court">
                        {formatShort(fromKey(inv.date))}・{timeSlotLabel(inv.timeSlot)} に決まりました
                      </span>
                      <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-ink-muted">{inv.reply}</span>
                      <span className="mt-1.5 block text-[11px] text-ink-muted">{timeAgo(inv.repliedAt ?? "")}</span>
                    </span>
                  </Link>
                </li>
              );
            })}

          <li className="flex gap-3 rounded-2xl border border-line bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court text-lawn">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <b>Courtly</b>へようこそ。プレー希望を登録して、同じ気持ちの人とつながりましょう。
            </span>
          </li>
        </ul>

        {ready && replies.length === 0 && (
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
            <BellOff className="h-3.5 w-3.5" />
            声かけへの返信はまだありません
          </p>
        )}
      </main>
    </>
  );
}
