const express = require("express");
const connectDB = require("../db");

const router = express.Router();

// CREATE feedback
router.post("/", (req, res) => {
  const { user_id, rating, message } = req.body;
  const sql = `INSERT INTO feedback (user_id, rating, message, status, created_at, updated_at) VALUES (?, ?, ?, 'delivered', NOW(), NOW())`;
  connectDB.query(sql, [user_id, rating, message], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({
      success: true,
      message: "Feedback submitted",
      feedback: { id: result.insertId, user_id, rating, message },
    });
  });
});

// GET feedback (all or by user)
router.get("/", (req, res) => {
  const { user_id } = req.query;
  let sql = `
    SELECT f.*, u.firstname, u.lastname
    FROM feedback f JOIN useraccount u ON f.user_id = u.user_id
    ORDER BY f.created_at DESC
  `;
  let params = [];
  if (user_id) {
    sql = `
      SELECT f.*, u.firstname, u.lastname
      FROM feedback f JOIN useraccount u ON f.user_id = u.user_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    params = [user_id];
  }
  connectDB.query(sql, params, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({ success: true, feedbacks: results });
  });
});

// REPLY to feedback
router.post("/:id/reply", (req, res) => {
  const sql = `UPDATE feedback SET reply=?, status='replied', updated_at=NOW() WHERE id=?`;
  connectDB.query(sql, [req.body.reply, req.params.id], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Reply saved" });
  });
});

// DELETE feedback
router.delete("/:id", (req, res) => {
  connectDB.query(
    "DELETE FROM feedback WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ success: false, message: "Feedback not found" });
      res.json({ success: true, message: "Feedback deleted" });
    }
  );
});

module.exports = router;
