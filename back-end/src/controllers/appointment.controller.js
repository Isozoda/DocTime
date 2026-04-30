const appointmentService = require('../services/appointment.service');

const bookAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.bookAppointment(req.user.id, req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getPatientAppointments(req.user.id);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

const getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(req.user.id);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointment(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

const confirmAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.confirmAppointment(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  cancelAppointment,
  confirmAppointment,
};
