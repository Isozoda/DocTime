"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { WeekSchedule, DaySchedule } from "@/types/doctor";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
type Day = typeof DAYS[number];

interface ScheduleEditorProps {
  initial?: WeekSchedule | null;
}

export function ScheduleEditor({ initial }: ScheduleEditorProps) {
  const t = useTranslations("dashboard");

  const [schedule, setSchedule] = useState<WeekSchedule>(
    initial ?? {} as WeekSchedule
  );
  const [saving, setSaving] = useState(false);

  const isEnabled = (day: Day) => !!schedule[day];

  const toggle = (day: Day, enabled: boolean) => {
    setSchedule((s) => ({
      ...s,
      [day]: enabled ? { start: "09:00", end: "17:00" } : null,
    }));
  };

  const setTime = (day: Day, field: "start" | "end", value: string) => {
    setSchedule((s) => ({
      ...s,
      [day]: { ...(s[day] as DaySchedule), [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/doctors/me/profile", { schedule });
      toast.success("Schedule saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {DAYS.map((day) => {
          const active = isEnabled(day);
          const slot = schedule[day] as DaySchedule | null | undefined;

          return (
            <div
              key={day}
              className="flex items-center gap-4 p-3 rounded-xl border bg-card"
            >
              <Switch
                checked={active}
                onCheckedChange={(v) => toggle(day, v)}
              />
              <span className="w-24 text-sm font-medium capitalize">{day}</span>
              {active && slot ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={slot.start}
                    onChange={(e) => setTime(day, "start", e.target.value)}
                    className="h-8 w-28 text-sm"
                  />
                  <span className="text-muted-foreground text-sm">—</span>
                  <Input
                    type="time"
                    value={slot.end}
                    onChange={(e) => setTime(day, "end", e.target.value)}
                    className="h-8 w-28 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Day off</span>
              )}
            </div>
          );
        })}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("saving")}</> : t("saveProfile")}
      </Button>
    </div>
  );
}
