"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Activity, Phone, Mail, MapPin, Twitter, Github, Instagram } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  const columns = [
    {
      title: t("footer.platform"),
      links: [
        { href: "/doctors", label: t("nav.doctors") },
        { href: "/hospitals", label: t("nav.hospitals") },
        { href: "/map", label: t("footer.doctorMap") },
        { href: "/about", label: t("nav.about") },
      ],
    },
    {
      title: t("footer.patients"),
      links: [
        { href: "/auth/register", label: t("footer.createAccount") },
        { href: "/auth/login", label: t("nav.login") },
        { href: "/patient/appointments", label: t("footer.myAppointments") },
        { href: "/faq", label: t("footer.faq") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/about", label: t("footer.aboutDoctime") },
        { href: "/contact", label: t("footer.contact") },
        { href: "/faq", label: t("footer.helpCenter") },
      ],
    },
  ];

  return (
    <footer
      className="relative border-t border-border bg-card/50 backdrop-blur-md"
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20"
              >
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-lg text-foreground">
                Doc<span className="text-primary">Time</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-muted-foreground">
              {t("footer.tagline")}
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              {[
                { Icon: Phone, label: "+992 90 000 00 00" },
                { Icon: Mail, label: "info@doctime.tj" },
                { Icon: MapPin, label: "Dushanbe, Tajikistan" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground/60">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-primary text-muted-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40"
        >
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} DocTime TJ. {t("footer.rights")}.
          </p>
          <p className="text-xs text-center max-w-md text-muted-foreground/60">
            {t("footer.disclaimer")}
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Github, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 bg-muted/30 border border-border/60 text-muted-foreground hover:text-primary"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
