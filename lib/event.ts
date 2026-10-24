import type { CourtEvent } from "./types";
import { PLAYERS } from "./mock";

/** 自分の参加を含めた参加人数 */
export const joinedCount = (event: CourtEvent, joined: boolean) => event.joined + (joined ? 1 : 0);

/** 参加者のイニシャル（モック）。足りない分は「?」で埋める */
export function participantInitials(event: CourtEvent): string[] {
  const seed = Number(event.id.replace(/\D/g, "")) || 0;
  return Array.from({ length: event.joined }, (_, i) => PLAYERS[(seed + i) % PLAYERS.length]?.initials ?? "?");
}
