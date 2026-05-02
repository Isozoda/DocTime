"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import type { AuthResponse } from "@/types/user";
import type { Doctor } from "@/types/doctor";
import { SPECIALTIES } from "@/lib/utils";
import { doctorPhotoUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Stethoscope, Check, Eye, EyeOff, Loader2, User, Shield,
  ChevronLeft, Star, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ─── types ─── */
type Role = "patient" | "doctor" | "admin";

/* ─── step meta ─── */
function useSteps(role: Role, t: ReturnType<typeof useTranslations<"auth">>) {
  const patient = [
    t("stepPersonal"),
    t("stepVerification"),
    t("stepPassword"),
    t("stepBooking"),
  ];
  const other = [
    t("stepPersonal"),
    t("stepVerification"),
    t("stepPassword"),
  ];
  return role === "patient" ? patient : other;
}

/* ─── step indicator ─── */
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <div key={num} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                  done  && "border-primary bg-primary",
                  active && "border-primary bg-transparent",
                  !done && !active && "border-white/20 bg-transparent"
                )}
              >
                {done ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-colors",
                      active ? "bg-primary" : "bg-white/20"
                    )}
                  />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8 mt-1 transition-colors",
                    done ? "bg-primary" : "bg-white/15"
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                "text-sm font-medium pt-1.5 transition-colors",
                (done || active) ? "text-white" : "text-white/40"
              )}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── doctor mini-card for step 4 ─── */
