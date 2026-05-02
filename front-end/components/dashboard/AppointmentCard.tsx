"use client";

import { useTranslations } from "next-intl";
import type { Appointment } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { avatarUrl, doctorPhotoUrl, formatDateTime } from "@/lib/utils";
import { CalendarDays, Check, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: Appointment;
  role: "patient" | "doctor";
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
}

const statusBar = {
  pending:   "bg-amber-400",
  confirmed: "bg-primary",
  cancelled: "bg-destructive",
} as const;

export function AppointmentCard({
  appointment, role, onCancel, onConfirm,
}: AppointmentCardProps) {
  const t = useTranslations("dashboard");

  const isDoctor = role === "doctor";
  const name = isDoctor ? appointment.patient.name : appointment.doctor.user.name;
  const sub  = isDoctor ? (appointment.patient.phone ?? "") : appointment.doctor.specialization;
  const photo = isDoctor
    ? avatarUrl(name, appointment.patient.avatar)
    : doctorPhotoUrl(appointment.doctor.user.name, appointment.doctor.photoUrl);

  const canAct = appointment.status !== "cancelled";
  const bar = statusBar[appointment.status as keyof typeof statusBar] ?? statusBar.pending;

  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden flex hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
      {/* Status bar */}
      <div className={cn("w-1 shrink-0", bar)} />

      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <Image
              src={photo}
              alt={name}
              width={44}
              height={44}
              className="rounded-2xl object-cover ring-2 ring-border/60 group-hover:ring-primary/20 transition-all"
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-snug truncate">{name}</p>
                {sub && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub}</p>
                )}
              </div>
              <div className="shrink-0">
                <StatusBadge status={appointment.status} />
              </div>
            </div>

            {/* Date chip */}
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/8 text-primary rounded-full px-3 py-1 border border-primary/15">
                <CalendarDays className="h-3 w-3" />
                {formatDateTime(appointment.date)}
              </span>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <p className="text-xs text-muted-foreground mt-2 italic line-clamp-1 leading-relaxed">
                &quot;{appointment.notes}&quot;
              </p>
            )}

            {/* Actions */}
            {canAct && (
              <div className="flex gap-2 mt-3">
                {isDoctor && appointment.status === "pending" && onConfirm && (
                  <Button
                    size="sm"
                    className="gap-1.5 h-8 text-xs rounded-xl font-semibold shadow-sm shadow-primary/20"
                    onClick={() => onConfirm(appointment.id)}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {t("accept")}
                  </Button>
                )}
                {onCancel && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8 text-xs rounded-xl font-medium text-destructive border-destructive/25 hover:bg-destructive/5 hover:border-destructive/50 hover:text-destructive"
                    onClick={() => onCancel(appointment.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                    {t("cancel")}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
