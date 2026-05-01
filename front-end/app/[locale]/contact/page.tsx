"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Phone, Mail, MapPin, ExternalLink, Send } from "lucide-react";

const DEPARTMENTS = ["General Consultation", "Emergency Services", "Cardiology Wing", "Billing & Support"];

const OFFICES = [
  { name: "Manhattan Medical Plaza", address: "745 5th Ave, New York, NY 10151" },
  { name: "London Health Tower", address: "30 St Mary Axe, London EC3A 8BF" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message sent successfully!");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col gap-6">
        {/* Hero */}
        <section>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Precision care starts with a conversation. Reach out to our concierge team or locate your nearest clinical center.
          </p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Contact Form */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
            <h2 className="text-xl font-semibold mb-6">Direct Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</Label>
                  <Input
                    placeholder="Dr. Adrian Stone"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl bg-white/5 border-white/10 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="adrian.stone@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl bg-white/5 border-white/10 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Department</Label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</Label>
                <Textarea
                  placeholder="Describe your inquiry with precision..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="rounded-xl bg-white/5 border-white/10 focus:border-primary resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-6 font-semibold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all group"
              >
                {loading ? "Sending..." : "Send Secure Message"}
                {!loading && <Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
              </Button>
            </form>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Quick Contact */}
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">Immediate Support</p>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Emergency Hotline</p>
                  <p className="text-muted-foreground">1-800-DOC-TIME (24/7)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Digital Care</p>
                  <p className="text-muted-foreground">support@doctime.clinic</p>
                </div>
              </div>
            </div>

            {/* Offices */}
            <div className="glass-card rounded-2xl p-6 flex-grow">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Headquarters</p>
              <div className="space-y-3">
                {OFFICES.map((office) => (
                  <div
                    key={office.name}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{office.name}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">{office.address}</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map banner */}
          <div className="lg:col-span-12 glass-card rounded-2xl overflow-hidden relative min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground/60 text-sm">Interactive map · 15+ specialized centers globally</p>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-card rounded-xl p-4 max-w-sm border border-white/10">
                <p className="font-semibold text-sm mb-1">Find Our Clinics</p>
                <p className="text-muted-foreground text-xs mb-3">Explore our 15+ specialized centers globally.</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter zip code..."
                    className="rounded-full bg-white/5 border-white/10 text-sm h-9"
                  />
                  <Button size="sm" className="rounded-full px-4 bg-primary text-primary-foreground">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
