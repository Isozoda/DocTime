"use client";

import { motion } from "framer-motion";
import { Award, GraduationCap, Heart, Star, Users } from "lucide-react";

const CREDENTIALS = [
  { icon: GraduationCap, label: "Moscow Medical Academy, 2008" },
  { icon: Award, label: "Board Certified Cardiologist" },
  { icon: Heart, label: "15+ Years Clinical Experience" },
];

const DOCTOR_STATS = [
  { value: "5 000+", label: "Patients Treated", color: "#00d4ff" },
  { value: "4.9", label: "Average Rating", color: "#00ff88" },
  { value: "15+", label: "Years Experience", color: "#00ffee" },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-28 px-6 lg:px-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050510 0%, #080820 50%, #050510 100%)" }}
      aria-labelledby="about-heading"
    >
      {/* Background orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,255,238,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-5"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(0,255,238,0.08)",
              border: "1px solid rgba(0,255,238,0.25)",
              color: "#00ffee",
            }}
          >
            <Users className="h-3.5 w-3.5" aria-hidden />
            Meet Your Doctor
          </div>
        </motion.div>

        <motion.h2
          id="about-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl lg:text-5xl font-black text-white text-center mb-16 font-orbitron"
        >
          Your Health,{" "}
          <span className="gradient-text-space">Our Priority</span>
        </motion.h2>

        {/* Doctor card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-space rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto"
          style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,212,255,0.06)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 items-center">
            {/* Photo */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,212,255,0.3), rgba(0,255,136,0.2))",
                    filter: "blur(20px)",
                    transform: "scale(1.1)",
                  }}
                />
                <img
                  src="https://ui-avatars.com/api/?name=Aleksey+Rustamov&background=071828&color=00d4ff&size=160&bold=true&font-size=0.35"
                  alt="Dr. Алексей Рустамов, Cardiologist"
                  className="relative h-40 w-40 lg:h-48 lg:w-48 rounded-3xl object-cover"
                  style={{
                    border: "2px solid rgba(0,212,255,0.4)",
                    boxShadow: "0 0 40px rgba(0,212,255,0.2)",
                  }}
                />
                {/* Online indicator */}
                <div
                  className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    background: "rgba(0,255,136,0.12)",
                    border: "1px solid rgba(0,255,136,0.4)",
                    color: "#00ff88",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#00ff88]"
                    style={{ animation: "medPulse 1.4s infinite" }}
                  />
                  Available
                </div>
              </div>

              {/* Doctor mini stats */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {DOCTOR_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center p-3 rounded-2xl text-center"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <span
                      className="text-lg font-black font-orbitron"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[10px] mt-0.5 leading-tight text-center"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: "#00d4ff" }}
              >
                Chief Cardiologist
              </p>
              <h3 className="text-3xl lg:text-4xl font-black text-white mb-1 font-orbitron">
                Dr. Алексей Рустамов
              </h3>

              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-[#00d4ff] text-[#00d4ff]"
                    aria-hidden
                  />
                ))}
                <span className="text-sm ml-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  5.0 · 200+ reviews
                </span>
              </div>

              <p
                className="text-base leading-relaxed mb-7"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Dr. Рустамов — ведущий кардиолог с 15-летним опытом работы. Специализируется
                на диагностике и лечении сердечно-сосудистых заболеваний, включая ишемическую
                болезнь сердца, сердечную недостаточность и аритмии. Принимает пациентов как
                лично, так и онлайн.
              </p>

              {/* Credentials */}
              <ul className="flex flex-col gap-3 mb-8" role="list">
                {CREDENTIALS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(0,212,255,0.1)",
                        border: "1px solid rgba(0,212,255,0.25)",
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: "#00d4ff" }} aria-hidden />
                    </div>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#booking"
                className="neon-btn-blue inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
              >
                Book with Dr. Рустамов
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );      
}
