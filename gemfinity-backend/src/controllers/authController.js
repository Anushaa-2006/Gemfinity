const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register User
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, language_pref, phone_number } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return next(err);
      if (row) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const lang = language_pref || 'en';

      db.run(
        `INSERT INTO users (name, email, password_hash, language_pref, phone_number) VALUES (?, ?, ?, ?, ?)`,
        [name, email, password_hash, lang, phone_number || ''],
        function (err) {
          if (err) return next(err);
          const userId = this.lastID;

          // Initialize zero reward points record
          db.run(`INSERT INTO rewards (user_id, points, tier) VALUES (?, 0, 'BRONZE')`, [userId]);

          const token = jwt.sign({ id: userId, email, name }, process.env.JWT_SECRET || 'gemfinity_secret_key', {
            expiresIn: '30d'
          });

          res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            token,
            user: { id: userId, name, email, language_pref: lang, phone_number }
          });
        }
      );
    });
  } catch (err) {
    next(err);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'gemfinity_secret_key', {
        expiresIn: '30d'
      });

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          language_pref: user.language_pref,
          phone_number: user.phone_number
        }
      });
    });
  } catch (err) {
    next(err);
  }
};

// Get User Profile
exports.getProfile = (req, res, next) => {
  db.get('SELECT id, name, email, language_pref, phone_number, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  });
};

// Update Language Preference
exports.updateLanguage = (req, res, next) => {
  const { language_pref } = req.body;
  if (!['en', 'ta'].includes(language_pref)) {
    return res.status(400).json({ success: false, message: 'Language preference must be "en" or "ta".' });
  }

  db.run('UPDATE users SET language_pref = ? WHERE id = ?', [language_pref, req.user.id], function (err) {
    if (err) return next(err);
    res.json({ success: true, message: 'Language preference updated.', language_pref });
  });
};
