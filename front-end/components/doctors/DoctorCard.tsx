"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import type { Doctor } from "@/types/doctor";
import { doctorPhotoUrl } from "@/lib/utils";
import { MapPin, Clock, Star, Phone, CalendarDays, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const t = useTranslations("doctors");
  const color  = SPEC_COLORS[doctor.specialization] ?? "#6366F1";
  const specRu = SPEC_NAMES_RU[doctor.specialization] ?? doctor.specialization;
  const photo  = doctorPhotoUrl(doctor.user.name, doctor.photoUrl);
  const rating = Math.round(doctor.rating);

  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-black/10 hover:border-primary/25 hover:-translate-y-1.5 transition-all duration-300 flex flex-col">

      {/* ── Gradient header ── */}
      <div
        className="relative h-28 shrink-0 flex items-end px-5 pb-3"
        style={{
          background: `linear-gradient(135deg, ${color}22 0%, ${color}42 100%)`,
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-70"
          style={{
            background: `radial-gradient(ellipse at 20% 60%, ${color}60, transparent 55%)`,
          }}
        />

        {/* Online / offline badge */}
        <div className="absolute top-3 right-3 z-10">
          {doctor.schedule ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
            </div>
          ) : null}
        </div>

        {/* Doctor photo */}
        <div className="relative z-10 shrink-0">
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-30 scale-110 transition-opacity duration-300 group-hover:opacity-50"
            style={{ background: color }}
          />
          <Image
            src={photo}
            alt={doctor.user.name}
            width={72}
            height={72}
            className="relative rounded-2xl object-cover shadow-xl"
            style={{ outline: `2px solid ${color}40`, outlineOffset: "0px" }}
          />
        </div>

        {/* Name + specialty (header row) */}
        <div className="relative z-10 ms-3 flex-1 min-w-0 pb-0.5">
          <h3 className="font-bold text-sm leading-snug truncate text-foreground">
            {doctor.user.name}
          </h3>
          <span
            className="inline-flex items-center mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: `${color}28`,
              color,
              border: `1px solid ${color}45`,
            }}
          >
            {specRu}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  s <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/25"
                )}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold text-foreground">{doctor.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">/ 5.0</span>
        </div>

        {/* Info chips */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-xl px-2.5 py-2 border border-border/40">
            <MapPin className="h-3.5 w-3.5 text-primary/60 shrink-0" />
            <span className="truncate">{doctor.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-xl px-2.5 py-2 border border-border/40">
            <Clock className="h-3.5 w-3.5 text-primary/60 shrink-0" />
            <span className="truncate">{doctor.experience} {t("experience")}</span>
          </div>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
            {doctor.bio}
          </p>
        )}

        {/* Social links */}
        {(doctor.instagram || doctor.phone) && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
            {doctor.instagram && (
              <a
                href={`https://instagram.com/${doctor.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-pink-500 hover:text-pink-600 transition-colors font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <InstagramIcon className="h-3.5 w-3.5" />
                @{doctor.instagram}
              </a>
            )}
            {doctor.phone && (
              <a
                href={`tel:${doctor.phone}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3 w-3" />
                {doctor.phone}
              </a>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4">
          <Link
            href={`/doctors/${doctor.id}`}
            className={cn(
              "group/btn flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold",
              "bg-primary/8 text-primary border border-primary/20",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "hover:shadow-lg hover:shadow-primary/25",
              "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:outline-none",
              "transition-all duration-200"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            {t("bookBtn")}
            <ArrowRight className="h-3.5 w-3.5 opacity-0 -ms-1 group-hover/btn:opacity-100 group-hover/btn:ms-0 transition-all duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}
