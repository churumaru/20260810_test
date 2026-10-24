const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(base: Date, n: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + n);
  return d;
}

export function upcomingDays(count: number, base = new Date()): Date[] {
  return Array.from({ length: count }, (_, i) => addDays(base, i));
}

export function offsetToKey(offset: number, base = new Date()): string {
  return toKey(addDays(base, offset));
}

export const weekdayJa = (d: Date) => WEEKDAYS[d.getDay()];
export const weekdayEn = (d: Date) => WEEKDAYS_EN[d.getDay()];

export function formatJa(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekdayJa(d)}）`;
}

export function formatShort(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}（${weekdayJa(d)}）`;
}

/** 「たった今」「5分前」などの相対表記 */
export function timeAgo(iso: string, now = new Date()): string {
  const sec = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return "たった今";
  if (sec < 3600) return `${Math.floor(sec / 60)}分前`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}時間前`;
  return `${Math.floor(sec / 86400)}日前`;
}
