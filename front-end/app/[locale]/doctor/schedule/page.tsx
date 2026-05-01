"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { DoctorNavSidebar } from "@/components/layout/DoctorNavSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Clock, Save, Plus, Trash2, CalendarDays } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_SCHEDULE: Record<string, { enabled: boolean; slots: string[] }> = {
  Monday:    { enabled: true,  slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  Tuesday:   { enabled: true,  slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
  Wednesday: { enabled: true,  slots: ["09:00", "10:00", "14:00", "15:00", "16:00"] },
  Thursday:  { enabled: true,  slots: ["09:00", "11:00", "14:00", "16:00"] },
  Friday:    { enabled: true,  slots: ["09:00", "10:00", "11:00"] },
  Saturday:  { enabled: false, slots: [] },
  Sunday:    { enabled: false, slots: [] },
};

const UPCOMING = [
  { patient: "Marcus Bennett", day: "Mon", time: "09:00", type: "Video" },
  { patient: "Elena Rossi", day: "Mon", time: "10:00", type: "In-Person" },
  { patient: "Sarah Chen", day: "Tue", time: "09:00", type: "In-Person" },
  { patient: "Robert Davis", day: "Tue", time: "10:00", type: "Video" },
  { patient: "Amara Lawson", day: "Wed", time: "14:00", type: "In-Person" },
];

export default function DoctorSchedulePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "doctor") router.push("/login");
  }, [isAuthenticated, user, router]);

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  };

  const removeSlot = (day: string, slot: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], slots: prev[day].slots.filter((s) => s !== slot) },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <DoctorNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Schedule Management</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Configure your weekly availability and time slots.</p>
          </div>
          <Button
            onClick={handleSave}
            className={cn("rounded-xl gap-2 transition-all", saved ? "bg-secondary text-white" : "bg-primary text-white")}
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Weekly schedule */}
          <div className="lg:col-span-2 space-y-3">
            {DAYS.map((day) => {
              const { enabled, slots } = schedule[day];
              return (
                <div key={day} className={cn("glass-card rounded-2xl p-5 transition-opacity", !enabled && "opacity-50")}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Switch checked={enabled} onCheckedChange={() => toggleDay(day)} className="data-[state=checked]:bg-primary" />
                      <span className="font-semibold">{day}</span>
                    </div>
                    {enabled && (
                      <Button size="sm" variant="ghost" className="h-7 px-3 rounded-lg gap-1 text-xs text-primary hover:bg-primary/10">
                        <Plus className="h-3.5 w-3.5" /> Add Slot
                      </Button>
                    )}
                  </div>
                  {enabled && (
                    <div className="flex flex-wrap gap-2">
                      {slots.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No slots — add time slots for this day.</p>
                      ) : (
                        slots.map((slot) => (
                          <div key={slot} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium group">
                            <Clock className="h-3.5 w-3.5" />
                            {slot}
                            <button
                              onClick={() => removeSlot(day, slot)}
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {!enabled && <p className="text-muted-foreground text-sm">Day off</p>}
                </div>
              );
            })}
          </div>

          {/* Sidebar: upcoming bookings */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Upcoming Bookings
              </h2>
              <div className="space-y-3">
                {UPCOMING.map(({ patient, day, time, type }, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                      {patient[0]}{patient.split(" ")[1]?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{patient}</p>
                      <p className="text-xs text-muted-foreground">{day} · {time} · {type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-3">Schedule Stats</h2>
              <div className="space-y-2">
                {[
                  { label: "Active days/week", value: `${DAYS.filter((d) => schedule[d].enabled).length}` },
                  { label: "Total slots/week", value: `${Object.values(schedule).reduce((acc, d) => acc + d.slots.length, 0)}` },
                  { label: "Session duration", value: "45 min" },
                  { label: "Buffer between", value: "15 min" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
