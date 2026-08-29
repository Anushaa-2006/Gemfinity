const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/enroll', authMiddleware, schemeController.enrollScheme);
router.get('/', authMiddleware, schemeController.getUserSchemes);
router.get('/:scheme_id', authMiddleware, schemeController.getSchemeDetails);

module.exports = router;
