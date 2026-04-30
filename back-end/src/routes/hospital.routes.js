const router = require('express').Router();
const { getAll, getById } = require('../controllers/hospital.controller');

/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: Hospital information
 */

/**
 * @swagger
 * /api/hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 *     responses:
 *       200:
 *         description: List of hospitals
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital details
 */
router.get('/:id', getById);

module.exports = router;
