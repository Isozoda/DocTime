"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

export function ContactForm() {
  const t = useTranslations("about");
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
      // Assuming a generic contact endpoint
      await api.post("/contact", { name, email, message });
      setSuccess(true);
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      // Error is handled by axios interceptor toast, but we can add specific logic here
      console.error("Contact error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2rem] p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto"
      >
        <CheckCircle2 className="w-16 h-16 text-secondary mb-6" />
        <h3 className="text-3xl font-bold text-foreground mb-4">Thank You!</h3>
        <p className="text-muted-foreground text-lg mb-8">
          Your message has been received. Our team will get back to you shortly.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setSuccess(false)}
          className="rounded-full px-8"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <section className="py-24 px-4 bg-surface-container-lowest/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            {t("contact")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Have questions? We're here to help you navigate your healthcare journey.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2rem] p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider opacity-70">
                  {t("name")}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-white/5 border-white/10 rounded-xl h-14 px-6 focus:ring-primary/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider opacity-70">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="bg-white/5 border-white/10 rounded-xl h-14 px-6 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-bold uppercase tracking-wider opacity-70">
                {t("message")}
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you today?"
                rows={6}
                className="bg-white/5 border-white/10 rounded-2xl p-6 focus:ring-primary/50 resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)] transition-all active:scale-[0.98]"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("sending")}</>
              ) : (
                <><Send className="mr-2 h-5 w-5" /> {t("send")}</>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
