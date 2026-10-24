"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Invitation, PlayRequest } from "./types";
import { toKey } from "./date";
import { findPlayer, mockReply } from "./mock";

const KEYS = {
  request: "courtly:play-request",
  invitations: "courtly:invitations",
  joinedEvents: "courtly:joined-events",
  notificationsSeenAt: "courtly:notifications-seen-at",
};

/** 声かけから返信が届くまで（モック） */
const REPLY_DELAY_MS = 5000;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存領域が使えない環境ではメモリ上のみで動かす
  }
}

type StoreValue = {
  /** localStorage の読み込みが終わったか（SSRとの表示ズレ防止） */
  ready: boolean;
  request: PlayRequest | null;
  saveRequest: (req: Omit<PlayRequest, "updatedAt">) => void;
  clearRequest: () => void;
  invitations: Invitation[];
  sendInvitation: (inv: Pick<Invitation, "playerId" | "date" | "timeSlot" | "message">) => void;
  cancelInvitation: (playerId: string) => void;
  invitationFor: (playerId: string) => Invitation | undefined;
  joinedEvents: string[];
  joinEvent: (id: string) => void;
  leaveEvent: (id: string) => void;
  unreadCount: number;
  markNotificationsSeen: () => void;
  notificationsSeenAt: string;
  resetAll: () => void;
  selectedDate: string;
  setSelectedDate: (key: string) => void;
  toast: string | null;
  showToast: (message: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [request, setRequest] = useState<PlayRequest | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [notificationsSeenAt, setNotificationsSeenAt] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => toKey(new Date()));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRequest(load<PlayRequest | null>(KEYS.request, null));
    // 旧形式（status なし）のデータも読めるようにしておく
    setInvitations(
      load<Invitation[]>(KEYS.invitations, []).map((x) => ({ ...x, status: x.status ?? "pending" })),
    );
    setJoinedEvents(load<string[]>(KEYS.joinedEvents, []));
    setNotificationsSeenAt(load<string>(KEYS.notificationsSeenAt, ""));
    setSelectedDate(toKey(new Date()));
    setReady(true);
  }, []);

  // 状態が変わるたびに保存（読み込み完了前は保存しない）
  useEffect(() => {
    if (ready) save(KEYS.invitations, invitations);
  }, [ready, invitations]);
  useEffect(() => {
    if (ready) save(KEYS.joinedEvents, joinedEvents);
  }, [ready, joinedEvents]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  // 返信のシミュレーション：送信から一定時間後に相手が承諾する
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  useEffect(() => {
    if (!ready) return;
    // 取り消し・送り直しで消えた声かけのタイマーは止める
    const alive = new Set(invitations.map((x) => x.id));
    timers.current.forEach((timer, id) => {
      if (!alive.has(id)) {
        clearTimeout(timer);
        timers.current.delete(id);
      }
    });
    for (const inv of invitations) {
      if (inv.status !== "pending" || timers.current.has(inv.id)) continue;
      const wait = Math.max(0, new Date(inv.createdAt).getTime() + REPLY_DELAY_MS - Date.now());
      const timer = setTimeout(() => {
        timers.current.delete(inv.id);
        const player = findPlayer(inv.playerId);
        setInvitations((prev) =>
          prev.map((x) =>
            x.id === inv.id && x.status === "pending"
              ? {
                  ...x,
                  status: "accepted",
                  reply: mockReply(player?.name ?? ""),
                  repliedAt: new Date().toISOString(),
                }
              : x,
          ),
        );
        if (wait > 0 && player) setToast(`${player.name}さんから返信が届きました`);
      }, wait);
      timers.current.set(inv.id, timer);
    }
  }, [ready, invitations]);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  const saveRequest = useCallback((req: Omit<PlayRequest, "updatedAt">) => {
    const value = { ...req, dates: [...req.dates].sort(), updatedAt: new Date().toISOString() };
    setRequest(value);
    save(KEYS.request, value);
  }, []);

  const clearRequest = useCallback(() => {
    setRequest(null);
    save(KEYS.request, null);
  }, []);

  const sendInvitation = useCallback(
    (inv: Pick<Invitation, "playerId" | "date" | "timeSlot" | "message">) => {
      setInvitations((prev) => [
        ...prev.filter((x) => x.playerId !== inv.playerId),
        { ...inv, id: `inv-${Date.now()}`, createdAt: new Date().toISOString(), status: "pending" },
      ]);
    },
    [],
  );

  const cancelInvitation = useCallback((playerId: string) => {
    setInvitations((prev) => prev.filter((x) => x.playerId !== playerId));
  }, []);

  const invitationFor = useCallback(
    (playerId: string) => invitations.find((x) => x.playerId === playerId),
    [invitations],
  );

  const joinEvent = useCallback((id: string) => {
    setJoinedEvents((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const leaveEvent = useCallback((id: string) => {
    setJoinedEvents((prev) => prev.filter((x) => x !== id));
  }, []);

  const unreadCount = invitations.filter(
    (x) => x.status === "accepted" && x.repliedAt && x.repliedAt > notificationsSeenAt,
  ).length;

  const markNotificationsSeen = useCallback(() => {
    const now = new Date().toISOString();
    setNotificationsSeenAt(now);
    save(KEYS.notificationsSeenAt, now);
  }, []);

  const resetAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    Object.values(KEYS).forEach((k) => save(k, null));
    setRequest(null);
    setInvitations([]);
    setJoinedEvents([]);
    setNotificationsSeenAt("");
    setSelectedDate(toKey(new Date()));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      request,
      saveRequest,
      clearRequest,
      invitations,
      sendInvitation,
      cancelInvitation,
      invitationFor,
      joinedEvents,
      joinEvent,
      leaveEvent,
      unreadCount,
      markNotificationsSeen,
      notificationsSeenAt,
      resetAll,
      selectedDate,
      setSelectedDate,
      toast,
      showToast: setToast,
    }),
    [
      ready,
      request,
      saveRequest,
      clearRequest,
      invitations,
      sendInvitation,
      cancelInvitation,
      invitationFor,
      joinedEvents,
      joinEvent,
      leaveEvent,
      unreadCount,
      markNotificationsSeen,
      notificationsSeenAt,
      resetAll,
      selectedDate,
      toast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
