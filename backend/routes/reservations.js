const express = require("express");
const multer = require("multer");
const path = require("path");
const connectDB = require("../db");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CREATE reservation
router.post("/", upload.single("photo"), (req, res) => {
  const { cemetery, fullname, contact, date, user_id } = req.body;
  const photo = req.file ? req.file.filename : null;
  const sql = `INSERT INTO reservations (cemetery, fullname, contact, date, photo, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
  connectDB.query(
    sql,
    [cemetery, fullname, contact, date, photo, user_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({
        success: true,
        message: "Reservation saved",
        id: result.insertId,
      });
    }
  );
});

// READ all reservations
router.get("/", (req, res) => {
  connectDB.query(
    "SELECT * FROM reservations ORDER BY id DESC",
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, reservations: results });
    }
  );
});

// UPDATE reservation
router.put("/:id", (req, res) => {
  const { cemetery, fullname, contact, date, status } = req.body;
  const sql = `UPDATE reservations SET cemetery=?, fullname=?, contact=?, date=?, status=? WHERE id=?`;
  connectDB.query(
    sql,
    [cemetery, fullname, contact, date, status, req.params.id],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Reservation updated" });
    }
  );
});

// DELETE reservation
router.delete("/:id", (req, res) => {
  connectDB.query(
    "DELETE FROM reservations WHERE id=?",
    [req.params.id],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({ success: true, message: "Reservation deleted" });
    }
  );
});

module.exports = router;
