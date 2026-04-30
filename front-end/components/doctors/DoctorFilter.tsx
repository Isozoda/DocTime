"use client";

import { useTranslations } from "next-intl";
import { SPECIALTIES, CITIES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  specialization: string;
  city: string;
  rating: string;
  online: boolean;
}

interface DoctorFilterProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
}

export function DoctorFilter({ filters, onChange, onReset }: DoctorFilterProps) {
  const t = useTranslations("doctors");

  const set = (key: keyof FilterState, value: string | boolean) =>
    onChange({ ...filters, [key]: value });

  const hasActive =
    filters.specialization || filters.city || filters.rating !== "all" || filters.online;

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          </div>
          {t("filters")}
        </div>
        {hasActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Specialty */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("specialty")}
        </p>
        <Select
          value={filters.specialization || "all"}
          onValueChange={(v) => set("specialization", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-10 text-sm rounded-xl border-input/60">
            <SelectValue placeholder={t("specialty")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All specialties</SelectItem>
            {SPECIALTIES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("city")}
        </p>
        <Select
          value={filters.city || "all"}
          onValueChange={(v) => set("city", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-10 text-sm rounded-xl border-input/60">
            <SelectValue placeholder={t("city")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All cities</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating chips */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("rating")}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: t("allRatings") },
            { value: "4",   label: t("above4") },
            { value: "5",   label: t("only5") },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("rating", opt.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                filters.rating === opt.value
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Online toggle */}
      <div className="flex items-center justify-between py-1">
        <Label htmlFor="online-filter" className="text-sm font-medium cursor-pointer">
          {t("online")}
        </Label>
        <Switch
          id="online-filter"
          checked={filters.online}
          onCheckedChange={(v) => set("online", v)}
        />
      </div>
    </aside>
  );
}
