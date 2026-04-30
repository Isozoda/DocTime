const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

const appointmentSelect = {
  id: true,
  date: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  patient: {
    select: { id: true, name: true, email: true, phone: true },
  },
  doctor: {
    select: {
      id: true,
      specialization: true,
      city: true,
      photoUrl: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  },
};

const bookAppointment = async (patientId, { doctorId, date, notes }) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) throw createError(404, 'Doctor not found');

  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date: new Date(date),
      status: { not: 'cancelled' },
    },
  });
  if (conflict) throw createError(409, 'Doctor already has an appointment at this time');

  return prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      date: new Date(date),
      notes: notes || null,
      status: 'pending',
    },
    select: appointmentSelect,
  });
};

const getPatientAppointments = async (patientId) => {
  return prisma.appointment.findMany({
    where: { patientId },
    select: appointmentSelect,
    orderBy: { date: 'desc' },
  });
};

const getDoctorAppointments = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  return prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    select: appointmentSelect,
    orderBy: { date: 'asc' },
  });
};

const getAppointmentById = async (appointmentId, userId, role) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: appointmentSelect,
  });
  if (!appointment) throw createError(404, 'Appointment not found');

  if (role === 'admin') return appointment;

  const isPatient = appointment.patient.id === userId;
  const isDoctor = appointment.doctor.user.id === userId;

  if (!isPatient && !isDoctor) {
    throw createError(403, 'Not authorized to view this appointment');
  }

  return appointment;
};

const cancelAppointment = async (appointmentId, userId, role) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { doctor: { include: { user: true } } },
  });
  if (!appointment) throw createError(404, 'Appointment not found');

  if (appointment.status === 'cancelled') {
    throw createError(400, 'Appointment is already cancelled');
  }

  const isPatient = appointment.patientId === userId;
  const isDoctor = appointment.doctor.user.id === userId;

  if (role !== 'admin' && !isPatient && !isDoctor) {
    throw createError(403, 'Not authorized to cancel this appointment');
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: 'cancelled' },
    select: appointmentSelect,
  });
};

const confirmAppointment = async (appointmentId, userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) throw createError(404, 'Appointment not found');
  if (appointment.doctorId !== doctor.id) {
    throw createError(403, 'Not authorized to confirm this appointment');
  }
  if (appointment.status !== 'pending') {
    throw createError(400, `Cannot confirm an appointment with status '${appointment.status}'`);
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: 'confirmed' },
    select: appointmentSelect,
  });
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointmentById,
  cancelAppointment,
  confirmAppointment,
};