function DoctorPickCard({
  doctor,
  onBook,
}: {
  doctor: Doctor;
  onBook: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors">
      <img
        src={doctorPhotoUrl(doctor.user?.name ?? doctor.userId, (doctor as any).photoUrl)}
        alt={doctor.user?.name ?? "Doctor"}
        className="w-12 h-12 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          {doctor.user?.name ?? "Dr."}
        </p>
        <p className="text-xs text-muted-foreground truncate">{doctor.specialization}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            {doctor.rating.toFixed(1)}
          </span>
          {doctor.city && (
            <span className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {doctor.city}
            </span>
          )}
        </div>
      </div>
      <Button size="sm" className="rounded-lg" onClick={() => onBook(doctor.id)}>
        Book
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login } = useAuthStore();

  /* form state */
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("patient");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+992-");
  const [privacyOk, setPrivacyOk] = useState(false);
  const [dataOk, setDataOk] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(false);

  /* step-4 doctor search */
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const [specFilter, setSpecFilter] = useState("");

  const steps = useSteps(role, t);

  /* ── helpers ── */
  const busy = (fn: () => Promise<void>) => async () => {
    setLoading(true);
    try { await fn(); } finally { setLoading(false); }
  };

  /* ── Step 1: send OTP ── */
  const handleStep1 = busy(async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Enter your full name"); return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      toast.error("Enter a valid phone number"); return;
    }
    if (!privacyOk || !dataOk) {
      toast.error("Please accept the terms"); return;
    }
    const res = await api.post("/auth/send-otp", { phone });
    const dev: string = res.data.data?.devOtp ?? "";
    setDevOtp(dev);
    toast.success(`${t("codeSentTo")} ${phone}`);
    if (dev) toast.info(`${t("devOtpHint")} ${dev}`, { duration: 30000 });
    setStep(2);
  });

  /* ── Step 2: verify OTP ── */
  const handleStep2 = busy(async () => {
    if (otp.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    await api.post("/auth/verify-otp", { phone, otp });
    toast.success("Phone verified!");
    setStep(3);
  });

  /* ── Step 3: register ── */
  const handleStep3 = busy(async () => {
    if (!email.trim()) { toast.error("Enter your email"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (role === "doctor" && !specialization) { toast.error("Select a specialization"); return; }

    const res = await api.post<AuthResponse>("/auth/register", {
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      password,
      phone,
      role,
      specialization: role === "doctor" ? specialization : undefined,
    });
    const { user, token } = res.data.data;
    login(user, token);
    toast.success(`Welcome to EasyDoc TJ, ${user.name.split(" ")[0]}!`);

    if (role === "doctor") {
      router.push("/doctor/dashboard");
    } else if (role === "admin") {
      router.push("/admin");
    } else {
      // load doctors for step 4
      setDocLoading(true);
      api.get("/doctors?limit=6").then(({ data }) => {
        setDoctors(data.data.doctors ?? []);
      }).catch(() => {}).finally(() => setDocLoading(false));
      setStep(4);
    }
  });

  /* ── Step 4: load doctors when filter changes ── */
  const loadDoctors = async (spec: string) => {
    setDocLoading(true);
    setSpecFilter(spec);
    const params = (spec && spec !== "all") ? `?specialization=${spec}&limit=6` : "?limit=6";
    api.get(`/doctors${params}`).then(({ data }) => {
      setDoctors(data.data.doctors ?? []);
    }).catch(() => {}).finally(() => setDocLoading(false));
  };

  const handleBook = (doctorId: string) => {
    router.push(`/booking/${doctorId}` as Parameters<typeof router.push>[0]);
  };

  const handleSkip = () => router.push("/dashboard/patient");

  /* ── render content by step ── */
  const renderStep = () => {
    switch (step) {
      /* ── Step 1 ── */
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t("step1Title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("step1Subtitle")}</p>
            </div>

            {/* Role toggle */}
            <div className="flex rounded-xl border border-border p-1 bg-muted">
              {(["patient", "doctor", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all",
                    role === r
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r === "patient" && <User className="h-4 w-4" />}
                  {r === "doctor" && <Stethoscope className="h-4 w-4" />}
                  {r === "admin" && <Shield className="h-4 w-4" />}
                  {t(r === "patient" ? "asPatient" : r === "doctor" ? "asDoctor" : "asAdmin")}
                </button>
              ))}
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  {t("firstName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ali"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">{t("lastName")}</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nazarov"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                {t("phone")} <span className="text-destructive">*</span>
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+992-90-000-00-00"
                className="h-11 rounded-xl"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyOk}
                  onChange={(e) => setPrivacyOk(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded"
                  style={{ accentColor: "#0D9488" }}
                />
                <span className="text-sm text-muted-foreground">
                  <span className="text-primary font-medium">{t("privacyConsent")}</span>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataOk}
                  onChange={(e) => setDataOk(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded"
                  style={{ accentColor: "#0D9488" }}
                />
                <span className="text-sm text-muted-foreground">{t("dataConsent")}</span>
              </label>
            </div>

            <Button
              onClick={handleStep1}
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
            >
              {loading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("sendingCode")}</>
                : t("sendCode")}
            </Button>
          </div>
        );

      /* ── Step 2 ── */
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t("step2Title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("step2Subtitle", { phone })}
              </p>
              {devOtp && (
                <p className="text-xs text-primary mt-2 font-mono bg-primary/5 border border-primary/15 px-3 py-1.5 rounded-lg">
                  {t("devOtpHint")} <strong>{devOtp}</strong>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Verification Code</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em] font-mono h-14 rounded-xl"
              />
            </div>

            <Button
              onClick={handleStep2}
              disabled={loading || otp.length !== 6}
              className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
            >
              {loading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("verifying")}</>
                : t("verifyCode")}
            </Button>

            <button
              type="button"
              onClick={() => { setOtp(""); handleStep1(); }}
              className="w-full text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              {t("resendCode")}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          </div>
        );

      /* ── Step 3 ── */
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t("step3Title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("step3Subtitle")}</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                {t("email")} <span className="text-destructive">*</span>
              </Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                {t("password")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  className="pr-10 h-11 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t("confirmPassword")}</Label>
              <Input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                placeholder="Repeat password"
                className="h-11 rounded-xl"
              />
              {confirm && confirm !== password && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            {role === "doctor" && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  {t("specialty")} <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={setSpecialization} value={specialization}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={handleStep3}
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
            >
              {loading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("creating")}</>
                : t("createAccount")}
            </Button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          </div>
        );

      /* ── Step 4 (patients only) ── */
      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t("step4PatientTitle")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("step4PatientSubtitle")}</p>
            </div>

            {/* Specialty filter */}
            <Select onValueChange={loadDoctors} value={specFilter}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All specialties</SelectItem>
                {SPECIALTIES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Doctor list */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {docLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))
              ) : doctors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No doctors found</p>
              ) : (
                doctors.map((d) => (
                  <DoctorPickCard key={d.id} doctor={d} onBook={handleBook} />
                ))
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleSkip}
              className="w-full h-11 rounded-xl"
            >
              {t("skipBooking")}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  /* ══ layout ══ */
  return (
    <div className="flex min-h-screen">
      {/* ── Left sidebar — gradient branded ── */}
      <aside className="hidden md:flex flex-col w-80 shrink-0 bg-gradient-to-br from-primary via-primary/95 to-secondary p-8 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute bottom-10 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">EasyDoc TJ</span>
        </div>

        <h2 className="text-white text-2xl font-bold mb-8 relative z-10">{t("registration")}</h2>

        <div className="flex-1 relative z-10">
          <StepIndicator steps={steps} current={step} />
        </div>

        <div className="text-white/30 text-xs mt-auto relative z-10">
          © 2026 EasyDoc TJ
        </div>
      </aside>

      {/* ── Right content ── */}
      <main className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-6 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md shadow-primary/25">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text text-lg font-bold">EasyDoc TJ</span>
          </div>

          {/* Mobile step pills */}
          <div className="flex gap-1.5 mb-6 md:hidden">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  i + 1 <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8">
            {renderStep()}
          </div>

          {/* Sign-in link (only in first 3 steps) */}
          {step <= 3 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("hasAccount")}{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline underline-offset-4 transition-colors">
                {t("signInLink")}
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
