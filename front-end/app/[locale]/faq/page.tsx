"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, User, Stethoscope, Settings, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "patient" | "doctor" | "general";

interface FAQItem {
  q: string;
  a: string;
  category: Category;
}

const FAQS: FAQItem[] = [
  {
    category: "patient",
    q: "How do I book a video consultation?",
    a: "Navigate to the \"Find Doctor\" section, select your preferred specialist, and choose an available time slot labeled \"Video Call\". You'll receive a confirmation and a link via SMS and Email.",
  },
  {
    category: "patient",
    q: "Can I access my lab reports through the app?",
    a: "Yes. All lab reports uploaded by your doctor are accessible under your Health Records section. Reports are stored with end-to-end encryption and can be downloaded as PDF.",
  },
  {
    category: "patient",
    q: "How do I cancel or reschedule an appointment?",
    a: "Go to My Appointments, find the appointment you wish to modify, and tap \"Reschedule\" or \"Cancel\". Cancellations made 24 hours before the appointment are fully refunded.",
  },
  {
    category: "doctor",
    q: "How do I sync my clinic schedule?",
    a: "In your Doctor Dashboard, navigate to Schedule Management and connect your external calendar (Google Calendar, Outlook). Changes sync in real-time across all platforms.",
  },
  {
    category: "doctor",
    q: "Is the patient data encrypted and HIPAA compliant?",
    a: "Absolutely. DocTime utilizes end-to-end AES-256 encryption for all data transmissions. We are fully HIPAA and GDPR compliant, ensuring that sensitive medical records and patient communications remain private and secure at all times.",
  },
  {
    category: "doctor",
    q: "How does the earnings payout work?",
    a: "Earnings are calculated per completed consultation and paid out weekly directly to your registered bank account. You can view detailed breakdowns in the Earnings & Analytics section of your dashboard.",
  },
  {
    category: "general",
    q: "What payment methods are supported?",
    a: "We accept all major credit/debit cards (Visa, MasterCard, Amex), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed via Stripe with 256-bit SSL encryption.",
  },
  {
    category: "general",
    q: "How do I update my account information?",
    a: "Go to Profile Settings from your dashboard. You can update your name, contact details, profile photo, and notification preferences at any time. Changes take effect immediately.",
  },
  {
    category: "general",
    q: "What browsers and devices are supported?",
    a: "DocTime works on all modern browsers (Chrome, Firefox, Safari, Edge) and is available as a mobile app for iOS 14+ and Android 10+. We recommend keeping your browser and app up to date for the best experience.",
  },
];

const CATEGORY_META = {
  patient: { label: "Patient", icon: User, color: "text-primary", bg: "bg-primary/10", ring: "ring-primary/20" },
  doctor: { label: "Doctor", icon: Stethoscope, color: "text-secondary", bg: "bg-secondary/10", ring: "ring-secondary/20" },
  general: { label: "General", icon: Settings, color: "text-[--tertiary]", bg: "bg-[--tertiary]/10", ring: "ring-[--tertiary]/20" },
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("patient");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(
    (f) =>
      f.category === activeCategory &&
      (search === "" || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        {/* Hero */}
        <section className="text-center mb-14">
          <h1 className="text-5xl font-bold tracking-tight mb-4">How can we help?</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to frequently asked questions about DocTime&apos;s advanced clinical platform.
          </p>
          <div className="mt-8 relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for a topic or question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-full bg-muted/30 border-border/50 focus:border-primary text-base"
            />
          </div>
        </section>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={cn(
                  "glass-card p-8 rounded-2xl flex flex-col items-center text-center gap-4 transition-all duration-200 hover:bg-white/5",
                  active && `ring-1 ${meta.ring} border-opacity-60`
                )}
              >
                <div className={`h-16 w-16 rounded-2xl ${meta.bg} flex items-center justify-center`}>
                  <Icon className={`h-8 w-8 ${meta.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{meta.label}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {cat === "patient" && "Booking, teleconsultation, and health records management."}
                    {cat === "doctor" && "Patient management, scheduling, and analytics tools."}
                    {cat === "general" && "Account security, billing, and technical requirements."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-16">
          {/* Section divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/60" />
            <span className={`text-xs font-semibold ${CATEGORY_META[activeCategory].color} uppercase tracking-widest px-4`}>
              {CATEGORY_META[activeCategory].label} FAQ
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/60" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No questions found for &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
                >
                  <span className="font-medium pr-4">{item.q}</span>
                  {openIndex === idx ? (
                    <ChevronUp className={`h-5 w-5 shrink-0 ${CATEGORY_META[activeCategory].color}`} />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-5 pt-1 text-muted-foreground border-t border-border/30">
                    <p className="leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <section className="glass-card p-12 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-2xl font-bold mb-3 relative z-10">Still have questions?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto relative z-10">
            Our dedicated support team is available 24/7 to assist you with any clinical or technical inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button variant="outline" className="rounded-full px-8 py-5 border-border/60 hover:bg-muted/30 gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Support
            </Button>
            <Button className="rounded-full px-8 py-5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all gap-2">
              <MessageSquare className="h-4 w-4" />
              Live Chat
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
