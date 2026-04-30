import { create } from "zustand";
import type { Appointment } from "@/types/appointment";

interface AppointmentState {
  appointments: Appointment[];
  setAppointments: (items: Appointment[]) => void;
  addAppointment: (item: Appointment) => void;
  updateAppointment: (id: string, changes: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],

  setAppointments: (items) => set({ appointments: items }),

  addAppointment: (item) =>
    set((s) => ({ appointments: [item, ...s.appointments] })),

  updateAppointment: (id, changes) =>
    set((s) => ({
      appointments: s.appointments.map((a) =>
        a.id === id ? { ...a, ...changes } : a
      ),
    })),

  removeAppointment: (id) =>
    set((s) => ({
      appointments: s.appointments.filter((a) => a.id !== id),
    })),
}));
