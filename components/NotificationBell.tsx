"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useStore } from "@/lib/store";

export function NotificationBell() {
  const { ready, unreadCount } = useStore();
  return (
    <Link
      href="/notifications"
      aria-label={unreadCount ? `お知らせ（未読${unreadCount}件）` : "お知らせ"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-court"
    >
      <Bell className="h-5 w-5" />
      {ready && unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-lawn px-1 text-[10px] font-bold text-court">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
