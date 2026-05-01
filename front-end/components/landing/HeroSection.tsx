"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { EcgLine } from "./EcgLine";

const NAV_LINKS = ["About", "Services", "Stats", "Booking", "Contact"];

/* ── Floating appointment preview card ── */
function HeroAppointmentCard() {
  const slots = ["09:00", "11:30", "14:30", "16:00", "17:30", "+2"];

  return (
    <div className="relative w-[320px] xl:w-[360px] select-none">
      {/* Confirmed badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute -top-5 -left-5 z-20 px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(0,255,136,0.1)",
          border: "1px solid rgba(0,255,136,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#00ff88" }}
          >
            <CheckCircle className="h-4 w-4 text-black" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-snug">Confirmed</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              Today, 14:30
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main card */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(30px)",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.6), 0 0 80px rgba(0,212,255,0.07)",
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(0,212,255,0.12)",
                border: "1px solid rgba(0,212,255,0.3)",
              }}
            >
              <CalendarDays className="h-5 w-5" style={{ color: "#00d4ff" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Book Appointment</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                Choose a time slot
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.3)",
              color: "#00ff88",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#00ff88", animation: "medPulse 1.4s infinite" }}
            />
            Online
          </div>
        </div>

        {/* Doctor row */}
        <div
          className="flex items-center gap-3 p-3 rounded-2xl mb-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <img
            src="https://ui-avatars.com/api/?name=Aleksey+Rustamov&background=071828&color=00d4ff&size=48&bold=true"
            alt="Dr. Rustamov"
            className="h-12 w-12 rounded-xl object-cover shrink-0"
            style={{ border: "2px solid rgba(0,212,255,0.35)" }}
          />
          <div>
            <p className="text-sm font-bold text-white">Dr. Алексей Рустамов</p>
            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              Cardiologist
            </p>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="#00d4ff"
                  aria-hidden
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                5.0
              </span>
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {slots.map((time, i) => (
            <div
              key={time}
              className="py-2.5 rounded-xl text-center text-xs font-semibold"
              style={
                i === 2
                  ? {
                      background: "linear-gradient(135deg, #00d4ff, #00ffee)",
                      color: "#000",
                      boxShadow: "0 0 16px rgba(0,212,255,0.5)",
                    }
                  : i === 0
                  ? {
                      background: "rgba(255,255,255,0.03)",
                      color: "rgba(255,255,255,0.22)",
                      textDecoration: "line-through",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.65)",
                    }
              }
            >
              {time}
            </div>
          ))}
        </div>

        {/* Confirm CTA */}
        <div
          className="h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-black cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #00d4ff, #00ffee)",
            boxShadow: "0 0 22px rgba(0,212,255,0.45)",
          }}
        >
          <CheckCircle className="h-4 w-4" />
          Confirm Appointment
        </div>
      </div>

      {/* Doctors badge bottom-right */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-5 -right-5 z-20 px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(0,212,255,0.08)",
          border: "1px solid rgba(0,212,255,0.25)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #00d4ff, #00ffee)",
            }}
          >
            <Activity className="h-3.5 w-3.5 text-black" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">500+ Doctors</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Ready to help
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════ */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050510 0%, #07091e 50%, #050510 100%)" }}
      aria-label="Hero section"
    >
      {/* Ambient orbs */}
      <div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/3 -right-40 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,255,238,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 space-grid opacity-100 pointer-events-none" />

      {/* Navigation */}
      <nav
        className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5"
        aria-label="Main navigation"
      >
        <a href="#hero" className="flex items-center gap-3" aria-label="DocTime home">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #00d4ff, #00ffee)",
              boxShadow: "0 0 22px rgba(0,212,255,0.5)",
            }}
          >
            <Activity className="h-5 w-5 text-black" />
          </div>
          <span
            className="text-xl font-extrabold tracking-wider text-white font-orbitron"
            aria-hidden
          >
            DOC<span style={{ color: "#00d4ff" }}>TIME</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-colors duration-200 hover:text-[#00d4ff]"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden md:block text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:text-[#00d4ff]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="neon-btn-blue text-sm font-bold px-5 py-2.5 rounded-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center px-6 lg:px-16 py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-7"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.35)",
                color: "#00d4ff",
              }}
            >
              <Shield className="h-3.5 w-3.5" aria-hidden />
              Trusted Healthcare Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl lg:text-6xl xl:text-[4.5rem] font-black leading-[1.05] tracking-tight text-white mb-7 font-orbitron"
            >
              Саломатии <br className="hidden sm:block" />
              шумо —{" "}
              <span className="gradient-text-space">миссияи мо</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Платформаи тандурустӣ барои Тоҷикистон. Аз беҳтарин духтурон мулоқот
              гиред, онлайн машварат кунед ва саломатии худро идора кунед.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#booking"
                className="neon-btn-blue inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wide"
              >
                <CalendarDays className="h-5 w-5" aria-hidden />
                Book Appointment
              </a>
              <a
                href="#about"
                className="neon-btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide"
              >
                <Zap className="h-4.5 w-4.5" style={{ color: "#00ff88" }} aria-hidden />
                Learn More
              </a>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-8 mt-12 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              {[
                { value: "5 000+", label: "Patients Served" },
                { value: "15+", label: "Years Experience" },
                { value: "24/7", label: "Support Available" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span
                    className="text-2xl font-black font-orbitron"
                    style={{ color: "#00d4ff" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center py-8"
          >
            <HeroAppointmentCard />
          </motion.div>
        </div>
      </div>

      {/* ECG Line */}
      <div className="relative z-10 w-full px-6 lg:px-16 pb-6" aria-hidden>
        <EcgLine className="w-full h-14 opacity-70" />
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        style={{ color: "rgba(255,255,255,0.35)" }}
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
      </motion.a>
    </section>
  );
}
