const router = require('express').Router();
const contactController = require('../controllers/contact.controller');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form and support
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post('/', contactController.submitContactForm);

module.exports = router;
