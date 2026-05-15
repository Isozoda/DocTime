"use client";

import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { create } from "zustand";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { AIChatWidget } from "@/components/ui/AIChatWidget";
import {
  Search, MapPin, Star, X, Building2, ChevronRight,
  Phone, Users, ExternalLink, Navigation,
} from "lucide-react";
import { Link } from "@/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://doctime-backend-jqbp.onrender.com/api";

/* ─── Types ─── */
interface HospSpec { id: string; name: string; slug: string; color: string | null }
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
  specializations: HospSpec[];
}

/* ─── Geo constants ─── */
const CITY_CENTERS: Record<string, [number, number]> = {
  All:      [38.86, 69.30],   // zoom-out center (country view)
  Dushanbe: [38.560, 68.786],
  Khujand:  [40.290, 70.143],
  Bokhtar:  [37.831, 68.779],
};

const CITY_ZOOMS: Record<string, number> = {
  All: 7, Dushanbe: 13, Khujand: 13, Bokhtar: 13,
};

// Approximate city boundary boxes (used for darkening overlay)
const CITY_POLYGONS: Record<string, [number, number][]> = {
  Dushanbe: [
    [38.490, 68.670], [38.490, 68.900],
    [38.640, 68.900], [38.640, 68.670],
  ],
  Khujand: [
    [40.220, 70.060], [40.220, 70.220],
    [40.365, 70.220], [40.365, 70.060],
  ],
  Bokhtar: [
    [37.755, 68.680], [37.755, 68.880],
    [37.905, 68.880], [37.905, 68.680],
  ],
};

const CITIES = ["All", "Dushanbe", "Khujand", "Bokhtar"];

/* ─── Zustand store ─── */
interface MapState {
  selectedId: string | null;
  cityFilter: string;
  searchQuery: string;
  setSelectedId: (id: string | null) => void;
  setCityFilter: (city: string) => void;
  setSearchQuery: (q: string) => void;
}

