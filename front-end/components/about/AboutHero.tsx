"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import {
  ArrowRight,
  CalendarDays,
  HeartPulse,
  Shield,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const TRUST_BADGES = [
  { icon: Shield, text: "Verified Doctors" },
  { icon: HeartPulse, text: "98% Satisfaction" },
  { icon: CalendarDays, text: "Same-Day Booking" },
];

export function AboutHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-20 px-4 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5 blur-[80px]"
          style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }}
        />
      </div>

      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-5 dark:opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-badge mb-8 inline-flex"
        >
          <Sparkles className="w-3 h-3" />
          OUR STORY
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.07] mb-6"
        >
          Reimagining{" "}
          <span className="gradient-text-indigo">Healthcare</span>
          <br />
          in Tajikistan
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
        >
          DocTime connects patients with 200+ verified doctors — making quality
          healthcare accessible to everyone, everywhere in Tajikistan.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link href="/doctors" className="btn-primary px-8 py-3.5 text-base">
            <CalendarDays className="h-4 w-4" />
            Book a Doctor
          </Link>
          <a href="#team" className="btn-glass px-8 py-3.5 text-base">
            Meet Our Team <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm"
        >
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium text-foreground/70">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
