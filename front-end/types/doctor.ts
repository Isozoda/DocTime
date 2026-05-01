export interface DaySchedule {
  start: string;
  end: string;
}

export interface WeekSchedule {
  monday?: DaySchedule | null;
  tuesday?: DaySchedule | null;
  wednesday?: DaySchedule | null;
  thursday?: DaySchedule | null;
  friday?: DaySchedule | null;
  saturday?: DaySchedule | null;
  sunday?: DaySchedule | null;
}

export interface DoctorUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  city: string;
  rating: number;
  experience: number;
  bio?: string | null;
  schedule?: WeekSchedule | string | null;
  instagram?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  user: DoctorUser;
}

export interface DoctorFilters {
  specialization?: string;
  city?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DoctorListResponse {
  success: boolean;
  data: {
    doctors: Doctor[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}
