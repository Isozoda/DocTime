const router = require('express').Router();
const appointmentController = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { book } = require('../validators/appointment.validator');

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment booking and management
 */

// Patient
/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *             properties:
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked
 */
router.post('/',    authorize('patient'), validate(book), appointmentController.bookAppointment);

/**
 * @swagger
 * /api/appointments/my:
 *   get:
 *     summary: Get my appointments (as patient)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/my',   authorize('patient'), appointmentController.getMyAppointments);

// Doctor
/**
 * @swagger
 * /api/appointments/doctor:
 *   get:
 *     summary: Get my appointments (as doctor)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/doctor', authorize('doctor'), appointmentController.getDoctorAppointments);

/**
 * @swagger
 * /api/appointments/{id}/confirm:
 *   patch:
 *     summary: Confirm an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment confirmed
 */
router.patch('/:id/confirm', authorize('doctor'), appointmentController.confirmAppointment);

// Patient, Doctor, or Admin
/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details
 */
router.get('/:id',          authorize('patient', 'doctor', 'admin'), appointmentController.getAppointmentById);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled
 */
router.patch('/:id/cancel', authorize('patient', 'doctor', 'admin'), appointmentController.cancelAppointment);

module.exports = router;
