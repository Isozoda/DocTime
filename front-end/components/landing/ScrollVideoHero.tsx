"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import {
  Search, Stethoscope, Shield, CheckCircle, Zap, MapPin, HeartPulse,
  CalendarDays, Activity, Star, ChevronDown,
} from "lucide-react";
import { SPECIALTIES, CITIES } from "@/lib/utils";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import { useScrollVideo } from "@/hooks/useScrollVideo";

/* ─────────────────────────────────────────────────────────────
   PRELOADER
   Full-screen dark overlay with streaming progress bar.
───────────────────────────────────────────────────────────── */
function HeroPreloader({ progress, fading }: { progress: number; fading: boolean }) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setDots(d => (d % 3) + 1), 450);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "#050812",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.65s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div
          className="h-11 w-11 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 0 28px rgba(99,102,241,0.45)",
          }}
        >
          <HeartPulse className="h-5 w-5 text-white" />
        </div>
        <span
          className="text-2xl font-black tracking-tight"
          style={{
            background: "linear-gradient(135deg, #818CF8, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DocTime
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-52">
        <div className="flex justify-between mb-2.5">
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {"Loading" + ".".repeat(dots)}
          </span>
          <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
            {progress}%
          </span>
        </div>
        <div
          className="h-[2px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 10px rgba(99,102,241,0.7)",
              transition: "width 0.2s ease-out",
            }}
          />
        </div>
      </div>

      <p
        className="mt-8 text-[9px] tracking-[0.35em] uppercase"
        style={{ color: "rgba(255,255,255,0.1)" }}
      >
        DocTime TJ
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO APPOINTMENT CARD
   Dark-glassmorphism variant — always rendered on dark bg.
