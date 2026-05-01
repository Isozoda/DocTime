"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { toast } from "sonner";
import { Mail, Stethoscope, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Enter your email address"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success("Recovery email sent!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-primary/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-secondary/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DocTime</h1>
          <p className="text-muted-foreground text-sm mt-1 text-center">Recover your account access.</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
              <p className="text-muted-foreground text-sm mb-6">
                We sent a recovery link to <span className="font-semibold text-foreground">{email}</span>.
                Check your inbox and spam folder.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full rounded-xl border-border/60"
                >
                  Try another email
                </Button>
                <Link href="/login" className="block w-full">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your registered email address and we&apos;ll send you a secure reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="dr.stone@doctime.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 rounded-xl bg-background/50 border-border/60 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-6 font-semibold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all group"
                >
                  {loading ? "Sending..." : "Send Recovery Link"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-border/40">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Security note */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/15">
          <p className="text-xs text-muted-foreground text-center">
            🔒 HIPAA compliant · End-to-end encrypted · Links expire in 24 hours
          </p>
        </div>
      </div>
    </main>
  );
}
