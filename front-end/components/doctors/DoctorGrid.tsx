"use client";

import type { Doctor } from "@/types/doctor";
import { DoctorCard } from "./DoctorCard";
import { useTranslations } from "next-intl";
import { SearchX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorGridProps {
  doctors: Doctor[];
  isLoading: boolean;
  skeletonCount?: number;
}

function DoctorSkeleton() {
  return (
    <div className="rounded-[24px] overflow-hidden glass-card p-0 border-border/40">
      <div className="h-48 w-full bg-muted/20 skeleton-shimmer" />
      <div className="p-6 space-y-4">
        <div className="h-5 w-3/4 rounded-lg bg-muted/30 skeleton-shimmer" />
        <div className="h-3.5 w-1/2 rounded-lg bg-muted/20 skeleton-shimmer" />
        <div className="h-3.5 w-2/3 rounded-lg bg-muted/20 skeleton-shimmer" />
        <div className="h-11 w-full rounded-xl bg-muted/30 skeleton-shimmer" />
      </div>
    </div>
  );
}

export function DoctorGrid({ doctors, isLoading, skeletonCount = 6 }: DoctorGridProps) {
  const t = useTranslations("doctors");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <DoctorSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up rounded-[32px] bg-card/50 border border-border/50 backdrop-blur-xl">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
          <SearchX className="h-9 w-9 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{t("noResults")}</h3>
        <p className="text-sm text-muted-foreground max-w-xs px-6">{t("noResultsHint")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {doctors.map((doc, i) => (
        <div key={doc.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
          <DoctorCard doctor={doc} />
        </div>
      ))}
    </div>
  );
}