───────────────────────────────────────────────────────────── */
function HeroCard() {
  const t = useTranslations("home");
  const slots = ["09:00", "11:30", "14:30", "16:00", "17:30"];

  return (
    <div className="relative w-[288px] xl:w-[316px] select-none">
      {/* Confirmed float badge */}
      <div
        className="absolute -top-5 -left-4 z-20 px-3.5 py-2.5 rounded-2xl animate-float"
        style={{
          background: "rgba(16,185,129,0.12)",
          border: "1px solid rgba(16,185,129,0.32)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center"
            style={{ background: "#10B981" }}
          >
            <CheckCircle className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-snug">{t("heroCardConfirmed")}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              {t("heroCardToday")}
            </p>
          </div>
        </div>
      </div>

      {/* Main card body */}
      <div
        className="rounded-[28px] p-5 relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.11)",
          backdropFilter: "blur(48px)",
          WebkitBackdropFilter: "blur(48px)",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        {/* Inner glow orb */}
        <div
          className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            filter: "blur(20px)",
            transform: "translate(40%, -40%)",
          }}
        />

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(99,102,241,0.14)",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
            >
              <CalendarDays className="h-4 w-4" style={{ color: "#818CF8" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{t("heroCardTitle")}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {t("heroCardSlot")}
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#34D399",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: "#10B981" }}
            />
            {t("heroCardOnline")}
          </div>
        </div>

        {/* Doctor info */}
        <div
          className="flex items-center gap-3 p-3 rounded-2xl mb-4"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.16)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100"
            alt="Dr. Sarah Mitchell"
            className="h-11 w-11 rounded-xl object-cover object-top shrink-0"
            style={{ border: "2px solid rgba(99,102,241,0.4)" }}
            onError={e => {
              (e.target as HTMLImageElement).src =
                "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=6366F1&color=fff&size=100&bold=true";
            }}
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">Dr. Sarah Mitchell</p>
            <p className="text-[10px] mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Cardiologist
            </p>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} className="h-3 w-3" viewBox="0 0 20 20" fill="#F59E0B">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-[10px] ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                5.0
              </span>
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {slots.map((time, i) => (
            <div
              key={time}
              className="py-1.5 rounded-xl text-center text-[11px] font-semibold cursor-pointer transition-transform duration-150 hover:scale-105"
              style={
                i === 2
                  ? {
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      color: "white",
                      boxShadow: "0 0 16px rgba(99,102,241,0.55)",
                    }
                  : i === 0
                  ? {
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.2)",
                      textDecoration: "line-through",
                    }
                  : {
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.75)",
                    }
              }
            >
              {time}
            </div>
          ))}
        </div>

        {/* Confirm CTA */}
        <div
          className="h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
          }}
        >
          <CheckCircle className="h-4 w-4" />
          {t("heroCardBtn")}
        </div>
      </div>

      {/* Doctors-online badge */}
      <div
        className="absolute -bottom-5 -right-4 z-20 px-3.5 py-2.5 rounded-2xl animate-float-d"
        style={{
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.26)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            <Activity className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{t("heroCardDoctors")}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t("heroCardReady")}
            </p>
          </div>
        </div>
      </div>

      {/* Rating badge */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-14 z-20 px-3.5 py-2.5 rounded-2xl animate-float-d hidden xl:block"
        style={{
          background: "rgba(10,12,28,0.7)",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t("heroCardRating")}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>
              {t("heroCardFrom")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCROLL VIDEO HERO — Main export
───────────────────────────────────────────────────────────── */
export function ScrollVideoHero() {
  const t = useTranslations("home");
  const tSearch = useTranslations("search");
  const router = useRouter();

  /* Search state — local to hero, navigates on submit */
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");

  /* Mobile detection: disable scrubbing on touch + narrow screens */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024));
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Video preloading */
  const { blobUrl, progress, isReady } = useVideoPreloader("/video/scroll-hero.mp4");

  /* Preloader fade-out */
  const [showLoader, setShowLoader] = useState(true);
  const [fadingLoader, setFadingLoader] = useState(false);
  useEffect(() => {
    if (!isReady) return;
    setFadingLoader(true);
    const t = setTimeout(() => setShowLoader(false), 700);
    return () => clearTimeout(t);
  }, [isReady]);

  /* Animation refs */
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  /* Plug animation hook — only runs on desktop after video is ready */
  useScrollVideo(
    {
      section: sectionRef,
      video: videoRef,
      videoWrap: videoWrapRef,
      badge: badgeRef,
      title: titleRef,
      subtitle: subtitleRef,
      search: searchRef,
      cta: ctaRef,
      card: cardRef,
      progressBar: progressBarRef,
      scrollIndicator: scrollIndicatorRef,
    },
    isReady && !isMobile
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (specialty) params.set("specialization", specialty);
    if (city) params.set("city", city);
    router.push(`/doctors?${params}`);
  };

  /* On desktop, GSAP will reveal elements via fromTo — start them hidden.
     On mobile, show immediately. */
  const hidden = !isMobile ? { opacity: 0 } : {};

  return (
    <>
      {/* ── Preloader overlay ── */}
      {showLoader && <HeroPreloader progress={progress} fading={fadingLoader} />}

      {/* ── Hero section ── */}
      <section
        ref={sectionRef}
        className="relative"
        style={{
          /* 3× viewport height gives ~8–12 s of scroll travel at normal speed */
          height: isMobile ? "100svh" : "300vh",
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.5s ease 0.15s",
        }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* ── Scroll progress bar (top edge) ── */}
          <div
            ref={progressBarRef}
            className="absolute top-0 left-0 h-[2px] z-30 pointer-events-none"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 8px rgba(99,102,241,0.8)",
            }}
          />

          {/* ── Video container (scale-parallax wrapper) ── */}
          <div
            ref={videoWrapRef}
            className="absolute inset-0"
            style={{ transformOrigin: "center center", willChange: "transform" }}
          >
            {blobUrl && (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
                preload="auto"
                /* Mobile: autoplay loop as fallback (no scrub) */
                autoPlay={isMobile}
                loop={isMobile}
                src={blobUrl}
                style={{ willChange: "transform" }}
              />
            )}
          </div>

          {/* ── Overlays ── */}
          {/* Primary dark gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(5,8,18,0.78) 0%, rgba(5,8,18,0.42) 55%, rgba(5,8,18,0.65) 100%)",
            }}
          />
          {/* Bottom fade into next section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(5,8,18,0.95))" }}
          />
          {/* Subtle grid texture */}
          <div className="absolute inset-0 grid-overlay pointer-events-none opacity-[0.18]" />
          {/* Ambient orbs */}
          <div
            className="absolute top-1/3 -left-36 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
              filter: "blur(72px)",
            }}
          />
          <div
            className="absolute bottom-1/4 -right-36 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* ── Content ── */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="container mx-auto px-4 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

                {/* Left — text content */}
                <div>
                  {/* Badge */}
                  <div
                    ref={badgeRef}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
                    style={{
                      background: "rgba(99,102,241,0.14)",
                      border: "1px solid rgba(99,102,241,0.35)",
                      color: "#818CF8",
                      ...hidden,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ background: "#818CF8" }}
                    />
                    {t("heroBadge")}
                  </div>

                  {/* H1 */}
                  <h1
                    ref={titleRef}
                    className="font-black leading-[1.02] text-white mb-6"
                    style={{
                      fontSize: "clamp(2.4rem, 6.5vw, 4.4rem)",
                      letterSpacing: "-0.04em",
                      ...hidden,
                    }}
                  >
                    Book the best
                    <br />
                    <span
                      style={{
                        background: "linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      doctors
                    </span>{" "}
                    in
                    <br />
                    minutes
                  </h1>

                  {/* Subtitle */}
                  <p
                    ref={subtitleRef}
                    className="text-lg leading-relaxed mb-8 max-w-lg"
                    style={{ color: "rgba(255,255,255,0.58)", ...hidden }}
                  >
                    {t("heroSubtitle")}
                  </p>

                  {/* Search bar */}
                  <div
                    ref={searchRef}
                    className="flex flex-col sm:flex-row gap-2.5 p-2.5 rounded-3xl mb-6 max-w-xl"
                    style={{
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.11)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                      ...hidden,
                    }}
                  >
                    <select
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      <option value="" style={{ background: "#0a0e1a" }}>
                        🔍 {tSearch("specialty")}
                      </option>
                      {SPECIALTIES.map(s => (
                        <option key={s} value={s} style={{ background: "#0a0e1a" }}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      <option value="" style={{ background: "#0a0e1a" }}>
                        📍 {tSearch("city")}
                      </option>
                      {CITIES.map(c => (
                        <option key={c} value={c} style={{ background: "#0a0e1a" }}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleSearch}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl whitespace-nowrap transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                      style={{
                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.55)",
                      }}
                    >
                      <Search className="h-4 w-4" />
                      {tSearch("button")}
                    </button>
                  </div>

                  {/* CTAs + trust row */}
                  <div ref={ctaRef} style={hidden}>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <Link
                        href="/doctors"
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                        style={{
                          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                          boxShadow: "0 4px 20px rgba(99,102,241,0.48)",
                        }}
                      >
                        <Stethoscope className="h-4 w-4" />
                        {t("heroCtaPrimary")}
                      </Link>
                      <Link
                        href="/map"
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.88)",
                          backdropFilter: "blur(20px)",
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                        {t("heroCtaSecondary")}
                      </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-5">
                      {[
                        { Icon: Shield, label: t("trustVerified") },
                        { Icon: CheckCircle, label: t("trustLicensed") },
                        { Icon: Zap, label: t("trustInstant") },
                      ].map(({ Icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: "rgba(255,255,255,0.48)" }}
                        >
                          <Icon className="h-4 w-4" style={{ color: "#10B981" }} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right — appointment card */}
                <div
                  ref={cardRef}
                  className="hidden lg:flex justify-center items-center"
                  style={hidden}
                >
                  <HeroCard />
                </div>
              </div>
            </div>
          </div>

          {/* ── Scroll indicator ── */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
            style={{ transition: "opacity 0.4s ease" }}
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              scroll
            </span>
            <ChevronDown
              className="h-4 w-4 animate-bounce"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
