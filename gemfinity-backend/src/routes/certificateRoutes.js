const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/scheme/:scheme_id', authMiddleware, certificateController.getCertificate);
router.get('/verify/:code', certificateController.verifyCertificateCode); // Public verification endpoint

module.exports = router;
