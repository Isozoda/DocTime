"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { DoctorNavSidebar } from "@/components/layout/DoctorNavSidebar";
import { cn } from "@/lib/utils";
import {
  TrendingUp, DollarSign, CalendarDays, Star,
  ArrowUpRight, ArrowDownRight, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { label: "Total Revenue (MTD)", value: "$18,400", change: "+12%", up: true, icon: DollarSign, color: "text-secondary", bg: "bg-secondary/10" },
  { label: "Appointments (MTD)", value: "128", change: "+8%", up: true, icon: CalendarDays, color: "text-primary", bg: "bg-primary/10" },
  { label: "Avg. per Session", value: "$143", change: "+3%", up: true, icon: TrendingUp, color: "text-[--tertiary]", bg: "bg-[--tertiary]/10" },
  { label: "Patient Satisfaction", value: "4.9★", change: "−0.1", up: false, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
];

const MONTHLY_BARS = [
  { month: "May", pct: 55, value: "$10,200" },
  { month: "Jun", pct: 68, value: "$12,600" },
  { month: "Jul", pct: 72, value: "$13,300" },
  { month: "Aug", pct: 85, value: "$15,700" },
  { month: "Sep", pct: 78, value: "$14,400" },
  { month: "Oct", pct: 100, value: "$18,400" },
];

const TRANSACTIONS = [
  { patient: "Marcus Bennett", date: "Oct 24", type: "Video Call", amount: "$150", status: "paid" },
  { patient: "Elena Rossi", date: "Oct 24", type: "In-Person", amount: "$150", status: "paid" },
  { patient: "Sarah Chen", date: "Oct 23", type: "In-Person", amount: "$150", status: "paid" },
  { patient: "Robert Davis", date: "Oct 22", type: "Video Call", amount: "$150", status: "refunded" },
  { patient: "Amara Lawson", date: "Oct 21", type: "In-Person", amount: "$150", status: "paid" },
  { patient: "James Wilson", date: "Oct 20", type: "Video Call", amount: "$150", status: "pending" },
];

const STATUS_COLORS = {
  paid: "text-secondary bg-secondary/10",
  refunded: "text-destructive bg-destructive/10",
  pending: "text-yellow-500 bg-yellow-500/10",
};

export default function DoctorEarningsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "doctor") router.push("/login");
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <DoctorNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Earnings &amp; Health Analytics</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Your financial performance and practice metrics.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-border/60 gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
          {STATS.map(({ label, value, change, up, icon: Icon, color, bg }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", bg)}>
                  <Icon className={cn("h-4 w-4", color)} />
                </div>
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <div className={cn("flex items-center gap-1 text-xs mt-1 font-medium", up ? "text-secondary" : "text-destructive")}>
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {change} vs last month
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h2 className="font-semibold mb-6">Monthly Revenue</h2>
            <div className="flex items-end gap-3 h-48">
              {MONTHLY_BARS.map(({ month, pct, value }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-medium">{value}</div>
                  <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${pct * 1.6}px` }}>
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500",
                        month === "Oct" ? "bg-gradient-to-t from-primary to-primary/60" : "bg-muted/60 group-hover:bg-primary/40"
                      )}
                      style={{ height: "100%" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payout info */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Next Payout</h2>
              <div className="text-3xl font-bold text-secondary mb-1">$4,350</div>
              <p className="text-xs text-muted-foreground mb-4">Scheduled for Nov 1, 2025</p>
              <div className="space-y-2">
                {[
                  { label: "Gross earnings", value: "$4,500" },
                  { label: "Platform fee (3%)", value: "−$135" },
                  { label: "Tax withholding", value: "−$15" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm py-1.5 border-b border-border/20 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={cn("font-medium", value.startsWith("−") ? "text-destructive" : "")}>{value}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-sm">
                View Bank Details
              </Button>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold mb-3">Breakdown</h2>
              {[
                { label: "In-Person", value: "62%", color: "bg-primary" },
                { label: "Video Call", value: "38%", color: "bg-secondary" },
              ].map(({ label, value, color }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", color)} style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="lg:col-span-3 glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold">Recent Transactions</h2>
              <Button variant="ghost" size="sm" className="text-primary text-xs">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Patient", "Date", "Type", "Amount", "Status"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {TRANSACTIONS.map(({ patient, date, type, amount, status }) => (
                    <tr key={patient + date} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {patient[0]}{patient.split(" ")[1]?.[0]}
                          </div>
                          <span className="text-sm font-medium">{patient}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{date}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{type}</td>
                      <td className="px-6 py-3 text-sm font-bold">{amount}</td>
                      <td className="px-6 py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize", STATUS_COLORS[status as keyof typeof STATUS_COLORS])}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
