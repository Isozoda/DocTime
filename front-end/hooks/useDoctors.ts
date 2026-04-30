"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Doctor, DoctorFilters, DoctorListResponse } from "@/types/doctor";

interface UseDoctorsReturn {
  doctors: Doctor[];
  pagination: DoctorListResponse["data"]["pagination"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDoctors(filters: DoctorFilters = {}): UseDoctorsReturn {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<DoctorListResponse["data"]["pagination"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.specialization) params.set("specialization", filters.specialization);
      if (filters.city) params.set("city", filters.city);
      if (filters.rating) params.set("rating", String(filters.rating));
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const { data } = await api.get<DoctorListResponse>(`/doctors?${params}`);
      setDoctors(data.data.doctors);
      setPagination(data.data.pagination);
    } catch {
      setError("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  }, [filters.specialization, filters.city, filters.rating, filters.page, filters.limit]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, pagination, isLoading, error, refetch: fetchDoctors };
}
