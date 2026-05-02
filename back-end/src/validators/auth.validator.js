const Joi = require('joi');

const register = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('patient', 'doctor', 'admin').default('patient'),
  phone: Joi.string().max(20).optional(),
  specialization: Joi.string().max(100).optional(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const sendOtp = Joi.object({
  phone: Joi.string().min(7).max(20).required(),
});

const verifyOtp = Joi.object({
  phone: Joi.string().min(7).max(20).required(),
  otp: Joi.string().length(6).required(),
});

module.exports = { register, login, sendOtp, verifyOtp };
