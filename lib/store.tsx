"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Invitation, PlayRequest } from "./types";
import { toKey } from "./date";

const STORAGE_KEY = "courtly:play-request";
const INVITES_KEY = "courtly:invitations";

type StoreValue = {
  /** localStorage の読み込みが終わったか（SSRとの表示ズレ防止） */
  ready: boolean;
  request: PlayRequest | null;
  saveRequest: (req: Omit<PlayRequest, "updatedAt">) => void;
  clearRequest: () => void;
  invitations: Invitation[];
  sendInvitation: (inv: Omit<Invitation, "id" | "createdAt">) => void;
  invitationFor: (playerId: string) => Invitation | undefined;
  selectedDate: string;
  setSelectedDate: (key: string) => void;
  toast: string | null;
  showToast: (message: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [request, setRequest] = useState<PlayRequest | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => toKey(new Date()));
  const [toast, setToast] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRequest(JSON.parse(raw) as PlayRequest);
      const invites = localStorage.getItem(INVITES_KEY);
      if (invites) setInvitations(JSON.parse(invites) as Invitation[]);
    } catch {
      // 保存領域が使えない環境ではメモリ上のみで動かす
    }
    setSelectedDate(toKey(new Date()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const persist = (value: PlayRequest | null) => {
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  };

  const saveRequest = useCallback((req: Omit<PlayRequest, "updatedAt">) => {
    const value = { ...req, dates: [...req.dates].sort(), updatedAt: new Date().toISOString() };
    setRequest(value);
    persist(value);
  }, []);

  const clearRequest = useCallback(() => {
    setRequest(null);
    persist(null);
  }, []);

  const sendInvitation = useCallback((inv: Omit<Invitation, "id" | "createdAt">) => {
    setInvitations((prev) => {
      const next = [
        ...prev.filter((x) => x.playerId !== inv.playerId),
        { ...inv, id: `inv-${Date.now()}`, createdAt: new Date().toISOString() },
      ];
      try {
        localStorage.setItem(INVITES_KEY, JSON.stringify(next));
      } catch {
        // noop
      }
      return next;
    });
  }, []);

  const invitationFor = useCallback(
    (playerId: string) => invitations.find((x) => x.playerId === playerId),
    [invitations],
  );

  const value = useMemo(
    () => ({
      ready,
      request,
      saveRequest,
      clearRequest,
      invitations,
      sendInvitation,
      invitationFor,
      selectedDate,
      setSelectedDate,
      toast,
      showToast: setToast,
    }),
    [ready, request, saveRequest, clearRequest, invitations, sendInvitation, invitationFor, selectedDate, toast],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
