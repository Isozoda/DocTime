const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

// ─── Categories ───────────────────────────────────────────────────────────────

const getCategories = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  return prisma.serviceCategory.findMany({
    where: { doctorId: doctor.id },
    include: {
      services: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

const createCategory = async (userId, { name }) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');
  if (!name || !name.trim()) throw createError(400, 'Category name is required');

  return prisma.serviceCategory.create({
    data: { doctorId: doctor.id, name: name.trim() },
    include: { services: true },
  });
};

const updateCategory = async (userId, categoryId, { name }) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
  if (!category || category.doctorId !== doctor.id) throw createError(404, 'Category not found');
  if (!name || !name.trim()) throw createError(400, 'Category name is required');

  return prisma.serviceCategory.update({
    where: { id: categoryId },
    data: { name: name.trim() },
    include: { services: true },
  });
};

const deleteCategory = async (userId, categoryId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
  if (!category || category.doctorId !== doctor.id) throw createError(404, 'Category not found');

  await prisma.serviceCategory.delete({ where: { id: categoryId } });
};

// ─── Services ────────────────────────────────────────────────────────────────

const getServices = async (userId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  return prisma.service.findMany({
    where: { doctorId: doctor.id },
    include: { category: true },
    orderBy: { createdAt: 'asc' },
  });
};

const createService = async (userId, data) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');
  if (!data.name || !data.name.trim()) throw createError(400, 'Service name is required');

  if (data.categoryId) {
    const cat = await prisma.serviceCategory.findUnique({ where: { id: data.categoryId } });
    if (!cat || cat.doctorId !== doctor.id) throw createError(404, 'Category not found');
  }

  return prisma.service.create({
    data: {
      doctorId: doctor.id,
      name: data.name.trim(),
      price: data.price !== undefined ? Number(data.price) : 0,
      duration: data.duration !== undefined ? Number(data.duration) : 30,
      isHidden: data.isHidden ?? false,
      categoryId: data.categoryId || null,
    },
    include: { category: true },
  });
};

const updateService = async (userId, serviceId, data) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || service.doctorId !== doctor.id) throw createError(404, 'Service not found');

  if (data.categoryId) {
    const cat = await prisma.serviceCategory.findUnique({ where: { id: data.categoryId } });
    if (!cat || cat.doctorId !== doctor.id) throw createError(404, 'Category not found');
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.duration !== undefined) updateData.duration = Number(data.duration);
  if (data.isHidden !== undefined) updateData.isHidden = Boolean(data.isHidden);
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;

  return prisma.service.update({
    where: { id: serviceId },
    data: updateData,
    include: { category: true },
  });
};

const deleteService = async (userId, serviceId) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw createError(404, 'Doctor profile not found');

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || service.doctorId !== doctor.id) throw createError(404, 'Service not found');

  await prisma.service.delete({ where: { id: serviceId } });
};

// ─── Public: doctor's services for patients ──────────────────────────────────

const getPublicServices = async (doctorId) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) throw createError(404, 'Doctor not found');

  return prisma.service.findMany({
    where: { doctorId, isHidden: false },
    include: { category: true },
    orderBy: { createdAt: 'asc' },
  });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getServices,
  createService,
  updateService,
  deleteService,
  getPublicServices,
};
