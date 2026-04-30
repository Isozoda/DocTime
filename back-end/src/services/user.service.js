const path = require('path');
const fs = require('fs');
const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
      doctor: {
        select: {
          id: true,
          specialization: true,
          city: true,
          rating: true,
          experience: true,
          bio: true,
          schedule: true,
        },
      },
    },
  });

  if (!user) throw createError(404, 'User not found');
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      updatedAt: true,
    },
  });

  return user;
};

const updateAvatar = async (userId, filename) => {
  const old = await prisma.user.findUnique({ where: { id: userId }, select: { avatar: true } });

  if (old?.avatar) {
    const oldPath = path.join(__dirname, '../../uploads/avatars', path.basename(old.avatar));
    fs.unlink(oldPath, () => {});
  }

  const avatarUrl = `/uploads/avatars/${filename}`;
  return updateProfile(userId, { avatar: avatarUrl });
};

const deleteAvatar = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatar: true } });

  if (user?.avatar) {
    const filePath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
    fs.unlink(filePath, () => {});
  }

  return updateProfile(userId, { avatar: null });
};

const deleteAccount = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatar: true } });

  if (user?.avatar) {
    const filePath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
    fs.unlink(filePath, () => {});
  }

  await prisma.user.delete({ where: { id: userId } });
};

module.exports = { getProfile, updateProfile, updateAvatar, deleteAvatar, deleteAccount };
