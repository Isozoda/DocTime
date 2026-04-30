"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useDoctors } from "@/hooks/useDoctors";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DoctorGrid } from "@/components/doctors/DoctorGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "@/components/ui/StarRating";
import {
  Search, Brain, Heart, Baby, Eye, Bone, Activity,
  Stethoscope, Smile, ArrowRight, CalendarDays, Clock,
  Droplets, Scan, Ear, Shield, Users, Award, CheckCircle2,
  TrendingUp, MapPin, Sparkles,
} from "lucide-react";
import { SPECIALTIES, CITIES } from "@/lib/utils";
import { Link } from "@/navigation";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface Specialization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  smile: Smile, heart: Heart, brain: Brain, baby: Baby, eye: Eye,
  activity: Activity, droplets: Droplets, scan: Scan, ear: Ear,
  stethoscope: Stethoscope, bone: Bone, stomach: Stethoscope, mind: Brain,
};

const STATS = [
  { value: "500+",    key: "doctors",   icon: Stethoscope, bg: "bg-primary/10",   fg: "text-primary" },
  { value: "20+",     key: "hospitals", icon: Shield,      bg: "bg-secondary/10", fg: "text-secondary" },
  { value: "50,000+", key: "patients",  icon: Users,       bg: "bg-primary/10",   fg: "text-primary" },
  { value: "4.8★",    key: "rating",    icon: Award,       bg: "bg-amber-500/10", fg: "text-amber-500" },
];

const TESTIMONIALS = [
  { name: "Zulfiya Rahimova",  city: "Dushanbe", text: "Found an excellent cardiologist in minutes. The booking process was incredibly simple.", rating: 5 },
  { name: "Behruz Nazarov",    city: "Khujand",  text: "Great platform! I booked an appointment with a pediatrician for my child the same day.", rating: 5 },
  { name: "Malika Toshmatova", city: "Bokhtar",  text: "Very convenient to compare doctors and read reviews before making a decision.", rating: 4 },
];

