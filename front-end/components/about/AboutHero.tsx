"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function AboutHero() {
  const t = useTranslations("about");

  return (
    <section className="relative pt-24 pb-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary-container)/0.15,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center gap-8 mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold uppercase tracking-[0.2em] text-xs"
          >
            {t("visionBadge")}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight text-foreground"
          >
            {t("visionTitle").split("clinical precision")[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
              clinical precision
            </span>
            {t("visionTitle").split("clinical precision")[1]}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            {t("visionDesc")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
