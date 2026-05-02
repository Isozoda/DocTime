import type { User } from "./user";
import type { Doctor } from "./doctor";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  patient: Pick<User, "id" | "name" | "email" | "phone" | "avatar">;
  doctor: Pick<Doctor, "id" | "specialization" | "city" | "photoUrl"> & {
    user: Pick<User, "id" | "name" | "email" | "phone">;
  };
}

export interface BookAppointmentPayload {
  doctorId: string;
  date: string;
  notes?: string;
}
