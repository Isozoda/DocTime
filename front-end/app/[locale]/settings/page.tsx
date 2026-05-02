"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn, avatarUrl } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  User, ShieldCheck, Bell, CreditCard, ShieldAlert,
  Stethoscope, FlaskConical, Pill, Megaphone,
  CreditCard as VisaIcon, Wallet, Plus, CheckCircle,
  Camera, Loader2, Trash2,
} from "lucide-react";

type SettingsTab = "personal" | "security" | "notifications" | "payments";

const TABS = [
  { id: "personal" as SettingsTab, label: "Personal Info", icon: User },
  { id: "security" as SettingsTab, label: "Security (2FA)", icon: ShieldCheck },
  { id: "notifications" as SettingsTab, label: "Notification Prefs", icon: Bell },
  { id: "payments" as SettingsTab, label: "Payment Methods", icon: CreditCard },
];

const NOTIFICATION_PREFS = [
  { label: "Appointments", desc: "Get reminders 24h and 1h before your scheduled visit.", icon: Stethoscope, color: "text-secondary", toggled: true },
  { label: "Lab Results", desc: "Instant alerts when new diagnostic results are uploaded.", icon: FlaskConical, color: "text-primary", toggled: true },
  { label: "Prescriptions", desc: "Refill reminders and dosage tracking alerts via SMS.", icon: Pill, color: "text-[--tertiary]", toggled: true },
  { label: "Health Tips", desc: "Weekly wellness articles and community health bulletins.", icon: Megaphone, color: "text-destructive", toggled: false },
];

const PAYMENT_METHODS = [
  { label: "Visa •••• 4412", sub: "Exp 12/26", icon: VisaIcon, primary: false },
  { label: "Apple Pay", sub: "Primary", icon: Wallet, primary: true },
];

export default function SettingsPage() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("personal");
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_PREFS.map((n) => [n.label, n.toggled]))
  );
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoDeleting, setPhotoDeleting] = useState(false);
  const [photoKey, setPhotoKey] = useState(0);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("avatar", file);
    setPhotoUploading(true);
    try {
      const { data } = await api.post<{ success: boolean; data: typeof user }>("/users/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.data) updateUser(data.data as Parameters<typeof updateUser>[0]);
      setPhotoKey((k) => k + 1);
      toast.success("Avatar updated");
    } catch {
      // toast handles error
    } finally {
      setPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    setPhotoDeleting(true);
    try {
      const { data } = await api.delete<{ success: boolean; data: typeof user }>("/users/profile/avatar");
      if (data.data) updateUser(data.data as Parameters<typeof updateUser>[0]);
      setPhotoKey((k) => k + 1);
      toast.success("Avatar removed");
    } catch {
      // toast
    } finally {
      setPhotoDeleting(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put<{ success: boolean; data: typeof user }>("/users/profile", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      if (data.data) updateUser(data.data as Parameters<typeof updateUser>[0]);
      toast.success("Profile updated successfully");
    } catch {
      // axios interceptor already shows toast
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-2/5 h-2/5 bg-secondary/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-72 shrink-0 flex flex-col gap-4">
          {/* Profile card */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group shrink-0">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center border-2 border-primary/20">
                  <img
                    key={photoKey}
                    src={avatarUrl(user.name, (user as { avatar?: string | null }).avatar)}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Upload photo"
                >
                  {photoUploading ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : <Camera className="h-5 w-5 text-white" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-muted-foreground text-xs capitalize truncate">Patient ID: #DT-9942</p>
                {(user as { avatar?: string | null }).avatar && (
                  <button
                    onClick={handleDeletePhoto}
                    disabled={photoDeleting}
                    className="text-[10px] text-destructive hover:underline mt-1 flex items-center gap-1"
                  >
                    {photoDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all text-left",
                    activeTab === id
                      ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-white border-r-2 border-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Health record completion */}
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-bold">Health Record Status</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[85%] bg-secondary rounded-full" />
            </div>
            <p className="text-xs text-secondary mt-2">85% Complete</p>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Personal Info */}
          {activeTab === "personal" && (
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-6">
                <h1 className="text-xl font-bold">Personal Information</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Manage your basic details and medical identifiers.</p>
              </div>
              <form className="space-y-4" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl bg-white/5 border-white/10 focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl bg-white/5 border-white/10 focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+992 ..." className="rounded-xl bg-white/5 border-white/10 focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date of Birth</Label>
                    <Input type="date" className="rounded-xl bg-white/5 border-white/10 focus:border-primary" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Residential Address</Label>
                  <Textarea
                    rows={3}
                    placeholder="Your full residential address"
                    className="rounded-xl bg-white/5 border-white/10 focus:border-primary resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/10 text-muted-foreground"
                    onClick={() => { setName(user.name); setEmail(user.email); setPhone(user.phone ?? ""); }}
                  >
                    Discard
                  </Button>
                  <Button type="submit" disabled={saving} className="rounded-full bg-gradient-to-r from-primary to-secondary font-bold px-8">
                    {saving ? "Saving..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-6">
                <h1 className="text-xl font-bold">Security Settings</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Manage your account security and two-factor authentication.</p>
              </div>
              <div className="space-y-4">
                {/* 2FA */}
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                    </div>
                    <Switch
                      checked={twoFAEnabled}
                      onCheckedChange={setTwoFAEnabled}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Add an extra layer of security to your medical records using an authenticator app.
                  </p>
                  <Button variant="outline" className="rounded-xl border-white/10 text-sm">
                    Configure App
                  </Button>
                </div>

                {/* Password */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <h3 className="font-semibold">Change Password</h3>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl bg-white/5 border-white/10 focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Password</Label>
                      <Input type="password" placeholder="••••••••" className="rounded-xl bg-white/5 border-white/10 focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm Password</Label>
                      <Input type="password" placeholder="••••••••" className="rounded-xl bg-white/5 border-white/10 focus:border-primary" />
                    </div>
                  </div>
                  <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary font-bold">Update Password</Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl font-bold">Notification Preferences</h1>
                  <p className="text-muted-foreground text-sm mt-0.5">Control how you receive updates about your health.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full border-white/10 text-muted-foreground shrink-0">
                  Silence All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {NOTIFICATION_PREFS.map(({ label, desc, icon: Icon, color }) => (
                  <div key={label} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Icon className={cn("h-5 w-5", color)} />
                      <Switch
                        checked={!!notifications[label]}
                        onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [label]: v }))}
                        className="data-[state=checked]:bg-secondary"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-white">{label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-6">
                <h1 className="text-xl font-bold">Payment Methods</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Manage your saved payment methods and billing preferences.</p>
              </div>
              <div className="space-y-3 mb-5">
                {PAYMENT_METHODS.map(({ label, sub, icon: Icon, primary }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="text-xs text-muted-foreground uppercase">{sub}</p>
                      </div>
                    </div>
                    {primary && <CheckCircle className="h-5 w-5 text-secondary" />}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 gap-2 font-semibold">
                <Plus className="h-4 w-4" /> Add New Method
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
