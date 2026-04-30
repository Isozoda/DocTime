"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DoctorGrid } from "@/components/doctors/DoctorGrid";
import { DoctorFilter, type FilterState } from "@/components/doctors/DoctorFilter";
import { Button } from "@/components/ui/button";
import { useDoctors } from "@/hooks/useDoctors";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DoctorsPage() {
  const t = useTranslations("doctors");
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    specialization: searchParams.get("specialization") ?? "",
    city: searchParams.get("city") ?? "",
    rating: "all",
    online: false,
  });
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const ratingNum = filters.rating === "all" ? undefined : Number(filters.rating);

  const { doctors, pagination, isLoading } = useDoctors({
    specialization: filters.specialization || undefined,
    city: filters.city || undefined,
    rating: ratingNum,
    page,
    limit: 9,
  });

  const resetFilters = () => {
    setFilters({ specialization: "", city: "", rating: "all", online: false });
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        {/* Page header */}
        <div className="flex items-end justify-between mb-8 animate-fade-up">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-4.5 w-4.5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            {pagination && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">{pagination.total}</span>{" "}
                {pagination.total === 1 ? "doctor" : "doctors"} available
              </p>
            )}
          </div>
          <Button
            variant="outline"
            className="md:hidden gap-2 rounded-xl border-border/60"
            onClick={() => setDrawerOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("filters")}
          </Button>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-sm">
              <DoctorFilter filters={filters} onChange={setFilters} onReset={resetFilters} />
            </div>
          </aside>

          {/* Doctor grid + pagination */}
          <div className="flex-1 min-w-0">
            <DoctorGrid doctors={doctors} isLoading={isLoading} />

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "h-9 w-9 rounded-xl text-sm font-medium transition-all duration-200",
                          p === page
                            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                            : "border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 overflow-y-auto p-6 animate-slide-down md:hidden shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-base">Filters</span>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setDrawerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DoctorFilter filters={filters} onChange={setFilters} onReset={resetFilters} />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
