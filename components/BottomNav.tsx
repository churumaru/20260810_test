"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Plus, Search, User } from "lucide-react";

const ITEMS = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "#", label: "さがす", icon: Search },
  { href: "/register", label: "登録", icon: Plus, primary: true },
  { href: "#", label: "イベント", icon: CalendarDays },
  { href: "#", label: "マイページ", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-cream/95 backdrop-blur">
      <ul className="grid h-16 grid-cols-5">
        {ITEMS.map(({ href, label, icon: Icon, primary }) => {
          const active = href !== "#" && pathname === href;
          const disabled = href === "#";
          if (primary) {
            return (
              <li key={label} className="flex items-center justify-center">
                <Link
                  href={href}
                  aria-label="プレー希望を登録"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-court text-white shadow-md active:scale-95"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={label}>
              <Link
                href={href}
                aria-disabled={disabled}
                onClick={disabled ? (e) => e.preventDefault() : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[10px] ${
                  active ? "text-court" : "text-ink-muted"
                } ${disabled ? "opacity-60" : ""}`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
