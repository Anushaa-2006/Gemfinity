const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../../gemfinity.db');
const schemaPath = path.join(__dirname, '../../db/schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('⚡ Connected to Gemfinity SQLite Database at:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schemaSql, async (err) => {
    if (err) {
      console.error('❌ Schema initialization error:', err.message);
      return;
    }
    console.log('✅ Database schema verified.');
    seedDemoData();
  });
}

function seedDemoData() {
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (err) return;
    if (row && row.count > 0) {
      console.log('ℹ️ Demo data already exists.');
      return;
    }

    console.log('🌱 Seeding demo data for Gemfinity...');
    const hashedPw = await bcrypt.hash('gemfinity123', 10);

    // 1. Seed Demo User
    db.run(
      `INSERT INTO users (name, email, password_hash, language_pref, phone_number) VALUES (?, ?, ?, ?, ?)`,
      ['Ananya Sharma', 'ananya@gemfinity.com', hashedPw, 'en', '+919876543210'],
      function (err) {
        if (err) return console.error('Seed user error:', err);
        const userId = this.lastID;

        // 2. Seed Active Schemes
        db.run(
          `INSERT INTO schemes (user_id, amount, duration_months, monthly_installment, paid_installments, start_date, end_date, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, 55000.00, 11, 5000.00, 7, '2026-01-15', '2026-12-15', 'ACTIVE'],
          function (err) {
            if (err) return;
            const scheme1Id = this.lastID;

            // Seed Transactions for Scheme 1
            for (let i = 1; i <= 7; i++) {
              db.run(
                `INSERT INTO transactions (user_id, scheme_id, razorpay_payment_id, razorpay_order_id, amount, status, date)
                 VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-${(7 - i) * 30} days'))`,
                [userId, scheme1Id, `pay_sandbox_${1000 + i}`, `order_sandbox_${500 + i}`, 5000.00, 'SUCCESS']
              );
            }

            // Seed Scheme 2 (Wedding Gold Scheme)
            db.run(
              `INSERT INTO schemes (user_id, amount, duration_months, monthly_installment, paid_installments, start_date, end_date, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [userId, 110000.00, 11, 10000.00, 11, '2025-09-01', '2026-08-01', 'MATURED'],
              function (err) {
                if (err) return;
                const scheme2Id = this.lastID;

                // Seed Certificate for Matured Scheme
                const certCode = 'GEM-CERT-2026-916-8842';
                const qrPayload = JSON.stringify({
                  certificate: certCode,
                  purity: '22K (916 Hallmarked)',
                  retailer: 'Gemfinity Flagship Store',
                  issuedTo: 'Ananya Sharma',
                  schemeId: scheme2Id
                });

                db.run(
                  `INSERT INTO certificates (user_id, scheme_id, qr_code_url, purity_grade, certificate_code)
                   VALUES (?, ?, ?, ?, ?)`,
                  [userId, scheme2Id, `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`, '22K (916 Hallmarked)', certCode]
                );

                // Seed Collection
                const schemeIdsJson = JSON.stringify([scheme1Id, scheme2Id]);
                db.run(
                  `INSERT INTO collections (user_id, collection_name, scheme_ids, shared_status)
                   VALUES (?, ?, ?, ?)`,
                  [userId, 'Bridal Jewellery Fund 2026', schemeIdsJson, 1]
                );
              }
            );
          }
        );

        // Seed Rewards
        db.run(
          `INSERT INTO rewards (user_id, points, redeemed_status, tier) VALUES (?, ?, ?, ?)`,
          [userId, 700, 0, 'SILVER']
        );

        console.log('✅ Demo data seeded successfully! Demo account: ananya@gemfinity.com / gemfinity123');
      }
    );
  });
}

module.exports = db;
