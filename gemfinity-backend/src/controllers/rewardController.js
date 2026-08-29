const db = require('../config/db');

// Get User Reward Balance & Tier
exports.getUserRewards = (req, res, next) => {
  const userId = req.user.id;

  db.get('SELECT * FROM rewards WHERE user_id = ?', [userId], (err, reward) => {
    if (err) return next(err);

    if (!reward) {
      db.run('INSERT INTO rewards (user_id, points, tier) VALUES (?, 0, "BRONZE")', [userId]);
      return res.json({
        success: true,
        rewards: { user_id: userId, points: 0, tier: 'BRONZE', redeemed_status: false }
      });
    }

    // Determine Tier based on points
    let tier = 'BRONZE';
    if (reward.points >= 2000) tier = 'PLATINUM';
    else if (reward.points >= 1000) tier = 'GOLD';
    else if (reward.points >= 500) tier = 'SILVER';

    res.json({
      success: true,
      rewards: {
        ...reward,
        tier,
        redeemed_status: !!reward.redeemed_status
      }
    });
  });
};

// Redeem Reward Points
exports.redeemPoints = (req, res, next) => {
  const { points_to_redeem } = req.body;
  const userId = req.user.id;
  const pts = parseInt(points_to_redeem);

  if (!pts || pts < 100) {
    return res.status(400).json({ success: false, message: 'Minimum 100 points required for redemption.' });
  }

  db.get('SELECT points FROM rewards WHERE user_id = ?', [userId], (err, reward) => {
    if (err) return next(err);
    if (!reward || reward.points < pts) {
      return res.status(400).json({ success: false, message: 'Insufficient reward points balance.' });
    }

    const newPoints = reward.points - pts;
    db.run(
      'UPDATE rewards SET points = ?, redeemed_status = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [newPoints, userId],
      function (err) {
        if (err) return next(err);

        const voucherCode = `GEM-VOUCHER-${Math.floor(100000 + Math.random() * 900000)}`;
        res.json({
          success: true,
          message: `Successfully redeemed ${pts} points!`,
          voucher: {
            code: voucherCode,
            discount_value: `₹${pts}`,
            valid_on: 'Making charges on 22K/24K Gold & Diamond Jewellery',
            remaining_points: newPoints
          }
        });
      }
    );
  });
};
