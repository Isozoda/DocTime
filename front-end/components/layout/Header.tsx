"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Activity, Menu, X, LogOut, LayoutDashboard, User as UserIcon, Map,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:5000";

function resolveAvatar(user: { name: string; avatar?: string | null }): string {
  return avatarUrl(user.name, user.avatar);
}

export function Header() {
  const t = useTranslations("nav");
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/doctors", label: t("doctors") },
    { href: "/hospitals", label: t("hospitals") },
    { href: "/map", label: t("map") },
    { href: "/about", label: t("about") },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/30"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 20px rgba(99,102,241,0.4)",
            }}
          >
            <Activity className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-foreground">
            Doc<span className="text-primary">Time</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          {mounted && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full p-0.5 transition-all duration-200 hover:ring-2 ring-primary/40 border border-border"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={resolveAvatar(user)} alt={user.name} />
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}
                    >
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 p-1.5 rounded-2xl glass-card border-border shadow-xl"
              >
                <div
                  className="px-3 py-2.5 rounded-xl mb-1 bg-primary/5 border border-primary/10"
                >
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild className="gap-2 rounded-xl text-muted-foreground hover:text-foreground focus:text-foreground">
                  <Link
                    href={user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"}
                    className="flex items-center gap-2"
                  >
                    {user.role === "admin" || user.role === "doctor"
                      ? <LayoutDashboard className="h-4 w-4 text-primary" />
                      : <UserIcon className="h-4 w-4 text-primary" />}
                    {user.role === "admin" ? t("controlCenter") : user.role === "doctor" ? t("dashboard") : t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-rose-400 hover:text-rose-300 focus:text-rose-300 gap-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-xl hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-5 py-2"
                style={{ borderRadius: "12px", fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}
              >
                {t("register")}
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-border px-4 pb-5 animate-slide-down bg-background/98 backdrop-blur-2xl"
        >
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                style={isActive(link.href) ? { background: "var(--primary) / 0.1" } : {}}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2.5 text-sm font-medium text-center text-muted-foreground rounded-xl border border-border hover:bg-accent transition-all"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center text-sm"
                  style={{ borderRadius: "12px", padding: "0.625rem 1.25rem" }}
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
