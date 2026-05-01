"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Stethoscope, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-auto border-t border-border/50">
      <div className="bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-lg mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-sm">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <span className="gradient-text">EasyDoc</span>
                <span className="text-muted-foreground font-normal">TJ</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.tagline")}</p>
            </div>

            {/* Links */}
            <div>
              <p className="font-semibold text-sm mb-3">{t("footer.links")}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  { href: "/doctors", label: t("nav.doctors") },
                  { href: "/hospitals", label: t("nav.hospitals") },
                  { href: "/about", label: t("nav.about") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold text-sm mb-3">{t("footer.contact")}</p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>+992 90 000 00 00</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>info@easydoc.tj</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Dushanbe, Tajikistan</span>
                </li>
              </ul>
            </div>

            {/* Auth */}
            <div>
              <p className="font-semibold text-sm mb-3">Account</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-primary transition-colors duration-200">
                    {t("nav.login")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-primary transition-colors duration-200">
                    {t("nav.register")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EasyDoc TJ. {t("footer.rights")}.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
