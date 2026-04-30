"use client";

import React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useSlots } from "@/hooks/useSlots";
import api from "@/lib/axios";
import type { Doctor } from "@/types/doctor";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TimeSlotPicker } from "@/components/doctors/TimeSlotPicker";
import { BookingSuccess } from "./BookingSuccess";
import { cn, doctorPhotoUrl, formatDate } from "@/lib/utils";
import { Building2, Check, Loader2, MapPin, Wifi } from "lucide-react";
import Image from "next/image";

interface BookingWizardProps {
  doctor: Doctor;
}

/* ── Step indicator ────────────────────────────────────────────── */
function StepIndicator({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="flex items-start justify-center mb-8 gap-0">
      {labels.map((label, i) => {
        const num  = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                  done   && "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30",
                  active && "bg-primary/10 border-primary text-primary ring-4 ring-primary/10",
                  !done && !active && "bg-muted/50 border-border text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : num}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold text-center whitespace-nowrap",
                  active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 sm:w-16 mx-1 mt-4 rounded-full transition-all duration-500",
                  done ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Main wizard ─────────────────────────────────────────────── */
export function BookingWizard({ doctor }: BookingWizardProps) {
  const t = useTranslations("booking");
  const { user } = useAuthStore();

  const [step,      setStep]      = useState(1);
  const [date,      setDate]      = useState<Date | undefined>();
  const [time,      setTime]      = useState<string | null>(null);
  const [visitType, setVisitType] = useState<"in-person" | "online">("in-person");
  const [name,      setName]      = useState(user?.name ?? "");
  const [phone,     setPhone]     = useState(user?.phone ?? "");
  const [notes,     setNotes]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  const { slots, isLoading: slotsLoading, fetchSlots } = useSlots(doctor.id);

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    setTime(null);
    if (d) fetchSlots(d);
  };

  const handleConfirm = async () => {
    if (!date || !time) return;
    setLoading(true);
    const datetime = new Date(date);
    const [h, m] = time.split(":").map(Number);
    datetime.setHours(h, m, 0, 0);
    try {
      await api.post("/appointments", {
        doctorId: doctor.id,
        date: datetime.toISOString(),
        notes: notes || undefined,
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) return <BookingSuccess />;

  const stepLabels = [t("step1"), t("step2"), t("step3")];

  return (
    <div className="max-w-xl mx-auto">
      <StepIndicator labels={stepLabels} current={step} />

      {/* ── Step 1: Date & Time ─────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">{t("selectDate")}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t("step1")}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(d) => d < new Date()}
              className="mx-auto"
            />
          </div>

          {date && (
            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("selectTime")}
              </h3>
              <TimeSlotPicker
                slots={slots}
                isLoading={slotsLoading}
                selected={time}
                onSelect={setTime}
                hasDate={!!date}
              />
            </div>
          )}

          <Button
            className="w-full h-11 rounded-xl font-semibold"
            disabled={!date || !time}
            onClick={() => setStep(2)}
          >
            {t("next")}
          </Button>
        </div>
      )}

      {/* ── Step 2: Patient Info ─────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">{t("step2")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("patientName")}</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="bw-name" className="text-sm font-medium">
                {t("patientName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bw-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bw-phone" className="text-sm font-medium">
                {t("patientPhone")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bw-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+992 ..."
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("visitType")}</Label>
              <RadioGroup
                value={visitType}
                onValueChange={(v) => setVisitType(v as "in-person" | "online")}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { value: "in-person", icon: Building2, label: t("inPerson") },
                  { value: "online",    icon: Wifi,      label: t("online") },
                ].map(({ value, icon: Icon, label }) => (
                  <label
                    key={value}
                    htmlFor={`vt-${value}`}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors",
                      visitType === value
                        ? "bg-primary/8 border-primary/40 text-primary"
                        : "border-border hover:border-primary/30 hover:bg-muted/40"
                    )}
                  >
                    <RadioGroupItem value={value} id={`vt-${value}`} className="sr-only" />
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bw-notes" className="text-sm font-medium">{t("notes")}</Label>
              <Textarea
                id="bw-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setStep(1)}>
              {t("back")}
            </Button>
            <Button
              className="flex-1 h-11 rounded-xl font-semibold"
              disabled={!name || !phone}
              onClick={() => setStep(3)}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirm ─────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">{t("summary")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("confirm")}</p>
          </div>

          {/* Doctor banner */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />
            <div className="p-5 space-y-4">
              {/* Doctor row */}
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <Image
                  src={doctorPhotoUrl(doctor.user.name, doctor.photoUrl)}
                  alt={doctor.user.name}
                  width={52}
                  height={52}
                  className="rounded-full ring-2 ring-primary/20 object-cover"
                />
                <div>
                  <p className="font-semibold">{doctor.user.name}</p>
                  <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
                  {doctor.city && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" /> {doctor.city}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary rows */}
              <div className="space-y-2.5">
                {[
                  { label: t("date"),  value: date ? formatDate(date.toISOString(), "dd MMMM yyyy") : "" },
                  { label: t("time"),  value: time ?? "" },
                  { label: t("type"),  value: visitType === "online" ? t("online") : t("inPerson") },
                  { label: t("patientName"),  value: name },
                  { label: t("patientPhone"), value: phone },
                  ...(notes ? [{ label: t("notes"), value: notes }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start text-sm gap-4">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setStep(2)}>
              {t("back")}
            </Button>
            <Button
              className="flex-1 h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("confirming")}</>
                : t("confirm")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
