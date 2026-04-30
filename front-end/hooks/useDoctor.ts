"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import type { Doctor } from "@/types/doctor";

export function useDoctor(id: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api
      .get<{ success: boolean; data: Doctor }>(`/doctors/${id}`)
      .then(({ data }) => setDoctor(data.data))
      .catch(() => setError("Doctor not found"))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { doctor, isLoading, error };
}
