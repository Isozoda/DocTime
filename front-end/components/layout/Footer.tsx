"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Stethoscope, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-auto">
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="bg-gradient-to-b from-muted/30 to-muted/10">
        <div className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* Brand — wider column */}
            <div className="md:col-span-4">
              <Link href="/" className="flex items-center gap-2.5 font-bold text-lg mb-4 group w-fit">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md shadow-primary/25 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-105">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <span className="gradient-text">EasyDoc</span>
                <span className="text-muted-foreground font-normal text-sm">TJ</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
                {t("footer.tagline")}
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://t.me/easydoctj"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-xl bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="h-4 w-4" />
                </a>
                <a
                  href="mailto:info@easydoc.tj"
                  className="h-9 w-9 rounded-xl bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="tel:+992900000000"
                  className="h-9 w-9 rounded-xl bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  aria-label="Phone"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Navigation links */}
            <div className="md:col-span-2">
              <p className="font-semibold text-sm mb-4 text-foreground">{t("footer.links")}</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: "/doctors",   label: t("nav.doctors") },
                  { href: "/hospitals", label: t("nav.hospitals") },
                  { href: "/about",     label: t("nav.about") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group/link"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ms-3 group-hover/link:opacity-100 group-hover/link:ms-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div className="md:col-span-2">
              <p className="font-semibold text-sm mb-4 text-foreground">Account</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: "/auth/login",    label: t("nav.login") },
                  { href: "/auth/register", label: t("nav.register") },
                  { href: "/dashboard/patient", label: "Dashboard" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group/link"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ms-3 group-hover/link:opacity-100 group-hover/link:ms-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-4">
              <p className="font-semibold text-sm mb-4 text-foreground">{t("footer.contact")}</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="tel:+992900000000"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-200 group/contact"
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0 group-hover/contact:bg-primary/15 transition-colors duration-200">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                    </div>
                    +992 90 000 00 00
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@easydoc.tj"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-200 group/contact"
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0 group-hover/contact:bg-primary/15 transition-colors duration-200">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                    </div>
                    info@easydoc.tj
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-8 w-8 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Dushanbe, Tajikistan
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} EasyDoc TJ. {t("footer.rights")}.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
