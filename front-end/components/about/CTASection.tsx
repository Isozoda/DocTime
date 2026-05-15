"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { CalendarDays, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const TRUST_ITEMS = ["Free to register", "No credit card required", "Instant booking"];

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-muted/30">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, color-mix(in oklch, var(--primary), transparent 88%) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklch, var(--primary), transparent 60%), transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 blur-[100px] rounded-full animate-pulse pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-secondary/20 blur-[100px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: "700ms" }} />

          <div className="relative z-10">
            <div className="section-badge mb-6 inline-flex">
              <Sparkles className="w-3 h-3" />
              GET STARTED
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              Ready to Experience{" "}
              <span className="gradient-text-indigo">Better Healthcare?</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join over 10,000 patients who have already discovered a faster,
              smarter way to access medical care in Tajikistan.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Link href="/auth/register" className="btn-primary px-8 py-3.5 text-base">
                <CalendarDays className="h-4 w-4" />
                Book Your First Appointment
              </Link>
              <Link href="/doctors" className="btn-glass px-8 py-3.5 text-base">
                Browse Doctors <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {TRUST_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
