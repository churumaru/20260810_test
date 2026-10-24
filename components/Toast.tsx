"use client";

import { Check } from "lucide-react";
import { useStore } from "@/lib/store";

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="status"
        className="flex items-center gap-2 rounded-full bg-court px-4 py-2.5 text-sm text-white shadow-lg"
      >
        <Check className="h-4 w-4 text-lawn" />
        {toast}
      </div>
    </div>
  );
}
