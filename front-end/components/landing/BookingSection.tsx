"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  CalendarDays,
  User,
  Phone,
  Stethoscope,
  CheckCircle2,
  Loader2,
  ClockIcon,
} from "lucide-react";

const bookingSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  doctor: z.string().min(1, "Please select a doctor"),
  message: z.string().max(300, "Message is too long").optional(),
});

type BookingData = z.infer<typeof bookingSchema>;

const DOCTORS = [
  "Dr. Алексей Рустамов — Cardiologist",
  "Dr. Иноят Назаров — Neurologist",
  "Dr. Зебо Рахимова — Pediatrician",
  "Dr. Камол Мирзоев — Ophthalmologist",
  "Dr. Шахло Усмонова — Therapist",
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

type FieldName = keyof BookingData;

interface Field {
  name: FieldName;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ElementType;
  options?: string[];
}

const FIELDS: Field[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Your full name",
    icon: User,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+992 XX XXX XX XX",
    icon: Phone,
  },
  {
    name: "doctor",
    label: "Select Doctor",
    type: "select",
    placeholder: "Choose a specialist",
    icon: Stethoscope,
    options: DOCTORS,
  },
  {
    name: "date",
    label: "Preferred Date",
    type: "date",
    placeholder: "",
    icon: CalendarDays,
  },
  {
    name: "time",
    label: "Preferred Time",
    type: "select",
    placeholder: "Choose a time slot",
    icon: ClockIcon,
    options: TIME_SLOTS,
  },
];

function FormField({
  field,
  register,
  error,
}: {
  field: Field;
  register: ReturnType<typeof useForm<BookingData>>["register"];
  error?: string;
}) {
  const Icon = field.icon;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={field.name}
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {field.label}
      </label>

      <div className="relative">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden
        >
          <Icon className="h-4 w-4" style={{ color: "rgba(0,212,255,0.7)" }} />
        </div>

        {field.type === "select" ? (
          <select
            id={field.name}
            {...register(field.name)}
            className="neon-input w-full h-13 pl-11 pr-4 rounded-xl text-sm appearance-none"
            style={{ height: "3.25rem" }}
            aria-describedby={error ? `${field.name}-error` : undefined}
          >
            <option value="" style={{ background: "#0a0a1a" }}>
              {field.placeholder}
            </option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt} style={{ background: "#0a0a1a" }}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type={field.type}
            {...register(field.name)}
            placeholder={field.placeholder}
            className="neon-input w-full h-13 pl-11 pr-4 rounded-xl text-sm"
            style={{ height: "3.25rem" }}
            aria-describedby={error ? `${field.name}-error` : undefined}
          />
        )}
      </div>

      {error && (
        <p
          id={`${field.name}-error`}
          className="text-xs mt-0.5"
          style={{ color: "#ff6b6b" }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function BookingSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingData>({ resolver: zodResolver(bookingSchema) });

  const onSubmit = async (data: BookingData) => {
    await new Promise((r) => setTimeout(r, 1500));
    console.info("Booking submitted:", data);
    setSubmitted(true);
  };

  return (
    <section
      id="booking"
      className="relative py-28 px-6 lg:px-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050510 0%, #080820 100%)" }}
      aria-labelledby="booking-heading"
    >
      {/* Orbs */}
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.28)",
              color: "#00d4ff",
            }}
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Schedule Visit
          </div>

          <h2
            id="booking-heading"
            className="text-4xl lg:text-5xl font-black text-white font-orbitron mb-4"
          >
            Book Your{" "}
            <span className="gradient-text-space">Appointment</span>
          </h2>

          <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            Fill in your details and we will confirm your slot within 30 minutes.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-space rounded-3xl p-8 lg:p-10"
          style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,212,255,0.06)" }}
        >
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12">
              <div
                className="h-20 w-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: "rgba(0,255,136,0.12)",
                  border: "2px solid rgba(0,255,136,0.4)",
                  boxShadow: "0 0 40px rgba(0,255,136,0.2)",
                }}
              >
                <CheckCircle2 className="h-10 w-10" style={{ color: "#00ff88" }} />
              </div>
              <h3 className="text-2xl font-black text-white font-orbitron mb-3">
                Appointment Confirmed!
              </h3>
              <p className="text-base max-w-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                We have received your booking request. Our team will contact you
                within 30 minutes to confirm the exact time.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 neon-btn-outline px-7 py-3 rounded-xl text-sm font-semibold"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {FIELDS.map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    register={register}
                    error={errors[field.name]?.message}
                  />
                ))}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 mb-8">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Additional Notes{" "}
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>(optional)</span>
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={3}
                  placeholder="Describe your symptoms or any relevant information..."
                  className="neon-input w-full px-4 py-3.5 rounded-xl text-sm resize-none"
                />
                {errors.message && (
                  <p className="text-xs" style={{ color: "#ff6b6b" }} role="alert">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="neon-btn-blue w-full h-14 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CalendarDays className="h-5 w-5" aria-hidden />
                    Confirm Appointment
                  </>
                )}
              </button>

              <p className="text-xs text-center mt-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                By submitting you agree to our Privacy Policy. We never share your data.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
