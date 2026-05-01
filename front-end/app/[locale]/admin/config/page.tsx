"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { AdminNavSidebar } from "@/components/layout/AdminNavSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Palette, ShieldCheck, Network, BellRing,
  Moon, Sun, Plus, Key, Fingerprint,
  Database, Mail, MessageSquare, Cloud,
} from "lucide-react";

type ConfigTab = "identity" | "api" | "security" | "infrastructure";

const TABS: { id: ConfigTab; label: string }[] = [
  { id: "identity", label: "Global Identity" },
  { id: "api", label: "API Gateway" },
  { id: "security", label: "Security Matrix" },
  { id: "infrastructure", label: "Infrastructure" },
];

const ACCENT_COLORS = [
  { className: "bg-primary ring-4 ring-primary/30", active: true },
  { className: "bg-secondary opacity-60 hover:opacity-100", active: false },
  { className: "bg-[--tertiary] opacity-60 hover:opacity-100", active: false },
  { className: "bg-destructive opacity-60 hover:opacity-100", active: false },
];

const API_ENDPOINTS = [
  {
    label: "FHIR Medical Stream",
    sub: "v4.0.1 Stable · Last sync 2m ago",
    icon: Network,
    color: "text-[--tertiary]",
    bg: "bg-[--tertiary]/10",
    stat: "99.98% Up",
    statColor: "text-[--tertiary]",
    bars: [1, 1, 1, 0],
    barColor: "bg-[--tertiary]",
  },
  {
    label: "Patient Archive Sync",
    sub: "Read-only Legacy Bridge",
    icon: Database,
    color: "text-primary",
    bg: "bg-primary/10",
    stat: "Latency: 42ms",
    statColor: "text-muted-foreground",
    bars: [1, 1, 1, 1],
    barColor: "bg-primary",
  },
];

const NOTIFICATION_GATEWAYS = [
  { label: "SMTP Global Relay", sub: "Primary server: mail.doctime-admin.io", icon: Mail, status: "CONNECTED", statusColor: "text-secondary bg-secondary/10 border-secondary/20" },
  { label: "Twilio SMS Gateway", sub: "Urgent alerts only (High Priority)", icon: MessageSquare, status: "STANDBY", statusColor: "text-muted-foreground bg-white/5 border-white/10" },
];

export default function AdminConfigPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ConfigTab>("identity");
  const [darkMode, setDarkMode] = useState(true);
  const [autoContrast, setAutoContrast] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") router.push("/login");
  }, [isAuthenticated, user, router]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Configure global administration protocols and gateway management.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-border/60">Discard Changes</Button>
            <Button
              onClick={handleSave}
              className="rounded-xl bg-gradient-to-r from-primary to-secondary font-bold shadow-lg shadow-primary/20"
            >
              {saved ? "Saved!" : "Save Protocols"}
            </Button>
          </div>
        </div>

        {/* Tab nav */}
        <nav className="flex gap-6 border-b border-white/5 mb-6">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "text-sm font-semibold pb-3 transition-colors",
                activeTab === id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Global Identity / Theme & Branding */}
          <section className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-primary" />
                <h2 className="font-semibold text-lg">Global Identity Defaults</h2>
              </div>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wide border border-secondary/20">
                Live Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              {/* Interface Mode */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Interface Mode</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDarkMode(true)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                      darkMode ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/30"
                    )}
                  >
                    <Moon className="h-7 w-7 text-primary" />
                    <span className="text-xs font-semibold">Obsidian Dark</span>
                  </button>
                  <button
                    onClick={() => setDarkMode(false)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                      !darkMode ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/30"
                    )}
                  >
                    <Sun className="h-7 w-7 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">Pristine Light</span>
                  </button>
                </div>
              </div>

              {/* Accent colors */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Primary Accent</p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {ACCENT_COLORS.map(({ className }, i) => (
                    <button key={i} className={cn("w-10 h-10 rounded-full cursor-pointer transition-all", className)} />
                  ))}
                  <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-adaptive contrast */}
            <div className="p-4 rounded-xl bg-muted/20 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">Auto-Adaptive Contrast</p>
                    <p className="text-xs text-muted-foreground">Adjust UI opacity based on ambient light sensors.</p>
                  </div>
                </div>
                <Switch checked={autoContrast} onCheckedChange={setAutoContrast} className="data-[state=checked]:bg-primary" />
              </div>
            </div>
          </section>

          {/* Security Matrix */}
          <section className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="h-6 w-6 text-secondary" />
              <h2 className="font-semibold text-lg">Security Matrix</h2>
            </div>

            <div className="space-y-5 flex-1">
              {/* Encryption level */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Encryption Level</p>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-secondary to-[--tertiary] rounded-full" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>AES-128</span>
                  <span className="text-secondary font-semibold">AES-256 (Quantum Ready)</span>
                </div>
              </div>

              {/* Security toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-semibold">Rotation Protocol</span>
                  </div>
                  <span className="text-xs text-muted-foreground">90 Days</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-semibold">Biometric Bypass</span>
                  </div>
                  <Switch checked={biometric} onCheckedChange={setBiometric} className="data-[state=checked]:bg-secondary" />
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-5 rounded-xl border-secondary/30 text-secondary hover:bg-secondary/10">
              Audit Access Logs
            </Button>
          </section>

          {/* API Gateway Hub */}
          <section className="col-span-12 lg:col-span-7 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Network className="h-6 w-6 text-[--tertiary]" />
                <h2 className="font-semibold text-lg">API Gateway Hub</h2>
              </div>
              <button className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
                <Plus className="h-4 w-4" /> New Endpoint
              </button>
            </div>
            <div className="space-y-3">
              {API_ENDPOINTS.map(({ label, sub, icon: Icon, color, bg, stat, statColor, bars, barColor }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-white/5 hover:border-[--tertiary]/30 transition-all cursor-pointer">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", bg)}>
                    <Icon className={cn("h-5 w-5", color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-mono font-semibold", statColor)}>{stat}</p>
                    <div className="flex gap-0.5 mt-1 justify-end">
                      {bars.map((on, i) => (
                        <div key={i} className={cn("h-1 w-4 rounded-full", on ? barColor : `${barColor}/20`)} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notification Gateways */}
          <section className="col-span-12 lg:col-span-5 glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <BellRing className="h-6 w-6 text-primary" />
              <h2 className="font-semibold text-lg">Notification Gateways</h2>
            </div>
            <div className="space-y-5">
              {NOTIFICATION_GATEWAYS.map(({ label, sub, icon: Icon, status, statusColor }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                    </div>
                  </div>
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded border shrink-0", statusColor)}>
                    {status}
                  </span>
                </div>
              ))}

              {/* Alert throttle */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Alert Throttling</span>
                  <span className="text-xs font-mono text-primary font-semibold">50 / min</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>
              </div>
            </div>
          </section>

          {/* System Health footer tile */}
          <section className="col-span-12 glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-muted/30 to-primary/5">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-semibold text-secondary">System: Nominal</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="text-xs text-muted-foreground">
                Uptime: <span className="text-white font-mono">142 Days, 4h 12m</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Version: <span className="text-white font-mono">2.4.0-build.882</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground shrink-0">
              <span className="text-xs font-mono">NODE_ADMIN_01</span>
              <Cloud className="h-5 w-5" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
