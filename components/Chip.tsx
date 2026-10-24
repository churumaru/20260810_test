import { Check } from "lucide-react";

type Props = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  /** 選択時のチェックマーク（幅が狭いチップでは非表示に） */
  showCheck?: boolean;
};

export function Chip({ selected, onClick, children, className = "", showCheck = true }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm transition-colors ${
        selected ? "border-court bg-court text-white" : "border-line bg-white text-ink active:bg-court-light"
      } ${className}`}
    >
      {selected && showCheck && <Check className="h-3.5 w-3.5 shrink-0 text-lawn" />}
      {children}
    </button>
  );
}
