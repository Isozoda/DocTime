"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { AdminNavSidebar } from "@/components/layout/AdminNavSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarCheck, AlertTriangle, ShieldCheck, Wallet,
  TrendingUp, Zap, CheckCircle, AlertCircle, Clock,
  MoreVertical, ChevronLeft, ChevronRight, Filter, LayoutList,
} from "lucide-react";

const STATS = [
  { label: "Total Bookings Today", value: "1,248", note: "+12% from yesterday", icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", noteColor: "text-secondary" },
  { label: "Pending Disputes", value: "14", note: "Action required by EOD", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", noteColor: "text-muted-foreground" },
  { label: "Auto-Confirmed", value: "89%", note: "System Health: Optimal", icon: ShieldCheck, color: "text-secondary", bg: "bg-secondary/10", noteColor: "text-secondary" },
  { label: "Revenue (24h)", value: "$42,910", note: "Processing live", icon: Wallet, color: "text-primary", bg: "bg-primary/10", noteColor: "text-primary" },
];

type ApptStatus = "confirmed" | "disputed" | "pending";

const APPOINTMENTS = [
  { patient: "Marcus Chen", with: "Dr. Elena Vance", specialty: "Neurology", specialtyColor: "text-blue-400 bg-blue-500/10 border-blue-500/20", time: "10:30 AM", mode: "In-person Visit", status: "disputed" as ApptStatus },
  { patient: "Dr. Sarah Jenkins", with: "Sarah Miller", specialty: "Cardiology", specialtyColor: "text-secondary bg-secondary/10 border-secondary/20", time: "11:15 AM", mode: "Telehealth", status: "confirmed" as ApptStatus },
  { patient: "Arthur Pendragon", with: "Dr. David Kim", specialty: "General Surgery", specialtyColor: "text-primary bg-primary/10 border-primary/20", time: "01:00 PM", mode: "Pre-Op Evaluation", status: "pending" as ApptStatus },
  { patient: "Priya Sharma", with: "Dr. James Ford", specialty: "Dermatology", specialtyColor: "text-purple-400 bg-purple-500/10 border-purple-500/20", time: "02:30 PM", mode: "Video Call", status: "confirmed" as ApptStatus },
  { patient: "Robert Chen", with: "Dr. Anna Koch", specialty: "Orthopedics", specialtyColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", time: "03:00 PM", mode: "In-person Visit", status: "pending" as ApptStatus },
  { patient: "Lucia Mendez", with: "Dr. Tom Baker", specialty: "Neurology", specialtyColor: "text-blue-400 bg-blue-500/10 border-blue-500/20", time: "04:15 PM", mode: "Telehealth", status: "disputed" as ApptStatus },
];

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, label: "CONFIRMED", color: "text-secondary" },
  disputed: { icon: AlertCircle, label: "DISPUTED", color: "text-destructive" },
  pending: { icon: Clock, label: "PENDING", color: "text-primary" },
};

const STATUS_ACTION = {
  confirmed: { label: "Reschedule", className: "bg-primary/10 text-primary hover:bg-primary/20" },
  disputed: { label: "Resolve", className: "bg-secondary/10 text-secondary hover:bg-secondary/20" },
  pending: { label: "Manual Override", className: "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10" },
};

export default function AdminAppointmentsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") router.push("/login");
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Global Appointment Moderator</h1>
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse inline-block" />
              System-wide Bookings Control Center
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setView("list")}
                className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", view === "list" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-white")}
              >
                <LayoutList className="h-4 w-4 inline mr-1" /> List View
              </button>
              <button
                onClick={() => setView("calendar")}
                className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", view === "calendar" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-white")}
              >
                Calendar
              </button>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-border/60 gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {STATS.map(({ label, value, note, icon: Icon, color, bg, noteColor }) => (
            <div key={label} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors pointer-events-none" />
              <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-4", bg)}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <p className="text-muted-foreground text-sm font-medium">{label}</p>
              <p className="text-3xl font-bold text-white mt-1">{value}</p>
              <div className={cn("flex items-center gap-1 text-xs mt-4 font-medium", noteColor)}>
                <TrendingUp className="h-3 w-3" />
                {note}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/3">
            <h2 className="font-semibold">Active Global Schedule</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="italic">Showing data for Oct 24, 2023</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-destructive" />
                <span>Disputed</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Patient / Doctor", "Specialty", "Time Slot", "Status", "Moderation"].map((h) => (
                    <th key={h} className={cn("text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4", h === "Moderation" && "text-right")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {APPOINTMENTS.map(({ patient, with: withPerson, specialty, specialtyColor, time, mode, status }) => {
                  const cfg = STATUS_CONFIG[status];
                  const act = STATUS_ACTION[status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={patient + time} className="hover:bg-white/3 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="h-9 w-9 rounded-full bg-muted/30 flex items-center justify-center text-xs font-bold">
                              {patient[0]}{patient.split(" ")[1]?.[0]}
                            </div>
                            {status === "disputed" && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-destructive border-2 border-background rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{patient}</p>
                            <p className="text-muted-foreground text-xs">with {withPerson}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", specialtyColor)}>{specialty}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">{time}</p>
                        <p className="text-muted-foreground text-xs">{mode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("flex items-center gap-1.5 text-xs font-bold", cfg.color)}>
                          <StatusIcon className="h-4 w-4" />
                          {cfg.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" className={cn("h-7 px-3 rounded-lg text-xs font-bold border-0", act.className)}>
                            {act.label}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-white/10">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing <span className="text-white font-bold">1–10</span> of 1,248 global bookings
            </p>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
