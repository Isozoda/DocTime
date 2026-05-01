"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const t = useTranslations("about");

  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full animate-pulse delay-700" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">
            {t("promiseTitle")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {t("promiseDesc")}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              size="lg" 
              className="px-10 py-7 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:shadow-[0_0_40px_rgba(var(--color-primary),0.4)] transition-all active:scale-95"
            >
              {t("ctaJoin")}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-7 rounded-full border-white/20 text-foreground font-bold text-lg hover:bg-white/5 transition-all active:scale-95"
            >
              {t("ctaWhitepaper")}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
