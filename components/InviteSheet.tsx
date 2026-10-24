"use client";

import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { Chip } from "./Chip";
import { MESSAGE_TEMPLATES, TIME_SLOTS } from "@/lib/constants";
import { formatShort, fromKey } from "@/lib/date";
import { playerDates } from "@/lib/player";
import { useStore } from "@/lib/store";
import type { Player, TimeSlot } from "@/lib/types";

const MAX_LENGTH = 140;

type Props = {
  player: Player;
  open: boolean;
  onClose: () => void;
  /** 開いたときに選んでおく日付（ホームで選択中の日など） */
  initialDate?: string;
};

export function InviteSheet({ player, open, onClose, initialDate }: Props) {
  const { request, sendInvitation, invitationFor, showToast } = useStore();
  const dates = useMemo(() => playerDates(player), [player]);
  const myDates = request?.dates ?? [];

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [message, setMessage] = useState("");

  // 開くたびに初期値を決める：送信済みならその内容 → 指定日 → 自分と共通の日 → 最初の日
  useEffect(() => {
    if (!open) return;
    const sent = invitationFor(player.id);
    if (sent && dates.includes(sent.date)) {
      setDate(sent.date);
      setTimeSlot(sent.timeSlot);
      setMessage(sent.message);
      return;
    }
    const common = dates.find((d) => myDates.includes(d));
    setDate((initialDate && dates.includes(initialDate) ? initialDate : common) ?? dates[0]);
    setTimeSlot(player.timeSlots.find((t) => request?.timeSlots.includes(t)) ?? player.timeSlots[0]);
    setMessage(MESSAGE_TEMPLATES[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canSend = date && timeSlot && message.trim().length > 0;

  const handleSend = () => {
    if (!canSend || !timeSlot) return;
    sendInvitation({ playerId: player.id, date, timeSlot, message: message.trim() });
    showToast(`${player.name}さんに声をかけました`);
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={`${player.name}さんに声をかける`}
      footer={
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-court text-sm font-bold text-white active:opacity-90 disabled:opacity-35"
        >
          <Send className="h-4 w-4" />
          送信する
        </button>
      }
    >
      <section className="mt-2">
        <h3 className="mb-2 text-xs font-medium text-ink-muted">日にち</h3>
        <div className="grid grid-cols-3 gap-2">
          {dates.map((d) => (
            <Chip key={d} selected={date === d} onClick={() => setDate(d)} showCheck={false} className="relative whitespace-nowrap px-1 text-[13px]">
              {formatShort(fromKey(d))}
              {myDates.includes(d) && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-cream bg-lawn" />
              )}
            </Chip>
          ))}
        </div>
        {myDates.length > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-muted">
            <span className="h-2 w-2 rounded-full bg-lawn" />
            あなたもプレー希望を出している日
          </p>
        )}
      </section>

      <section className="mt-5">
        <h3 className="mb-2 text-xs font-medium text-ink-muted">時間帯</h3>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.filter((t) => player.timeSlots.includes(t.id)).map((t) => (
            <Chip key={t.id} selected={timeSlot === t.id} onClick={() => setTimeSlot(t.id)}>
              <span className="font-medium">{t.label}</span>
              <span className="text-xs opacity-70">{t.range}</span>
            </Chip>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h3 className="mb-2 text-xs font-medium text-ink-muted">メッセージ</h3>
        <div className="no-scrollbar -mx-5 mb-2 flex gap-2 overflow-x-auto px-5">
          {MESSAGE_TEMPLATES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMessage(t)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${
                message === t ? "border-court bg-court-light text-court" : "border-line bg-white text-ink-muted"
              }`}
            >
              {t.length > 14 ? `${t.slice(0, 14)}…` : t}
            </button>
          ))}
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
          rows={3}
          className="w-full resize-none rounded-xl border border-line bg-white p-3 text-base leading-relaxed outline-none focus:border-court"
          placeholder="ひとことメッセージ"
        />
        <p className="mt-1 text-right text-[11px] text-ink-muted">
          {message.length}/{MAX_LENGTH}
        </p>
      </section>
    </BottomSheet>
  );
}
