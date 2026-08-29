const db = require('../config/db');

// Get Certificate by Scheme ID
exports.getCertificate = (req, res, next) => {
  const { scheme_id } = req.params;

  db.get(
    `SELECT c.*, u.name as user_name, s.amount, s.end_date 
     FROM certificates c
     JOIN users u ON c.user_id = u.id
     JOIN schemes s ON c.scheme_id = s.scheme_id
     WHERE c.scheme_id = ?`,
    [scheme_id],
    (err, cert) => {
      if (err) return next(err);
      if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found for this scheme.' });
      res.json({ success: true, certificate: cert });
    }
  );
};

// Verify Certificate Code (Public endpoint for QR scanner)
exports.verifyCertificateCode = (req, res, next) => {
  const { code } = req.params;

  db.get(
    `SELECT c.*, u.name as customer_name, s.amount as total_value, s.start_date, s.end_date
     FROM certificates c
     JOIN users u ON c.user_id = u.id
     JOIN schemes s ON c.scheme_id = s.scheme_id
     WHERE c.certificate_code = ?`,
    [code],
    (err, cert) => {
      if (err) return next(err);
      if (!cert) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: '❌ Invalid or fake purity certificate code.'
        });
      }

      res.json({
        success: true,
        verified: true,
        certificate: {
          code: cert.certificate_code,
          customer_name: cert.customer_name,
          purity: cert.purity_grade,
          retailer: 'Gemfinity Certified Flagship Partner',
          total_value: `₹${cert.total_value}`,
          issue_date: cert.issue_date,
          status: 'AUTHENTIC_HALLMARKED_22K'
        }
      });
    }
  );
};
