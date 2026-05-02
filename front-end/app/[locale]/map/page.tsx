"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { AIChatWidget } from "@/components/ui/AIChatWidget";
import { Search, MapPin, Star, X, Phone, CalendarDays, ChevronRight, Filter } from "lucide-react";
import { Link } from "@/navigation";

const DOCTOR_PINS = [
  { id: "p1", name: "Dr. Sarah Mitchell", spec: "Cardiologist", city: "Dushanbe", lat: 38.562, lng: 68.788, rating: 4.9, price: "120", online: true, photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80" },
  { id: "p2", name: "Dr. Kamol Nazarov", spec: "Neurologist", city: "Dushanbe", lat: 38.555, lng: 68.802, rating: 4.8, price: "100", online: false, photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80" },
  { id: "p3", name: "Dr. Lena Rakhimova", spec: "Pediatrician", city: "Dushanbe", lat: 38.572, lng: 68.775, rating: 5.0, price: "90", online: true, photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80" },
  { id: "p4", name: "Dr. Timur Rashidov", spec: "Dermatologist", city: "Dushanbe", lat: 38.548, lng: 68.815, rating: 4.8, price: "85", online: true, photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80" },
  { id: "p5", name: "Dr. Nilufar Odinaeva", spec: "Gynecologist", city: "Dushanbe", lat: 38.568, lng: 68.760, rating: 4.9, price: "95", online: true, photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80" },
  { id: "p6", name: "Dr. Aleksei Petrov", spec: "Orthopedist", city: "Dushanbe", lat: 38.580, lng: 68.794, rating: 4.7, price: "110", online: false, photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80" },
  { id: "p7", name: "Dr. Elena Koroleva", spec: "Ophthalmologist", city: "Dushanbe", lat: 38.558, lng: 68.830, rating: 4.9, price: "105", online: true, photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80" },
  { id: "p8", name: "Dr. Bahodir Yusupov", spec: "ENT", city: "Dushanbe", lat: 38.542, lng: 68.778, rating: 4.7, price: "80", online: true, photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80" },
  { id: "p9", name: "Dr. Gulnora Hasanova", spec: "Cardiologist", city: "Khujand", lat: 40.293, lng: 70.148, rating: 4.8, price: "115", online: true, photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80" },
  { id: "p10", name: "Dr. Mirzo Tursunov", spec: "Neurologist", city: "Khujand", lat: 40.285, lng: 70.155, rating: 4.6, price: "95", online: false, photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80" },
  { id: "p11", name: "Dr. Shoira Nazarova", spec: "Pediatrician", city: "Khujand", lat: 40.298, lng: 70.140, rating: 4.9, price: "88", online: true, photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80" },
  { id: "p12", name: "Dr. Farrukh Karimov", spec: "Dentist", city: "Bokhtar", lat: 37.831, lng: 68.780, rating: 4.7, price: "75", online: true, photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80" },
  { id: "p13", name: "Dr. Maftuna Aliyeva", spec: "Dermatologist", city: "Bokhtar", lat: 37.838, lng: 68.792, rating: 4.8, price: "82", online: false, photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80" },
];

const CITIES_MAP = [
  { label: "All", center: [68.786, 38.560], zoom: 7 },
  { label: "Dushanbe", center: [68.786, 38.560], zoom: 12 },
  { label: "Khujand", center: [70.143, 40.290], zoom: 12 },
  { label: "Bokhtar", center: [68.779, 37.831], zoom: 13 },
];

const SPECIALTIES_FILTER = ["All", "Cardiologist", "Neurologist", "Pediatrician", "Dermatologist", "Dentist", "Gynecologist", "ENT", "Orthopedist", "Ophthalmologist"];

type DoctorPin = typeof DOCTOR_PINS[0];

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorPin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [specFilter, setSpecFilter] = useState("All");
  const [mapLoaded, setMapLoaded] = useState(false);

  const filteredDoctors = DOCTOR_PINS.filter((d) => {
    const matchesCity = cityFilter === "All" || d.city === cityFilter;
    const matchesSpec = specFilter === "All" || d.spec === specFilter;
    const matchesSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.spec.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSpec && matchesSearch;
  });

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapRef.current || mapInstanceRef.current) return;

    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = token;
      const map = new mapboxgl.default.Map({
        container: mapRef.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [68.786, 38.560],
        zoom: 7,
        pitch: 45,
        bearing: -10,
        antialias: true,
      });

      map.on("load", () => {
        setMapLoaded(true);
        addMarkers(map, mapboxgl.default, DOCTOR_PINS);
      });

      mapInstanceRef.current = map;
    }).catch(() => setMapLoaded(false));

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  function addMarkers(map: any, mapboxgl: any, doctors: DoctorPin[]) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    doctors.forEach((doc) => {
      const el = document.createElement("div");
      el.className = "map-marker";
      el.innerHTML = `
        <div style="position:relative;width:44px;height:44px;cursor:pointer">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(99,102,241,0.15);border:2px solid #6366F1;animation:pulse-ring 2s ease-out infinite"></div>
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(99,102,241,0.15);border:2px solid #6366F1;animation:pulse-ring 2s ease-out infinite 0.8s"></div>
          <div style="position:absolute;inset:50%;transform:translate(-50%,-50%);width:20px;height:20px;border-radius:50%;background:#6366F1;display:flex;align-items:center;justify-content:center">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="white"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z"/></svg>
          </div>
        </div>
      `;
      el.addEventListener("click", () => {
        setSelectedDoctor(doc);
        map.flyTo({ center: [doc.lng, doc.lat], zoom: 14, duration: 1200 });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([doc.lng, doc.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }

  const handleCityChange = (city: string) => {
    setCityFilter(city);
    const cfg = CITIES_MAP.find((c) => c.label === city);
    if (cfg && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: cfg.center, zoom: cfg.zoom, duration: 1500 });
    }
  };

  const handleDoctorClick = (doc: DoctorPin) => {
    setSelectedDoctor(doc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [doc.lng, doc.lat], zoom: 14, duration: 1200 });
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "#050812" }}>
      <Header />

      <div className="flex flex-1 relative overflow-hidden">
        {/* ── Left Panel ── */}
        <div
          className="w-[380px] shrink-0 flex flex-col z-10 overflow-hidden"
          style={{ background: "rgba(9,15,31,0.97)", borderRight: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
        >
          {/* Search */}
          <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6366F1" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors, specialties..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#F1F5F9" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.45)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>
          </div>

          {/* Filter pills */}
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CITIES_MAP.map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleCityChange(c.label)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={cityFilter === c.label
                    ? { background: "rgba(99,102,241,0.20)", border: "1px solid rgba(99,102,241,0.45)", color: "#a78bfa" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8" }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor list */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-2">
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-10">
                  <MapPin className="h-8 w-8 mx-auto mb-2" style={{ color: "#475569" }} />
                  <p className="text-sm" style={{ color: "#475569" }}>No doctors found</p>
                </div>
              ) : filteredDoctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleDoctorClick(doc)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-2xl transition-all duration-200"
                  style={selectedDoctor?.id === doc.id
                    ? { background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.30)" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }
                  }
                  onMouseEnter={(e) => { if (selectedDoctor?.id !== doc.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { if (selectedDoctor?.id !== doc.id) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div className="relative shrink-0">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="h-11 w-11 rounded-xl object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=6366F1&color=fff&size=44&bold=true`; }}
                    />
                    {doc.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 bg-emerald-400" style={{ borderColor: "rgba(9,15,31,1)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{doc.name}</p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>{doc.spec}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-white">{doc.rating}</span>
                      <span className="text-xs" style={{ color: "#475569" }}>· {doc.city}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "#475569" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Map area ── */}
        <div className="flex-1 relative">
          {/* Filters overlay top */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2 flex-wrap">
            {SPECIALTIES_FILTER.slice(0, 6).map((s) => (
              <button
                key={s}
                onClick={() => setSpecFilter(s)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 backdrop-blur-xl"
                style={specFilter === s
                  ? { background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.50)", color: "#a78bfa" }
                  : { background: "rgba(9,15,31,0.85)", border: "1px solid rgba(255,255,255,0.10)", color: "#94A3B8" }
                }
              >
                {s}
              </button>
            ))}
          </div>

          {/* Map container */}
          <div ref={mapRef} className="w-full h-full" />

          {/* Fallback when no token */}
          {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%), #090f1f" }}
            >
              <div
                className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
              >
                <MapPin className="h-9 w-9" style={{ color: "#6366F1" }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Interactive Map</h3>
              <p className="text-sm mb-6 max-w-sm text-center" style={{ color: "#94A3B8" }}>
                Add your Mapbox token to <code className="text-indigo-400 bg-indigo-400/10 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the live doctor map
              </p>
              <div className="grid grid-cols-3 gap-3">
                {DOCTOR_PINS.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="px-4 py-3 rounded-2xl text-center" style={{ background: "rgba(13,21,38,0.80)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-sm font-semibold text-white">{doc.city}</p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>{doc.spec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected doctor popup */}
          {selectedDoctor && (
            <div
              className="absolute bottom-6 right-6 w-80 rounded-2xl overflow-hidden animate-slide-up z-10"
              style={{ background: "rgba(9,15,31,0.95)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
            >
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-3 right-3 z-10 h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                style={{ color: "#94A3B8" }}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative h-28 overflow-hidden">
                <img
                  src={selectedDoctor.photo.replace("w=80", "w=320")}
                  alt={selectedDoctor.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=6366F1&color=fff&size=320&bold=true`; }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,15,31,0.95) 0%, transparent 60%)" }} />
                {selectedDoctor.online && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#10B981" }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                    Online now
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base text-white mb-0.5">{selectedDoctor.name}</h3>
                <p className="text-sm mb-2" style={{ color: "#94A3B8" }}>{selectedDoctor.spec} · {selectedDoctor.city}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white">{selectedDoctor.rating}</span>
                  <span className="text-sm" style={{ color: "#475569" }}>· from {selectedDoctor.price} TJS</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/doctors/${selectedDoctor.id}`}
                    className="btn-primary flex-1 text-sm py-2.5 justify-center"
                    style={{ borderRadius: "10px" }}
                  >
                    <CalendarDays className="h-4 w-4" />
                    Book Now
                  </Link>
                  <Link
                    href={`/doctors/${selectedDoctor.id}`}
                    className="btn-glass py-2.5 px-3.5"
                    style={{ borderRadius: "10px" }}
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AIChatWidget />
    </div>
  );
}
