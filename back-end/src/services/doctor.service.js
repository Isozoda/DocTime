const path = require('path');
const fs = require('fs');
const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

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
    select: { id: true, name: true, email: true, phone: true },
  },
};

/** Serialize schedule object → JSON string for SQLite String? field */
const prepareData = (data) => {
  const out = { ...data };
  if (out.schedule !== undefined && out.schedule !== null && typeof out.schedule === 'object') {
    out.schedule = JSON.stringify(out.schedule);
  }
  return out;
};

const createProfile = async (userId, data) => {
  const exists = await prisma.doctor.findUnique({ where: { userId } });
  if (exists) throw createError(409, 'Doctor profile already exists');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'doctor') {
    throw createError(403, 'Only users with the doctor role can create a doctor profile');
  }

  return prisma.doctor.create({
    data: { userId, ...prepareData(data) },
    select: doctorSelect,
  });
};

const getProfileByUserId = async (userId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    select: doctorSelect,
  });
  if (!doctor) throw createError(404, 'Doctor profile not found');
  return doctor;
};

const getDoctorById = async (doctorId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: doctorSelect,
  });
  if (!doctor) throw createError(404, 'Doctor not found');
  return doctor;
};

const updateProfile = async (userId, data) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  return prisma.doctor.update({
    where: { userId },
    data: prepareData(data),
    select: doctorSelect,
  });
};

const getDoctorClients = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  // Get unique patients from appointments
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    select: {
      patient: {
        select: { id: true, name: true, email: true, phone: true, createdAt: true },
      },
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Deduplicate by patient id, keep the latest appointment info
  const seen = new Set();
  const clients = [];
  for (const apt of appointments) {
    if (!seen.has(apt.patient.id)) {
      seen.add(apt.patient.id);
      clients.push({
        ...apt.patient,
        lastVisit: apt.createdAt,
        lastStatus: apt.status,
      });
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

  return {
    doctors,
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

  if (doctor.photoUrl && doctor.photoUrl.startsWith('/uploads/')) {
    const oldPath = path.join(__dirname, '../../', doctor.photoUrl);
    fs.unlink(oldPath, () => {});
  }

  const photoUrl = `/uploads/doctors/${filename}`;
  return prisma.doctor.update({
    where: { userId },
    data: { photoUrl },
    select: doctorSelect,
  });
};

const deletePhoto = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { photoUrl: true } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  if (doctor.photoUrl && doctor.photoUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '../../', doctor.photoUrl);
    fs.unlink(filePath, () => {});
  }

  return prisma.doctor.update({
    where: { userId },
    data: { photoUrl: null },
    select: doctorSelect,
  });
};

/** Link a doctor to a hospital (upsert — replaces any previous single hospital link) */
const setHospital = async (userId, hospitalId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  if (!hospitalId) {
    // Remove all hospital links for this doctor
    await prisma.hospitalDoctor.deleteMany({ where: { doctorId: doctor.id } });
    return;
  }

  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
  if (!hospital) throw createError(404, 'Hospital not found');

  // Remove previous links, then add the new one
  await prisma.hospitalDoctor.deleteMany({ where: { doctorId: doctor.id } });
  await prisma.hospitalDoctor.create({ data: { hospitalId, doctorId: doctor.id } });
};

/** Get the hospital this doctor currently belongs to */
const getMyHospital = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const link = await prisma.hospitalDoctor.findFirst({
    where: { doctorId: doctor.id },
    include: { hospital: { select: { id: true, name: true, city: true, address: true } } },
  });
  return link?.hospital ?? null;
};

module.exports = { createProfile, getProfileByUserId, getDoctorById, updateProfile, getAllDoctors, getDoctorClients, uploadPhoto, deletePhoto, setHospital, getMyHospital };
