"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import {
  CalendarDays, Clock, MapPin, CreditCard, Star,
  ArrowRight, ArrowLeft, CheckCircle, Headphones,
  Sun, Sunset,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CALENDAR_DAYS = [
  { day: 28, disabled: true }, { day: 29, disabled: true }, { day: 30, disabled: true }, { day: 31, disabled: true },
  { day: 1 }, { day: 2 }, { day: 3 }, { day: 4, active: true }, { day: 5 },
  { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 },
  { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 }, { day: 15 },
  { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 },
  { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 },
];

const TIME_SLOTS = [
  { time: "09:00 AM", icon: Sun, booked: false },
  { time: "10:30 AM", icon: Sun, booked: false },
  { time: "01:00 PM", icon: Sunset, booked: false },
  { time: "02:30 PM", icon: Sunset, booked: false },
  { time: "04:00 PM", icon: Sunset, booked: true },
  { time: "05:30 PM", icon: Sunset, booked: false },
];

const STEPS = ["Schedule", "Type", "Notes", "Confirm"];
const VISIT_TYPES = [
  { id: "in-person", label: "In-Person Visit", desc: "Visit the clinic in person", icon: MapPin },
  { id: "video", label: "Video Call", desc: "Virtual consultation", icon: Clock },
];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(4);
  const [selectedTime, setSelectedTime] = useState<string | null>("10:30 AM");
  const [visitType, setVisitType] = useState("in-person");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const handleConfirm = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    toast.success("Appointment booked successfully!");
  };

  if (done) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Appointment Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Your consultation with <span className="font-semibold text-foreground">Dr. Adrian Stone</span> is booked.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {selectedTime} · May 4, 2025 · {visitType === "video" ? "Video Call" : "In-Person"}
            </p>
            <div className="glass-card rounded-2xl p-5 text-left space-y-3 mb-6">
              {[
                { label: "Confirmation code", value: "DT-2025-8471" },
                { label: "Duration", value: "45 minutes" },
                { label: "Fee", value: "$150.00" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => { setDone(false); setStep(0); }} className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
              Book Another
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 pb-20">
        {/* Header & Progress */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Schedule Your Consultation</h1>
          <p className="text-muted-foreground">Complete the quick 4-step process to secure your slot with Dr. Adrian Stone.</p>

          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                    i < step ? "bg-secondary text-white" :
                    i === step ? "bg-primary text-white shadow-lg shadow-primary/30" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {i < step ? <CheckCircle className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className={cn("text-xs font-semibold", i === step ? "text-primary" : "text-muted-foreground")}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-0.5 w-16 rounded-full mb-5", i < step ? "bg-secondary" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Doctor Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Image
                    src="/placeholder.svg"
                    alt="Dr. Adrian Stone"
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-primary/20 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 h-5 w-5 bg-secondary rounded-full border-2 border-background" />
                </div>
                <h2 className="text-lg font-bold">Dr. Adrian Stone</h2>
                <p className="text-secondary text-sm font-medium">Chief Surgeon</p>
                <div className="mt-3 flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold">4.9</span>
                  <span className="text-xs text-muted-foreground">(1.2k Reviews)</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Location</p>
                    <p className="text-sm font-medium">Prestige Medical Center, NY</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Consultation Fee</p>
                    <p className="text-sm font-medium">$150.00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-secondary">
              <div>
                <p className="font-semibold text-sm">Need Help?</p>
                <p className="text-xs text-muted-foreground">24/7 Priority Support</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-muted/40 flex items-center justify-center">
                <Headphones className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-8">
            <div className="glass-card rounded-2xl p-8">
              {/* Step 0: Calendar */}
              {step === 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      Select Date &amp; Time
                    </h3>
                    <div className="flex items-center gap-2 bg-muted/40 rounded-full px-3 py-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">45 Min Session</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 mb-6 text-center">
                    {DAYS.map((d) => (
                      <div key={d} className="text-xs font-semibold text-muted-foreground pb-3 uppercase">{d}</div>
                    ))}
                    {CALENDAR_DAYS.map((item, idx) => (
                      <button
                        key={idx}
                        disabled={item.disabled}
                        onClick={() => setSelectedDay(item.day)}
                        className={cn(
                          "h-12 rounded-xl text-sm font-medium transition-all",
                          item.disabled ? "text-muted-foreground/20 cursor-default" :
                          selectedDay === item.day ? "bg-primary text-white shadow-md shadow-primary/30" :
                          "hover:bg-muted/50 text-foreground"
                        )}
                      >
                        {item.day}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Available Slots (May {selectedDay ?? 4}th)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map(({ time, icon: Icon, booked }) => (
                        <button
                          key={time}
                          disabled={booked}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "px-3 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all",
                            booked ? "opacity-30 cursor-not-allowed bg-muted/20 border border-border/20" :
                            selectedTime === time ? "bg-primary text-white shadow-md shadow-primary/30 border border-primary" :
                            "bg-muted/20 border border-border/40 hover:border-primary/50"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {time}
                          {booked && <span className="text-xs ml-1">(Full)</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Visit type */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">Select Visit Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {VISIT_TYPES.map(({ id, label, desc, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setVisitType(id)}
                        className={cn(
                          "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 text-center transition-all",
                          visitType === id
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                            : "border-border/40 bg-muted/10 hover:bg-muted/30"
                        )}
                      >
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center",
                          visitType === id ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground"
                        )}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="font-semibold">{label}</p>
                          <p className="text-muted-foreground text-sm mt-0.5">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Notes */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Add Notes</h3>
                  <p className="text-muted-foreground text-sm mb-6">Describe your symptoms or concerns to help the doctor prepare.</p>
                  <Textarea
                    placeholder="Describe your main concerns, symptoms, or questions for the doctor..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                    className="rounded-xl bg-white/5 border-white/10 focus:border-primary resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">This information is confidential and only visible to your doctor.</p>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Confirm Appointment
                  </h3>
                  <div className="space-y-3 mb-8">
                    {[
                      { label: "Doctor", value: "Dr. Adrian Stone" },
                      { label: "Date", value: `May ${selectedDay ?? 4}, 2025` },
                      { label: "Time", value: selectedTime ?? "10:30 AM" },
                      { label: "Visit Type", value: visitType === "video" ? "Video Call" : "In-Person" },
                      { label: "Duration", value: "45 minutes" },
                      { label: "Consultation Fee", value: "$150.00" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center p-4 rounded-xl bg-muted/20 border border-border/30">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 text-sm text-muted-foreground">
                    By confirming, you agree to DocTime&apos;s cancellation policy. Free cancellation up to 24 hours before the appointment.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-border/30 pt-6">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-default"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-semibold">Back</span>
                </button>
                {step < STEPS.length - 1 ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    className="rounded-xl px-8 py-5 bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all group"
                  >
                    Continue to Step {step + 2}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleConfirm}
                    className="rounded-xl px-8 py-5 bg-gradient-to-r from-primary to-secondary font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                  >
                    Confirm Booking
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
