const express = require("express");
const connectDB = require("../db");

const router = express.Router();

/**
 * ✅ Create a notification
 */
router.post("/", (req, res) => {
  const { user_id, title, message } = req.body;

  if (!user_id || !title || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const sql = `
    INSERT INTO notifications (user_id, title, message, status, date)
    VALUES (?, ?, ?, 'unread', NOW())
  `;
  const values = [user_id, title, message];

  connectDB.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting notification:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }

    res.json({
      success: true,
      message: "Notification created successfully!",
      notification: {
        id: result.insertId,
        user_id,
        title,
        message,
        status: "unread",
        date: new Date(),
      },
    });
  });
});

/**
 * ✅ Fetch notifications for a user
 */
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY date DESC
  `;
  connectDB.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, notifications: results });
  });
});

/**
 * ✅ Mark a notification as read
 */
router.patch("/:id/read", (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE notifications 
    SET status = 'read' 
    WHERE id = ?
  `;
  connectDB.query(sql, [id], (err) => {
    if (err) {
      console.error("Error updating notification:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Notification marked as read" });
  });
});

module.exports = router;
