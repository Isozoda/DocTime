const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

const hospitalInclude = {
  specializations: {
    include: { specialization: { select: { id: true, name: true, slug: true, color: true, icon: true } } },
  },
  doctors: {
    include: {
      doctor: {
        select: {
          id: true, specialization: true, city: true, rating: true,
          experience: true, bio: true, instagram: true, phone: true, photoUrl: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
  },
};

const getAll = async (req, res, next) => {
  try {
    const { city, specializationSlug } = req.query;
    const where = {};
    if (city) where.city = { contains: city };
    if (specializationSlug) {
      const spec = await prisma.specialization.findUnique({ where: { slug: specializationSlug } });
      if (spec) where.specializations = { some: { specializationId: spec.id } };
    }

    const hospitals = await prisma.hospital.findMany({
      where,
      include: {
        specializations: {
          include: { specialization: { select: { id: true, name: true, slug: true, color: true } } },
        },
        _count: { select: { doctors: true } },
      },
      orderBy: { rating: 'desc' },
    });

    const result = hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      address: h.address,
      city: h.city,
      phone: h.phone,
      instagram: h.instagram,
      googleMapUrl: h.googleMapUrl,
      imageUrl: h.imageUrl,
      rating: h.rating,
      doctorCount: h._count.doctors,
      specializations: h.specializations.map((hs) => hs.specialization),
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: req.params.id },
      include: hospitalInclude,
    });
    if (!hospital) throw createError(404, 'Hospital not found');

    const result = {
      ...hospital,
      specializations: hospital.specializations.map((hs) => hs.specialization),
      doctors: hospital.doctors.map((hd) => hd.doctor),
    };

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById };
