"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { DoctorNavSidebar } from "@/components/layout/DoctorNavSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctorAppointments } from "@/hooks/useAppointments";
import { formatDate, formatTime, cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/appointment";
import {
  Search, CalendarDays, Clock, CheckCircle,
  XCircle, AlertCircle, Filter, ChevronLeft, ChevronRight,
} from "lucide-react";

type FilterStatus = "all" | AppointmentStatus;

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, color: "text-secondary",  bg: "bg-secondary/10",  label: "Confirmed" },
  pending:   { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending" },
  cancelled: { icon: XCircle,     color: "text-destructive", bg: "bg-destructive/10", label: "Cancelled" },
};

export default function DoctorAppointmentsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const { appointments, isLoading, confirm, cancel } = useDoctorAppointments();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "doctor") router.push("/login");
  }, [isAuthenticated, user, router]);

  const filtered = appointments.filter((a) =>
    (filter === "all" || a.status === filter) &&
    (search === "" ||
      a.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = {
    all:       appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending:   appointments.filter((a) => a.status === "pending").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <DoctorNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and track all patient appointments.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(["all", "confirmed", "pending", "cancelled"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize",
                filter === s
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
              )}
            >
              {s} ({counts[s as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl bg-white/5 border-white/10"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-border/60 gap-2 shrink-0">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="space-y-px">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full rounded-none" />)}
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">ID</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">Patient</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">Date &amp; Time</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">Status</th>
                    <th className="px-4 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((apt) => {
                    const cfg = STATUS_CONFIG[apt.status];
                    const StatusIcon = cfg.icon;
                    const initials = apt.patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("");

                    return (
                      <tr key={apt.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                          {apt.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                              {initials}
                            </div>
                            <div>
                              <span className="text-sm font-medium">{apt.patient.name}</span>
                              {apt.patient.phone && (
                                <p className="text-xs text-muted-foreground">{apt.patient.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{formatDate(apt.date)}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Clock className="h-3 w-3" /> {formatTime(apt.date)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", cfg.bg, cfg.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {apt.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-7 px-3 rounded-lg text-xs bg-secondary/10 text-secondary hover:bg-secondary/20 border-0"
                                  onClick={() => confirm(apt.id)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-3 rounded-lg text-xs text-destructive hover:bg-destructive/10"
                                  onClick={() => cancel(apt.id)}
                                >
                                  Decline
                                </Button>
                              </>
                            )}
                            {apt.status === "confirmed" && (
                              <Button size="sm" variant="ghost" className="h-7 px-3 rounded-lg text-xs text-muted-foreground">
                                Details
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>{appointments.length === 0 ? "No appointments yet" : "No appointments match your filter"}</p>
              </div>
            )}

            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <p className="text-sm text-muted-foreground">{filtered.length} appointments</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/60">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-8 px-3 rounded-lg bg-primary text-white text-xs">1</Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/60">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
