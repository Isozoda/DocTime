"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/StarRating";
import {
  MapPin, Phone, Building2, ArrowLeft, Users, Star, ExternalLink,
} from "lucide-react";
import { Link } from "@/navigation";
import api from "@/lib/axios";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface SpecTag { id: string; name: string; slug: string; color: string | null }
interface Doctor {
  id: string;
  specialization: string;
  city: string;
  rating: number;
  experience: number;
  bio: string | null;
  instagram: string | null;
  phone: string | null;
  user: { id: string; name: string; email: string; phone: string | null };
}
interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  instagram: string | null;
  googleMapUrl: string | null;
  imageUrl: string | null;
  rating: number;
  specializations: SpecTag[];
  doctors: Doctor[];
}

const HOSPITAL_IMAGES = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
];

export default function HospitalDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<{ success: boolean; data: Hospital }>(`/hospitals/${id}`)
      .then(({ data: res }) => setHospital(res.data))
      .catch((err) => { if (err?.response?.status === 404) setNotFound(true); })
      .finally(() => setIsLoading(false));
  }, [id]);

  const coverImg = hospital?.imageUrl ?? HOSPITAL_IMAGES[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {isLoading ? (
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="h-56 rounded-2xl bg-muted animate-pulse mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : notFound || !hospital ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <Building2 className="h-14 w-14 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Клиника не найдена</h2>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/hospitals"><ArrowLeft className="mr-2 h-4 w-4" />Все клиники</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cover image */}
            <div className="relative h-56 md:h-72 w-full overflow-hidden bg-muted">
              <img src={coverImg} alt={hospital.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="container mx-auto max-w-5xl">
                  <Link href="/hospitals" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-3 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Все клиники
                  </Link>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">{hospital.name}</h1>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <section className="py-8 px-4 border-b">
              <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{hospital.address}</span>
                    </div>
                    {hospital.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary shrink-0" />
                        <a href={`tel:${hospital.phone}`} className="text-primary hover:underline font-medium">
                          {hospital.phone}
                        </a>
                      </div>
                    )}
                    {hospital.instagram && (
                      <div className="flex items-center gap-2 text-sm">
                        <InstagramIcon className="h-4 w-4 text-pink-500 shrink-0" />
                        <a
                          href={`https://instagram.com/${hospital.instagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-500 hover:underline font-medium"
                        >
                          @{hospital.instagram}
                        </a>
                      </div>
                    )}

                    {/* Specializations */}
                    {hospital.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {hospital.specializations.map((s) => (
                          <Link key={s.id} href={`/specializations/${s.slug}`}>
                            <Badge
                              variant="secondary"
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                              style={s.color ? { background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` } : {}}
                            >
                              {s.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rating + stats */}
                  <div className="flex flex-col gap-4">
                    {hospital.rating > 0 && (
                      <div className="bg-muted/50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-extrabold text-primary">{hospital.rating.toFixed(1)}</div>
                        <StarRating rating={hospital.rating} className="justify-center mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">Рейтинг клиники</p>
                      </div>
                    )}
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Users className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <div className="font-bold text-lg">{hospital.doctors.length}</div>
                        <div className="text-xs text-muted-foreground">специалистов</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Map button */}
                {hospital.googleMapUrl && (
                  <div className="mt-5">
                    <Button asChild className="gap-2">
                      <a href={hospital.googleMapUrl} target="_blank" rel="noreferrer">
                        <MapPin className="h-4 w-4" />
                        Открыть на карте
                        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Google Maps embed */}
            {hospital.googleMapUrl && (() => {
              const coords = hospital.googleMapUrl.match(/q=([\d.]+),([\d.]+)/);
              if (!coords) return null;
              const [, lat, lng] = coords;
              const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
              return (
                <section className="px-4 py-6 border-b">
                  <div className="container mx-auto max-w-5xl">
                    <h2 className="text-lg font-semibold mb-3">Расположение на карте</h2>
                    <div className="rounded-xl overflow-hidden border h-64 md:h-80">
                      <iframe
                        title="map"
                        src={src}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Doctors */}
            <section className="py-10 px-4">
              <div className="container mx-auto max-w-5xl">
                <h2 className="text-2xl font-bold mb-6">
                  Врачи клиники
                  <span className="ml-3 text-base font-normal text-muted-foreground">
                    ({hospital.doctors.length})
                  </span>
                </h2>
                {hospital.doctors.length === 0 ? (
                  <p className="text-muted-foreground">Врачи пока не привязаны к этой клинике.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hospital.doctors.map((doc) => (
                      <DoctorCard key={doc.id} doctor={doc as any} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
