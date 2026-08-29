const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-order', authMiddleware, paymentController.createOrder);
router.post('/verify-signature', authMiddleware, paymentController.verifyPayment);
router.get('/transactions', authMiddleware, paymentController.getTransactions);

module.exports = router;
