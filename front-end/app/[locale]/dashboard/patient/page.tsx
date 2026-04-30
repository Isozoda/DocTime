"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import { usePatientAppointments } from "@/hooks/useAppointments";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/navigation";
import {
  CalendarDays, FileText, Loader2, Camera, Trash2,
  AlertTriangle, ArrowRight, SearchX,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { User } from "@/types/user";

type Tab = "overview" | "appointments" | "history" | "profile";

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:5000";

function resolveAvatar(user: { name: string; avatar?: string | null }): string {
  if (user.avatar) return `${BACKEND}${user.avatar}`;
  const encoded = encodeURIComponent(user.name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=0D9488&color=fff&size=128`;
}

/* ── Welcome banner ────────────────────────────────────────────── */
function WelcomeBanner({ user }: { user: { name: string; avatar?: string | null } | null }) {
  const firstName = user?.name?.split(" ")[0] ?? "";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const emoji = hour < 12 ? "☀️" : hour < 18 ? "👋" : "🌙";

  return (
    <div className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-2xl p-7 text-white overflow-hidden shadow-xl shadow-primary/20">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-white/25 shadow-lg shrink-0">
            <AvatarImage src={user ? resolveAvatar(user) : ""} alt={user?.name ?? ""} />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {(user?.name ?? "?")[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white/65 text-sm font-medium">{greeting} {emoji}</p>
            <h1 className="text-2xl font-bold leading-tight mt-0.5">{firstName}</h1>
            <p className="text-white/55 text-xs mt-1">Manage your health appointments</p>
          </div>
        </div>
        <div className="shrink-0 hidden sm:block">
          <div className="glass rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-bold">{new Date().toLocaleDateString("en", { day: "2-digit", month: "short" })}</p>
            <p className="text-white/60 text-xs">{new Date().toLocaleDateString("en", { weekday: "long" })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ───────────────────────────────────────────────── */
function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border/60 bg-muted/15">
      <div className="h-14 w-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-4">
        <CalendarDays className="h-6 w-6 text-primary/50" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">{message}</p>
      <p className="text-xs text-muted-foreground mb-4">No appointments yet</p>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function PatientDashboardPage() {
  const t = useTranslations("dashboard");
  const { user, updateUser, logout } = useAuthStore();
  const { appointments, isLoading, cancel } = usePatientAppointments();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarDeleting, setAvatarDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab === "profile") {
      setProfileLoading(true);
      api
        .get<{ success: boolean; data: User }>("/users/profile")
        .then(({ data }) => {
          setProfile(data.data);
          setName(data.data.name);
          setPhone(data.data.phone ?? "");
        })
        .finally(() => setProfileLoading(false));
    }
  }, [tab]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put<{ success: boolean; data: User }>("/users/profile", { name, phone });
      updateUser({ name: data.data.name, phone: data.data.phone });
      setProfile(data.data);
      toast.success("Profile updated");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("avatar", file);
    setAvatarUploading(true);
    try {
      const { data } = await api.post<{ success: boolean; data: User }>("/users/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ avatar: data.data.avatar });
      setProfile((p) => p ? { ...p, avatar: data.data.avatar } : p);
      toast.success("Avatar updated");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    setAvatarDeleting(true);
    try {
      await api.delete("/users/profile/avatar");
      updateUser({ avatar: null });
      setProfile((p) => p ? { ...p, avatar: null } : p);
      toast.success("Avatar removed");
    } finally {
      setAvatarDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/users/profile");
      logout();
      router.push("/");
      toast.success("Account deleted");
    } finally {
      setDeleting(false);
    }
  };

  const upcoming  = appointments.filter((a) => a.status !== "cancelled");
  const cancelled = appointments.filter((a) => a.status === "cancelled");

  const renderContent = () => {
    switch (tab) {
      /* ── Overview ─────────────────────────────────────────────── */
      case "overview":
        return (
          <div className="space-y-6">
            <WelcomeBanner user={user} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard title={t("upcoming")}     value={upcoming.length}     icon={CalendarDays} color="primary" />
              <StatsCard title="Total"             value={appointments.length} icon={CalendarDays} color="secondary" />
              <StatsCard title="Cancelled"         value={cancelled.length}    icon={FileText}     color="destructive" />
            </div>

            {/* Upcoming list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-base">{t("upcoming")}</h2>
                {upcoming.length > 3 && (
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
              ) : upcoming.length === 0 ? (
                <EmptyState
                  message={t("noUpcoming")}
                  action={
                    <Button size="sm" asChild>
                      <Link href="/doctors">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Book a doctor
                      </Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {upcoming.slice(0, 3).map((a) => (
                    <AppointmentCard key={a.id} appointment={a} role="patient" onCancel={cancel} />
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
              <span className="text-sm text-muted-foreground">
                {appointments.length} total
              </span>
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
                  <AppointmentCard key={a.id} appointment={a} role="patient" onCancel={cancel} />
                ))}
              </div>
            )}
          </div>
        );

      /* ── History ──────────────────────────────────────────────── */
      case "history":
        return (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">{t("history")}</h2>
            {cancelled.length === 0 ? (
              <EmptyState message="No history yet" />
            ) : (
              <div className="space-y-3">
                {cancelled.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} role="patient" onCancel={cancel} />
                ))}
              </div>
            )}
          </div>
        );

      /* ── Profile ──────────────────────────────────────────────── */
      case "profile":
        return (
          <div className="max-w-lg space-y-6">
            <h2 className="text-xl font-bold">{t("profile")}</h2>

            {/* Avatar section */}
            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-border/60">
                    <AvatarImage
                      src={profile ? resolveAvatar(profile) : (user ? resolveAvatar(user) : "")}
                      alt={profile?.name ?? user?.name ?? ""}
                    />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
                      {(profile?.name ?? user?.name ?? "?")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Upload photo"
                  >
                    {avatarUploading
                      ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                      : <Camera className="h-5 w-5 text-white" />}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="text-center">
                  <p className="font-semibold">{profile?.name ?? user?.name}</p>
                  <p className="text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="rounded-full"
                  >
                    {avatarUploading
                      ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Uploading…</>
                      : <><Camera className="h-4 w-4 mr-1.5" />Change photo</>}
                  </Button>
                  {(profile?.avatar ?? user?.avatar) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteAvatar}
                      disabled={avatarDeleting}
                      className="text-destructive hover:text-destructive rounded-full"
                    >
                      {avatarDeleting
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile fields */}
            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Personal information</h3>
              {profileLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-11 rounded-xl" />
                  <Skeleton className="h-11 rounded-xl" />
                  <Skeleton className="h-11 rounded-xl" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input
                      value={profile?.email ?? ""}
                      disabled
                      className="h-11 rounded-xl opacity-60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+992 ..."
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
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

            {/* Danger zone */}
            <div className="bg-card rounded-2xl border border-destructive/25 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-semibold">Danger zone</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                This will permanently delete your account and all appointments. This cannot be undone.
              </p>
              {!confirmDelete ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-colors"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete my account
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                  >
                    {deleting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                    Yes, delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="patient"
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