/* ─── Decorative hero preview (aria-hidden, desktop only) ─── */
function HeroPreviewCard() {
  const slots = ["09:00", "11:30", "14:30", "16:00", "17:30"];
  return (
    <div aria-hidden className="relative w-[340px] shrink-0 select-none pointer-events-none">
      {/* Confirmed badge — floats top-left */}
      <div className="absolute -top-6 -left-8 z-20 animate-float">
        <div className="glass rounded-2xl px-4 py-3 shadow-2xl shadow-primary/20 border border-white/30 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Appointment Confirmed</p>
              <p className="text-xs text-muted-foreground">Today, 14:30</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main booking card */}
      <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-primary/10">
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Book Appointment</p>
              <p className="text-xs text-muted-foreground">Choose a time slot</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Online</span>
          </div>
        </div>

        {/* Doctor row */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/60 mb-5 border border-border/50">
          <img
            src="https://ui-avatars.com/api/?name=Kamol+Nazarov&background=0D9488&color=fff&size=48"
            alt=""
            className="h-12 w-12 rounded-xl object-cover shadow-md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Dr. Kamol Nazarov</p>
            <p className="text-xs text-muted-foreground">Cardiologist · Dushanbe</p>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-muted-foreground ms-1">4.9</span>
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {slots.map((time, i) => (
            <div
              key={time}
              className={cn(
                "py-2 rounded-xl text-center text-xs font-semibold transition-all",
                i === 2
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : i === 0
                  ? "bg-muted/40 text-muted-foreground/50 line-through"
                  : "bg-muted/60 text-foreground/70"
              )}
            >
              {time}
            </div>
          ))}
          <div className="py-2 rounded-xl text-center text-xs font-semibold bg-muted/30 text-muted-foreground/40">
            +2
          </div>
        </div>

        {/* CTA row */}
        <div className="h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 text-xs font-semibold shadow-md shadow-primary/25">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Confirm Appointment
        </div>
      </div>

      {/* Doctors count badge — floats bottom-right */}
      <div className="absolute -bottom-6 -right-8 z-20 animate-float-alt">
        <div className="glass rounded-2xl px-4 py-3 shadow-2xl shadow-primary/20 border border-white/30 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md shadow-primary/25">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">500+ Doctors</p>
              <p className="text-xs text-muted-foreground">Ready to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Specialization grid ─── */
function SpecializationGrid({ specializations }: { specializations: Specialization[] }) {
  const displayed = specializations.slice(0, 12);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {displayed.map((spec, i) => {
        const Icon = ICON_MAP[spec.icon ?? ""] ?? Stethoscope;
        const color = spec.color ?? "#0D9488";
        return (
          <Link
            key={spec.id}
            href={`/specializations/${spec.slug}`}
            className="group relative flex flex-col items-center gap-3 p-5 bg-card border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Top accent */}
            <div
              className="absolute top-0 inset-x-0 h-1 transition-all duration-300 group-hover:h-1.5"
              style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
            />
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 mt-1"
              style={{
                background: `${color}18`,
                border: `1.5px solid ${color}35`,
              }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <span className="text-xs font-semibold text-center leading-snug text-foreground/75 group-hover:text-primary transition-colors">
              {spec.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════ */
export default function HomePage() {
  const t = useTranslations();
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const { doctors, isLoading } = useDoctors({ limit: 6 });

  useEffect(() => {
    api
      .get<{ success: boolean; data: Specialization[] }>("/specializations")
      .then(({ data }) => setSpecializations(data.data))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (specialty) params.set("specialization", specialty);
    if (city) params.set("city", city);
    router.push(`/doctors?${params}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-20 pb-28 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/12 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-secondary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
            {/* Left — text + search */}
            <div className="text-center lg:text-start max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20 mb-6 animate-fade-in-up">
                <Sparkles className="h-3.5 w-3.5" />
                {t("hero.badge")}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-balance mb-6 animate-fade-in-up delay-100">
                <span className="gradient-text">{t("hero.title")}</span>
              </h1>

              <p className="text-lg text-muted-foreground text-pretty max-w-xl mx-auto lg:mx-0 mb-10 animate-fade-in-up delay-200">
                {t("hero.subtitle")}
              </p>

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-2 glass-card rounded-2xl p-2.5 shadow-2xl shadow-primary/8 animate-fade-in-up delay-300">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 z-10 pointer-events-none" />
                  <Select onValueChange={setSpecialty}>
                    <SelectTrigger className="border-0 bg-transparent h-11 ps-9">
                      <SelectValue placeholder={t("search.specialty")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-border/60 mx-1" />
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 z-10 pointer-events-none" />
                  <Select onValueChange={setCity}>
                    <SelectTrigger className="border-0 bg-transparent h-11 ps-9">
                      <SelectValue placeholder={t("search.city")} />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="gap-2 px-6 h-11 rounded-xl shadow-lg shadow-primary/20 shrink-0 font-semibold"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                  {t("search.button")}
                </Button>
              </div>
            </div>

            {/* Right — floating booking preview (desktop only) */}
            <div className="hidden lg:flex items-center justify-center py-12 px-4">
              <HeroPreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-4 -mt-8 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s, idx) => (
              <div
                key={s.key}
                className="bg-card rounded-2xl border border-border/60 p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up flex flex-col items-center gap-2"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-1", s.bg)}>
                  <s.icon className={cn("h-5 w-5", s.fg)} />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold gradient-text leading-none">{s.value}</p>
                <p className="text-muted-foreground text-xs font-medium">{t(`stats.${s.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specializations ── */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="section-badge mb-4">
              <Stethoscope className="h-3.5 w-3.5" />
              {t("specialties.title")}
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">{t("specialties.title")}</h2>
            <p className="text-muted-foreground mt-2 text-pretty">{t("specialties.subtitle")}</p>
          </div>

          {specializations.length > 0 ? (
            <SpecializationGrid specializations={specializations} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-muted/60 animate-pulse" />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button variant="outline" asChild className="rounded-xl px-6 font-medium gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200">
              <Link href="/doctors">
                {t("doctors.findAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Top Doctors ── */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-badge mb-3">
                <Award className="h-3.5 w-3.5" />
                {t("doctors.title")}
              </span>
              <h2 className="text-3xl font-bold tracking-tight mt-3">{t("doctors.title")}</h2>
              <p className="text-muted-foreground mt-2">{t("doctors.subtitle")}</p>
            </div>
            <Button variant="ghost" asChild className="gap-2 hidden sm:flex rounded-xl font-medium hover:text-primary hover:bg-primary/5 transition-all duration-200">
              <Link href="/doctors">
                {t("doctors.findAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <DoctorGrid doctors={doctors} isLoading={isLoading} skeletonCount={6} />
          <div className="text-center mt-8 sm:hidden">
            <Button variant="outline" asChild className="rounded-xl gap-2">
              <Link href="/doctors">{t("doctors.findAll")} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="section-badge mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            {t("howItWorks.title")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight mt-3 mb-3">{t("howItWorks.title")}</h2>
          <p className="text-muted-foreground mb-14 text-pretty">{t("howItWorks.subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[2.75rem] left-[calc(16.66%+2.5rem)] right-[calc(16.66%+2.5rem)] h-px bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 z-0" />

            {[
              { icon: Search,      titleKey: "step1Title", descKey: "step1Desc", num: "1" },
              { icon: CalendarDays, titleKey: "step2Title", descKey: "step2Desc", num: "2" },
              { icon: Clock,       titleKey: "step3Title", descKey: "step3Desc", num: "3" },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="relative z-10 flex flex-col items-center bg-card border border-border/60 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="relative mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-primary/15 shadow-md shadow-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold flex items-center justify-center shadow-md shadow-primary/25">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2">{t(`howItWorks.${step.titleKey}`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-balance">
                  {t(`howItWorks.${step.descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="section-badge mb-4">
              <Award className="h-3.5 w-3.5" />
              {t("testimonials.title")}
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">{t("testimonials.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((review, idx) => (
              <div
                key={review.name}
                className="relative bg-card border border-border/60 rounded-2xl p-6 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 shadow-sm animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Top accent based on rating */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/60 via-secondary/60 to-primary/60" />
                {/* Decorative quote mark */}
                <div className="absolute -top-1 -right-1 text-[6rem] font-serif leading-none text-primary/6 select-none pointer-events-none">
                  &ldquo;
                </div>

                <StarRating rating={review.rating} className="mb-4 relative z-10" />
                <p className="text-sm text-foreground/75 mb-5 leading-relaxed relative z-10 flex-1 text-pretty">
                  {review.text}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50 relative z-10">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=0D9488&color=fff&size=40`}
                    alt={review.name}
                    className="h-10 w-10 rounded-full ring-2 ring-primary/20 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-snug">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container mx-auto max-w-2xl text-center text-white relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            EasyDoc TJ
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-balance">
            {t("cta.title")}
          </h2>
          <p className="text-white/75 mb-10 text-lg text-pretty">{t("cta.subtitle")}</p>
          <Button
            size="lg"
            asChild
            className="bg-white text-primary hover:bg-white/95 font-bold px-10 rounded-full shadow-2xl shadow-black/20 hover:scale-[1.03] hover:shadow-white/20 transition-all duration-300 text-sm"
          >
            <Link href="/auth/register">
              {t("cta.button")}
              <ArrowRight className="ms-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
