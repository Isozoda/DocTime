const path = require('path');
const fs = require('fs');
const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

// Only include fields that existed before schema changes — safe with any Prisma client state
const doctorSelect = {
  id: true,
  specialization: true,
  city: true,
  rating: true,
  experience: true,
  bio: true,
  schedule: true,
  instagram: true,
  phone: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: { id: true, name: true, email: true, phone: true, avatar: true },
  },
};

const CITY_CENTERS = {
  Dushanbe: { lat: 38.560, lng: 68.786 },
  Khujand:  { lat: 40.290, lng: 70.143 },
  Bokhtar:  { lat: 37.831, lng: 68.779 },
};

const prepareData = (data) => {
  const out = { ...data };
  if (out.schedule !== undefined && out.schedule !== null && typeof out.schedule === 'object') {
    out.schedule = JSON.stringify(out.schedule);
  }
  return out;
};

// Fetch the first hospital for a given doctorId via a separate query (no nested select)
const getHospitalForDoctor = async (doctorId) => {
  try {
    const link = await prisma.hospitalDoctor.findFirst({
      where: { doctorId },
      include: {
        hospital: {
          select: { id: true, name: true, address: true, city: true },
        },
      },
    });
    return link?.hospital ?? null;
  } catch {
    return null;
  }
};

// Bulk-fetch hospitals for multiple doctors in one query
const getHospitalsForDoctors = async (doctorIds) => {
  if (!doctorIds.length) return {};
  try {
    const links = await prisma.hospitalDoctor.findMany({
      where: { doctorId: { in: doctorIds } },
      include: {
        hospital: {
          select: { id: true, name: true, address: true, city: true },
        },
      },
    });
    const map = {};
    for (const link of links) {
      if (!map[link.doctorId]) map[link.doctorId] = link.hospital;
    }
    return map;
  } catch {
    return {};
  }
};

const formatDoctor = (doctor, hospital = null) => {
  if (!doctor) return null;

  const photoUrl =
    doctor.photoUrl?.trim()
      ? doctor.photoUrl
      : doctor.user?.avatar?.trim()
        ? doctor.user.avatar
        : null;

  const city = doctor.city ?? '';
  const lat = CITY_CENTERS[city]?.lat ?? 38.560;
  const lng = CITY_CENTERS[city]?.lng ?? 68.786;

  return {
    ...doctor,
    photoUrl,
    lat,
    lng,
    hospital: hospital ?? null,
  };
};

const createProfile = async (userId, data) => {
  const exists = await prisma.doctor.findUnique({ where: { userId } });
  if (exists) throw createError(409, 'Doctor profile already exists');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'doctor') {
    throw createError(403, 'Only users with the doctor role can create a doctor profile');
  }

  const doctor = await prisma.doctor.create({
    data: { userId, ...prepareData(data) },
    select: doctorSelect,
  });
  return formatDoctor(doctor);
};

const getProfileByUserId = async (userId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    select: doctorSelect,
  });
  if (!doctor) throw createError(404, 'Doctor profile not found');
  const hospital = await getHospitalForDoctor(doctor.id);
  return formatDoctor(doctor, hospital);
};

const getDoctorById = async (doctorId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: doctorSelect,
  });
  if (!doctor) throw createError(404, 'Doctor not found');
  const hospital = await getHospitalForDoctor(doctorId);
  return formatDoctor(doctor, hospital);
};

const updateProfile = async (userId, data) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const updated = await prisma.doctor.update({
    where: { userId },
    data: prepareData(data),
    select: doctorSelect,
  });
  const hospital = await getHospitalForDoctor(updated.id);
  return formatDoctor(updated, hospital);
};

const getDoctorClients = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    select: {
      patient: {
        select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true },
      },
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const seen = new Set();
  const clients = [];
  for (const apt of appointments) {
    if (!seen.has(apt.patient.id)) {
      seen.add(apt.patient.id);
      clients.push({ ...apt.patient, lastVisit: apt.createdAt, lastStatus: apt.status });
    }
  }
  return clients;
};

const getAllDoctors = async ({ specialization, city, rating, page = 1, limit = 10 }) => {
  const where = {};
  if (specialization) where.specialization = { contains: specialization };
  if (city) where.city = { contains: city };
  if (rating) where.rating = { gte: Number(rating) };

  const skip = (Number(page) - 1) * Number(limit);

  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      select: doctorSelect,
      orderBy: { rating: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.doctor.count({ where }),
  ]);

  // Bulk-fetch all hospital links in one extra query — no nested select issues
  const doctorIds = doctors.map((d) => d.id);
  const hospitalMap = await getHospitalsForDoctors(doctorIds);

  const mapped = doctors.map((d) => formatDoctor(d, hospitalMap[d.id] ?? null));

  return {
    doctors: mapped,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const uploadPhoto = async (userId, filename) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { photoUrl: true } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  if (doctor.photoUrl?.startsWith('/uploads/')) {
    fs.unlink(path.join(__dirname, '../../', doctor.photoUrl), () => {});
  }

  const photoUrl = `/uploads/doctors/${filename}`;
  await prisma.user.update({ where: { id: userId }, data: { avatar: photoUrl } });
  const updated = await prisma.doctor.update({
    where: { userId },
    data: { photoUrl },
    select: doctorSelect,
  });
  return formatDoctor(updated);
};

const deletePhoto = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { photoUrl: true } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  if (doctor.photoUrl?.startsWith('/uploads/')) {
    fs.unlink(path.join(__dirname, '../../', doctor.photoUrl), () => {});
  }

  await prisma.user.update({ where: { id: userId }, data: { avatar: null } });
  const updated = await prisma.doctor.update({
    where: { userId },
    data: { photoUrl: null },
    select: doctorSelect,
  });
  return formatDoctor(updated);
};

const setHospital = async (userId, hospitalId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  if (!hospitalId) {
    await prisma.hospitalDoctor.deleteMany({ where: { doctorId: doctor.id } });
    return;
  }

  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
  if (!hospital) throw createError(404, 'Hospital not found');

  await prisma.hospitalDoctor.deleteMany({ where: { doctorId: doctor.id } });
  await prisma.hospitalDoctor.create({ data: { hospitalId, doctorId: doctor.id } });
};

const getMyHospital = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const link = await prisma.hospitalDoctor.findFirst({
    where: { doctorId: doctor.id },
    include: { hospital: { select: { id: true, name: true, city: true, address: true } } },
  });
  return link?.hospital ?? null;
};

module.exports = {
  createProfile, getProfileByUserId, getDoctorById, updateProfile,
  getAllDoctors, getDoctorClients, uploadPhoto, deletePhoto,
  setHospital, getMyHospital, formatDoctor,
};
