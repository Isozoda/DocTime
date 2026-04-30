"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Target, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TEAM = [
  { name: "Alisher Karimov",    role: "CEO & Co-founder",     city: "Dushanbe" },
  { name: "Dilnoza Rakhimova",  role: "Medical Director",     city: "Dushanbe" },
  { name: "Ravshan Toshmatov",  role: "CTO",                  city: "Khujand" },
  { name: "Nilufar Nazarova",   role: "Head of Partnerships", city: "Dushanbe" },
];

export default function AboutPage() {
  const t = useTranslations("about");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!name || !message) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We will respond shortly.");
    setName("");
    setMessage("");
    setSending(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto max-w-3xl text-center relative">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 mb-6">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
            <p className="text-xl text-muted-foreground font-medium">
              &quot;A Doctor in One Click&quot;
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">{t("mission")}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{t("missionText")}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "500+",    label: "Doctors" },
                  { value: "20+",     label: "Hospitals" },
                  { value: "7",       label: "Cities" },
                  { value: "50,000+", label: "Patients" },
                ].map((s) => (
                  <Card key={s.label}>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-2 mb-10 justify-center">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{t("team")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {TEAM.map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center bg-card border border-border/60 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D9488&color=fff&size=80`}
                    alt={member.name}
                    className="h-16 w-16 rounded-full mb-3 ring-2 ring-primary/20"
                  />
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{member.city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-xl">
            <h2 className="text-2xl font-bold text-center mb-8">{t("contact")}</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>{t("name")}</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("message")}</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="How can we help you?"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleSend}
                  disabled={sending || !name || !message}
                >
                  {sending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("sending")}</>
                  ) : t("send")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
