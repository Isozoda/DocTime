const router = require('express').Router();
const doctorController = require('../controllers/doctor.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createProfile, updateProfile } = require('../validators/doctor.validator');
const { doctorUpload } = require('../middlewares/upload.middleware');

// Public
/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor profile management and search
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/',    doctorController.getAllDoctors);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor details
 *       404:
 *         description: Doctor not found
 */
router.get('/:id', doctorController.getDoctorById);

// Doctor only
/**
 * @swagger
 * /api/doctors/profile:
 *   post:
 *     summary: Create doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Profile created
 */
router.post('/profile',    protect, authorize('doctor'), validate(createProfile), doctorController.createProfile);

/**
 * @swagger
 * /api/doctors/me/profile:
 *   get:
 *     summary: Get my doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My profile details
 */
router.get('/me/profile',  protect, authorize('doctor'), doctorController.getMyProfile);

/**
 * @swagger
 * /api/doctors/me/profile:
 *   put:
 *     summary: Update my doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/me/profile',  protect, authorize('doctor'), validate(updateProfile), doctorController.updateProfile);

/**
 * @swagger
 * /api/doctors/me/photo:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded
 */
router.post('/me/photo',   protect, authorize('doctor'), doctorUpload.single('photo'), doctorController.uploadPhoto);

/**
 * @swagger
 * /api/doctors/me/photo:
 *   delete:
 *     summary: Delete profile photo
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Photo deleted
 */
router.delete('/me/photo', protect, authorize('doctor'), doctorController.deletePhoto);

/**
 * @swagger
 * /api/doctors/me/clients:
 *   get:
 *     summary: Get list of clients (patients) for current doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 */
router.get('/me/clients',  protect, authorize('doctor'), doctorController.getMyClients);

/**
 * @swagger
 * /api/doctors/me/hospital:
 *   get:
 *     summary: Get current doctor's hospital
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hospital details
 */
router.get('/me/hospital', protect, authorize('doctor'), doctorController.getMyHospital);

/**
 * @swagger
 * /api/doctors/me/hospital:
 *   put:
 *     summary: Assign doctor to a hospital
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hospitalId
 *             properties:
 *               hospitalId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hospital assigned
 */
router.put('/me/hospital', protect, authorize('doctor'), doctorController.setHospital);

module.exports = router;
