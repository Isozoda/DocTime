const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const message = error.details.map((d) => d.message.replace(/"/g, '')).join(', ');
    return res.status(422).json({ success: false, message });
  }

  next();
};

module.exports = validate;
