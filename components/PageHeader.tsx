"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  /** 英字見出し（Playfair）で表示するか */
  serif?: boolean;
  right?: React.ReactNode;
};

/** 戻るボタン付きのヘッダー（詳細画面用） */
export function PageHeader({ title, serif = false, right }: Props) {
  const router = useRouter();
  const goBack = () => (window.history.length > 1 ? router.back() : router.push("/"));
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center bg-cream/95 px-2 backdrop-blur">
      <button onClick={goBack} aria-label="戻る" className="flex h-10 w-10 items-center justify-center text-court">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <h1
        className={`flex-1 truncate text-center ${
          serif ? "font-serif text-base font-semibold text-court" : "text-[15px] font-bold"
        }`}
      >
        {title}
      </h1>
      <span className="flex w-10 justify-center">{right}</span>
    </header>
  );
}

/** タブ画面（さがす・イベント・マイページ）のヘッダー */
export function TabHeader({ en, ja, right }: { en: string; ja: string; right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-cream/95 px-5 backdrop-blur">
      <div className="flex items-baseline gap-2">
        <h1 className="font-serif text-2xl font-semibold text-court">{en}</h1>
        <span className="text-xs text-ink-muted">{ja}</span>
      </div>
      {right}
    </header>
  );
}
