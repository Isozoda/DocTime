"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import api from "@/lib/axios";
import type { AuthResponse } from "@/types/user";
import {
  User, Mail, Lock, Phone, ArrowRight, Stethoscope,
  Shield, BarChart2, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "patient" | "doctor";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error("Please accept the Terms of Service"); return; }
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password, role, phone });
      login(data.data.user, data.data.token);
      toast.success("Account created successfully!");
      router.push(role === "doctor" ? "/dashboard/doctor" : "patient/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-secondary/8 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-center">

          {/* Left: Value props */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary rounded-full px-4 py-1.5 w-fit text-xs font-semibold uppercase tracking-wider">
              <CheckCircle className="h-3.5 w-3.5" />
              Medical Grade Security
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight leading-tight">
                Join the future of{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Clinical Prestige
                </span>
              </h1>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Experience a new standard of healthcare management with our obsidian-grade platform.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-2xl bg-muted/60 border border-border/40 shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Health Vault</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Military-grade encryption for all medical records and private communications.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-2xl bg-muted/60 border border-border/40 shrink-0">
                  <BarChart2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-Driven Insights</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Advanced analytics to monitor vitals and predict health trends in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 overflow-hidden relative h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              <p className="relative text-xs text-muted-foreground font-semibold">Trusted by 500+ Clinics worldwide</p>
              <div className="relative mt-4 flex gap-2 flex-wrap">
                {["HIPAA Compliant", "AES-256 Encrypted", "ISO 27001"].map((badge) => (
                  <span key={badge} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create Account</h2>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full ${i === 0 ? "bg-primary shadow-sm shadow-primary/50" : "bg-muted"}`} />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role selection */}
                <div className="grid grid-cols-2 gap-3">
                  {(["patient", "doctor"] as Role[]).map((r) => (
                    <label key={r} className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                        className="sr-only"
                      />
                      <div className={`p-5 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                        role === r
                          ? "border-secondary bg-secondary/8 shadow-sm shadow-secondary/20"
                          : "border-border/40 bg-muted/20 hover:bg-muted/40"
                      }`}>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          r === "patient" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        }`}>
                          {r === "patient" ? <User className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold capitalize">{r}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {r === "patient" ? "Seek care & track health" : "Provide care & manage practice"}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Dr. Adrian Stone"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 rounded-xl bg-background/50 border-border/60 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="adrian.stone@doctime.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 rounded-xl bg-background/50 border-border/60 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 rounded-xl bg-background/50 border-border/60 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 rounded-xl bg-background/50 border-border/60 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/about" className="text-primary hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/about" className="text-primary hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-6 font-semibold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all group"
                >
                  {loading ? "Creating account..." : "Complete Registration"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-secondary font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
