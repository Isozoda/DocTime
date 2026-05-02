"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { PatientNavSidebar } from "@/components/layout/PatientNavSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatientAppointments } from "@/hooks/useAppointments";
import { formatDate, formatTime, cn, doctorPhotoUrl } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/appointment";
import {
  Search, CalendarDays, Clock, CheckCircle,
  XCircle, AlertCircle, MapPin, ChevronLeft, ChevronRight, Filter, User,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type FilterStatus = "all" | AppointmentStatus;

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, color: "text-secondary", bg: "bg-secondary/10", label: "Confirmed" },
  pending:   { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending" },
  cancelled: { icon: XCircle,     color: "text-destructive", bg: "bg-destructive/10", label: "Cancelled" },
};

export default function PatientAppointmentsPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const { appointments, isLoading, cancel } = usePatientAppointments();

  useEffect(() => {
    if (isHydrated && (!isAuthenticated || user?.role !== "patient")) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, user, router]);

  const filtered = appointments.filter((a) =>
    (filter === "all" || a.status === filter) &&
    (search === "" ||
      a.doctor.user.name.toLowerCase().includes(search.toLowerCase()) ||
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
      <PatientNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage and track all your scheduled visits.</p>
          </div>
          <Link href="/book-appointment">
            <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary font-bold gap-2">
              <CalendarDays className="h-4 w-4" /> Book New
            </Button>
          </Link>
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
              placeholder="Search by doctor name or appointment ID..."
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
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
        )}

        {/* Cards */}
        {!isLoading && (
          <div className="space-y-3">
            {filtered.map((apt) => {
              const cfg = STATUS_CONFIG[apt.status];
              const StatusIcon = cfg.icon;
              const month = formatDate(apt.date, "MMM");
              const day   = formatDate(apt.date, "d");
              const time  = formatTime(apt.date);

              return (
                <div key={apt.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-muted/40 border border-white/10 shrink-0">
                    <span className="text-xs text-muted-foreground font-bold uppercase">{month}</span>
                    <span className="text-xl font-bold text-white">{day}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl border border-white/10 ring-2 ring-primary/5">
                          <AvatarImage 
                            src={doctorPhotoUrl(apt.doctor.user.name, apt.doctor.photoUrl)} 
                            alt={apt.doctor.user.name} 
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {apt.doctor.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white group-hover:text-primary transition-colors">{apt.doctor.user.name}</p>
                          <p className="text-muted-foreground text-xs">{apt.doctor.specialization}</p>
                        </div>
                      </div>
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", cfg.bg, cfg.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{time}</span>
                      {apt.doctor.city && (
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{apt.doctor.city}</span>
                      )}
                      <span className="font-mono text-primary/60">{apt.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {apt.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-3 rounded-lg text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => cancel(apt.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    {apt.status === "confirmed" && (
                      <Button size="sm" variant="ghost" className="h-7 px-3 rounded-lg text-xs text-muted-foreground">
                        Details
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="glass-card rounded-2xl text-center py-16 text-muted-foreground mt-3">
            <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>{appointments.length === 0 ? "No appointments yet. Book your first one!" : "No appointments found"}</p>
            {appointments.length === 0 && (
              <Link href="/doctors">
                <Button className="mt-4 rounded-xl bg-primary font-semibold">Browse Doctors</Button>
              </Link>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-5">
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
      </main>
    </div>
  );
}
