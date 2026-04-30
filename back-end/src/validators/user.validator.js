const Joi = require('joi');

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().max(20).allow('', null),
}).min(1);

module.exports = { updateProfile };
