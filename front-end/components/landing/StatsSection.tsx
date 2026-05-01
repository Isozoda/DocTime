"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Clock, Award, HeartPulse, TrendingUp, Shield } from "lucide-react";

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
  border: string;
}

const STATS: Stat[] = [
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    label: "Patients Treated",
    sublabel: "Across Tajikistan",
    color: "#00d4ff",
    border: "rgba(0,212,255,0.25)",
  },
  {
    icon: Award,
    value: 15,
    suffix: "+",
    label: "Years Experience",
    sublabel: "Clinical Practice",
    color: "#00ffee",
    border: "rgba(0,255,238,0.25)",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Support Available",
    sublabel: "Always Reachable",
    color: "#00ff88",
    border: "rgba(0,255,136,0.25)",
  },
  {
    icon: HeartPulse,
    value: 99,
    suffix: "%",
    label: "Satisfaction Rate",
    sublabel: "Patient Reviews",
    color: "#00d4ff",
    border: "rgba(0,212,255,0.25)",
  },
  {
    icon: TrendingUp,
    value: 98,
    suffix: "%",
    label: "Recovery Success",
    sublabel: "Treatment Outcomes",
    color: "#00ffee",
    border: "rgba(0,255,238,0.25)",
  },
  {
    icon: Shield,
    value: 500,
    suffix: "+",
    label: "Doctors Network",
    sublabel: "Certified Specialists",
    color: "#00ff88",
    border: "rgba(0,255,136,0.25)",
  },
];

function AnimatedCounter({
  target,
  suffix,
  color,
  isVisible,
  delay = 0,
}: {
  target: number;
  suffix: string;
  color: string;
  isVisible: boolean;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || animatedRef.current) return;
    animatedRef.current = true;

    const timer = setTimeout(() => {
      const duration = 1800;
      const start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, target, delay]);

  return (
    <span style={{ color }} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="stats"
      ref={ref}
      className="relative py-28 px-6 lg:px-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050510 0%, #08091f 100%)" }}
      aria-labelledby="stats-heading"
    >
      {/* Grid */}
      <div className="absolute inset-0 space-grid opacity-60 pointer-events-none" />

      {/* Central glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{
              background: "rgba(0,255,136,0.08)",
              border: "1px solid rgba(0,255,136,0.28)",
              color: "#00ff88",
            }}
          >
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            By The Numbers
          </div>

          <h2
            id="stats-heading"
            className="text-4xl lg:text-5xl font-black text-white font-orbitron mb-4"
          >
            Results That{" "}
            <span className="gradient-text-space">Speak Loudly</span>
          </h2>

          <p className="text-lg max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Decades of dedication to exceptional patient outcomes and
            medical innovation.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {STATS.map(({ icon: Icon, value, suffix, label, sublabel, color, border }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-2xl p-7 text-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${border}`,
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />

              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${border}`,
                }}
              >
                <Icon className="h-7 w-7" style={{ color }} aria-hidden />
              </div>

              <div
                className="text-4xl lg:text-5xl font-black mb-2 font-orbitron"
                aria-label={`${value}${suffix} ${label}`}
              >
                <AnimatedCounter
                  target={value}
                  suffix={suffix}
                  color={color}
                  isVisible={isInView}
                  delay={idx * 100}
                />
              </div>

              <p className="text-sm font-semibold text-white mb-1">{label}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {sublabel}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
