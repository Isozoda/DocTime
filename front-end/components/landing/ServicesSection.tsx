"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Heart,
  Stethoscope,
  Eye,
  Baby,
  Activity,
  Scan,
  Microscope,
  Pill,
  Phone,
  CalendarDays,
  Shield,
} from "lucide-react";

const SERVICES = [
  {
    icon: Heart,
    title: "Cardiology",
    description: "Advanced heart diagnostics and treatment. ECG, Echo, stress tests.",
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.15)",
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Expert neurological assessments for brain and nervous system disorders.",
    color: "#00ffee",
    glow: "rgba(0,255,238,0.12)",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Compassionate child healthcare from newborn to adolescence.",
    color: "#00ff88",
    glow: "rgba(0,255,136,0.12)",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Comprehensive eye examinations, vision care, and laser procedures.",
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.15)",
  },
  {
    icon: Scan,
    title: "Diagnostics",
    description: "State-of-the-art imaging: MRI, CT, ultrasound, and lab analysis.",
    color: "#00ffee",
    glow: "rgba(0,255,238,0.12)",
  },
  {
    icon: Phone,
    title: "Telemedicine",
    description: "24/7 online consultations. See a doctor from anywhere, anytime.",
    color: "#00ff88",
    glow: "rgba(0,255,136,0.12)",
  },
  {
    icon: Activity,
    title: "Cardio Rehab",
    description: "Personalized recovery programs after cardiac events and surgery.",
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.15)",
  },
  {
    icon: Microscope,
    title: "Laboratory",
    description: "Full blood panel, hormone testing, genetic screening, and more.",
    color: "#00ffee",
    glow: "rgba(0,255,238,0.12)",
  },
  {
    icon: Pill,
    title: "Preventive Care",
    description: "Annual health checkups and personalized prevention programs.",
    color: "#00ff88",
    glow: "rgba(0,255,136,0.12)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative py-28 px-6 lg:px-16 overflow-hidden"
      style={{ background: "#080820" }}
      aria-labelledby="services-heading"
    >
      {/* Orb */}
      <div
        className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute -bottom-32 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.28)",
              color: "#00d4ff",
            }}
          >
            <Stethoscope className="h-3.5 w-3.5" aria-hidden />
            Our Services
          </motion.div>

          <motion.h2
            id="services-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl lg:text-5xl font-black text-white font-orbitron mb-4"
          >
            World-Class{" "}
            <span className="gradient-text-space">Medical Care</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Comprehensive healthcare services powered by cutting-edge technology
            and delivered by certified specialists.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {SERVICES.map(({ icon: Icon, title, description, color, glow }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="service-card group relative rounded-2xl p-6 cursor-default overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl transition-all duration-300 group-hover:h-[3px]"
                style={{
                  background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`,
                }}
              />

              {/* Hover glow bg */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="h-13 w-13 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `rgba(${color === "#00d4ff" ? "0,212,255" : color === "#00ffee" ? "0,255,238" : "0,255,136"},0.12)`,
                    border: `1px solid ${color}35`,
                    width: "3.25rem",
                    height: "3.25rem",
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color }} aria-hidden />
                </div>

                <h3
                  className="text-base font-bold text-white mb-2 transition-colors duration-200 group-hover:text-[#00d4ff]"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-14"
        >
          <a
            href="#booking"
            className="neon-btn-blue inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm"
          >
            <CalendarDays className="h-5 w-5" aria-hidden />
            Book a Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
