"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Sparkles, Target, Eye } from "lucide-react";

const PILLARS = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    desc: "Your medical data is encrypted end-to-end with the same standards used by leading global banks. Your privacy is our top priority.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Globe,
    title: "Multi-City Coverage",
    desc: "From Dushanbe to Khujand and Bokhtar — quality healthcare wherever you are in Tajikistan.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Sparkles,
    title: "AI Smart Assistant",
    desc: "Describe your symptoms in plain language and let our AI recommend the right specialist — no guesswork needed.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
];

export function MissionBento() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, color-mix(in oklch, var(--primary), transparent 94%) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-badge mb-4">OUR MISSION</div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text-indigo mb-4">
            Healthcare That Puts People First
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            We believe quality healthcare should not be a luxury. DocTime breaks
            down barriers — geographic, financial, and logistical — making it as
            easy as possible for patients in Tajikistan to find and book qualified
            medical professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large feature card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-7 glass-card rounded-3xl overflow-hidden relative group min-h-[420px] flex flex-col justify-end"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=2000"
                alt="Healthcare"
                className="w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            </div>
            <div className="relative z-10 p-8 md:p-10">
              <div className="section-badge mb-4 inline-flex">
                <Target className="w-3 h-3" />
                MISSION
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                AI-Powered Doctor Discovery
              </h3>
              <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
                Our intelligent search engine matches patients with the right
                specialists based on symptoms, location, and availability —
                cutting search time from hours to seconds.
              </p>
            </div>
          </motion.div>

          {/* Vision card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5 glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 blur-3xl bg-secondary pointer-events-none" />
            <div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "color-mix(in oklch, var(--secondary), transparent 85%)", border: "1px solid color-mix(in oklch, var(--secondary), transparent 70%)" }}
              >
                <Eye className="w-7 h-7 text-secondary" />
              </div>
              <div
                className="section-badge mb-4 inline-flex"
                style={{
                  background: "color-mix(in oklch, var(--secondary), transparent 88%)",
                  color: "var(--secondary)",
                  borderColor: "color-mix(in oklch, var(--secondary), transparent 70%)",
                }}
              >
                VISION
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                The Future of Digital Healthcare
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A Tajikistan where every person — no matter where they live — can
                access a trusted doctor within minutes. We're building the
                infrastructure for that future, one appointment at a time.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="text-5xl font-black gradient-text-indigo tabular-nums">98%</div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                Patient Satisfaction Rate
              </p>
            </div>
          </motion.div>

          {/* Three pillars */}
          {PILLARS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="md:col-span-4 glass-card rounded-3xl p-7 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${card.bg} border ${card.border} flex items-center justify-center mb-5`}
              >
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">{card.title}</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
