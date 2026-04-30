const Joi = require('joi');

const book = Joi.object({
  doctorId: Joi.string().uuid().required(),
  date: Joi.date().iso().greater('now').required(),
  notes: Joi.string().max(500).allow('', null),
});

module.exports = { book };
