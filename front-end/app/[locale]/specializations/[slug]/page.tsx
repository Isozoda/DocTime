"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/StarRating";
import {
  Brain, Heart, Baby, Eye, Bone, Activity, Stethoscope, Smile,
  Droplets, Scan, Ear, MapPin, Phone, Instagram, Building2, ArrowLeft, Users,
} from "lucide-react";
import { Link } from "@/navigation";
import api from "@/lib/axios";

interface Specialization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

interface DoctorUser { id: string; name: string; email: string; phone: string | null }
interface Doctor {
  id: string;
  specialization: string;
  city: string;
  rating: number;
  experience: number;
  bio: string | null;
  instagram: string | null;
  phone: string | null;
  user: DoctorUser;
}

interface HospitalSpecialization { name: string; slug: string; color: string | null }
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
  specializations: HospitalSpecialization[];
  doctors: { id: string; doctor: { id: string; specialization: string; rating: number; user: { name: string } } }[];
}

interface SpecDetail extends Specialization {
  doctors: Doctor[];
  hospitals: Hospital[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  smile: Smile, heart: Heart, brain: Brain, baby: Baby, eye: Eye,
  activity: Activity, droplets: Droplets, scan: Scan, ear: Ear,
  stethoscope: Stethoscope, bone: Bone, stomach: Stethoscope, mind: Brain,
};

const HOSPITAL_IMAGES = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80",
  "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&q=80",
];

export default function SpecializationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [data, setData] = useState<SpecDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get<{ success: boolean; data: SpecDetail }>(`/specializations/${slug}`)
      .then(({ data: res }) => setData(res.data))
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const Icon = data ? (ICON_MAP[data.icon ?? ""] ?? Stethoscope) : Stethoscope;
  const color = data?.color ?? "#6366F1";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {isLoading ? (
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="h-48 rounded-2xl bg-muted animate-pulse mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : notFound || !data ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <Stethoscope className="h-14 w-14 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Специализация не найдена</h2>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />На главную</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Hero banner */}
            <section
              className="py-14 px-4"
              style={{ background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)` }}
            >
              <div className="container mx-auto max-w-5xl">
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> На главную
                </Link>
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div
                    className="h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{ background: `${color}22`, border: `2px solid ${color}44` }}
                  >
                    <Icon style={{ width: 40, height: 40, color }} />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{data.name}</h1>
                    {data.description && (
                      <p className="text-muted-foreground max-w-2xl">{data.description}</p>
                    )}
                    <div className="flex gap-3 mt-4 flex-wrap">
                      <Badge variant="secondary" className="gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {data.doctors.length} врачей
                      </Badge>
                      <Badge variant="secondary" className="gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> {data.hospitals.length} клиник
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Doctors */}
            <section className="py-12 px-4">
              <div className="container mx-auto max-w-5xl">
                <h2 className="text-2xl font-bold mb-6">Специалисты</h2>
                {data.doctors.length === 0 ? (
                  <p className="text-muted-foreground">Врачи пока не добавлены.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.doctors.map((doc) => (
                      <DoctorCard key={doc.id} doctor={doc as any} />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Hospitals */}
            {data.hospitals.length > 0 && (
              <section className="py-12 px-4 bg-muted/30">
                <div className="container mx-auto max-w-5xl">
                  <h2 className="text-2xl font-bold mb-6">Клиники и больницы</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.hospitals.map((hosp, i) => (
                      <Card key={hosp.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-36 bg-muted overflow-hidden">
                          <img
                            src={hosp.imageUrl ?? HOSPITAL_IMAGES[i % HOSPITAL_IMAGES.length]}
                            alt={hosp.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold leading-tight text-sm">{hosp.name}</h3>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">{hosp.address}</span>
                          </div>
                          {hosp.rating > 0 && <StarRating rating={hosp.rating} size={12} className="mt-2" />}
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {hosp.phone && (
                              <a
                                href={`tel:${hosp.phone}`}
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <Phone className="h-3 w-3" /> {hosp.phone}
                              </a>
                            )}
                            {hosp.instagram && (
                              <a
                                href={`https://instagram.com/${hosp.instagram}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-pink-500 hover:underline"
                              >
                                <Instagram className="h-3 w-3" /> @{hosp.instagram}
                              </a>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            {hosp.googleMapUrl && (
                              <Button size="sm" variant="outline" className="flex-1 text-xs h-8" asChild>
                                <a href={hosp.googleMapUrl} target="_blank" rel="noreferrer">
                                  <MapPin className="h-3 w-3 mr-1" /> Карта
                                </a>
                              </Button>
                            )}
                            <Button size="sm" className="flex-1 text-xs h-8" asChild>
                              <Link href={`/hospitals/${hosp.id}`}>Подробнее</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
