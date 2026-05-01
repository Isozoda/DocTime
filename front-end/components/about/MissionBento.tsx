"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Rocket, Shield, Globe, Sparkles } from "lucide-react";
import Image from "next/image";

export function MissionBento() {
  const t = useTranslations("about");

  const cards = [
    {
      id: "security",
      title: t("securityTitle"),
      desc: t("securityDesc"),
      icon: Shield,
      color: "text-secondary",
      span: "md:col-span-4",
    },
    {
      id: "global",
      title: t("globalTitle"),
      desc: t("globalDesc"),
      icon: Globe,
      color: "text-blue-400",
      span: "md:col-span-4",
    },
    {
      id: "ai",
      title: t("aiTitle"),
      desc: t("aiDesc"),
      icon: Sparkles,
      color: "text-primary",
      span: "md:col-span-4",
      gradient: "bg-gradient-to-br from-primary/10 to-transparent",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Feature Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 glass-card rounded-3xl p-8 md:p-12 relative group overflow-hidden min-h-[400px] flex flex-col justify-end"
          >
            <div className="absolute inset-0 z-0">
              <img 
                alt="Modern Medical Research" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000"
                src="https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=2000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("feature1Title")}</h3>
              <p className="text-muted-foreground max-w-xl text-lg">
                {t("feature1Desc")}
              </p>
            </div>
          </motion.div>

          {/* Metric Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-center items-center text-center border-primary/20"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-[0_0_40px_rgba(var(--color-primary),0.2)]">
              <Rocket className="w-10 h-10" />
            </div>
            <div className="text-6xl font-black text-foreground mb-2 tracking-tighter">{t("metricValue")}</div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">{t("metricLabel")}</p>
          </motion.div>

          {/* Secondary Bento Rows */}
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className={`${card.span} glass-card rounded-3xl p-8 hover:translate-y-[-4px] transition-all duration-300 ${card.gradient || ""}`}
            >
              <card.icon className={`${card.color} w-10 h-10 mb-6`} />
              <h4 className="text-2xl font-bold text-foreground mb-3">{card.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
