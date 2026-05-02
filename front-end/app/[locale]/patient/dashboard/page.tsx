"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { PatientNavSidebar } from "@/components/layout/PatientNavSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatientAppointments } from "@/hooks/useAppointments";
import { formatDate, formatTime, cn } from "@/lib/utils";
import {
  Heart, Activity, Moon, CalendarDays, ChevronRight,
  ArrowRight, Clock, CheckCircle, AlertCircle, XCircle,
  Stethoscope, Brain,
} from "lucide-react";

const VITALS = [
  {
    label: "Heart Rate",
    value: "72",
    unit: "BPM",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-500/10",
    path: "M0 15 Q 10 5, 20 18 T 40 10 T 60 15 T 80 8 T 100 12",
    stroke: "stroke-red-400",
  },
  {
    label: "Activity",
    value: "8,432",
    unit: "STEPS",
    icon: Activity,
    color: "text-secondary",
    bg: "bg-secondary/10",
    path: "M0 18 L 10 16 L 20 12 L 30 14 L 40 8 L 50 10 L 60 4 L 70 6 L 80 2 L 90 4 L 100 0",
    stroke: "stroke-secondary",
  },
  {
    label: "Sleep Score",
    value: "84",
    unit: "/ 100",
    icon: Moon,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    path: "M0 10 C 20 10, 30 2, 50 2 C 70 2, 80 18, 100 18",
    stroke: "stroke-blue-400",
  },
];

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, color: "text-secondary",  bg: "bg-secondary/10" },
  pending:   { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  cancelled: { icon: XCircle,     color: "text-destructive", bg: "bg-destructive/10" },
};

const SPECIALTIES = [
  { label: "Cardiology", icon: Heart,  color: "text-red-400" },
  { label: "Neurology",  icon: Brain,  color: "text-blue-400" },
];

export default function PatientDashboardPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const { appointments, isLoading } = usePatientAppointments();

  useEffect(() => {
    if (isHydrated && (!isAuthenticated || user?.role !== "patient")) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, user, router]);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const upcoming = appointments
    .filter((a) => a.status !== "cancelled" && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
    
  return (
    <div className="flex min-h-screen bg-background">
      <PatientNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        {/* Welcome hero */}
        <div className="relative glass-card rounded-2xl p-8 mb-6 overflow-hidden min-h-[220px] flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Patient Profile Overview</p>
            <h1 className="text-3xl font-bold text-white mb-3">Good morning, {firstName}.</h1>
            <p className="text-muted-foreground text-sm max-w-xl mb-6">
              {isLoading
                ? "Loading your health summary..."
                : upcoming.length > 0
                  ? `You have ${upcoming.length} upcoming appointment${upcoming.length > 1 ? "s" : ""} scheduled.`
                  : "You have no upcoming appointments. Book one to get started."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/doctors">
                <Button className="rounded-full bg-primary text-primary-foreground font-bold gap-2">
                  <CalendarDays className="h-4 w-4" /> Book Appointment
                </Button>
              </Link>
              <Link href="/patient/medical-history">
                <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 font-bold">
                  View Records
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {VITALS.map(({ label, value, unit, icon: Icon, color, bg, path, stroke }) => (
            <div key={label} className="glass-card rounded-2xl p-6 flex flex-col justify-between h-48 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{value}</span>
                    <span className="text-sm text-muted-foreground">{unit}</span>
                  </div>
                </div>
                <div className={cn("p-2 rounded-xl", bg)}>
                  <Icon className={cn("h-5 w-5", color)} />
                </div>
              </div>
              <div className="mt-4 h-16 w-full">
                <svg className={cn("w-full h-full fill-none", stroke)} strokeWidth="1.5" viewBox="0 0 100 20">
                  <path d={path} />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Upcoming appointments */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Upcoming Appointments
              </h2>
              <Link href="/patient/appointments" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
              </div>
            )}

            {!isLoading && upcoming.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <CalendarDays className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">No upcoming appointments</p>
                <Link href="/doctors">
                  <Button size="sm" className="mt-3 rounded-xl bg-primary font-semibold">Find a Doctor</Button>
                </Link>
              </div>
            )}

            {!isLoading && upcoming.length > 0 && (
              <div className="space-y-4">
                {upcoming.map((apt) => {
                  const cfg = STATUS_CONFIG[apt.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-muted/40 border border-white/10 shrink-0">
                        <span className="text-xs text-muted-foreground font-bold uppercase">{formatDate(apt.date, "MMM")}</span>
                        <span className="text-xl font-bold text-white">{formatDate(apt.date, "d")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm">{apt.doctor.user.name}</p>
                        <p className="text-muted-foreground text-xs">{apt.doctor.specialization}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(apt.date)}
                      </div>
                      <div className={cn("p-1.5 rounded-full shrink-0", cfg.bg)}>
                        <StatusIcon className={cn("h-4 w-4", cfg.color)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Find a specialist */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-5">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find a Specialist</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Connect with top-tier medical professionals across 24 departments instantly.
              </p>
            </div>
            <div className="space-y-3">
              {SPECIALTIES.map(({ label, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5", color)} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                </div>
              ))}
              <Link href="/doctors" className="block text-center text-primary text-sm font-bold pt-2 hover:underline">
                View All Specializations
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
