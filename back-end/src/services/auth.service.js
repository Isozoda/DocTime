const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { sign } = require('../utils/jwt');
const { createError } = require('../middlewares/error.middleware');

const SALT_ROUNDS = 10;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

const sendOtp = async ({ phone }) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.otpRequest.upsert({
    where: { phone },
    update: { otp, expiresAt, verified: false },
    create: { phone, otp, expiresAt },
  });

  // In production: integrate SMS provider (e.g. Eskiz, SMSC) here
  console.log(`[OTP] Phone: ${phone} → Code: ${otp}`);

  // Return otp only for development — remove in production
  return { message: 'OTP sent', devOtp: otp };
};

const verifyOtp = async ({ phone, otp }) => {
  const request = await prisma.otpRequest.findUnique({ where: { phone } });

  if (!request) throw createError(404, 'OTP not requested for this phone');
  if (request.verified) throw createError(400, 'OTP already used');
  if (new Date() > request.expiresAt) throw createError(400, 'OTP has expired');
  if (request.otp !== otp) throw createError(400, 'Invalid OTP code');

  await prisma.otpRequest.update({ where: { phone }, data: { verified: true } });
  return { verified: true };
};

const register = async ({ name, email, password, role, phone, specialization }) => {
  /*
  // Check phone OTP was verified
  if (phone) {
    const otpRecord = await prisma.otpRequest.findUnique({ where: { phone } });
    if (!otpRecord || !otpRecord.verified) {
      throw createError(400, 'Phone number not verified. Please verify your phone first.');
    }
  }
  */

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw createError(409, 'Email already in use');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role || 'patient', phone: phone || null },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
  });

  // Auto-create doctor profile stub so the doctor can access /doctors/me/profile
  if (role === 'doctor') {
    await prisma.doctor.create({
      data: {
        userId: user.id,
        specialization: specialization || 'General',
        city: 'Dushanbe',
      },
    });
  }

  // Clean up used OTP
  if (phone) {
    await prisma.otpRequest.deleteMany({ where: { phone } }).catch(() => {});
  }

  const token = sign({ id: user.id, role: user.role });
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createError(401, 'Invalid email or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw createError(401, 'Invalid email or password');

  const token = sign({ id: user.id, role: user.role });

  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

module.exports = { register, login, sendOtp, verifyOtp };
