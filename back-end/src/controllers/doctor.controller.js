const doctorService = require('../services/doctor.service');

const getMyClients = async (req, res, next) => {
  try {
    const clients = await doctorService.getDoctorClients(req.user.id);
    res.status(200).json({ success: true, data: clients });
  } catch (err) {
    next(err);
  }
};

const createProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.createProfile(req.user.id, req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.getProfileByUserId(req.user.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const result = await doctorService.getAllDoctors(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const doctor = await doctorService.uploadPhoto(req.user.id, req.file.filename);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

const deletePhoto = async (req, res, next) => {
  try {
    const doctor = await doctorService.deletePhoto(req.user.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

const setHospital = async (req, res, next) => {
  try {
    await doctorService.setHospital(req.user.id, req.body.hospitalId ?? null);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

const getMyHospital = async (req, res, next) => {
  try {
    const hospital = await doctorService.getMyHospital(req.user.id);
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    next(err);
  }
};

module.exports = { createProfile, getMyProfile, getDoctorById, updateProfile, getAllDoctors, getMyClients, uploadPhoto, deletePhoto, setHospital, getMyHospital };
