"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  BarChart3, CalendarDays, Clock, User, LogOut,
  Menu, X, Stethoscope, Users, Briefcase, Star,
  MessageSquare, Settings, FileText, ChevronUp, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doctorPhotoUrl, avatarUrl } from "@/lib/utils";

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:5000";

interface SidebarItem {
  tab: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
}

interface DashboardSidebarProps {
  role: "patient" | "doctor";
  activeTab: string;
  onTabChange: (tab: string) => void;
  doctorPhotoUrl?: string | null;
}

const DOCTOR_ITEMS: SidebarItem[] = [
  { tab: "overview",     icon: BarChart3,     labelKey: "overview" },
  { tab: "appointments", icon: CalendarDays,  labelKey: "appointments" },
  { tab: "schedule",     icon: Clock,         labelKey: "schedule" },
  { tab: "clients",      icon: Users,         labelKey: "clients" },
  { tab: "services",     icon: Briefcase,     labelKey: "services" },
  { tab: "reviews",      icon: Star,          labelKey: "reviews" },
  { tab: "feedback",     icon: MessageSquare, labelKey: "feedback" },
  { tab: "settings",     icon: Settings,      labelKey: "settings" },
];

const PATIENT_ITEMS: SidebarItem[] = [
  { tab: "overview",     icon: BarChart3,    labelKey: "overview" },
  { tab: "appointments", icon: CalendarDays, labelKey: "appointments" },
  { tab: "history",      icon: FileText,     labelKey: "history" },
  { tab: "profile",      icon: User,         labelKey: "profile" },
];

function resolvePhoto(role: "patient" | "doctor", name: string, photoUrl?: string | null): string {
  if (role === "doctor") return doctorPhotoUrl(name, photoUrl);
  return avatarUrl(name, photoUrl);
}

export function DashboardSidebar({ role, activeTab, onTabChange, doctorPhotoUrl }: DashboardSidebarProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const goToProfile = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    onTabChange(role === "doctor" ? "settings" : "profile");
  };

  const items = role === "doctor" ? DOCTOR_ITEMS : PATIENT_ITEMS;

  const avatarSrc = user
    ? resolvePhoto(
        role,
        user.name,
        role === "patient"
          ? (user as { avatar?: string | null }).avatar
          : doctorPhotoUrl,
      )
    : "";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30 shrink-0">
          <Stethoscope className="h-4 w-4 text-white" />
        </div>
        <span className="text-sidebar-foreground font-bold text-base tracking-tight">EasyDoc TJ</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const active = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => { onTabChange(item.tab); setMobileOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left relative",
                active
                  ? "bg-white/12 text-white shadow-sm"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/6"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-primary" />
              )}
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                active ? "bg-primary/20" : "bg-transparent"
              )}>
                <item.icon className={cn("h-4 w-4", active ? "text-primary" : "opacity-50")} />
              </div>
              {t(item.labelKey as Parameters<typeof t>[0])}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-2.5 py-3 border-t border-sidebar-border space-y-1" ref={menuRef}>
        {menuOpen && (
          <div className="mb-2 bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
            <div className="px-4 py-3 bg-primary/5 border-b border-border/40">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={goToProfile}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
            >
              <User className="h-4 w-4 text-primary" />
              {t("profile")}
            </button>
            <div className="border-t border-border/40" />
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          </div>
        )}

        {user && (
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors group"
          >
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white/15">
              <AvatarImage src={avatarSrc} alt={user.name} />
              <AvatarFallback className="bg-primary text-white text-xs font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/45 capitalize">{user.role}</p>
            </div>
            <ChevronUp className={cn(
              "h-3.5 w-3.5 text-sidebar-foreground/35 shrink-0 transition-transform duration-200",
              menuOpen ? "" : "rotate-180"
            )} />
          </button>
        )}

        {role === "patient" && (
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-white/6 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center">
              <Home className="h-4 w-4 opacity-50" />
            </div>
            {t("home")}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen((p) => !p)}
          className="bg-sidebar border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent shadow-lg rounded-xl"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-60 z-50 bg-sidebar md:hidden shadow-2xl animate-slide-down">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
