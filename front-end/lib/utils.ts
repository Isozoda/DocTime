import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, fmt = "dd MMM yyyy"): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, "dd MMM yyyy, HH:mm");
}

export function formatTime(dateStr: string): string {
  return formatDate(dateStr, "HH:mm");
}

export function avatarUrl(name: string, avatar?: string | null): string {
  if (avatar?.startsWith("/uploads/")) return `${BACKEND_URL}${avatar}`;
  if (avatar) return avatar;
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=0D9488&color=fff&size=128`;
}

const FEMALE_NAMES = new Set([
  'farida','malika','nasiba','zulfiya','maftuna','dilnoza','sabina',
  'muhabbat','barno','nilufar','dildora','aziza','shahnoza','lola',
  'mohinur','gulnora','nargiza','manzura','hulkar','shahlo','dilorom',
  'madina','kamola','sevinch','mohira','feruza','iroda','nodira',
]);

function stableHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:5000";

export function doctorPhotoUrl(name: string, photoUrl?: string | null): string {
  if (photoUrl?.startsWith("/uploads/")) return `${BACKEND_URL}${photoUrl}`;
  if (photoUrl) return photoUrl;
  // Detect gender from first name (Tajik/Uzbek name conventions)
  const firstName = name.replace(/^Dr\.\s*/i, '').split(' ')[0].toLowerCase();
  const isFemale = FEMALE_NAMES.has(firstName) ||
    (firstName.endsWith('a') && !firstName.endsWith('sha') && firstName.length > 4);
  const gender = isFemale ? 'women' : 'men';
  const n = (stableHash(name) % 70) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
}

export const SPECIALTIES = [
  "Dentist",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Ophthalmologist",
  "Gynecologist",
  "Urologist",
  "Dermatologist",
  "ENT",
  "Therapist",
  "Orthopedist",
  "Endocrinologist",
  "Psychiatrist",
  "Gastroenterologist",
] as const;

export const CITIES = [
  "Dushanbe",
  "Khujand",
  "Bokhtar",
  "Qurghonteppa",
  "Kulob",
  "Tursunzoda",
  "Isfara",
] as const;
