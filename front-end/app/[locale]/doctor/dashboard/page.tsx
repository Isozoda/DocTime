"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { useEffect } from "react";
import { DoctorNavSidebar } from "@/components/layout/DoctorNavSidebar";
import { Link } from "@/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctorAppointments } from "@/hooks/useAppointments";
import { formatTime, cn } from "@/lib/utils";
import {
  CalendarDays, Users, Star, TrendingUp, ArrowRight,
  Clock, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, color: "text-secondary",  bg: "bg-secondary/10",  label: "Confirmed" },
  pending:   { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending" },
  cancelled: { icon: XCircle,     color: "text-destructive", bg: "bg-destructive/10", label: "Cancelled" },
};

function isSameDay(dateStr: string, reference: Date) {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  );
}

export default function DoctorDashboardPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const { appointments, isLoading } = useDoctorAppointments();

  useEffect(() => {
    if (isHydrated && (!isAuthenticated || user?.role !== "doctor")) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, user, router]);

  if (!user) return null;

  const today = new Date();
  const todayAppointments = appointments
    .filter((a) => isSameDay(a.date, today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pendingCount   = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const totalPatients  = new Set(appointments.map((a) => a.patientId)).size;

  const STATS = [
    { label: "Today's Appointments", value: String(todayAppointments.length), change: `${pendingCount} pending`, icon: CalendarDays, color: "text-primary",    bg: "bg-primary/10" },
    { label: "Total Patients",        value: String(totalPatients),           change: "unique patients",          icon: Users,        color: "text-secondary",  bg: "bg-secondary/10" },
    { label: "Confirmed",             value: String(confirmedCount),          change: "of all appointments",      icon: Star,         color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Total Appointments",    value: String(appointments.length),     change: "all time",                 icon: TrendingUp,   color: "text-[--tertiary]", bg: "bg-[--tertiary]/10" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DoctorNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        {/* Welcome banner */}
        <div className="relative bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold">Dr. {user.name.split(" ").pop()}</h1>
              <p className="text-white/60 text-sm mt-0.5">
                {todayAppointments.length > 0
                  ? `${todayAppointments.length} appointment${todayAppointments.length > 1 ? "s" : ""} today`
                  : "No appointments today"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/doctor/appointments">
                <Button variant="secondary" size="sm" className="rounded-xl bg-white/20 hover:bg-white/30 text-white border-white/20 gap-1.5">
                  <CalendarDays className="h-4 w-4" /> View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {isLoading
            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            : STATS.map(({ label, value, change, icon: Icon, color, bg }) => (
                <div key={label} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-muted-foreground text-sm font-medium">{label}</p>
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", bg)}>
                      <Icon className={cn("h-4 w-4", color)} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{change}</p>
                </div>
              ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Today's appointments */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Today&apos;s Appointments
              </h2>
              <Link href="/doctor/appointments" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            )}

            {!isLoading && todayAppointments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <CalendarDays className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">No appointments today</p>
              </div>
            )}

            {!isLoading && todayAppointments.length > 0 && (
              <div className="space-y-3">
                {todayAppointments.map((apt) => {
                  const cfg = STATUS_CONFIG[apt.status];
                  const StatusIcon = cfg.icon;
                  const initials = apt.patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("");

                  return (
                    <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{apt.patient.name}</p>
                        {apt.notes && <p className="text-muted-foreground text-xs truncate">{apt.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(apt.date)}
                      </div>
                      <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0", cfg.bg, cfg.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions + this week */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Manage Schedule",     href: "/doctor/schedule",  icon: Clock },
                  { label: "View Earnings",        href: "/doctor/earnings",  icon: TrendingUp },
                  { label: "Verification Status",  href: "/doctor/verify",    icon: CheckCircle },
                ].map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors group">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium flex-1">{label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Overview</h2>
              <div className="space-y-3">
                {isLoading
                  ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 rounded-xl" />)
                  : [
                      { label: "Pending",   value: String(pendingCount),   color: "text-yellow-500" },
                      { label: "Confirmed", value: String(confirmedCount), color: "text-secondary" },
                      { label: "Total",     value: String(appointments.length), color: "text-primary" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center p-3 rounded-xl bg-muted/20">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className={cn("font-bold text-sm", color)}>{value}</span>
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
