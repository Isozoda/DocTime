"use client";

import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/types/doctor";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  isLoading: boolean;
  selected: string | null;
  onSelect: (time: string) => void;
  hasDate: boolean;
}

export function TimeSlotPicker({
  slots, isLoading, selected, onSelect, hasDate,
}: TimeSlotPickerProps) {
  const t = useTranslations("doctors");

  if (!hasDate) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="h-14 w-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-primary/50" />
        </div>
        <p className="text-sm font-medium">{t("selectDate")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-11 rounded-xl" />
        ))}
      </div>
    );
  }

  const available = slots.filter((s) => s.available);

  if (!available.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 opacity-40" />
        </div>
        <p className="text-sm font-semibold mb-1">{t("noSlots")}</p>
        <p className="text-xs text-muted-foreground/70">Try a different date</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
      {slots.map((slot) => {
        const isSelected = selected === slot.time;
        return (
          <button
            key={slot.time}
            disabled={!slot.available}
            onClick={() => slot.available && onSelect(slot.time)}
            aria-pressed={isSelected}
            className={cn(
              "py-3 rounded-xl text-xs font-semibold transition-all duration-200 border text-center",
              slot.available
                ? isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.03]"
                  : "border-border/70 hover:border-primary hover:text-primary hover:bg-primary/5 text-foreground"
                : "bg-muted/50 text-muted-foreground/40 border-transparent cursor-not-allowed"
            )}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}
