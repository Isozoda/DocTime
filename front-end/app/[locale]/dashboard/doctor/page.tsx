"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useDoctorAppointments } from "@/hooks/useAppointments";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ScheduleEditor } from "@/components/dashboard/ScheduleEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3, CalendarDays, Star, Loader2,
  Construction, Camera, Trash2, ArrowRight,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { doctorPhotoUrl } from "@/lib/utils";
import type { Doctor, WeekSchedule } from "@/types/doctor";
import type { User } from "@/types/user";

interface HospitalOption { id: string; name: string; city: string; address: string; }

type Tab =
  | "overview" | "appointments" | "schedule" | "clients"
  | "services" | "reviews" | "feedback" | "settings";

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:5000";

function resolveDoctorPhoto(name: string, photoUrl?: string | null): string {
  if (photoUrl && photoUrl.startsWith("/uploads/")) return `${BACKEND}${photoUrl}`;
  return doctorPhotoUrl(name, photoUrl);
}

/* ── Coming soon placeholder ───────────────────────────────────── */
function ComingSoon({ label }: { label: string }) {
  const t = useTranslations("dashboard");
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Construction className="h-8 w-8 text-muted-foreground opacity-60" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{label}</h3>
      <p className="text-sm text-muted-foreground">{t("comingSoonDesc")}</p>
    </div>
  );
}

