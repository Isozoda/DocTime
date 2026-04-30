"use client";

import axios from "axios";
import { toast } from "sonner";
import { getToken, removeToken } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== "undefined") {
        const segments = window.location.pathname.split("/");
        const locale = ["tj", "ru", "en"].includes(segments[1]) ? segments[1] : "tj";
        window.location.href = `/${locale}/auth/login`;
      }
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
