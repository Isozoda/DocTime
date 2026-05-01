"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, MessageCircle } from "lucide-react";

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Phone",
    value: "+992 900 00 00 00",
    href: "tel:+992900000000",
    color: "#00d4ff",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@doctime.tj",
    href: "mailto:info@doctime.tj",
    color: "#00ffee",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Rudaki Ave 44, Dushanbe, Tajikistan",
    href: "#",
    color: "#00ff88",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon–Sat · 08:00 – 20:00",
    href: "#",
    color: "#00d4ff",
  },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative py-28 px-6 lg:px-16 overflow-hidden"
      style={{ background: "#080820" }}
      aria-labelledby="contact-heading"
    >
      {/* Orb */}
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto">
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
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            Get In Touch
          </div>

          <h2
            id="contact-heading"
            className="text-4xl lg:text-5xl font-black text-white font-orbitron mb-4"
          >
            We're Here{" "}
            <span className="gradient-text-space">For You</span>
          </h2>

          <p className="text-lg max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Reach out anytime. Our support team responds within 30 minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10">
          {/* Left — contact info */}
          <div className="flex flex-col gap-5">
            {CONTACT_INFO.map(({ icon: Icon, label, value, href, color }, idx) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                  (e.currentTarget as HTMLElement).style.background =
                    `rgba(${color === "#00d4ff" ? "0,212,255" : color === "#00ffee" ? "0,255,238" : "0,255,136"},0.05)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}35`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color }} aria-hidden />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-0.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {label}
                  </p>
                  <p className="text-sm font-medium text-white">{value}</p>
                </div>
              </motion.a>
            ))}

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {[
                  {
                    Icon: TelegramIcon,
                    href: "https://t.me/doctime",
                    label: "Telegram",
                    color: "#00d4ff",
                  },
                  {
                    Icon: Mail,
                    href: "mailto:info@doctime.tj",
                    label: "Email",
                    color: "#00ffee",
                  },
                  {
                    Icon: Phone,
                    href: "tel:+992900000000",
                    label: "Call",
                    color: "#00ff88",
                  },
                ].map(({ Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: `${color}12`,
                      border: `1px solid ${color}30`,
                      color,
                    }}
                    aria-label={label}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              minHeight: "420px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {/* Simulated map */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize: "30px 30px",
              }}
            />
            {/* Radial "location" glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            {/* Map streets simulation */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(0,212,255,0.12)" strokeWidth="0.3" />
              <line x1="0" y1="55" x2="100" y2="55" stroke="rgba(0,212,255,0.12)" strokeWidth="0.3" />
              <line x1="0" y1="70" x2="100" y2="70" stroke="rgba(0,212,255,0.12)" strokeWidth="0.3" />
              <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(0,212,255,0.12)" strokeWidth="0.3" />
              <line x1="55" y1="0" x2="55" y2="100" stroke="rgba(0,212,255,0.12)" strokeWidth="0.3" />
              <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(0,212,255,0.12)" strokeWidth="0.3" />
              <line x1="10" y1="20" x2="80" y2="45" stroke="rgba(0,212,255,0.08)" strokeWidth="0.3" />
              <line x1="30" y1="60" x2="90" y2="80" stroke="rgba(0,212,255,0.08)" strokeWidth="0.3" />
            </svg>

            {/* Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center mb-2 animate-neon-pulse"
                style={{
                  background: "linear-gradient(135deg, #00d4ff, #00ffee)",
                  boxShadow: "0 0 30px rgba(0,212,255,0.5)",
                }}
              >
                <MapPin className="h-7 w-7 text-black" />
              </div>
              <div
                className="px-4 py-2 rounded-xl text-center"
                style={{
                  background: "rgba(5,5,16,0.9)",
                  border: "1px solid rgba(0,212,255,0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <p className="text-xs font-bold text-white">DocTime Clinic</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Rudaki Ave 44, Dushanbe
                </p>
              </div>
            </div>

            {/* Map label */}
            <div
              className="absolute bottom-5 left-5 right-5 flex items-center justify-between"
              aria-hidden
            >
              <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
                INTERACTIVE MAP
              </span>
              <div
                className="h-px flex-1 mx-4"
                style={{ background: "rgba(0,212,255,0.2)" }}
              />
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "#00d4ff", animation: "medPulse 1.4s infinite" }}
                />
                <span className="text-xs font-semibold" style={{ color: "#00d4ff" }}>
                  LIVE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
