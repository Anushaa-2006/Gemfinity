const db = require('../config/db');

// Create a new Collection (group of schemes)
exports.createCollection = (req, res, next) => {
  const { collection_name, scheme_ids, shared_status } = req.body;
  const userId = req.user.id;

  if (!collection_name || !Array.isArray(scheme_ids)) {
    return res.status(400).json({ success: false, message: 'Collection name and array of scheme IDs are required.' });
  }

  const schemeIdsJson = JSON.stringify(scheme_ids);

  db.run(
    `INSERT INTO collections (user_id, collection_name, scheme_ids, shared_status) VALUES (?, ?, ?, ?)`,
    [userId, collection_name, schemeIdsJson, shared_status ? 1 : 0],
    function (err) {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: 'Collection created successfully.',
        collection: {
          collection_id: this.lastID,
          user_id: userId,
          collection_name,
          scheme_ids,
          shared_status: !!shared_status
        }
      });
    }
  );
};

// Get User Collections
exports.getUserCollections = (req, res, next) => {
  db.all('SELECT * FROM collections WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) return next(err);

    const collections = rows.map(col => ({
      ...col,
      scheme_ids: JSON.parse(col.scheme_ids || '[]'),
      shared_status: !!col.shared_status
    }));

    res.json({ success: true, count: collections.length, collections });
  });
};
