"use client";

import { Activity, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const QUICK_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Statistics", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export function SpaceFooter() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#030308" }}
      aria-label="Site footer"
    >
      {/* Top divider */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(0,255,238,0.3), transparent)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* CTA Band */}
      <div
        className="relative py-16 px-6 lg:px-16"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(0,255,136,0.04) 50%, rgba(0,212,255,0.06) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black text-white font-orbitron mb-2">
              Ready to Take{" "}
              <span className="gradient-text-space">Control</span>?
            </h3>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
              Book your appointment today and experience world-class healthcare.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a href="#booking" className="neon-btn-blue px-7 py-3.5 rounded-xl font-bold text-sm">
              Book Appointment
            </a>
            <a
              href="tel:+992900000000"
              className="neon-btn-outline px-7 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative px-6 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <a href="#hero" className="flex items-center gap-3 mb-6" aria-label="DocTime home">
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #00d4ff, #00ffee)",
                  boxShadow: "0 0 24px rgba(0,212,255,0.4)",
                }}
              >
                <Activity className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-extrabold tracking-wider text-white font-orbitron">
                DOC<span style={{ color: "#00d4ff" }}>TIME</span>
              </span>
            </a>

            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Саломатии шумо — миссияи мо. Premium healthcare platform bringing
              world-class medical care to every corner of Tajikistan.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { Icon: TelegramIcon, href: "https://t.me/doctime", label: "Telegram", color: "#00d4ff" },
                { Icon: Mail, href: "mailto:info@doctime.tj", label: "Email", color: "#00ffee" },
                { Icon: Phone, href: "tel:+992900000000", label: "Phone", color: "#00ff88" },
              ].map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: `${color}12`,
                    border: `1px solid ${color}30`,
                    color,
                  }}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Quick Links
            </p>
            <ul className="flex flex-col gap-3" role="list">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-sm transition-colors duration-200 hover:text-[#00d4ff]"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    <ArrowUpRight
                      className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      aria-hidden
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-5">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Contact
            </p>
            <ul className="flex flex-col gap-4" role="list">
              {[
                { Icon: Phone, value: "+992 900 00 00 00", href: "tel:+992900000000", color: "#00d4ff" },
                { Icon: Mail, value: "info@doctime.tj", href: "mailto:info@doctime.tj", color: "#00ffee" },
                { Icon: MapPin, value: "Rudaki Ave 44, Dushanbe, Tajikistan", href: "#", color: "#00ff88" },
              ].map(({ Icon, value, href, color }) => (
                <li key={value}>
                  <a
                    href={href}
                    className="flex items-start gap-3 transition-colors duration-200 hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden />
                    </div>
                    <span className="text-sm">{value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative px-6 lg:px-16 py-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            &copy; {new Date().getFullYear()} DocTime. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs transition-colors duration-200 hover:text-[#00d4ff]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#00ff88", animation: "medPulse 1.4s infinite" }}
              aria-hidden
            />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
