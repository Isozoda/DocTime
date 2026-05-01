"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { AdminNavSidebar } from "@/components/layout/AdminNavSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search, TrendingUp, Zap, AlertCircle, BadgeCheck,
  UserPlus, Download, Edit, KeyRound, UserX,
} from "lucide-react";

const STATS = [
  { label: "Total Patients", value: "12,842", note: "+4.2% from last month", icon: TrendingUp, color: "text-secondary", bg: "bg-secondary/10", noteColor: "text-secondary" },
  { label: "Active Sessions", value: "156", note: "Real-time platform usage", icon: Zap, color: "text-primary", bg: "bg-primary/10", noteColor: "text-primary" },
  { label: "Pending Approvals", value: "24", note: "Requires immediate action", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", noteColor: "text-destructive" },
  { label: "Growth Score", value: "98%", note: "Excellent retention", icon: BadgeCheck, color: "text-secondary", bg: "bg-secondary/10", noteColor: "text-secondary" },
];

const PATIENTS = [
  { name: "Sarah Jenkins", email: "sarah.j@example.com", id: "#PAT-992-B4", plan: "Premium Plus", planBg: "bg-[--tertiary]/10 text-[--tertiary] border-[--tertiary]/30", status: "active", statusColor: "bg-secondary" },
  { name: "Marcus Vane", email: "m.vane@cloud.com", id: "#PAT-881-X2", plan: "Standard", planBg: "bg-white/5 text-muted-foreground border-white/10", status: "offline", statusColor: "bg-muted-foreground" },
  { name: "Elena Rodriguez", email: "e.rodriguez@webmail.com", id: "#PAT-774-K9", plan: "Premium Plus", planBg: "bg-[--tertiary]/10 text-[--tertiary] border-[--tertiary]/30", status: "suspended", statusColor: "bg-destructive" },
  { name: "James Thornton", email: "j.thornton@corp.net", id: "#PAT-663-Z5", plan: "Standard", planBg: "bg-white/5 text-muted-foreground border-white/10", status: "active", statusColor: "bg-secondary" },
  { name: "Amara Osei", email: "a.osei@healthmail.org", id: "#PAT-551-Q3", plan: "Basic", planBg: "bg-muted/20 text-muted-foreground border-white/5", status: "active", statusColor: "bg-secondary" },
  { name: "Thomas Keller", email: "t.keller@domain.com", id: "#PAT-440-H7", plan: "Premium Plus", planBg: "bg-[--tertiary]/10 text-[--tertiary] border-[--tertiary]/30", status: "offline", statusColor: "bg-muted-foreground" },
];

const STATUS_LABELS = {
  active: "Active",
  offline: "Offline",
  suspended: "Suspended",
};

export default function AdminPatientsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") router.push("/login");
  }, [isAuthenticated, user, router]);

  const filtered = PATIENTS.filter((p) =>
    search === "" ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.id.includes(search)
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Patient Directory</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage patient accounts, health plans, and access controls.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {STATS.map(({ label, value, note, icon: Icon, color, bg, noteColor }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", bg)}>
                  <Icon className={cn("h-4 w-4", color)} />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{value}</p>
              <p className={cn("text-xs font-medium", noteColor)}>{note}</p>
            </div>
          ))}
        </div>

        {/* Filters + actions */}
        <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl bg-white/5 border-white/10"
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-border/60 gap-2 shrink-0">
              All Tiers
            </Button>
            <span className="text-sm text-muted-foreground hidden md:block">
              Showing <span className="text-white font-bold">{filtered.length}</span> results
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button size="sm" className="rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 border-0 gap-2 font-semibold">
              <UserPlus className="h-4 w-4" /> New Patient
            </Button>
            <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl border-border/60">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  {["Patient Details", "Account ID", "Health Plan", "Status", "Actions"].map((h) => (
                    <th key={h} className={cn("text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4", h === "Actions" && "text-right")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(({ name, email, id, plan, planBg, status, statusColor }) => (
                  <tr key={id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                            {name[0]}{name.split(" ")[1]?.[0]}
                          </div>
                          <div className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background", statusColor)} />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{name}</p>
                          <p className="text-xs text-muted-foreground">{email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-primary">{id}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", planBg)}>
                        {plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", statusColor)} />
                        <span className="text-sm font-medium text-muted-foreground">
                          {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/10">
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No patients found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
