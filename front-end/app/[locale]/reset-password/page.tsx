"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Stethoscope, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-destructive", "bg-yellow-500", "bg-secondary"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
    toast.success("Password reset successfully!");
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
          <p className="text-muted-foreground text-sm mt-1">Set your new password.</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password Updated</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your password has been reset successfully. You can now sign in with your new credentials.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary"
              >
                Sign In Now
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Set New Password</h2>
                  <p className="text-xs text-muted-foreground">Choose a strong, unique password.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 rounded-xl bg-background/50 border-border/60 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-muted"}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${["", "text-destructive", "text-yellow-500", "text-secondary"][strength]}`}>
                        {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={`pl-10 pr-10 rounded-xl bg-background/50 border-border/60 focus:border-primary ${
                        confirm && confirm !== password ? "border-destructive focus:border-destructive" : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                {/* Requirements */}
                <div className="p-3 rounded-xl bg-muted/30 space-y-1">
                  {[
                    { label: "At least 8 characters", ok: password.length >= 8 },
                    { label: "Passwords match", ok: password === confirm && confirm.length > 0 },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      <CheckCircle className={`h-3.5 w-3.5 ${ok ? "text-secondary" : "text-muted-foreground/40"}`} />
                      <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={loading || password !== confirm}
                  className="w-full rounded-xl py-6 font-semibold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all group"
                >
                  {loading ? "Updating..." : "Update Password"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
