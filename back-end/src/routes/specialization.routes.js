const router = require('express').Router();
const { getAll, getBySlug } = require('../controllers/specialization.controller');

/**
 * @swagger
 * tags:
 *   name: Specializations
 *   description: Medical specialization categories
 */

/**
 * @swagger
 * /api/specializations:
 *   get:
 *     summary: Get all specializations
 *     tags: [Specializations]
 *     responses:
 *       200:
 *         description: List of specializations
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/specializations/{slug}:
 *   get:
 *     summary: Get specialization by slug
 *     tags: [Specializations]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialization details
 */
router.get('/:slug', getBySlug);

module.exports = router;
