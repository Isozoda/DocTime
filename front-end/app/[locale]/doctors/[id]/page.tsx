"use client";

import { useState } from "react";
import { use } from "react";
import { useTranslations } from "next-intl";
import { useDoctor } from "@/hooks/useDoctor";
import { useSlots } from "@/hooks/useSlots";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TimeSlotPicker } from "@/components/doctors/TimeSlotPicker";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ArrowLeft, CalendarDays, Phone, Star, Award, Wifi } from "lucide-react";
import { doctorPhotoUrl, cn } from "@/lib/utils";

import { Link } from "@/navigation";
import Image from "next/image";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const SPEC_COLORS: Record<string, string> = {
  Dentist: "#3B82F6", Cardiologist: "#EF4444", Neurologist: "#8B5CF6",
  Pediatrician: "#10B981", Ophthalmologist: "#06B6D4", Gynecologist: "#EC4899",
  Urologist: "#F59E0B", Dermatologist: "#F97316", ENT: "#14B8A6",
  Therapist: "#6366F1", Orthopedist: "#84CC16", Endocrinologist: "#A855F7",
  Psychiatrist: "#64748B", Gastroenterologist: "#D97706",
};

const SPEC_NAMES_RU: Record<string, string> = {
  Dentist: "Стоматолог", Cardiologist: "Кардиолог", Neurologist: "Невролог",
  Pediatrician: "Педиатр", Ophthalmologist: "Офтальмолог", Gynecologist: "Гинеколог",
  Urologist: "Уролог", Dermatologist: "Дерматолог", ENT: "Отоларинголог",
  Therapist: "Терапевт", Orthopedist: "Ортопед", Endocrinologist: "Эндокринолог",
  Psychiatrist: "Психиатр", Gastroenterologist: "Гастроэнтеролог",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function DoctorProfilePage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations("doctors");
  const tDoc = useTranslations("doctor");
  const tBooking = useTranslations("booking");
  const { doctor, isLoading } = useDoctor(id);
  const { slots, isLoading: slotsLoading, fetchSlots } = useSlots(id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleDateChange = (d: Date | undefined) => {
    setSelectedDate(d);
    setSelectedTime(null);
    if (d) fetchSlots(d);
  };

  const color = doctor ? (SPEC_COLORS[doctor.specialization] ?? "#6366F1") : "#6366F1";
  const specRu = doctor ? (SPEC_NAMES_RU[doctor.specialization] ?? doctor.specialization) : "";
  
  const primaryPhoto = doctor ? doctorPhotoUrl(doctor.user.name, doctor.photoUrl) : "";
  const fallbackPhoto = doctor ? `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.name)}&background=6366F1&color=fff&size=400&bold=true` : "";
  const photo = imageError ? fallbackPhoto : primaryPhoto;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="h-52 bg-muted animate-pulse" />
          <div className="container mx-auto px-4 max-w-5xl -mt-16 relative z-10">
            <div className="flex gap-6">
              <Skeleton className="h-32 w-32 rounded-full shrink-0" />
              <div className="flex-1 space-y-3 pt-4">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <p className="text-xl text-muted-foreground mb-4">Врач не найден</p>
          <Button asChild variant="outline">
            <Link href="/doctors"><ArrowLeft className="mr-2 h-4 w-4" />{t("title")}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(doctor.rating));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* Hero banner with gradient */}
        <div
          className="relative h-48 md:h-56 w-full overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}33 0%, ${color}11 50%, transparent 100%)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
          <div className="absolute top-4 left-4 md:left-8">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("title")}
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-10" style={{ background: color }} />
          <div className="absolute right-32 top-8 h-32 w-32 rounded-full opacity-5" style={{ background: color }} />
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Profile header — overlaps the banner */}
          <div className="relative -mt-20 z-10 flex flex-col sm:flex-row items-start gap-5 mb-8">
            {/* Avatar with colored ring */}
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full blur-md opacity-40 scale-110"
                style={{ background: color }}
              />
              <div className="relative p-1.5 rounded-full" style={{ background: `${color}30` }}>
                <Image
                  src={photo}
                  alt={doctor.user.name}
                  width={112}
                  height={112}
                  className={cn(
                    "rounded-full ring-4 ring-background bg-background object-cover",
                    imageError ? "p-4" : ""
                  )}
                  onError={() => setImageError(true)}
                />
              </div>
            </div>

            {/* Name / specialty / rating */}
            <div className="flex-1 pt-2 sm:pt-10">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold">{doctor.user.name}</h1>
                {doctor.schedule && (
                  <Badge className="gap-1 text-xs" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                    <Wifi className="h-3 w-3" /> Онлайн
                  </Badge>
                )}
              </div>

              <span
                className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-2"
                style={{ background: `${color}18`, color }}
              >
                {specRu}
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {stars.map((filled, i) => (
                    <Star key={i} className="h-4 w-4" fill={filled ? color : "none"} stroke={filled ? color : "currentColor"} strokeOpacity={filled ? 1 : 0.25} />
                  ))}
                </div>
                <span className="font-bold text-sm" style={{ color }}>{doctor.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">• {doctor.city}</span>
                <span className="text-xs text-muted-foreground">• {doctor.experience} {t("experience")}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Star,     label: t("rating"),      value: `${doctor.rating.toFixed(1)} / 5` },
              { icon: Award,    label: t("experience"),  value: `${doctor.experience} ${t("experience")}` },
              { icon: MapPin,   label: t("city"),        value: doctor.city },
              { icon: CalendarDays, label: t("schedule"), value: doctor.schedule ? `${t("onlineConsult")} / ${t("inPerson")}` : t("inPerson") },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl border p-4 flex flex-col gap-1">
                <s.icon className="h-4 w-4 mb-0.5" style={{ color }} />
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Main area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">
            {/* Left: tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-5 w-full justify-start">
                  <TabsTrigger value="about">{t("about")}</TabsTrigger>
                  <TabsTrigger value="booking">{tDoc("book")}</TabsTrigger>
                  <TabsTrigger value="contacts">{t("viewProfile")}</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-4">
                  {doctor.bio && (
                    <div className="rounded-2xl border bg-card p-5">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="h-5 w-1 rounded-full inline-block" style={{ background: color }} />
                        {t("about")}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
                    </div>
                  )}
                  <div className="rounded-2xl border bg-card p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <span className="h-5 w-1 rounded-full inline-block" style={{ background: color }} />
                      {t("viewProfile")}
                    </h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: t("specialty"),   value: specRu },
                        { label: t("experience"),  value: `${doctor.experience} ${t("experience")}` },
                        { label: t("city"),        value: doctor.city },
                        { label: t("rating"),      value: `${doctor.rating.toFixed(1)} / 5` },
                        { label: t("schedule"),    value: doctor.schedule ? `${t("onlineConsult")} / ${t("inPerson")}` : t("inPerson") },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="booking">
                  <div className="rounded-2xl border bg-card p-5 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="h-5 w-1 rounded-full inline-block" style={{ background: color }} />
                      {t("selectDate")}
                    </h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      disabled={(d) => d < new Date()}
                      className="mx-auto"
                    />
                    {selectedDate && (
                      <div>
                        <p className="text-sm font-medium mb-3">{tBooking("selectTime")}</p>
                        <TimeSlotPicker
                          slots={slots}
                          isLoading={slotsLoading}
                          selected={selectedTime}
                          onSelect={setSelectedTime}
                          hasDate={!!selectedDate}
                        />
                      </div>
                    )}
                    {selectedDate && selectedTime && (
                      <Button className="w-full gap-2 font-semibold" style={{ background: color }} asChild>
                        <Link href={`/booking/${doctor.id}`}>
                          <CalendarDays className="h-4 w-4" />
                          {tBooking("confirm")}
                        </Link>
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="contacts">
                  <div className="rounded-2xl border bg-card p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="h-5 w-1 rounded-full inline-block" style={{ background: color }} />
                      {t("viewProfile")}
                    </h3>
                    <div className="space-y-3">
                      {(doctor as any).phone && (
                        <a
                          href={`tel:${(doctor as any).phone}`}
                          className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors group"
                        >
                          <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                            <Phone className="h-4 w-4" style={{ color }} />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm font-semibold group-hover:underline" style={{ color }}>{(doctor as any).phone}</p>
                          </div>
                        </a>
                      )}
                      {(doctor as any).instagram && (
                        <a
                          href={`https://instagram.com/${(doctor as any).instagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors group"
                        >
                          <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-pink-500/10">
                            <InstagramIcon className="h-4 w-4 text-pink-500" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Instagram</p>
                            <p className="text-sm font-semibold text-pink-500 group-hover:underline">@{(doctor as any).instagram}</p>
                          </div>
                        </a>
                      )}
                      {doctor.user.email && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                          <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                            <span className="text-xs font-bold" style={{ color }}>@</span>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium">{doctor.user.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: sticky booking sidebar */}
            <div>
              <div className="sticky top-24 rounded-2xl border bg-card overflow-hidden shadow-sm">
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
                <div className="p-5 space-y-3">
                  <p className="text-sm font-semibold">{tDoc("book")}</p>
                  <p className="text-xs text-muted-foreground">{tBooking("visitType")}</p>

                  <Button className="w-full gap-2 font-semibold" style={{ background: color }} asChild>
                    <Link href={`/booking/${doctor.id}`}>
                      <CalendarDays className="h-4 w-4" />
                      {tBooking("inPerson")}
                    </Link>
                  </Button>

                  {doctor.schedule && (
                    <Button variant="outline" className="w-full gap-2" style={{ borderColor: `${color}60`, color }} asChild>
                      <Link href={`/booking/${doctor.id}?type=online`}>
                        <Wifi className="h-4 w-4" />
                        {tDoc("consult")}
                      </Link>
                    </Button>
                  )}

                  {(doctor as any).phone && (
                    <a
                      href={`tel:${(doctor as any).phone}`}
                      className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 rounded-lg hover:bg-muted/50"
                    >
                      <Phone className="h-4 w-4" />
                      {(doctor as any).phone}
                    </a>
                  )}

                  <div className="pt-2 border-t text-center">
                    <div className="flex justify-center gap-1 mb-1">
                      {stars.map((filled, i) => (
                        <Star key={i} className="h-3.5 w-3.5" fill={filled ? color : "none"} stroke={filled ? color : "currentColor"} strokeOpacity={filled ? 1 : 0.25} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{t("rating")}: {doctor.rating.toFixed(1)} / 5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
