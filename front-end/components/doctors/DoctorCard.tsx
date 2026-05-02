"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/navigation";
import type { Doctor } from "@/types/doctor";
import { doctorPhotoUrl, cn } from "@/lib/utils";
import { MapPin, Clock, Star, Phone, CalendarDays, Wifi } from "lucide-react";
import Image from "next/image";

const SPEC_COLORS: Record<string, string> = {
  Dentist: "#22D3EE",
  Cardiologist: "#F43F5E",
  Neurologist: "#8B5CF6",
  Pediatrician: "#10B981",
  Ophthalmologist: "#06B6D4",
  Gynecologist: "#EC4899",
  Urologist: "#F59E0B",
  Dermatologist: "#F97316",
  ENT: "#14B8A6",
  Therapist: "#6366F1",
  Orthopedist: "#84CC16",
  Endocrinologist: "#A855F7",
  Psychiatrist: "#64748B",
  Gastroenterologist: "#D97706",
};

const SPEC_NAMES_RU: Record<string, string> = {
  Dentist: "Стоматолог",
  Cardiologist: "Кардиолог",
  Neurologist: "Невролог",
  Pediatrician: "Педиатр",
  Ophthalmologist: "Офтальмолог",
  Gynecologist: "Гинеколог",
  Urologist: "Уролог",
  Dermatologist: "Дерматолог",
  ENT: "Отоларинголог",
  Therapist: "Терапевт",
  Orthopedist: "Ортопед",
  Endocrinologist: "Эндокринолог",
  Psychiatrist: "Психиатр",
  Gastroenterologist: "Гастроэнтеролог",
};

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const t = useTranslations("doctors");
  const [imageError, setImageError] = useState(false);
  const color = SPEC_COLORS[doctor.specialization] ?? "#6366F1";
  const specRu = SPEC_NAMES_RU[doctor.specialization] ?? doctor.specialization;
  
  const primaryPhoto = doctorPhotoUrl(doctor.user.name, doctor.photoUrl);
  const fallbackPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.name)}&background=6366F1&color=fff&size=400&bold=true`;
  const photo = imageError ? fallbackPhoto : primaryPhoto;

  return (
    <div
      className="group relative rounded-[20px] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 glass-card border-border shadow-xl shadow-black/5 dark:shadow-black/30"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px ${color}40, 0 0 40px ${color}15`;
        e.currentTarget.style.borderColor = `${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "";
      }}
    >
      {/* Photo area */}
      <div className="relative h-48 w-full overflow-hidden bg-muted/20">
        <Image
          src={photo}
          alt={doctor.user.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className={cn(
            "object-cover object-top transition-all duration-500 group-hover:scale-105",
            imageError ? "p-8 opacity-60" : "opacity-100"
          )}
          onError={() => setImageError(true)}
          priority={false}
        />
        {/* Gradient overlay - only show if not using fallback UI avatar */}
        {!imageError && (
          <div
            className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/40 to-transparent"
          />
        )}
        {/* Specialty badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}50`,
              color,
              backdropFilter: "blur(8px)",
            }}
          >
            {specRu}
          </span>
        </div>
        {/* Online indicator */}
        {doctor.schedule && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
            Online
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-base leading-snug text-foreground line-clamp-1">{doctor.user.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">{doctor.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{doctor.city}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{doctor.experience} {t("experience")}</span>
          </div>
          {doctor.schedule && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Wifi className="h-3.5 w-3.5 shrink-0" />
              <span>{t("onlineConsult")}</span>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-base font-bold text-foreground">80 TJS</p>
            </div>
            {doctor.phone && (
              <a
                href={`tel:${doctor.phone}`}
                className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 bg-muted/50 border border-border/50 text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <Link
            href={`/doctors/${doctor.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-white"
            style={{
              borderColor: `${color}40`,
              color: color,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = color;
              (e.currentTarget as HTMLElement).style.color = "#000";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}50`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = color;
              (e.currentTarget as HTMLElement).style.boxShadow = "";
            }}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {t("bookBtn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
