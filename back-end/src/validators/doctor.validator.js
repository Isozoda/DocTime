const Joi = require('joi');

const daySchema = Joi.object({
  start: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  end: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
}).allow(null);

const scheduleSchema = Joi.object({
  monday:    daySchema,
  tuesday:   daySchema,
  wednesday: daySchema,
  thursday:  daySchema,
  friday:    daySchema,
  saturday:  daySchema,
  sunday:    daySchema,
});

const createProfile = Joi.object({
  specialization: Joi.string().min(2).max(100).required(),
  city: Joi.string().min(2).max(100).required(),
  experience: Joi.number().integer().min(0).default(0),
  bio: Joi.string().max(1000).allow('', null),
  schedule: scheduleSchema,
});

const updateProfile = Joi.object({
  specialization: Joi.string().min(2).max(100),
  city: Joi.string().min(2).max(100),
  experience: Joi.number().integer().min(0),
  bio: Joi.string().max(1000).allow('', null),
  schedule: scheduleSchema,
}).min(1);

module.exports = { createProfile, updateProfile };
