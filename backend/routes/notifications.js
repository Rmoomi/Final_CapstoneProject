const express = require("express");
const connectDB = require("../db");

const router = express.Router();

// CREATE notification
router.post("/", (req, res) => {
  const { user_id, title, message } = req.body;
  const sql = `INSERT INTO notifications (user_id, title, message, status, date) VALUES (?, ?, ?, 'unread', NOW())`;
  connectDB.query(sql, [user_id, title, message], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({
      success: true,
      message: "Notification created",
      id: result.insertId,
    });
  });
});

// GET notifications by user
router.get("/:userId", (req, res) => {
  connectDB.query(
    "SELECT * FROM notifications WHERE user_id=? ORDER BY date DESC",
    [req.params.userId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, notifications: results });
    }
  );
});

// MARK as read
router.patch("/:id/read", (req, res) => {
  connectDB.query(
    "UPDATE notifications SET status='read' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Notification marked as read" });
    }
  );
});

module.exports = router;
