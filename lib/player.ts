import type { Player } from "./types";
import { offsetToKey } from "./date";

/** プレーヤーの希望日（YYYY-MM-DD、昇順） */
export function playerDates(player: Player, today = new Date()): string[] {
  return [...player.dayOffsets].sort((a, b) => a - b).map((o) => offsetToKey(o, today));
}
