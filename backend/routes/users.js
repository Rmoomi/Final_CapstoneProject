const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("../db");

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  connectDB.query(
    "SELECT user_id, firstname, lastname, email, contact_num, date_entered FROM useraccount",
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, users: result });
    }
  );
});

// ADD user
router.post("/", async (req, res) => {
  const { firstname, lastname, contact, email, pass } = req.body;
  if (!firstname || !lastname || !contact || !email || !pass) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }
  const hashedPass = await bcrypt.hash(pass, 10);
  const sql = `
    INSERT INTO useraccount(firstname, lastname, contact_num, email, pass, date_entered)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  connectDB.query(
    sql,
    [firstname, lastname, contact, email, hashedPass],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({
        success: true,
        message: "User added successfully",
        userID: result.insertId,
      });
    }
  );
});

// UPDATE user
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, contact, email } = req.body;
  const sql = `UPDATE useraccount SET firstname=?, lastname=?, contact_num=?, email=? WHERE user_id=?`;
  connectDB.query(sql, [firstname, lastname, contact, email, id], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json({ success: true, message: "User updated" });
  });
});

// DELETE user
router.delete("/:id", (req, res) => {
  connectDB.query(
    "DELETE FROM useraccount WHERE user_id=?",
    [req.params.id],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "User deleted" });
    }
  );
});

module.exports = router;
