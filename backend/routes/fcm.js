// backend/routes/fcm.js
const express = require("express");
const connectDB = require("../db");
const router = express.Router();

/**
 * Register a token for a user (upsert)
 * POST { user_id, token }
 */
router.post("/register", (req, res) => {
  const { user_id, token } = req.body;
  if (!user_id || !token)
    return res
      .status(400)
      .json({ success: false, message: "user_id and token required" });

  const sql = `
    INSERT INTO fcm_tokens (user_id, token)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE updated_at = NOW()
  `;
  connectDB.query(sql, [user_id, token], (err) => {
    if (err) {
      console.error("Error saving token:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }
    res.json({ success: true, message: "Token registered" });
  });
});

/**
 * Unregister token (optional)
 * POST { user_id, token }
 */
router.post("/unregister", (req, res) => {
  const { user_id, token } = req.body;
  if (!user_id || !token)
    return res
      .status(400)
      .json({ success: false, message: "user_id and token required" });

  const sql = `DELETE FROM fcm_tokens WHERE user_id = ? AND token = ?`;
  connectDB.query(sql, [user_id, token], (err) => {
    if (err) {
      console.error("Error deleting token:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }
    res.json({ success: true, message: "Token unregistered" });
  });
});

module.exports = router;
