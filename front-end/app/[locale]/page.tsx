"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useDoctors } from "@/hooks/useDoctors";
import { ScrollVideoHero } from "@/components/landing/ScrollVideoHero";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/ui/AIChatWidget";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import Image from "next/image";
import {
  Search, Brain, Heart, Baby, Eye, Bone, Activity, Stethoscope,
  Smile, ArrowRight, CalendarDays, Droplets, Scan, Ear,
  CheckCircle, MapPin, Star, Users,
  Award, HeartPulse, ChevronRight, Sparkles,
} from "lucide-react";
import api from "@/lib/axios";
import type { Doctor } from "@/types/doctor";
import image1 from "./image/image.png";
import image2 from "./image/image copy.png";
import image3 from "./image/image copy 2.png";
import image4 from "./image/image copy 3.png";
import image5 from "./image/image copy 4.png";
import image6 from "./image/image copy 5.png";
import image7 from "./image/image copy 6.png";
import image8 from "./image/image copy 7.png";
import image9 from "./image/image copy 8.png";
import image10 from "./image/image copy 9.png";
/* ══════════════ TYPES ══════════════ */
interface Specialization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

/* ══════════════ STATIC DATA ══════════════ */
interface DemoDoctor { id: string; name: string; spec: string; rating: number; reviews: number; price: string; photo: string; city: string; slots: string[]; }
interface DemoClinic { id: string; name: string; city: string; specs: string[]; rating: number; doctors: number; color: string; }
interface DemoReview { id: string; name: string; city: string; text: string; rating: number; doctor: string; avatar: string; }

const SPEC_COLORS: Record<string, string> = {
  smile:"#22D3EE", heart:"#F43F5E", brain:"#8B5CF6", baby:"#10B981",
  eye:"#06B6D4", activity:"#6366F1", droplets:"#3B82F6", scan:"#A855F7",
  ear:"#14B8A6", stethoscope:"#6366F1", bone:"#84CC16",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  smile: Smile, heart: Heart, brain: Brain, baby: Baby, eye: Eye,
  activity: Activity, droplets: Droplets, scan: Scan, ear: Ear,
  stethoscope: Stethoscope, bone: Bone, stomach: Activity, mind: Brain,
  waves: Activity,
};

const SPEC_IMAGES: Record<string, any> = {
  smile: image1, // Dentist
  heart: image2, // Cardiologist
  brain: image3, // Neurologist/Psychiatrist
  baby: image4, // Pediatrician
  eye: image5, // Ophthalmologist
  activity: image6, // Gynecologist/General
  droplets: image7, // Urologist
  scan: image8, // Dermatologist/Scan
  ear: image9, // ENT
  stethoscope: image10, // Therapist
  bone: image1, // Orthopedist (Fallback to image1)
  waves: image2, // Endocrinologist (Fallback to image2)
};

/* ══════════════ HOOKS ══════════════ */
function useInViewport(ref: React.RefObject<HTMLElement | null>, threshold = 0.2) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

