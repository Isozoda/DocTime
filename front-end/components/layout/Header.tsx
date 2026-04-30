"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Stethoscope, Menu, X, LogOut, LayoutDashboard, User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:5000";

function resolveAvatar(user: { name: string; avatar?: string | null }): string {
  if (user.avatar) return `${BACKEND}${user.avatar}`;
  return avatarUrl(user.name);
}

export function Header() {
  const t = useTranslations("nav");
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    { href: "/about", label: t("about") },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/90 backdrop-blur-2xl shadow-sm shadow-black/5"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md shadow-primary/25 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <span className="gradient-text">EasyDoc</span>
          <span className="text-muted-foreground font-normal text-sm">TJ</span>
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
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full ring-2 ring-border/60 hover:ring-primary/40 transition-all duration-200"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={resolveAvatar(user)} alt={user.name} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-2xl border-border/50 shadow-2xl shadow-black/10 p-1.5 backdrop-blur-xl">
                <div className="px-3 py-2.5 bg-primary/5 rounded-xl mb-1 border border-primary/10">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild className="gap-2 rounded-xl">
                  <Link
                    href={user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"}
                    className="flex items-center gap-2"
                  >
                    {user.role === "doctor"
                      ? <LayoutDashboard className="h-4 w-4 text-primary" />
                      : <UserIcon className="h-4 w-4 text-primary" />}
                    {user.role === "doctor" ? t("dashboard") : t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive gap-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl px-4 font-medium" asChild>
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-xl px-5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200 font-semibold"
                asChild
              >
                <Link href="/auth/register">{t("register")}</Link>
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-2xl px-4 pb-5 animate-slide-down">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/40">
                <Button variant="outline" className="rounded-xl" asChild onClick={() => setMobileOpen(false)}>
                  <Link href="/auth/login">{t("login")}</Link>
                </Button>
                <Button
                  className="rounded-xl shadow-md shadow-primary/20 font-semibold"
                  asChild
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/auth/register">{t("register")}</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
