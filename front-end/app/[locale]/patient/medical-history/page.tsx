"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/navigation";
import { PatientNavSidebar } from "@/components/layout/PatientNavSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  History, FlaskConical, Syringe, Download, User, MapPin,
  Droplets, Microscope, Scan, CheckCircle, Clock,
} from "lucide-react";

const VISITS = [
  {
    date: "October 14, 2023",
    type: "Routine Checkup",
    typeBg: "bg-secondary/10 text-secondary",
    title: "General Physical Examination",
    notes: "Patient presents for annual physical. Vital signs stable. BMI within normal range. Recommended increased vitamin D intake.",
    doctor: "Dr. Sarah Jenkins",
    location: "Central Clinic",
    dotColor: "bg-primary shadow-[0_0_12px_theme(colors.primary/0.5)]",
    accent: "border-primary/30",
  },
  {
    date: "August 22, 2023",
    type: "Urgent Care",
    typeBg: "bg-destructive/10 text-destructive",
    title: "Acute Bronchitis Treatment",
    notes: "Treatment for persistent cough and congestion. Prescribed antibiotic course and rest. Follow-up recommended in 10 days.",
    doctor: "Dr. Michael Vance",
    location: "",
    dotColor: "bg-secondary shadow-[0_0_12px_theme(colors.secondary/0.5)]",
    accent: "border-secondary/30",
  },
  {
    date: "June 05, 2023",
    type: "",
    typeBg: "",
    title: "Cardiology Consultation",
    notes: "Stress test and ECG monitoring performed. Normal sinus rhythm detected.",
    doctor: "",
    location: "",
    dotColor: "bg-primary/40 border-2 border-primary/40",
    accent: "",
  },
];

const LAB_REPORTS = [
  { label: "Complete Blood Count", date: "Oct 16, 2023", size: "2.4 MB", icon: Droplets, color: "text-blue-400", bg: "bg-blue-500/20" },
  { label: "Lipid Profile", date: "Oct 16, 2023", size: "1.8 MB", icon: Microscope, color: "text-secondary", bg: "bg-secondary/20" },
  { label: "Chest X-Ray", date: "Aug 22, 2023", size: "15.2 MB", icon: Scan, color: "text-purple-400", bg: "bg-purple-500/20" },
];

const IMMUNIZATIONS = [
  { label: "COVID-19 Booster", date: "Sep 2023", status: "Complete", icon: CheckCircle, color: "text-secondary" },
  { label: "Influenza Vaccine", date: "Oct 2023", status: "Complete", icon: CheckCircle, color: "text-secondary" },
  { label: "Tetanus (Td)", date: "Due Jan 2024", status: "Due", icon: Clock, color: "text-yellow-500" },
];

export default function PatientMedicalHistoryPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "patient") router.push("/login");
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <PatientNavSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8 pt-16 md:pt-8 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Medical History</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Comprehensive overview of your clinical journey, diagnostics, and immunizations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Visit Timeline */}
          <section className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" /> Past Visits
                </h2>
                <Button variant="ghost" size="sm" className="text-primary text-xs font-bold">View All</Button>
              </div>

              {/* Timeline */}
              <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary to-secondary" />

                <div className="space-y-6">
                  {VISITS.map(({ date, type, typeBg, title, notes, doctor, location, dotColor, accent }) => (
                    <div key={title} className="relative">
                      {/* Dot */}
                      <div className={cn("absolute -left-[37px] top-1 w-4 h-4 rounded-full ring-4 ring-background", dotColor)} />

                      <div className={cn("glass-card rounded-2xl p-5 border hover:border-primary/30 transition-all group", accent || "border-white/5")}>
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <span className={cn("text-xs font-bold uppercase tracking-widest", type ? "text-primary" : "text-muted-foreground/50")}>
                            {date}
                          </span>
                          {type && (
                            <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", typeBg)}>{type}</span>
                          )}
                        </div>
                        <h3 className={cn("font-bold text-lg mb-2 transition-colors group-hover:text-primary", !type && "text-white/60")}>
                          {title}
                        </h3>
                        <p className={cn("text-sm mb-4", !type ? "text-muted-foreground/50" : "text-muted-foreground")}>{notes}</p>
                        {(doctor || location) && (
                          <div className="flex items-center gap-3 flex-wrap">
                            {doctor && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <User className="h-3 w-3" /> {doctor}
                              </div>
                            )}
                            {location && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <MapPin className="h-3 w-3" /> {location}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Right: Lab Reports + Immunization */}
          <section className="lg:col-span-5 flex flex-col gap-5">
            {/* Lab Reports */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-secondary" /> Lab Reports
                </h2>
              </div>
              <div className="space-y-3">
                {LAB_REPORTS.map(({ label, date, size, icon: Icon, color, bg }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", bg)}>
                        <Icon className={cn("h-5 w-5", color)} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{label}</p>
                        <p className="text-muted-foreground text-xs">{date} · {size}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Immunization Records */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-primary" /> Immunization Records
                </h2>
              </div>
              <div className="space-y-3">
                {IMMUNIZATIONS.map(({ label, date, status, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
                    </div>
                    <div className={cn("flex items-center gap-1.5 text-xs font-semibold", color)}>
                      <Icon className="h-4 w-4" /> {status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
