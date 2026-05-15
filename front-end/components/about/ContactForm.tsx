"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Send,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "support@doctime.tj", color: "#6366F1" },
  { icon: Phone, label: "Phone", value: "+992 44 600-00-00", color: "#8B5CF6" },
  { icon: MapPin, label: "Office", value: "Dushanbe, Tajikistan", color: "#10B981" },
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/contact", { name, email, message });
      setSuccess(true);
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 0% 50%, color-mix(in oklch, var(--primary), transparent 95%) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4">CONTACT</div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in <span className="gradient-text-indigo">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have questions? Our team is ready to help you navigate your
            healthcare journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {CONTACT_INFO.map(({ icon: Icon, label, value, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300"
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}25`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                    {label}
                  </p>
                  <p className="font-semibold text-foreground text-sm">{value}</p>
                </div>
              </motion.div>
            ))}

            {/* Brief note */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-5 mt-auto"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                We typically respond within{" "}
                <span className="font-bold text-primary">24 hours</span> on
                business days. For urgent medical questions, please call our
                support line directly.
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                <h3 className="text-3xl font-bold text-foreground mb-4">Thank You!</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-sm">
                  Your message has been received. We&apos;ll get back to you
                  shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSuccess(false)}
                  className="rounded-full px-8"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <div className="glass-card rounded-3xl p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="h-12 rounded-xl bg-muted/30 border-border/60 focus:border-primary/50 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 rounded-xl bg-muted/30 border-border/60 focus:border-primary/50 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you today?"
                      rows={6}
                      className="rounded-2xl bg-muted/30 border-border/60 focus:border-primary/50 focus:ring-primary/20 resize-none p-4"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-base hover:shadow-[0_0_30px_color-mix(in_oklch,var(--primary),transparent_60%)] transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