/* ══════════════ ANIMATED COUNTER ══════════════ */
function AnimatedCounter({ target, suffix, isVisible, delay = 0 }: { target: number; suffix: string; isVisible: boolean; delay?: number }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!isVisible || done.current) return;
    done.current = true;
    const t = setTimeout(() => {
      const dur = 1000;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(e * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [isVisible, target, delay]);
  return <>{count.toLocaleString()}{suffix}</>;
}

/* ══════════════ HERO CARD ══════════════ */
function HeroAppointmentCard() {
  const t = useTranslations("home");
  const slots = ["09:00", "11:30", "14:30", "16:00", "17:30"];
  return (
    <div className="relative w-[300px] xl:w-[340px] select-none">
      {/* Confirmed float badge */}
      <div
        className="absolute -top-5 -left-4 z-20 px-3.5 py-2.5 rounded-2xl animate-float bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full flex items-center justify-center bg-emerald-500">
            <CheckCircle className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground leading-snug">{t("heroCardConfirmed")}</p>
            <p className="text-xs text-muted-foreground">{t("heroCardToday")}</p>
          </div>
        </div>
      </div>

      {/* Main glassmorphism card */}
      <div
        className="rounded-[32px] p-6 glass-card shadow-2xl relative overflow-hidden card-shimmer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/30">
              <CalendarDays className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t("heroCardTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("heroCardSlot")}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
            {t("heroCardOnline")}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl mb-4 bg-primary/5 border border-primary/10">
          <Image
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100"
            alt="Dr. Sarah Mitchell"
            width={48}
            height={48}
            className="rounded-xl object-cover shrink-0 border-2 border-primary/30"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=6366F1&color=fff&size=48&bold=true"; }}
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">Dr. Sarah Mitchell</p>
            <p className="text-xs mb-1 text-muted-foreground">Cardiologist</p>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="h-3 w-3" viewBox="0 0 20 20" fill="#F59E0B">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <span className="text-xs ml-1 text-muted-foreground">5.0</span>
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {slots.map((time, i) => (
            <div
              key={time}
              className="py-2 rounded-xl text-center text-xs font-semibold cursor-pointer"
              style={i === 2
                ? { background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white", boxShadow: "0 0 16px rgba(99,102,241,0.5)" }
                : i === 0
                ? { background: "rgba(128,128,128,0.08)", color: "var(--muted-foreground)", textDecoration: "line-through" }
                : { background: "rgba(128,128,128,0.06)", border: "1px solid var(--border)", color: "var(--foreground)" }
              }
            >
              {time}
            </div>
          ))}
        </div>

        {/* Confirm CTA */}
        <div
          className="h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20"
        >
          <CheckCircle className="h-4 w-4" />
          {t("heroCardBtn")}
        </div>
      </div>

      {/* Doctors badge bottom-right */}
      <div
        className="absolute -bottom-5 -right-4 z-20 px-3.5 py-2.5 rounded-2xl animate-float-d bg-primary/10 border border-primary/20 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            <Activity className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{t("heroCardDoctors")}</p>
            <p className="text-xs text-muted-foreground">{t("heroCardReady")}</p>
          </div>
        </div>
      </div>

      {/* Trust badge floating */}
      <div
        className="absolute top-1/2 -right-12 z-20 px-4 py-3 rounded-2xl animate-float-d bg-card/40 border border-border/30 backdrop-blur-xl hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/30">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{t("heroCardRating")}</p>
            <p className="text-xs text-muted-foreground">{t("heroCardFrom")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ DOCTOR SCROLL CARD ══════════════ */
function DoctorScrollCard({ doc }: { doc: DemoDoctor }) {
  const t = useTranslations("home");
  const SPEC_COLOR: Record<string, string> = {
    Cardiologist: "#F43F5E", Neurologist: "#8B5CF6", Pediatrician: "#10B981",
    Orthopedist: "#84CC16", Gynecologist: "#EC4899", Dermatologist: "#F97316",
    Ophthalmologist: "#06B6D4", ENT: "#14B8A6",
  };
  const color = SPEC_COLOR[doc.spec] ?? "#6366F1";

  return (
    <div
      className="flex-shrink-0 w-[260px] rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer bg-card/80 border border-border/50 backdrop-blur-md shadow-xl"
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.15), 0 0 30px ${color}18`; e.currentTarget.style.borderColor = `${color}40`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = ""; }}
    >
      <div className="relative h-36">
        <img
          src={doc.photo}
          alt={doc.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=6366F1&color=fff&size=200&bold=true`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/20 to-transparent" />
        <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>{doc.spec}</span>
      </div>
      <div className="p-4">
        <p className="font-bold text-sm text-foreground truncate mb-0.5">{doc.name}</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-foreground">{doc.rating}</span>
          <span className="text-xs text-muted-foreground">({doc.reviews})</span>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="h-3 w-3 text-primary" />
          <span className="text-xs text-muted-foreground">{doc.city}</span>
        </div>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {doc.slots.slice(0, 3).map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-lg font-medium bg-primary/10 border border-primary/20 text-primary">{s}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("priceFrom")}</p>
            <p className="text-sm font-bold text-foreground">{doc.price} TJS</p>
          </div>
          <Link href={`/doctors/${doc.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white" }}>
            {t("bookShort")}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ CLINIC SCROLL CARD ══════════════ */
function ClinicScrollCard({ clinic }: { clinic: DemoClinic }) {
  const t = useTranslations("home");
  const tHosp = useTranslations("hospitals");
  return (
    <div
      className="flex-shrink-0 w-[300px] rounded-[20px] p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer bg-card/80 border border-border/50 backdrop-blur-md shadow-xl"
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.15), 0 0 30px ${clinic.color}15`; e.currentTarget.style.borderColor = `${clinic.color}40`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = ""; }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: `${clinic.color}18`, border: `1px solid ${clinic.color}30` }}>
          <Stethoscope className="h-5.5 w-5.5" style={{ color: clinic.color }} />
        </div>
        <div>
          <p className="font-bold text-sm text-foreground">{clinic.name}</p>
          <p className="text-xs flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" style={{ color: clinic.color }} />{clinic.city}
          </p>
        </div>
      </div>
      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {clinic.specs.map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${clinic.color}12`, border: `1px solid ${clinic.color}25`, color: clinic.color }}>{s}</span>
        ))}
      </div>
      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-foreground">{clinic.rating}</span>
        </div>
        <span className="text-xs text-muted-foreground">{clinic.doctors} {tHosp("doctors")}</span>
        <Link href="/hospitals" className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: `${clinic.color}18`, border: `1px solid ${clinic.color}30`, color: clinic.color }}>
          {t("viewClinic")} →
        </Link>
      </div>
    </div>
  );
}

/* ══════════════ REVIEW CARD ══════════════ */
function ReviewScrollCard({ review }: { review: DemoReview }) {
  return (
    <div
      className="flex-shrink-0 w-[320px] rounded-[20px] p-5 transition-all duration-300 hover:-translate-y-1 cursor-default bg-card/80 border border-border/50 backdrop-blur-md shadow-lg"
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      {/* Quote */}
      <div className="absolute -top-1 right-4 text-6xl font-serif pointer-events-none select-none opacity-10 text-primary" style={{ lineHeight: 1 }}>&quot;</div>
      <p className="text-sm leading-relaxed mb-4 relative text-foreground/90">{review.text}</p>
      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-border/50">
        <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-gradient-to-br from-primary to-secondary text-white">
          {review.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.city} • {review.doctor}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ MAIN PAGE ══════════════ */
export default function HomePage() {
  const t = useTranslations();
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const { doctors, isLoading } = useDoctors({ limit: 6 });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsVisible = useInViewport(statsRef);

  const [scrollDoctors, setScrollDoctors] = useState<DemoDoctor[]>([]);
  const [scrollClinics, setScrollClinics] = useState<DemoClinic[]>([]);
  const [scrollReviews, setScrollReviews] = useState<DemoReview[]>([]);

  useEffect(() => {
    api.get<{ success: boolean; data: Specialization[] }>("/specializations")
      .then(({ data }) => setSpecializations(data.data))
      .catch(() => {});

    api.get("/public/doctors")
      .then(({ data }) => setScrollDoctors([...data.data, ...data.data]))
      .catch(() => {});

    api.get("/public/clinics")
      .then(({ data }) => setScrollClinics([...data.data, ...data.data]))
      .catch(() => {});

    api.get("/public/reviews")
      .then(({ data }) => setScrollReviews([...data.data, ...data.data]))
      .catch(() => {});
  }, []);

  const th = useTranslations("home");

  const STATS = [
    { icon: Users, value: 200, suffix: "+", label: th("statsVerifiedDoctors"), sub: th("statsVerifiedSub"), color: "#6366F1" },
    { icon: CalendarDays, value: 50000, suffix: "+", label: th("statsAppointments"), sub: th("statsAppointmentsSub"), color: "#8B5CF6" },
    { icon: HeartPulse, value: 98, suffix: "%", label: th("statsSatisfaction"), sub: th("statsSatisfactionSub"), color: "#10B981" },
    { icon: Award, value: 15, suffix: "+", label: th("statsSpecialties"), sub: th("statsSpecialtiesSub"), color: "#F59E0B" },
  ];

  const HOW_IT_WORKS = [
    { icon: Search, num: "01", title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc"), color: "#6366F1" },
    { icon: CalendarDays, num: "02", title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc"), color: "#8B5CF6" },
    { icon: CheckCircle, num: "03", title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc"), color: "#10B981" },
  ];

  /* ── Arrays are already doubled in the effect for seamless loops ── */

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ── SCROLL VIDEO HERO ── */}
      <ScrollVideoHero />

      {/* ── DOCTORS SCROLL STRIP ── */}
      <section className="py-20 bg-muted/20 border-y border-border/50 relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-transparent to-background opacity-20" />
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-badge mb-3">{th("topSpecialistsBadge")}</div>
              <h2 className="text-2xl font-bold text-foreground">{th("topSpecialistsTitle")}</h2>
            </div>
            <Link href="/doctors" className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
              {th("viewAll")} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="scroll-container">
          <div className="scroll-track">
            {scrollDoctors.map((doc, i) => (
              <DoctorScrollCard key={`${doc.id}-${i}`} doc={doc} />
            ))}
          </div>
        </div>
      </section>

      <section
        ref={statsRef}
        className="relative py-24 overflow-hidden stats-bg border-b border-border/50"
      >
        <div className="absolute inset-0 pointer-events-none grid-overlay opacity-10 dark:opacity-100" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="section-badge mb-4">{th("statsBadge")}</div>
            <h2 className="text-3xl font-bold text-foreground mb-3 gradient-text-indigo">{th("statsTitle")}</h2>
            <p className="text-muted-foreground">{th("statsSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map(({ icon: Icon, value, suffix, label, sub, color }, idx) => (
              <div
                key={label}
                className="group rounded-[20px] p-6 text-center transition-all duration-300 hover:-translate-y-1.5 animate-fade-in-up bg-card/80 border border-border/50 shadow-xl"
                style={{
                  animationDelay: `${idx * 0.1}s`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.1), 0 0 30px ${color}15`; e.currentTarget.style.borderColor = `${color}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = ""; }}
              >
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon className="h-5.5 w-5.5" style={{ color }} />
                </div>
                <p className="text-3xl md:text-4xl font-black mb-1.5 tabular-nums" style={{ color }}>
                  <AnimatedCounter target={value} suffix={suffix} isVisible={statsVisible} delay={idx * 120} />
                </p>
                <p className="text-sm font-semibold text-foreground mb-0.5">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none opacity-50 dark:opacity-100" style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--primary), transparent 94%) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-badge mb-4">{th("howItWorksBadge")}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 gradient-text-indigo">
              {th("howItWorksTitle")}
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              {th("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }} />

            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={step.num}
                className="group relative rounded-[20px] p-7 text-center transition-all duration-300 hover:-translate-y-2 animate-fade-in-up bg-card/80 border border-border/50 shadow-lg"
                style={{ animationDelay: `${idx * 0.15}s` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${step.color}40`; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.1), 0 0 30px ${step.color}12`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                {/* Step number */}
                <span className="absolute top-4 right-5 text-4xl font-black pointer-events-none opacity-5 dark:opacity-10 text-foreground">{step.num}</span>
                {/* Icon */}
                <div className="relative mx-auto mb-5 w-fit">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${step.color}20, ${step.color}08)`, border: `1px solid ${step.color}30` }}>
                    <step.icon className="h-7 w-7" style={{ color: step.color }} />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLINICS SCROLL STRIP ── */}
      <section className="py-20 bg-muted/20 border-y border-border/50 relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-transparent to-background opacity-20" />
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-badge mb-3">{th("clinicsBadge")}</div>
              <h2 className="text-2xl font-bold text-foreground">{th("clinicsTitle")}</h2>
            </div>
            <Link href="/hospitals" className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
              {th("viewAll")} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="scroll-container">
          <div className="scroll-track-reverse">
            {scrollClinics.map((c, i) => (
              <ClinicScrollCard key={`${c.id}-${i}`} clinic={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS GRID ── */}
      <section className="py-24 bg-background relative border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="section-badge mb-4">{th("specialtiesBadge")}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 gradient-text-indigo">
              {th("specialtiesTitle")}
            </h2>
            <p className="text-muted-foreground">{th("specialtiesSubtitle")}</p>
          </div>

          {specializations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {specializations.slice(0, 16).map((spec, idx) => {
                const Icon = ICON_MAP[spec.icon ?? ""] ?? Stethoscope;
                const color = spec.color ?? (SPEC_COLORS[spec.icon ?? ""] ?? "#6366F1");
                const imageUrl = SPEC_IMAGES[spec.icon ?? ""] || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80";
                
                return (
                  <Link
                    key={spec.id}
                    href={`/specializations/${spec.slug}`}
                    className="group relative h-48 md:h-60 rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 animate-fade-in-up border border-white/10 shadow-2xl card-shimmer"
                    style={{
                      animationDelay: `${idx * 0.05}s`,
                    }}
                  >
                    {/* Background image */}
                    <Image
                      src={imageUrl}
                      alt={spec.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/90 transition-opacity duration-500 group-hover:opacity-90" />
                    
                    {/* Internal Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)` }}
                    />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                      <div
                        className="h-11 w-11 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl self-end transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                        style={{ background: `color-mix(in oklch, ${color}, transparent 50%)` }}
                      >
                        <Icon className="h-5.5 w-5.5 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-px w-6 bg-white/30" />
                          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
                            {th("specialtiesLabel")}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                          {spec.name}
                        </h3>
                      </div>
                    </div>

                    {/* Outer Border Light */}
                    <div className="absolute inset-0 rounded-[32px] border border-white/5 pointer-events-none group-hover:border-white/20 transition-colors duration-500" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 md:h-56 rounded-[28px] skeleton-shimmer" style={{ border: "1px solid var(--border)" }} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/doctors" className="btn-glass inline-flex">
              {th("viewAllDoctors")} <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TOP DOCTORS GRID ── */}
      <section className="py-24 bg-muted/20 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-badge mb-3">{th("featuredBadge")}</div>
              <h2 className="text-3xl font-bold text-foreground">{t("doctors.title")}</h2>
              <p className="mt-2 text-muted-foreground">{t("doctors.subtitle")}</p>
            </div>
            <Link href="/doctors" className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
              {t("doctors.findAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-[20px] skeleton-shimmer" style={{ border: "1px solid rgba(255,255,255,0.06)" }} />
              ))}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)}
            </div>
          ) : (
            <div className="text-center py-16 rounded-[20px] bg-card/80 border border-border/50">
              <Stethoscope className="h-10 w-10 mx-auto mb-3 text-primary" />
              <p className="font-semibold text-foreground mb-1">{th("noFeaturedDoctors")}</p>
              <p className="text-sm text-muted-foreground">{th("noFeaturedHint")}</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/doctors" className="btn-glass inline-flex">{t("doctors.findAll")}</Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS SCROLL STRIP ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <div className="section-badge mb-4">{th("testimonialsBadge")}</div>
            <h2 className="text-2xl font-bold text-foreground">{t("testimonials.title")}</h2>
          </div>
        </div>
        <div className="scroll-container">
          <div className="scroll-track-slow">
            {scrollReviews.map((r, i) => (
              <ReviewScrollCard key={`${r.id}-${i}`} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden bg-muted/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in oklch, var(--primary), transparent 88%) 0%, transparent 70%)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="container mx-auto px-4 max-w-2xl text-center relative z-10">
          <div className="section-badge mb-6">{th("ctaBadge")}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-lg mb-10 text-muted-foreground">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary px-8 py-3.5 text-base">
              <Sparkles className="h-4 w-4" />
              {t("cta.button")}
            </Link>
            <Link href="/doctors" className="btn-glass px-8 py-3.5 text-base">
              {th("ctaBrowse")} →
            </Link>
          </div>
          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {[th("ctaTrust1"), th("ctaTrust2"), th("ctaTrust3")].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── FLOATING AI CHAT ── */}
      <AIChatWidget />
    </div>
  );
}
