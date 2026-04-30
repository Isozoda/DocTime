"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Appointment } from "@/types/appointment";
import { useAppointmentStore } from "@/store/appointmentStore";
import { toast } from "sonner";

export function usePatientAppointments() {
  const { appointments, setAppointments, updateAppointment } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: Appointment[] }>("/appointments/my");
      setAppointments(data.data);
    } finally {
      setIsLoading(false);
    }
  }, [setAppointments]);

  const cancel = useCallback(
    async (id: string) => {
      await api.patch(`/appointments/${id}/cancel`);
      updateAppointment(id, { status: "cancelled" });
      toast.success("Appointment cancelled");
    },
    [updateAppointment]
  );

  useEffect(() => { fetch(); }, [fetch]);

  return { appointments, isLoading, cancel, refetch: fetch };
}

export function useDoctorAppointments() {
  const { appointments, setAppointments, updateAppointment } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: Appointment[] }>("/appointments/doctor");
      setAppointments(data.data);
    } finally {
      setIsLoading(false);
    }
  }, [setAppointments]);

  const confirm = useCallback(
    async (id: string) => {
      await api.patch(`/appointments/${id}/confirm`);
      updateAppointment(id, { status: "confirmed" });
      toast.success("Appointment confirmed");
    },
    [updateAppointment]
  );

  const cancel = useCallback(
    async (id: string) => {
      await api.patch(`/appointments/${id}/cancel`);
      updateAppointment(id, { status: "cancelled" });
      toast.success("Appointment cancelled");
    },
    [updateAppointment]
  );

  useEffect(() => { fetch(); }, [fetch]);

  return { appointments, isLoading, confirm, cancel, refetch: fetch };
}
