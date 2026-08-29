const db = require('../config/db');

// Enroll in a new savings scheme
exports.enrollScheme = (req, res, next) => {
  const { monthly_installment, duration_months } = req.body;
  const userId = req.user.id;

  const installment = parseFloat(monthly_installment);
  const duration = parseInt(duration_months) || 11;

  if (!installment || installment < 500) {
    return res.status(400).json({ success: false, message: 'Minimum monthly installment is ₹500.' });
  }

  const totalAmount = installment * duration;
  const startDate = new Date().toISOString().split('T')[0];
  const endDateObj = new Date();
  endDateObj.setMonth(endDateObj.getMonth() + duration);
  const endDate = endDateObj.toISOString().split('T')[0];

  db.run(
    `INSERT INTO schemes (user_id, amount, duration_months, monthly_installment, paid_installments, start_date, end_date, status)
     VALUES (?, ?, ?, ?, 0, ?, ?, 'ACTIVE')`,
    [userId, totalAmount, duration, installment, startDate, endDate],
    function (err) {
      if (err) return next(err);
      const schemeId = this.lastID;

      res.status(201).json({
        success: true,
        message: 'Scheme enrolled successfully.',
        scheme: {
          scheme_id: schemeId,
          user_id: userId,
          amount: totalAmount,
          duration_months: duration,
          monthly_installment: installment,
          paid_installments: 0,
          start_date: startDate,
          end_date: endDate,
          status: 'ACTIVE'
        }
      });
    }
  );
};

// Get User's Active & Matured Schemes
exports.getUserSchemes = (req, res, next) => {
  const userId = req.user.id;

  db.all('SELECT * FROM schemes WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, schemes) => {
    if (err) return next(err);
    res.json({ success: true, count: schemes.length, schemes });
  });
};

// Get Single Scheme Details with Transaction History
exports.getSchemeDetails = (req, res, next) => {
  const { scheme_id } = req.params;
  const userId = req.user.id;

  db.get('SELECT * FROM schemes WHERE scheme_id = ? AND user_id = ?', [scheme_id, userId], (err, scheme) => {
    if (err) return next(err);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });

    db.all('SELECT * FROM transactions WHERE scheme_id = ? ORDER BY date DESC', [scheme_id], (err, transactions) => {
      if (err) return next(err);

      // Check if certificate exists if matured
      db.get('SELECT * FROM certificates WHERE scheme_id = ?', [scheme_id], (err, certificate) => {
        if (err) return next(err);

        res.json({
          success: true,
          scheme,
          transactions,
          certificate: certificate || null
        });
      });
    });
  });
};
