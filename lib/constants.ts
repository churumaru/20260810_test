import type { Area, Intent, TimeSlot } from "./types";

export const TIME_SLOTS: { id: TimeSlot; label: string; range: string }[] = [
  { id: "morning", label: "朝", range: "6–9時" },
  { id: "forenoon", label: "午前", range: "9–12時" },
  { id: "afternoon", label: "午後", range: "12–17時" },
  { id: "evening", label: "夜", range: "17–22時" },
];

export const AREAS: { id: Area; label: string }[] = [
  { id: "shibuya", label: "渋谷・恵比寿" },
  { id: "shinjuku", label: "新宿・代々木" },
  { id: "shinagawa", label: "品川・田町" },
  { id: "ariake", label: "有明・豊洲" },
  { id: "setagaya", label: "世田谷・二子玉川" },
  { id: "meguro", label: "目黒・駒沢" },
];

export const INTENTS: { id: Intent; label: string; short: string; description: string }[] = [
  {
    id: "must",
    label: "絶対やりたい",
    short: "絶対やりたい",
    description: "日程が合えば確実に参加します",
  },
  {
    id: "maybe",
    label: "条件が合えばやってもいい",
    short: "条件次第",
    description: "時間・場所・メンバー次第で参加します",
  },
];

export const timeSlotLabel = (id: TimeSlot) => TIME_SLOTS.find((t) => t.id === id)?.label ?? id;
export const areaLabel = (id: Area) => AREAS.find((a) => a.id === id)?.label ?? id;
