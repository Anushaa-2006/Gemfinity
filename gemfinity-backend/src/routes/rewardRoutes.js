const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, rewardController.getUserRewards);
router.post('/redeem', authMiddleware, rewardController.redeemPoints);

module.exports = router;
