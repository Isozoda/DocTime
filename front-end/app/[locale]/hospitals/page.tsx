"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { StarRating } from "@/components/ui/StarRating";
import { Link } from "@/navigation";
import { MapPin, Users, Building2, Phone } from "lucide-react";
import { CITIES } from "@/lib/utils";
import api from "@/lib/axios";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface SpecTag { id: string; name: string; slug: string; color: string | null }
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
  doctorCount: number;
  specializations: SpecTag[];
}

const HOSPITAL_IMAGES = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80",
  "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&q=80",
  "https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?w=400&q=80",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80",
];

export default function HospitalsPage() {
  const t = useTranslations("hospitals");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState("");

  useEffect(() => {
    api
      .get<{ success: boolean; data: Hospital[] }>("/hospitals")
      .then(({ data }) => setHospitals(data.data))
      .catch(() => setHospitals([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = city ? hospitals.filter((h) => h.city === city) : hospitals;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <Select onValueChange={(v) => setCity(v === "all" ? "" : v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("allCities")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCities")}</SelectItem>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((hosp, i) => (
              <div key={hosp.id} className="group bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                <div className="relative h-40 bg-muted overflow-hidden shrink-0">
                  <img
                    src={hosp.imageUrl ?? HOSPITAL_IMAGES[i % HOSPITAL_IMAGES.length]}
                    alt={hosp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold leading-snug text-sm">{hosp.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{hosp.address || hosp.city}</span>
                  </div>

                  {hosp.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {hosp.specializations.slice(0, 3).map((s) => (
                        <Badge
                          key={s.id}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={s.color ? { background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` } : {}}
                        >
                          {s.name}
                        </Badge>
                      ))}
                      {hosp.specializations.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 rounded-full">
                          +{hosp.specializations.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      {hosp.doctorCount} {t("doctors")}
                    </div>
                    {hosp.rating > 0 && <StarRating rating={hosp.rating} size={12} />}
                  </div>

                  <div className="flex gap-3 mt-2">
                    {hosp.phone && (
                      <a href={`tel:${hosp.phone}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <Phone className="h-3 w-3" />
                        {hosp.phone}
                      </a>
                    )}
                    {hosp.instagram && (
                      <a
                        href={`https://instagram.com/${hosp.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-pink-500 hover:underline"
                      >
                        <InstagramIcon className="h-3 w-3" />
                        @{hosp.instagram}
                      </a>
                    )}
                  </div>

                  <div className="mt-auto pt-3">
                    <Button size="sm" className="w-full gap-2 rounded-xl shadow-sm shadow-primary/15" asChild>
                      <Link href={`/hospitals/${hosp.id}`}>Подробнее</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
