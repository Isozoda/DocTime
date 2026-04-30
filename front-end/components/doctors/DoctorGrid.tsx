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
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Gradient header skeleton */}
      <div className="h-28 bg-muted/60 flex items-end px-5 pb-3 gap-3">
        <Skeleton className="h-[72px] w-[72px] rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2 pb-1">
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      {/* Body skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-20 rounded-full" />
          <Skeleton className="h-3 w-10 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-8 rounded-xl" />
          <Skeleton className="h-8 rounded-xl" />
        </div>
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-3/4 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-xl" />
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
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5">
          <SearchX className="h-7 w-7 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{t("noResults")}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{t("noResultsHint")}</p>
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
