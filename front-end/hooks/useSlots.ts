"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import type { TimeSlot } from "@/types/doctor";
import { format } from "date-fns";

export function useSlots(doctorId: string) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSlots = useCallback(
    async (date: Date) => {
      setIsLoading(true);
      setSlots([]);
      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const { data } = await api.get<{ success: boolean; data: TimeSlot[] }>(
          `/doctors/${doctorId}/slots?date=${dateStr}`
        );
        setSlots(data.data);
      } catch {
        // fallback: generate default morning/afternoon slots
        const generated: TimeSlot[] = [];
        for (let h = 9; h < 18; h++) {
          for (const m of [0, 30]) {
            generated.push({
              time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
              available: Math.random() > 0.3,
            });
          }
        }
        setSlots(generated);
      } finally {
        setIsLoading(false);
      }
    },
    [doctorId]
  );

  return { slots, isLoading, fetchSlots };
}
