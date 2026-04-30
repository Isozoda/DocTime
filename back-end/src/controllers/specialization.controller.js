const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

const getAll = async (req, res, next) => {
  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: specializations });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const spec = await prisma.specialization.findUnique({ where: { slug } });
    if (!spec) throw createError(404, 'Specialization not found');

    const [doctors, hospitals] = await Promise.all([
      prisma.doctor.findMany({
        where: { specialization: { contains: slug } },
        select: {
          id: true, specialization: true, city: true, rating: true,
          experience: true, bio: true, instagram: true, phone: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { rating: 'desc' },
        take: 20,
      }),
      prisma.hospital.findMany({
        where: { specializations: { some: { specializationId: spec.id } } },
        include: {
          specializations: { include: { specialization: { select: { name: true, slug: true, color: true } } } },
          doctors: { include: { doctor: { select: { id: true, specialization: true, rating: true, user: { select: { name: true } } } } } },
        },
      }),
    ]);

    res.json({ success: true, data: { ...spec, doctors, hospitals } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug };
