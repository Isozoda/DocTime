"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useDoctors } from "@/hooks/useDoctors";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DoctorGrid } from "@/components/doctors/DoctorGrid";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/ui/StarRating";
import {
  Search, Brain, Heart, Baby, Eye, Bone, Activity,
  Stethoscope, Smile, ArrowRight, CalendarDays, Clock,
  Droplets, Scan, Ear,
} from "lucide-react";
import { SPECIALTIES, CITIES } from "@/lib/utils";
import { Link } from "@/navigation";
import api from "@/lib/axios";

interface Specialization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  smile: Smile,
  heart: Heart,
  brain: Brain,
  baby: Baby,
  eye: Eye,
  activity: Activity,
  droplets: Droplets,
  scan: Scan,
  ear: Ear,
  stethoscope: Stethoscope,
  bone: Bone,
  stomach: Stethoscope,
  mind: Brain,
};

const STATS = [
  { value: "500+", key: "doctors" },
  { value: "20+", key: "hospitals" },
  { value: "50,000+", key: "patients" },
  { value: "4.8", key: "rating" },
];

const TESTIMONIALS = [
  { name: "Zulfiya Rahimova", city: "Dushanbe", text: "Found an excellent cardiologist in minutes. The booking process was incredibly simple.", rating: 5 },
  { name: "Behruz Nazarov", city: "Khujand", text: "Great platform! I booked an appointment with a pediatrician for my child the same day.", rating: 5 },
  { name: "Malika Toshmatova", city: "Bokhtar", text: "Very convenient to compare doctors and read reviews before making a decision.", rating: 4 },
];

function SpecializationGrid({ specializations }: { specializations: Specialization[] }) {
  const displayed = specializations.slice(0, 12);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {displayed.map((spec) => {
        const Icon = ICON_MAP[spec.icon ?? ""] ?? Stethoscope;
        const color = spec.color ?? "#0D9488";
        return (
          <Link
            key={spec.id}
            href={`/specializations/${spec.slug}`}
            className="group flex flex-col items-center gap-3 p-5 bg-card border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ background: `${color}18`, border: `1.5px solid ${color}35` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <span className="text-xs font-medium text-center leading-snug text-foreground/75 group-hover:text-primary transition-colors">
              {spec.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations();
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const { doctors, isLoading } = useDoctors({ limit: 6 });

  useEffect(() => {
    api.get<{ success: boolean; data: Specialization[] }>("/specializations")
      .then(({ data }) => setSpecializations(data.data))
      .catch(() => { });
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

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-16 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            {t("hero.badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 glass-card rounded-2xl p-3 shadow-xl shadow-primary/5 max-w-2xl mx-auto">
            <Select onValueChange={setSpecialty}>
              <SelectTrigger className="border-0 bg-transparent flex-1">
                <SelectValue placeholder={t("search.specialty")} />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-px sm:h-auto sm:w-px bg-border/60" />
            <Select onValueChange={setCity}>
              <SelectTrigger className="border-0 bg-transparent flex-1">
                <SelectValue placeholder={t("search.city")} />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="gap-2 px-6 rounded-xl shadow-md shadow-primary/20" onClick={handleSearch}>
              <Search className="h-4 w-4" />
              {t("search.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s, idx) => (
              <div
                key={s.key}
                className="bg-card rounded-2xl border border-border/60 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <p className="text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-muted-foreground text-sm mt-1.5">{t(`stats.${s.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations — spoke/mind-map */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t("specialties.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("specialties.subtitle")}</p>
          </div>

          {specializations.length > 0 ? (
            <SpecializationGrid specializations={specializations} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link href="/doctors">Все врачи <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Doctors */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">{t("doctors.title")}</h2>
              <p className="text-muted-foreground mt-2">{t("doctors.subtitle")}</p>
            </div>
            <Button variant="ghost" asChild className="gap-2 hidden sm:flex">
              <Link href="/doctors">
                {t("doctors.findAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <DoctorGrid doctors={doctors} isLoading={isLoading} skeletonCount={6} />
          <div className="text-center mt-8 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/doctors">{t("doctors.findAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-3">{t("howItWorks.title")}</h2>
          <p className="text-muted-foreground mb-12">{t("howItWorks.subtitle")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { icon: Search, titleKey: "step1Title", descKey: "step1Desc", num: "1" },
              { icon: CalendarDays, titleKey: "step2Title", descKey: "step2Desc", num: "2" },
              { icon: Clock, titleKey: "step3Title", descKey: "step3Desc", num: "3" },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="flex flex-col items-center bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="relative mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-primary/8 flex items-center justify-center border border-primary/15">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-2">{t(`howItWorks.${step.titleKey}`)}</h3>
                <p className="text-muted-foreground text-sm text-center leading-relaxed">{t(`howItWorks.${step.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">{t("testimonials.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((review, idx) => (
              <div
                key={review.name}
                className="bg-card border border-border/60 rounded-2xl p-6 relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.12}s` }}
              >
                <div className="absolute -top-2 -right-1 text-7xl font-serif text-primary/8 leading-none select-none pointer-events-none">
                  "
                </div>
                <StarRating rating={review.rating} className="mb-3" />
                <p className="text-sm text-foreground/70 mb-5 leading-relaxed">
                  {review.text}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=0D9488&color=fff&size=40`}
                    alt={review.name}
                    className="h-9 w-9 rounded-full ring-2 ring-primary/20 shrink-0"
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

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />
        <div className="container mx-auto max-w-2xl text-center text-white relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("cta.title")}</h2>
          <p className="text-white/80 mb-8 text-lg">{t("cta.subtitle")}</p>
          <Button
            size="lg"
            asChild
            className="bg-white text-primary hover:bg-white/95 font-semibold px-8 rounded-full shadow-xl shadow-black/20"
          >
            <Link href="/auth/register">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
