"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import type { TimeSlot } from "@/types/doctor";
import { format } from "date-fns";
import { toast } from "sonner";

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
        
        const availableSlots = data.data.filter(s => s.available);
        if (availableSlots.length === 0) {
          toast.error("Дар ин рӯз навбат пурра гирифта шудааст", {
            description: "Лутфан рӯзи дигарро интихоб кунед.",
          });
        }
      } catch (error) {
        // Just log the error or show a fallback message, no fake slots
        toast.error("Хатогӣ дар гирифтани маълумоти навбат");
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    },
    [doctorId]
  );

  return { slots, isLoading, fetchSlots };
}
