"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, CalendarDays, HeartPulse, Award, MapPin } from "lucide-react";

function useInViewport(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function AnimatedCounter({
  target,
  suffix,
  isVisible,
  delay = 0,
}: {
  target: number;
  suffix: string;
  isVisible: boolean;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!isVisible || done.current) return;
    done.current = true;
    const t = setTimeout(() => {
      const dur = 1500;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setCount(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [isVisible, target, delay]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

const STATS = [
  { icon: Users, value: 200, suffix: "+", label: "Verified Doctors", sub: "Across 3 cities", color: "#6366F1" },
  { icon: CalendarDays, value: 50000, suffix: "+", label: "Appointments", sub: "Booked to date", color: "#8B5CF6" },
  { icon: HeartPulse, value: 98, suffix: "%", label: "Satisfaction", sub: "Patient reviews", color: "#10B981" },
  { icon: Award, value: 15, suffix: "+", label: "Specialties", sub: "Available daily", color: "#F59E0B" },
  { icon: MapPin, value: 3, suffix: "", label: "Cities", sub: "Across Tajikistan", color: "#EC4899" },
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInViewport(ref);

  return (
    <section
      ref={ref}
      className="py-14 px-4 bg-muted/20 border-y border-border/50 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklch, var(--primary), transparent 94%) 0%, transparent 40%, transparent 60%, color-mix(in oklch, var(--secondary), transparent 94%) 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STATS.map(({ icon: Icon, value, suffix, label, sub, color }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group text-center p-5 rounded-2xl glass-card hover:-translate-y-1 transition-all duration-300 cursor-default"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.1), 0 0 30px ${color}15`;
                e.currentTarget.style.borderColor = `${color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div className="text-3xl md:text-4xl font-black tabular-nums mb-1" style={{ color }}>
                <AnimatedCounter
                  target={value}
                  suffix={suffix}
                  isVisible={visible}
                  delay={idx * 100}
                />
              </div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
