const db = require('../config/db');

// Create Razorpay Order
exports.createOrder = (req, res, next) => {
  const { scheme_id, amount } = req.body;
  const userId = req.user.id;

  if (!scheme_id || !amount) {
    return res.status(400).json({ success: false, message: 'Scheme ID and amount are required.' });
  }

  // Verify scheme belongs to user
  db.get('SELECT * FROM schemes WHERE scheme_id = ? AND user_id = ?', [scheme_id, userId], (err, scheme) => {
    if (err) return next(err);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });

    if (scheme.status === 'MATURED') {
      return res.status(400).json({ success: false, message: 'This scheme has already matured!' });
    }

    // Generate Razorpay Sandbox Order ID
    const razorpayOrderId = `order_sandbox_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    res.json({
      success: true,
      message: 'Razorpay sandbox order created.',
      order: {
        id: razorpayOrderId,
        entity: 'order',
        amount: Math.round(parseFloat(amount) * 100), // Amount in paise
        currency: 'INR',
        receipt: `rcpt_scheme_${scheme_id}_${Date.now()}`,
        status: 'created',
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_GemfinitySandbox123'
      }
    });
  });
};

// Verify Payment Signature & Complete Installment
exports.verifyPayment = (req, res, next) => {
  const { scheme_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;
  const userId = req.user.id;

  if (!scheme_id || !amount) {
    return res.status(400).json({ success: false, message: 'Scheme ID and payment amount required.' });
  }

  const paymentId = razorpay_payment_id || `pay_test_${Date.now()}`;
  const orderId = razorpay_order_id || `order_test_${Date.now()}`;
  const paymentAmount = parseFloat(amount);

  // Insert Transaction
  db.run(
    `INSERT INTO transactions (user_id, scheme_id, razorpay_payment_id, razorpay_order_id, amount, status, payment_method)
     VALUES (?, ?, ?, ?, ?, 'SUCCESS', 'RAZORPAY_SANDBOX')`,
    [userId, scheme_id, paymentId, orderId, paymentAmount],
    function (err) {
      if (err) return next(err);

      // Increment Paid Installments in Scheme
      db.get('SELECT * FROM schemes WHERE scheme_id = ?', [scheme_id], (err, scheme) => {
        if (err) return next(err);
        if (!scheme) return res.status(404).json({ success: false, message: 'Scheme record not found.' });

        const newPaidCount = scheme.paid_installments + 1;
        const isMatured = newPaidCount >= scheme.duration_months;
        const newStatus = isMatured ? 'MATURED' : 'ACTIVE';

        db.run(
          'UPDATE schemes SET paid_installments = ?, status = ? WHERE scheme_id = ?',
          [newPaidCount, newStatus, scheme_id],
          function (err) {
            if (err) return next(err);

            // Add 100 Reward Points for timely payment
            db.run('UPDATE rewards SET points = points + 100 WHERE user_id = ?', [userId]);

            // If scheme matured, generate Certificate!
            if (isMatured) {
              const certCode = `GEM-CERT-${Date.now()}-916-${Math.floor(1000 + Math.random() * 9000)}`;
              const qrPayload = JSON.stringify({
                certificate: certCode,
                purity: '22K (916 Hallmarked)',
                retailer: 'Gemfinity Flagship Store',
                issuedTo: req.user.name || 'Valued Gemfinity Member',
                schemeId: scheme_id,
                date: new Date().toISOString().split('T')[0]
              });
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;

              db.run(
                `INSERT INTO certificates (user_id, scheme_id, qr_code_url, purity_grade, certificate_code)
                 VALUES (?, ?, ?, '22K (916 Hallmarked)', ?)`,
                [userId, scheme_id, qrUrl, certCode]
              );
            }

            res.json({
              success: true,
              message: isMatured
                ? '🎉 Congratulations! Your scheme has fully MATURED! Purity Certificate generated.'
                : 'Payment successful! Installment recorded and 100 reward points credited.',
              transaction: {
                txn_id: this.lastID,
                payment_id: paymentId,
                amount: paymentAmount,
                paid_installments: newPaidCount,
                duration_months: scheme.duration_months,
                is_matured: isMatured
              }
            });
          }
        );
      });
    }
  );
};

// Get User's All Transactions
exports.getTransactions = (req, res, next) => {
  db.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [req.user.id], (err, txns) => {
    if (err) return next(err);
    res.json({ success: true, count: txns.length, transactions: txns });
  });
};
