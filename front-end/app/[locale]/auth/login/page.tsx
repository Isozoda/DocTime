"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import type { AuthResponse } from "@/types/user";
import { Label } from "@/components/ui/label";
import { Activity, Loader2, Eye, EyeOff, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const STATS = [
  { value: "500+", label: "Doctors" },
  { value: "50K+", label: "Patients" },
  { value: "4.8★", label: "Rating" },
];

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post<AuthResponse>("/auth/login", data);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.push(user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
    } catch {
      // error toast is handled by axios interceptor
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[480px] shrink-0 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-16 right-8 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-8 w-56 h-56 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">EasyDoc TJ</span>
          </div>

          {/* Hero */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-glow" />
                Healthcare platform
              </div>
              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
                Your health,<br />one click<br />away.
              </h1>
            </div>
            <p className="text-lg text-white/70 leading-relaxed max-w-xs">
              Connect with top doctors in Tajikistan and book appointments instantly.
            </p>
            <div className="flex gap-8 pt-2">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-white/55 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial card */}
          <div className="glass rounded-2xl p-6 space-y-3">
            <p className="text-sm text-white/90 italic leading-relaxed">
              &ldquo;Found an excellent cardiologist in minutes. The booking process was incredibly simple.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Zulfiya+R&background=ffffff&color=0D9488&size=40"
                alt="Zulfiya R"
                className="w-9 h-9 rounded-full ring-2 ring-white/30"
              />
              <div>
                <p className="text-sm font-semibold">Zulfiya Rahimova</p>
                <p className="text-xs text-white/55">Patient since 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-10">
        <div className="w-full max-w-sm space-y-8 animate-fade-up">
          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{t("loginTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("loginSubtitle")}</p>
            </div>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block">
            <h1 className="text-3xl font-bold tracking-tight">{t("loginTitle")}</h1>
            <p className="text-muted-foreground mt-1.5">{t("loginSubtitle")}</p>
          </div>

          {/* Form card */}
          <div className="glass-card rounded-3xl p-8 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  {t("email")}
                </Label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full h-12 px-4 rounded-xl border bg-background/50 text-foreground",
                    "placeholder:text-muted-foreground/50 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                    "transition-all duration-200",
                    errors.email ? "border-destructive/60" : "border-input"
                  )}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t("password")}
                </Label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    placeholder="••••••••"
                    className={cn(
                      "w-full h-12 px-4 pr-11 rounded-xl border bg-background/50 text-foreground",
                      "placeholder:text-muted-foreground/50 text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                      "transition-all duration-200",
                      errors.password ? "border-destructive/60" : "border-input"
                    )}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm",
                  "shadow-md shadow-primary/25 hover:bg-primary/90",
                  "hover:shadow-lg hover:shadow-primary/35 hover:scale-[1.01]",
                  "active:scale-[0.99] transition-all duration-200",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />{t("signingIn")}</>
                ) : t("signIn")}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/auth/register"
              className="text-primary font-semibold hover:underline underline-offset-4 transition-colors"
            >
              {t("signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
