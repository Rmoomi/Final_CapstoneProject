const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db"); // ✅ use pool

// ===== REGISTER ADMIN =====
router.post("/register", async (req, res) => {
  const { cemetery_name, fullname, email, pass, confirmPass } = req.body;

  if (!cemetery_name || !fullname || !email || !pass || !confirmPass) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  if (pass !== confirmPass) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    // ✅ Check if email already exists
    const [check] = await pool.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);
    if (check.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // ✅ Insert into DB
    const [result] = await pool.query(
      "INSERT INTO admin (cemetery_name, fullname, email, password_hash, created_at) VALUES (?, ?, ?, ?, NOW())",
      [cemetery_name, fullname, email, hashedPassword]
    );

    res.json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        admin_id: result.insertId,
        cemetery_name,
        fullname,
        email,
      },
    });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===== LOGIN ADMIN =====
router.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // ✅ Check if admin exists
    const [rows] = await pool.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const admin = rows[0];

    // ✅ Compare password
    const isMatch = await bcrypt.compare(pass, admin.password_hash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      admin: {
        admin_id: admin.admin_id,
        cemetery_name: admin.cemetery_name,
        fullname: admin.fullname,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Error logging in admin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
