const serviceService = require('../services/service.service');

// ─── Categories ───────────────────────────────────────────────────────────────

const getCategories = async (req, res, next) => {
  try {
    const data = await serviceService.getCategories(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const data = await serviceService.createCategory(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const data = await serviceService.updateCategory(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    await serviceService.deleteCategory(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) { next(err); }
};

// ─── Services ────────────────────────────────────────────────────────────────

const getServices = async (req, res, next) => {
  try {
    const data = await serviceService.getServices(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const createService = async (req, res, next) => {
  try {
    const data = await serviceService.createService(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const updateService = async (req, res, next) => {
  try {
    const data = await serviceService.updateService(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (err) { next(err); }
};

// ─── Public ──────────────────────────────────────────────────────────────────

const getPublicServices = async (req, res, next) => {
  try {
    const data = await serviceService.getPublicServices(req.params.doctorId);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
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
