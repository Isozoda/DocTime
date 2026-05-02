"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { AdminNavSidebar } from "@/components/layout/AdminNavSidebar";
import { LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") router.push("/login");
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="relative glass-card rounded-2xl p-8 mb-6 overflow-hidden min-h-[220px] flex flex-col justify-end border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 pointer-events-none" />
          <div className="relative z-10">
             <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Admin Control Center</p>
             <h1 className="text-3xl font-bold text-white mb-3">Welcome back, {user.name.split(" ")[0]}.</h1>
             <p className="text-muted-foreground text-sm max-w-xl mb-6">
               Here you can manage patients, doctors, appointments, and system configuration.
             </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center py-20 text-muted-foreground border border-border/50">
           <LayoutDashboard className="h-10 w-10 mb-3 opacity-20 text-primary" />
           <p className="text-lg font-semibold text-foreground">Control Center Overview</p>
           <p className="text-sm mt-1">Analytics and overview charts are coming soon.</p>
        </div>
      </main>
    </div>
  );
}
