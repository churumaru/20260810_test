"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function BottomSheet({ open, onClose, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="閉じる" onClick={onClose} className="absolute inset-0 animate-[fade_.2s_ease-out] bg-black/40" />
      <div className="pb-safe relative flex max-h-[88dvh] w-full max-w-md animate-[sheet_.25s_ease-out] flex-col rounded-t-3xl bg-cream">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} aria-label="閉じる" className="-mr-2 flex h-10 w-10 items-center justify-center text-ink-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="border-t border-line px-5 pb-3 pt-3">{footer}</div>}
      </div>
    </div>
  );
}
