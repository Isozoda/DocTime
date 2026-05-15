"use client";

import { motion } from "framer-motion";
import { Heart, Star, Zap, Lock, Award, Users } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Accessibility",
    desc: "Healthcare should be a right, not a privilege. We work every day to remove geographic, financial, and logistical barriers for every patient.",
    color: "#F43F5E",
    gradient: "from-rose-500/10 to-transparent",
  },
  {
    icon: Star,
    title: "Transparency",
    desc: "Clear pricing, honest reviews, and no hidden fees. Patients deserve complete information before every appointment.",
    color: "#F59E0B",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    icon: Zap,
    title: "Innovation",
    desc: "From AI-driven search to real-time booking — we use cutting-edge technology to make healthcare smarter and faster.",
    color: "#6366F1",
    gradient: "from-indigo-500/10 to-transparent",
  },
  {
    icon: Lock,
    title: "Privacy",
    desc: "End-to-end encryption, GDPR-aligned data policies, and zero data selling. Your health data belongs to you.",
    color: "#8B5CF6",
    gradient: "from-violet-500/10 to-transparent",
  },
  {
    icon: Award,
    title: "Quality",
    desc: "Every doctor on DocTime is verified, licensed, and reviewed by real patients. We maintain strict quality standards.",
    color: "#10B981",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    icon: Users,
    title: "Community",
    desc: "We invest in local healthcare infrastructure, support medical education, and champion Tajik health professionals.",
    color: "#06B6D4",
    gradient: "from-cyan-500/10 to-transparent",
  },
];

export function ValuesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-muted/20 border-y border-border/50">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4">WHAT WE STAND FOR</div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Six Principles,{" "}
            <span className="gradient-text-indigo">One Goal</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            The values that guide every decision we make — from product features
            to company culture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group relative glass-card rounded-3xl p-7 overflow-hidden hover:-translate-y-1.5 transition-all duration-300 cursor-default"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.15), 0 0 40px ${value.color}10`;
                e.currentTarget.style.borderColor = `${value.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${value.color}18`,
                    border: `1px solid ${value.color}30`,
                  }}
                >
                  <value.icon className="w-6 h-6" style={{ color: value.color }} />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {value.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed text-sm">{value.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
