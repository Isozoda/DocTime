"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { CalendarDays, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookingSuccess() {
  const t = useTranslations("booking");

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up px-4">
      {/* Animated check */}
      <div className="relative mb-8">
        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
          <svg viewBox="0 0 52 52" className="h-16 w-16">
            <circle
              cx="26" cy="26" r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-primary/30"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27l8 8 16-16"
              className="text-primary animate-check-draw"
            />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/8 animate-ping opacity-20" />
      </div>

      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold tracking-tight">{t("successTitle")}</h2>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          {t("successMessage")}
        </p>
      </div>

      {/* Confirmation note */}
      <div className="flex items-center gap-2 mt-4 mb-8 px-4 py-2.5 bg-primary/8 rounded-xl border border-primary/15 text-primary text-xs font-medium">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        Your appointment is confirmed. Check your dashboard for details.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/patient/dashboard"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold",
            "bg-primary text-primary-foreground shadow-md shadow-primary/25",
            "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.01]",
            "active:scale-[0.99] transition-all duration-200"
          )}
        >
          <CalendarDays className="h-4 w-4" />
          {t("viewAppointments")}
        </Link>
        <Link
          href="/doctors"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold",
            "border border-border text-foreground",
            "hover:border-primary/40 hover:text-primary hover:bg-primary/5",
            "transition-all duration-200"
          )}
        >
          {t("bookAnother")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