const useMapStore = create<MapState>((set) => ({
  selectedId: null,
  cityFilter: "All",
  searchQuery: "",
  setSelectedId: (id) => set({ selectedId: id }),
  setCityFilter: (city) => set({ cityFilter: city }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));

/* ─── Helpers ─── */
function idOffset(id: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0;
  return ((h % 600) - 300) / 100000; // ±0.003° ≈ ±330 m
}

function hospitalPin(h: Hospital): [number, number] {
  const c = CITY_CENTERS[h.city] ?? CITY_CENTERS.Dushanbe;
  return [c[0] + idOffset(h.id, 1), c[1] + idOffset(h.id, 2)];
}

/* ─── Marker HTML builder ─── */
function buildMarkerHtml(hosp: Hospital, isSelected: boolean): string {
  const accent = isSelected ? "#8B5CF6" : "#6366F1";
  const bg     = isSelected
    ? "linear-gradient(135deg,#6D28D9,#8B5CF6)"
    : "linear-gradient(135deg,#3730A3,#6366F1)";
  const shadow = isSelected
    ? "0 6px 24px rgba(139,92,246,0.70)"
    : "0 4px 16px rgba(99,102,241,0.50)";
  const ring   = isSelected
    ? `<div style="position:absolute;inset:-6px;border-radius:16px;border:2px solid rgba(139,92,246,0.55);animation:pulse-ring 1.6s ease-out infinite"></div>
       <div style="position:absolute;inset:-12px;border-radius:20px;border:1px solid rgba(139,92,246,0.25);animation:pulse-ring 1.6s ease-out 0.4s infinite"></div>`
    : "";
  const badge  = hosp.doctorCount > 0
    ? `<div style="position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;padding:0 3px;background:#6366F1;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:white;border:2px solid #050812;letter-spacing:-0.3px">${hosp.doctorCount}</div>`
    : "";
  return `
    <div style="position:relative;width:48px;height:48px;cursor:pointer">
      ${ring}
      <div style="position:absolute;inset:0;border-radius:13px;background:${bg};display:flex;align-items:center;justify-content:center;box-shadow:${shadow};border:2px solid rgba(255,255,255,0.18);transition:all 0.2s">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      ${badge}
    </div>`;
}

/* ─── Main component ─── */
export default function MapPage() {
  const t = useTranslations("map");
  const { selectedId, cityFilter, searchQuery, setSelectedId, setCityFilter, setSearchQuery } = useMapStore();

  /* refs */
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInst     = useRef<any>(null);
  const markersRef  = useRef<Map<string, any>>(new Map());
  const overlayRef  = useRef<{ remove: () => void } | null>(null);
  const cardRefs    = useRef<Map<string, HTMLDivElement>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  /* data */
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading,   setLoading]   = useState(true);

  const selectedHospital = hospitals.find((h) => h.id === selectedId) ?? null;

  /* fetch */
  useEffect(() => {
    fetch(`${API_URL}/hospitals`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json) => setHospitals(json?.data ?? []))
      .catch((e) => { console.error("[MapPage]", e.message); setHospitals([]); })
      .finally(() => setLoading(false));
  }, []);

  /* filtered list */
  const filtered = hospitals.filter((h) => {
    if (cityFilter !== "All" && h.city !== cityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!h.name.toLowerCase().includes(q) && !h.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  /* ── Init Leaflet once ── */
  useEffect(() => {
    if (!mapRef.current || mapInst.current) return;

    // Cancelled flag prevents the async import from racing with cleanup
    // (React Strict Mode fires effects twice in dev; the first import() resolves
    // after cleanup has already nulled mapInst, causing a double-init error)
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || mapInst.current) return;
      // Belt-and-suspenders: Leaflet marks containers with _leaflet_id
      if ((mapRef.current as any)._leaflet_id) return;

      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      const map = L.default.map(mapRef.current, {
        center: [38.86, 69.30],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });
      L.default.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);
      L.default.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
      L.default.control.zoom({ position: "bottomright" }).addTo(map);
      map.on("click", () => setSelectedId(null));
      mapInst.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      if (mapInst.current) {
        mapInst.current.remove();
        mapInst.current = null;
        setMapReady(false);
      }
    };
  }, []);

  /* ── Draw markers ── */
  const drawMarkers = useCallback((L: any, hosps: Hospital[], selId: string | null) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    hosps.forEach((hosp) => {
      const [lat, lng] = hospitalPin(hosp);
      const isSelected = hosp.id === selId;
      const el = document.createElement("div");
      el.innerHTML = buildMarkerHtml(hosp, isSelected);
      const icon = L.divIcon({ html: el, className: "", iconSize: [48, 48], iconAnchor: [24, 24] });
      const marker = L.marker([lat, lng], { icon, zIndexOffset: isSelected ? 1000 : 0 })
        .addTo(mapInst.current);
      marker.on("click", (e: any) => {
        e.originalEvent.stopPropagation();
        setSelectedId(hosp.id);
        mapInst.current?.flyTo([lat, lng], 15, { duration: 1.2 });
        setTimeout(() => {
          cardRefs.current.get(hosp.id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);
      });
      markersRef.current.set(hosp.id, marker);
    });
  }, [setSelectedId]);

  useEffect(() => {
    if (!mapReady || !mapInst.current) return;
    import("leaflet").then((L) => drawMarkers(L.default, filtered, selectedId));
  }, [filtered, selectedId, drawMarkers, mapReady]);

  /* ── City polygon overlay (darken outside) ── */
  const applyOverlay = useCallback((L: any, city: string) => {
    overlayRef.current?.remove();
    overlayRef.current = null;
    if (city === "All" || !CITY_POLYGONS[city]) return;

    const poly = CITY_POLYGONS[city];
    const world: [number, number][] = [[-90, -180], [-90, 180], [90, 180], [90, -180]];

    const shadow = L.polygon([world, poly], {
      color: "transparent",
      fillColor: "#050812",
      fillOpacity: 0.65,
      interactive: false,
    }).addTo(mapInst.current);

    const border = L.polygon(poly, {
      color: "#8B5CF6",
      weight: 2.5,
      opacity: 0.85,
      fillOpacity: 0,
      interactive: false,
      dashArray: "8, 5",
    }).addTo(mapInst.current);

    // Animated glow ring — draw a slightly larger polygon with low opacity
    const glow = L.polygon(poly, {
      color: "#a78bfa",
      weight: 8,
      opacity: 0.12,
      fillOpacity: 0,
      interactive: false,
    }).addTo(mapInst.current);

    overlayRef.current = { remove: () => { shadow.remove(); border.remove(); glow.remove(); } };
  }, []);

  /* ── City change ── */
  const handleCityChange = useCallback((city: string) => {
    setCityFilter(city);
    const center = CITY_CENTERS[city];
    mapInst.current?.flyTo(center, CITY_ZOOMS[city] ?? 7, { duration: 1.5 });
    if (mapReady) import("leaflet").then((L) => applyOverlay(L.default, city));
  }, [mapReady, setCityFilter, applyOverlay]);

  /* ── Sidebar hospital click ── */
  const handleCardClick = useCallback((hosp: Hospital) => {
    setSelectedId(hosp.id);
    const [lat, lng] = hospitalPin(hosp);
    mapInst.current?.flyTo([lat, lng], 15, { duration: 1.2 });
  }, [setSelectedId]);

  /* ─── Render ─── */
  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.75); opacity: 0.9; }
          100% { transform: scale(1.70); opacity: 0; }
        }
        .leaflet-container { background: #050812 !important; }
        .leaflet-attribution-flag { display: none !important; }
        .leaflet-control-attribution {
          background: rgba(5,8,18,0.88) !important;
          color: #475569 !important;
          font-size: 10px !important;
          border-radius: 6px !important;
          padding: 2px 7px !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
        }
        .leaflet-control-attribution a { color: #6366F1 !important; }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: none !important;
          margin-bottom: 10px !important;
          margin-right: 10px !important;
        }
        .leaflet-control-zoom a {
          background: rgba(9,15,31,0.94) !important;
          border: 1px solid rgba(255,255,255,0.09) !important;
          color: #94A3B8 !important;
          width: 36px !important; height: 36px !important;
          line-height: 34px !important;
          border-radius: 10px !important;
          margin-bottom: 4px !important;
          font-size: 18px !important;
          font-weight: 300 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(99,102,241,0.20) !important;
          color: #a78bfa !important;
          border-color: rgba(99,102,241,0.35) !important;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.22); border-radius: 3px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex flex-col h-screen" style={{ background: "#050812" }}>
        <Header />

        <div className="flex flex-1 overflow-hidden">

          {/* ══════════ Sidebar ══════════ */}
          <div
            className="w-[380px] shrink-0 flex flex-col z-10 relative"
            style={{
              background: "rgba(6,10,22,0.99)",
              borderRight: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Search bar */}
            <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "#6366F1" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#F1F5F9",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.50)")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#475569" }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* City pills */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                {CITIES.map((city, i) => (
                  <motion.button
                    key={city}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => handleCityChange(city)}
                    className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                    style={
                      cityFilter === city
                        ? {
                            background: "rgba(99,102,241,0.20)",
                            border: "1px solid rgba(99,102,241,0.50)",
                            color: "#a78bfa",
                            boxShadow: "0 0 12px rgba(99,102,241,0.20)",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "#94A3B8",
                          }
                    }
                  >
                    {city === "All" ? t("allCities") : city}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Count row */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-2.5 border-b flex items-center justify-between"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <p className="text-xs font-medium" style={{ color: "#475569" }}>
                  <span className="text-white font-semibold">{filtered.length}</span>
                  {" "}{t("clinics")}
                </p>
                {cityFilter !== "All" && (
                  <motion.button
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleCityChange("All")}
                    className="text-xs flex items-center gap-1 transition-colors"
                    style={{ color: "#6366F1" }}
                    whileHover={{ color: "#a78bfa" } as any}
                  >
                    <X className="h-3 w-3" />
                    {t("clearFilter")}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Hospital list */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-2">
                {loading ? (
                  /* skeleton */
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-2xl animate-pulse"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="h-14 w-14 rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
                      <div className="flex-1 space-y-2 pt-0.5">
                        <div className="h-3 w-36 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                        <div className="h-2.5 w-28 rounded" style={{ background: "rgba(255,255,255,0.035)" }} />
                        <div className="h-2 w-20 rounded" style={{ background: "rgba(255,255,255,0.025)" }} />
                      </div>
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-14"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}
                    >
                      <Building2 className="h-7 w-7" style={{ color: "#334155" }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: "#475569" }}>{t("noResults")}</p>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filtered.map((hosp, i) => (
                      <motion.div
                        key={hosp.id}
                        ref={(el) => { if (el) cardRefs.current.set(hosp.id, el); }}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ delay: Math.min(i * 0.04, 0.25), type: "spring", stiffness: 300, damping: 28 }}
                        layout
                      >
                        <button
                          onClick={() => handleCardClick(hosp)}
                          className="w-full text-left flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 group"
                          style={
                            selectedId === hosp.id
                              ? {
                                  background: "rgba(99,102,241,0.12)",
                                  border: "1px solid rgba(99,102,241,0.32)",
                                  boxShadow: "0 0 0 1px rgba(99,102,241,0.08) inset",
                                }
                              : {
                                  background: "rgba(255,255,255,0.025)",
                                  border: "1px solid rgba(255,255,255,0.05)",
                                }
                          }
                          onMouseEnter={(e) => {
                            if (selectedId !== hosp.id)
                              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            if (selectedId !== hosp.id)
                              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                          }}
                        >
                          {/* Thumbnail */}
                          <div
                            className="h-14 w-14 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                            style={{
                              background: selectedId === hosp.id
                                ? "rgba(99,102,241,0.15)"
                                : "rgba(255,255,255,0.04)",
                              border: `1px solid ${selectedId === hosp.id ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.07)"}`,
                            }}
                          >
                            {hosp.imageUrl ? (
                              <img src={hosp.imageUrl} alt={hosp.name} className="h-full w-full object-cover" />
                            ) : (
                              <Building2
                                className="h-6 w-6"
                                style={{ color: selectedId === hosp.id ? "#6366F1" : "#475569" }}
                              />
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold truncate mb-0.5"
                              style={{ color: selectedId === hosp.id ? "#a78bfa" : "#F1F5F9" }}
                            >
                              {hosp.name}
                            </p>
                            <p className="text-xs truncate mb-1.5 flex items-center gap-1" style={{ color: "#475569" }}>
                              <MapPin className="h-2.5 w-2.5 shrink-0" style={{ color: "#6366F1" }} />
                              {hosp.address}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-white">{hosp.rating.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center gap-1" style={{ color: "#475569" }}>
                                <Users className="h-3 w-3" />
                                <span className="text-xs">{hosp.doctorCount}</span>
                              </div>
                              {hosp.specializations.slice(0, 2).map((s) => (
                                <span
                                  key={s.id}
                                  className="text-xs px-1.5 py-0.5 rounded-full leading-none"
                                  style={{
                                    background: `${s.color ?? "#6366F1"}18`,
                                    color: s.color ?? "#a78bfa",
                                    border: `1px solid ${s.color ?? "#6366F1"}28`,
                                  }}
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          <ChevronRight
                            className="h-4 w-4 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                            style={{ color: selectedId === hosp.id ? "#8B5CF6" : "#2D3748" }}
                          />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* ══════════ Map area ══════════ */}
          <div className="flex-1 relative overflow-hidden">
            <div ref={mapRef} className="w-full h-full" style={{ zIndex: 0 }} />

            {/* City label badge */}
            <AnimatePresence>
              {cityFilter !== "All" && (
                <motion.div
                  key={cityFilter}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(99,102,241,0.14)",
                    border: "1px solid rgba(139,92,246,0.40)",
                    backdropFilter: "blur(18px)",
                    color: "#c4b5fd",
                    boxShadow: "0 8px 32px rgba(99,102,241,0.18)",
                  }}
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold">{cityFilter}</span>
                  <button
                    onClick={() => handleCityChange("All")}
                    className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected hospital popup */}
            <AnimatePresence>
              {selectedHospital && (
                <motion.div
                  key={selectedHospital.id}
                  initial={{ opacity: 0, y: 28, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 28, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute bottom-6 right-6 w-[300px] rounded-2xl overflow-hidden z-[1000]"
                  style={{
                    background: "rgba(6,10,22,0.97)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(28px)",
                    boxShadow: "0 28px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(99,102,241,0.08)",
                  }}
                >
                  {/* Close */}
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-3 right-3 z-10 h-7 w-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", color: "#94A3B8" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.13)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Image / gradient header */}
                  <div className="relative h-28 overflow-hidden">
                    {selectedHospital.imageUrl ? (
                      <img
                        src={selectedHospital.imageUrl}
                        alt={selectedHospital.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg,rgba(55,48,163,0.6) 0%,rgba(109,40,217,0.6) 100%)",
                        }}
                      >
                        <Building2 className="h-10 w-10 opacity-40" style={{ color: "#a78bfa" }} />
                      </div>
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(6,10,22,1) 0%, transparent 55%)" }}
                    />
                    {/* City pill */}
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                      style={{ background: "rgba(6,10,22,0.80)", border: "1px solid rgba(255,255,255,0.12)", color: "#94A3B8" }}
                    >
                      <MapPin className="h-2.5 w-2.5" style={{ color: "#6366F1" }} />
                      {selectedHospital.city}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 -mt-1">
                    <h3 className="font-bold text-[15px] text-white mb-1 pr-6 leading-snug">
                      {selectedHospital.name}
                    </h3>
                    <p className="text-xs flex items-start gap-1 mb-3" style={{ color: "#64748B" }}>
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "#6366F1" }} />
                      {selectedHospital.address}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-white">{selectedHospital.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: "#64748B" }}>
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-sm">{selectedHospital.doctorCount} {t("doctors")}</span>
                      </div>
                      {selectedHospital.phone && (
                        <a
                          href={`tel:${selectedHospital.phone}`}
                          className="flex items-center gap-1 ml-auto"
                          style={{ color: "#6366F1" }}
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Specialty tags */}
                    {selectedHospital.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {selectedHospital.specializations.map((s) => (
                          <span
                            key={s.id}
                            className="text-xs px-2 py-0.5 rounded-full leading-none"
                            style={{
                              background: `${s.color ?? "#6366F1"}18`,
                              color: s.color ?? "#a78bfa",
                              border: `1px solid ${s.color ?? "#6366F1"}28`,
                            }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/hospitals/${selectedHospital.id}`}
                        className="btn-primary flex-1 text-sm py-2.5 justify-center"
                        style={{ borderRadius: "10px" }}
                      >
                        <Building2 className="h-4 w-4" />
                        {t("goToClinic")}
                      </Link>
                      {selectedHospital.googleMapUrl ? (
                        <a
                          href={selectedHospital.googleMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-glass py-2.5 px-3 flex items-center gap-1.5 text-sm font-medium"
                          style={{ borderRadius: "10px" }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {t("directions")}
                        </a>
                      ) : (
                        <Link
                          href={`/doctors?hospital=${selectedHospital.id}`}
                          className="btn-glass py-2.5 px-3 text-sm font-medium"
                          style={{ borderRadius: "10px" }}
                        >
                          {t("view")}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading overlay */}
            {loading && (
              <div
                className="absolute inset-0 z-[999] flex items-center justify-center"
                style={{ background: "rgba(5,8,18,0.50)", backdropFilter: "blur(4px)" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="h-8 w-8 rounded-full border-2 border-transparent"
                  style={{ borderTopColor: "#6366F1", borderRightColor: "#6366F1" }}
                />
              </div>
            )}
          </div>
        </div>

        <AIChatWidget />
      </div>
    </>
  );
}
