"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { useDoctor } from "@/hooks/useDoctor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { doctorPhotoUrl } from "@/lib/utils";
import Image from "next/image";

interface Props {
  params: Promise<{ doctorId: string }>;
}

const SPEC_NAMES_RU: Record<string, string> = {
  Dentist: "Стоматолог", Cardiologist: "Кардиолог", Neurologist: "Невролог",
  Pediatrician: "Педиатр", Ophthalmologist: "Офтальмолог", Gynecologist: "Гинеколог",
  Urologist: "Уролог", Dermatologist: "Дерматолог", ENT: "Отоларинголог",
  Therapist: "Терапевт", Orthopedist: "Ортопед", Endocrinologist: "Эндокринолог",
  Psychiatrist: "Психиатр", Gastroenterologist: "Гастроэнтеролог",
};

export default function BookingPage({ params }: Props) {
  const { doctorId } = use(params);
  const t = useTranslations("booking");
  const tDoc = useTranslations("doctors");
  const { doctor, isLoading } = useDoctor(doctorId);
  const specName = doctor ? (SPEC_NAMES_RU[doctor.specialization] ?? doctor.specialization) : "";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground rounded-xl">
          <Link href={`/doctors/${doctorId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </Link>
        </Button>

        {/* Page header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">Complete the steps below to book your appointment</p>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-fade-up">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        ) : doctor ? (
          <div className="space-y-6 animate-fade-up">
            {/* Doctor mini card */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <Image
                src={doctorPhotoUrl(doctor.user.name, doctor.photoUrl)}
                alt={doctor.user.name}
                width={56}
                height={56}
                className="rounded-2xl ring-2 ring-primary/15 object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{doctor.user.name}</p>
                <p className="text-sm text-primary font-semibold mt-0.5">{specName}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    {doctor.rating.toFixed(1)}
                  </span>
                  {doctor.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {doctor.city}
                    </span>
                  )}
                  <span>{doctor.experience} {tDoc("experience")}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available
                </div>
              </div>
            </div>

            <BookingWizard doctor={doctor} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-muted/20 animate-fade-up">
            <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
              <ArrowLeft className="h-6 w-6 text-primary/50" />
            </div>
            <p className="text-muted-foreground mb-4 font-medium">Doctor not found</p>
            <Button asChild className="rounded-xl">
              <Link href="/doctors">Browse Doctors</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
