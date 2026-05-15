"use client";

import { motion } from "framer-motion";
import { Zap, Video, Database, Brain, Shield, Clock } from "lucide-react";

const TECH = [
  {
    icon: Zap,
    title: "Real-Time Booking",
    desc: "Instant confirmation, live availability updates, and automated SMS/email reminders — zero phone tag.",
    color: "#6366F1",
    tag: "CORE",
  },
  {
    icon: Video,
    title: "HD Telemedicine",
    desc: "Encrypted video consultations, secure chat, and digital prescriptions — quality care from your home.",
    color: "#8B5CF6",
    tag: "PREMIUM",
  },
  {
    icon: Database,
    title: "Encrypted Records",
    desc: "Your medical history, prescriptions, and appointments stored with end-to-end encryption in one place.",
    color: "#10B981",
    tag: "SECURE",
  },
  {
    icon: Brain,
    title: "AI Smart Search",
    desc: "Describe your symptoms in plain language — our AI recommends the right specialist instantly.",
    color: "#F59E0B",
    tag: "AI",
  },
  {
    icon: Shield,
    title: "Verified Doctors Only",
    desc: "Every doctor passes a 3-stage verification: license check, background review, and patient rating audit.",
    color: "#EC4899",
    tag: "TRUST",
  },
  {
    icon: Clock,
    title: "Same-Day Appointments",
    desc: "When you need care now — filter for same-day slots and book in under 60 seconds.",
    color: "#06B6D4",
    tag: "FAST",
  },
];

export function TechSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-5 dark:opacity-20" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4">BUILT FOR THE FUTURE</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technology That{" "}
            <span className="gradient-text-indigo">Works For You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Modern infrastructure powering a seamless healthcare experience —
            from first search to follow-up prescription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group glass-card rounded-3xl p-7 hover:-translate-y-1.5 transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${item.color}30`;
                e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.1), 0 0 40px ${item.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {/* Icon + tag row */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-black tracking-wider"
                  style={{
                    background: `${item.color}15`,
                    color: item.color,
                    border: `1px solid ${item.color}25`,
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>

              {/* Bottom accent line */}
              <div
                className="mt-5 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
