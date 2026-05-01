"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { DoctorNavSidebar } from "@/components/layout/DoctorNavSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ShieldCheck, Upload, FileText, CheckCircle,
  Clock, AlertCircle, ChevronRight, Stethoscope,
} from "lucide-react";

const STEPS = [
  { id: "identity", label: "Identity Verification", icon: ShieldCheck, status: "complete" },
  { id: "license", label: "Medical License", icon: FileText, status: "complete" },
  { id: "specialty", label: "Specialty Certification", icon: Stethoscope, status: "review" },
  { id: "hospital", label: "Hospital Affiliation", icon: CheckCircle, status: "pending" },
];

const STATUS_CONFIG = {
  complete: { icon: CheckCircle, color: "text-secondary", bg: "bg-secondary/10", label: "Verified" },
  review: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Under Review" },
  pending: { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted/40", label: "Pending Upload" },
};

const REQUIREMENTS = [
  "Government-issued photo ID (passport or national ID)",
  "Medical degree certificate (MD or equivalent)",
  "Current medical license from state/national board",
  "Specialty board certification (if applicable)",
  "Hospital affiliation letter (if applicable)",
  "Professional headshot photograph",
];

export default function DoctorVerifyPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("specialty");
  const [specialty, setSpecialty] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const handleUpload = async () => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(false);
    toast.success("Documents submitted for review!");
  };

  if (!user) return null;

  const overallProgress = (STEPS.filter((s) => s.status === "complete").length / STEPS.length) * 100;

  return (
    <div className="flex min-h-screen bg-background">
      <DoctorNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Doctor Verification Portal</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Complete your verification to start accepting patients.</p>
        </div>

        {/* Progress bar */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm">Verification Progress</span>
            <span className="text-primary font-bold text-sm">{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {STEPS.filter((s) => s.status === "complete").length} of {STEPS.length} steps complete
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Steps list */}
          <div className="space-y-3">
            {STEPS.map(({ id, label, icon: Icon, status }) => {
              const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
              const StatusIcon = cfg.icon;
              return (
                <button
                  key={id}
                  onClick={() => setActiveStep(id)}
                  className={cn(
                    "w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left transition-all hover:bg-white/5",
                    activeStep === id && "ring-1 ring-primary/40 bg-primary/5"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                    <Icon className={cn("h-5 w-5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{label}</p>
                    <div className={cn("flex items-center gap-1 text-xs mt-0.5 font-medium", cfg.color)}>
                      <StatusIcon className="h-3 w-3" /> {cfg.label}
                    </div>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0 transition-colors", activeStep === id ? "text-primary" : "text-muted-foreground/30")} />
                </button>
              );
            })}

            {/* Requirements */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-3">Required Documents</h3>
              <ul className="space-y-2">
                {REQUIREMENTS.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/50" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Active step form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8">
              {activeStep === "specialty" && (
                <>
                  <h2 className="text-xl font-bold mb-1">Specialty Certification</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Provide your specialty board certification details. This is currently under review.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Medical Specialty</Label>
                      <Input
                        placeholder="e.g. Cardiovascular Surgery"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="rounded-xl bg-white/5 border-white/10 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Certifying Institution</Label>
                      <Input
                        placeholder="e.g. American Board of Surgery"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="rounded-xl bg-white/5 border-white/10 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year of Certification</Label>
                      <Input
                        placeholder="e.g. 2018"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="rounded-xl bg-white/5 border-white/10 focus:border-primary"
                        type="number"
                        min="1980"
                        max="2025"
                      />
                    </div>
                  </div>

                  {/* Upload zone */}
                  <div className="border-2 border-dashed border-border/40 rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer group mb-6">
                    <Upload className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3 group-hover:text-primary/50 transition-colors" />
                    <p className="font-medium text-sm">Drag &amp; drop your certification document</p>
                    <p className="text-muted-foreground text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
                    <button className="mt-3 text-xs text-primary font-semibold hover:underline">Browse files</button>
                  </div>

                  <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 mb-5">
                    <div className="flex items-center gap-2 text-yellow-500 text-sm font-semibold mb-1">
                      <Clock className="h-4 w-4" /> Under Review
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Your previous submission is being reviewed by our medical team. Typically takes 2-3 business days.
                    </p>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full rounded-xl py-6 bg-gradient-to-r from-primary to-secondary font-semibold"
                  >
                    {uploading ? "Submitting..." : "Submit Updated Documents"}
                  </Button>
                </>
              )}

              {activeStep !== "specialty" && (
                <div className="text-center py-12">
                  {activeStep === "identity" || activeStep === "license" ? (
                    <>
                      <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-secondary" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">Verified!</h2>
                      <p className="text-muted-foreground text-sm">
                        This step has been successfully verified by our team.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">Upload Required</h2>
                      <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                        Please upload the required documents to complete this verification step.
                      </p>
                      <div className="border-2 border-dashed border-border/40 rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer group mb-5">
                        <Upload className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3 group-hover:text-primary/50 transition-colors" />
                        <p className="text-sm font-medium">Click or drag to upload</p>
                      </div>
                      <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
                        Submit Documents
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