/* ── Welcome banner ────────────────────────────────────────────── */
function DoctorWelcome({ user, doctor }: { user: { name: string } | null; doctor: Doctor | null }) {
  const lastName = user?.name?.split(" ").pop() ?? "";
  return (
    <div className="relative bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm">Welcome back,</p>
          <h1 className="text-2xl font-bold">Dr. {lastName}</h1>
          {doctor && (
            <p className="text-white/60 text-sm mt-0.5">{doctor.specialization} · {doctor.city}</p>
          )}
        </div>
        {doctor && (
          <div className="shrink-0 text-center">
            <p className="text-3xl font-bold">{doctor.rating.toFixed(1)}</p>
            <p className="text-white/60 text-xs mt-0.5">★ rating</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Empty state ───────────────────────────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-muted/20">
      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
        <CalendarDays className="h-6 w-6 text-muted-foreground opacity-60" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function DoctorDashboardPage() {
  const t = useTranslations("dashboard");
  const { user, updateUser } = useAuthStore();
  const { appointments, isLoading, confirm, cancel } = useDoctorAppointments();

  const [tab, setTab] = useState<Tab>("overview");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [docLoading, setDocLoading] = useState(false);

  /* profile fields */
  const [name,           setName]           = useState("");
  const [phone,          setPhone]          = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city,           setCity]           = useState("");
  const [experience,     setExperience]     = useState("");
  const [instagram,      setInstagram]      = useState("");
  const [bio,            setBio]            = useState("");
  const [saving,         setSaving]         = useState(false);

  /* hospital */
  const [hospitals,  setHospitals]  = useState<HospitalOption[]>([]);
  const [hospitalId, setHospitalId] = useState<string>("");

  /* photo */
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoDeleting,  setPhotoDeleting]  = useState(false);
  const [photoKey,       setPhotoKey]       = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab === "schedule" || tab === "settings") {
      setDocLoading(true);
      Promise.all([
        api.get<{ success: boolean; data: Doctor }>("/doctors/me/profile"),
        api.get<{ success: boolean; data: User }>("/users/profile"),
        api.get<{ success: boolean; data: HospitalOption | null }>("/doctors/me/hospital"),
        api.get<{ success: boolean; data: { hospitals: HospitalOption[] } }>("/hospitals"),
      ])
        .then(([docRes, userRes, hospRes, allHospRes]) => {
          const d = docRes.data.data;
          const u = userRes.data.data;
          setDoctor(d);
          setName(u.name);
          setPhone(u.phone ?? "");
          setSpecialization(d.specialization);
          setCity(d.city);
          setExperience(String(d.experience));
          setInstagram(d.instagram ?? "");
          setBio(d.bio ?? "");
          setHospitalId(hospRes.data.data?.id ?? "");
          setHospitals(allHospRes.data.data.hospitals ?? []);
        })
        .catch(() => {})
        .finally(() => setDocLoading(false));
    }
  }, [tab]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        api.put("/users/profile", { name, phone }),
        api.put("/doctors/me/profile", {
          specialization, city, bio, instagram,
          experience: Number(experience) || 0,
        }),
        api.put("/doctors/me/hospital", { hospitalId: hospitalId || null }),
      ]);
      updateUser({ name, phone });
      toast.success("Profile updated");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("photo", file);
    setPhotoUploading(true);
    try {
      const { data } = await api.post<{ success: boolean; data: Doctor }>("/doctors/me/photo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDoctor(data.data);
      setPhotoKey((k) => k + 1);
      toast.success("Photo updated");
    } finally {
      setPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    setPhotoDeleting(true);
    try {
      const { data } = await api.delete<{ success: boolean; data: Doctor }>("/doctors/me/photo");
      setDoctor(data.data);
      setPhotoKey((k) => k + 1);
      toast.success("Photo removed");
    } finally {
      setPhotoDeleting(false);
    }
  };

  const pending   = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");

  const renderContent = () => {
    switch (tab) {
      /* ── Overview ─────────────────────────────────────────────── */
      case "overview":
        return (
          <div className="space-y-6">
            <DoctorWelcome user={user} doctor={doctor} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title={t("today")}    value={pending.length}                    icon={CalendarDays} color="primary" />
              <StatsCard title={t("thisWeek")} value={appointments.length}               icon={BarChart3}    color="secondary" />
              <StatsCard title="Confirmed"     value={confirmed.length}                  icon={CalendarDays} color="secondary" />
              <StatsCard title={t("myRating")} value={doctor?.rating.toFixed(1) ?? "—"} icon={Star}         color="warning" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-base">Recent appointments</h2>
                {appointments.length > 5 && (
                  <button
                    onClick={() => setTab("appointments")}
                    className="text-xs text-primary font-medium flex items-center gap-1 hover:underline underline-offset-2"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-2xl" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <EmptyState message={t("noUpcoming")} />
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((a) => (
                    <AppointmentCard key={a.id} appointment={a} role="doctor" onConfirm={confirm} onCancel={cancel} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      /* ── Appointments ─────────────────────────────────────────── */
      case "appointments":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t("appointments")}</h2>
              <span className="text-sm text-muted-foreground">{appointments.length} total</span>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <EmptyState message={t("noUpcoming")} />
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} role="doctor" onConfirm={confirm} onCancel={cancel} />
                ))}
              </div>
            )}
          </div>
        );

      /* ── Schedule ─────────────────────────────────────────────── */
      case "schedule":
        return (
          <div className="max-w-xl space-y-6">
            <h2 className="text-xl font-bold">{t("schedule")}</h2>
            {docLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : (
              <ScheduleEditor
                initial={
                  doctor?.schedule == null
                    ? null
                    : typeof doctor.schedule === "string"
                    ? (JSON.parse(doctor.schedule) as WeekSchedule)
                    : doctor.schedule
                }
              />
            )}
          </div>
        );

      /* ── Settings ─────────────────────────────────────────────── */
      case "settings":
        return (
          <div className="max-w-xl space-y-6">
            <h2 className="text-xl font-bold">{t("settings")}</h2>

            {/* Profile card with banner */}
            <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <div className="h-24 bg-gradient-to-r from-primary to-secondary relative" />
              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-12 mb-4">
                  <div className="relative group">
                    <Avatar key={photoKey} className="h-24 w-24 ring-4 ring-card shadow-lg">
                      <AvatarImage
                        src={doctor?.photoUrl
                          ? `${resolveDoctorPhoto(name || user?.name || "", doctor.photoUrl)}?t=${photoKey}`
                          : resolveDoctorPhoto(name || user?.name || "", undefined)}
                        alt={name || user?.name || ""}
                      />
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                        {(name || user?.name || "D")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoUploading}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Upload photo"
                    >
                      {photoUploading
                        ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                        : <Camera className="h-5 w-5 text-white" />}
                    </button>
                  </div>

                  <div className="flex gap-2 pb-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoUploading}
                      className="rounded-full px-4 gap-1.5"
                    >
                      {photoUploading
                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Uploading…</>
                        : <><Camera className="h-3.5 w-3.5" />Change photo</>}
                    </Button>
                    {doctor?.photoUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeletePhoto}
                        disabled={photoDeleting}
                        className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {photoDeleting
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />

                {!docLoading && (
                  <>
                    <h3 className="text-lg font-bold text-foreground">{name || user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{specialization} · {city}</p>
                  </>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-5">
              <h3 className="font-semibold text-foreground">Profile information</h3>

              {docLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-11 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Full Name
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Phone
                      </Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+992 ..."
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Specialization
                      </Label>
                      <Input
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        City
                      </Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Experience (years)
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Instagram
                      </Label>
                      <Input
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@username"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Bio
                    </Label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell patients about yourself..."
                      className="rounded-xl resize-none"
                    />
                  </div>

                  {/* Hospital */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      My Hospital / Clinic
                    </Label>
                    <select
                      value={hospitalId}
                      onChange={(e) => setHospitalId(e.target.value)}
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">— Not linked to a hospital —</option>
                      {hospitals.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} · {h.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-11 rounded-xl font-semibold"
                  >
                    {saving
                      ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("saving")}</>
                      : t("saveProfile")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case "clients":  return <ComingSoon label={t("clients")} />;
      case "services": return <ComingSoon label={t("services")} />;
      case "reviews":  return <ComingSoon label={t("reviews")} />;
      case "feedback": return <ComingSoon label={t("feedback")} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="doctor"
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
        doctorPhotoUrl={doctor?.photoUrl}
      />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
