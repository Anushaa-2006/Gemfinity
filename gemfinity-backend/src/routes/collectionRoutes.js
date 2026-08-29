const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, collectionController.createCollection);
router.get('/', authMiddleware, collectionController.getUserCollections);

module.exports = router;
