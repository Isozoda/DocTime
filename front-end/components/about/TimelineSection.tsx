"use client";

import { motion } from "framer-motion";
import { Rocket, MapPin, Users, Star, Brain } from "lucide-react";

const MILESTONES = [
  {
    year: "2023",
    title: "DocTime Founded",
    desc: "A team of doctors and engineers united by a shared vision: making quality healthcare accessible to every person in Tajikistan.",
    icon: Rocket,
    color: "#6366F1",
  },
  {
    year: "2024 Q1",
    title: "Launched in Dushanbe",
    desc: "Went live with 50 verified doctors, 5 specialties, and real-time booking — the first platform of its kind in Tajikistan.",
    icon: MapPin,
    color: "#8B5CF6",
  },
  {
    year: "2024 Q3",
    title: "Expanded Nationwide",
    desc: "Extended service to Khujand and Bokhtar, growing to 200+ doctors across 15 specialties and 3 major cities.",
    icon: Users,
    color: "#10B981",
  },
  {
    year: "2025",
    title: "50,000 Appointments Milestone",
    desc: "Celebrated our 50,000th appointment with a 98% patient satisfaction rate and zero security incidents.",
    icon: Star,
    color: "#F59E0B",
  },
  {
    year: "2026",
    title: "AI-Powered Platform",
    desc: "Launched DocTime AI — an intelligent assistant helping patients find the right doctor through natural language conversations.",
    icon: Brain,
    color: "#EC4899",
  },
];

export function TimelineSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in oklch, var(--primary), transparent 95%) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4">OUR JOURNEY</div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Idea to{" "}
            <span className="gradient-text-indigo">Tajikistan&apos;s #1</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every milestone tells the story of our commitment to better healthcare.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div
            className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--primary), color-mix(in oklch, var(--primary), transparent 60%), transparent)",
              transform: "translateX(-0.5px)",
            }}
          />

          <div className="space-y-10">
            {MILESTONES.map((milestone, idx) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex gap-6 md:gap-0 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div
                  className={`flex-1 md:max-w-[calc(50%-2.5rem)] pl-14 md:pl-0 ${
                    idx % 2 === 0 ? "md:pr-10 md:text-right" : "md:pl-10"
                  }`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card rounded-2xl p-6"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${milestone.color}30`;
                      e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.1), 0 0 30px ${milestone.color}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <span
                      className="text-xs font-black uppercase tracking-widest mb-2 block"
                      style={{ color: milestone.color }}
                    >
                      {milestone.year}
                    </span>
                    <h4 className="text-xl font-bold text-foreground mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {milestone.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Center icon dot */}
                <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `${milestone.color}20`,
                      border: `2px solid ${milestone.color}50`,
                      boxShadow: `0 0 24px ${milestone.color}25`,
                    }}
                  >
                    <milestone.icon className="w-5 h-5" style={{ color: milestone.color }} />
                  </motion.div>
                </div>

                {/* Spacer for opposite side on desktop */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
