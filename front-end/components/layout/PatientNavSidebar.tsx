"use client";

import { useState } from "react";
import { Link, usePathname } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { cn, avatarUrl } from "@/lib/utils";
import {
  LayoutDashboard, CalendarDays, FileText,
  Settings, LogOut, Stethoscope, Menu, X, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/patient/medical-history", label: "Medical History", icon: FileText },
];

export function PatientNavSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); router.push("/"); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border shrink-0">
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
          <Stethoscope className="h-4 w-4 text-white" />
        </div>
        <span className="text-sidebar-foreground font-bold text-base tracking-tight">DocTime</span>
      </div>

      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                active ? "bg-white/12 text-white" : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/6"
              )}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-primary" />}
              <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", active ? "bg-primary/20" : "")}>
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "opacity-50")} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2.5 py-3 border-t border-sidebar-border space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/6 transition-colors">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center"><Settings className="h-4 w-4 opacity-50" /></div>
          Settings
        </Link>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/6 transition-colors">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center"><Home className="h-4 w-4 opacity-50" /></div>
          Home
        </Link>
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white/15">
              <AvatarImage src={avatarUrl(user.name, (user as { avatar?: string | null }).avatar)} alt={user.name} />
              <AvatarFallback className="bg-primary text-white text-xs font-bold">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/45 capitalize">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-sidebar-foreground/35 hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-sidebar"><SidebarContent /></aside>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen((p) => !p)}
          className="bg-sidebar border-sidebar-border text-sidebar-foreground shadow-lg rounded-xl">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-60 z-50 bg-sidebar md:hidden shadow-2xl animate-slide-down"><SidebarContent /></aside>
        </>
      )}
    </>
  );
}
