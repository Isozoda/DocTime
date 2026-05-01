import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/navigation";
import {
  Star, ShieldCheck, CalendarDays, Award,
  Globe, Clock, ArrowRight, Heart, Activity, Clipboard,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

const STATS = [
  { label: "Successful Surgeries", value: "5k+", color: "text-primary" },
  { label: "Success Rate", value: "98%", color: "text-secondary" },
  { label: "Medical Awards", value: "12", color: "text-[--tertiary]" },
  { label: "Avg. Patient Rating", value: "4.9", color: "text-foreground" },
];

const SPECIALTIES = [
  { name: "Robotic Cardiac Surgery", desc: "Ultra-precision valve repair and bypass.", icon: Heart, color: "text-primary", bg: "bg-primary/10" },
  { name: "Aortic Aneurysm Repair", desc: "Endovascular and hybrid interventions.", icon: Activity, color: "text-secondary", bg: "bg-secondary/10" },
  { name: "Structural Heart Disease", desc: "Minimally invasive TAVI and Mitraclip.", icon: Clipboard, color: "text-[--tertiary]", bg: "bg-[--tertiary]/10" },
];

const REVIEWS = [
  { initials: "MB", name: "Marcus Bennett", time: "2 weeks ago", rating: 5, color: "text-primary", review: "Dr. Jenkins explained my valve procedure with such clarity that I felt immediate peace of mind. The results were life-changing." },
  { initials: "AL", name: "Amara Lawson", time: "1 month ago", rating: 5, color: "text-secondary", review: "Truly a pioneer. The technology she used for my bypass surgery meant I was home in three days instead of ten. Brilliant doctor." },
  { initials: "RD", name: "Robert Davis", time: "2 months ago", rating: 4, color: "text-[--tertiary]", review: "Expert care and professional staff. Dr. Jenkins is busy but worth every minute. She saved my father's life." },
];

const AVAILABILITY = [
  { day: "Tomorrow", date: "Oct 24, 2023", time: "09:00 AM", active: true },
  { day: "Wednesday", date: "Oct 25, 2023", time: "11:30 AM", active: false },
];

export default async function DoctorProfilePage({ params }: Props) {
  const { id } = await params;
  void id;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          <div className="lg:col-span-8 glass-card rounded-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="p-8 sm:p-12 flex flex-col sm:flex-row gap-8 items-center">
              <div className="relative shrink-0">
                <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                  <Image src="/placeholder.svg" alt="Doctor" width={160} height={160} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <ShieldCheck className="h-3 w-3" /> VERIFIED
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-1">Dr. Sarah Jenkins</h1>
                <p className="text-primary font-semibold text-lg mb-4">Senior Consultant, Cardiovascular Surgery</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Star className="h-4 w-4 text-secondary fill-secondary" />
                    <span className="font-bold">4.9</span>
                    <span className="text-muted-foreground text-xs">(1,240 Reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Award className="h-4 w-4 text-secondary" />
                    <span className="font-bold">15+ Yrs</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Globe className="h-4 w-4 text-secondary" />
                    <span className="font-bold">EN, ES, FR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking panel */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-8 flex flex-col justify-between border border-primary/20 bg-primary/5">
            <div>
              <h3 className="font-semibold mb-4">Next Availability</h3>
              <div className="space-y-3">
                {AVAILABILITY.map((slot) => (
                  <div
                    key={slot.day}
                    className={`flex justify-between items-center p-4 rounded-xl border transition-opacity ${
                      slot.active ? "bg-white/5 border-white/10" : "opacity-50 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-bold text-sm">{slot.day}</p>
                        <p className="text-muted-foreground text-xs">{slot.date}</p>
                      </div>
                    </div>
                    <p className={`font-bold text-sm ${slot.active ? "text-secondary" : "text-foreground"}`}>{slot.time}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/book-appointment" className="block mt-6">
              <Button className="w-full rounded-xl py-6 font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Bio */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-8">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Biography
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Dr. Sarah Jenkins is an internationally recognized leader in minimally invasive cardiovascular surgery.
              With over 15 years of experience at the world&apos;s most prestigious clinics, she has pioneered techniques
              that reduce recovery time for patients by up to 40%.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Her approach combines surgical precision with a deep commitment to personalized patient care. Dr. Jenkins
              believes that technology should serve to enhance the human connection between doctor and patient, ensuring
              clarity and transparency throughout the healing journey.
            </p>
          </div>

          {/* Specialties */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-8">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Specialties
            </h2>
            <div className="space-y-3">
              {SPECIALTIES.map(({ name, desc, icon: Icon, color, bg }) => (
                <div key={name} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                  <div className={`${bg} p-2 rounded-lg shrink-0`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{name}</h4>
                    <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ label, value, color }) => (
              <div key={label} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <span className={`text-4xl font-bold ${color} mb-1`}>{value}</span>
                <span className="text-muted-foreground text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="lg:col-span-12 glass-card rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Patient Testimonials
              </h2>
              <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REVIEWS.map(({ initials, name, time, rating, color, review }) => (
                <div key={name} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${color} font-bold text-sm`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{name}</p>
                        <p className="text-muted-foreground text-xs">{time}</p>
                      </div>
                    </div>
                    <div className="flex text-secondary">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm italic">&ldquo;{review}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
