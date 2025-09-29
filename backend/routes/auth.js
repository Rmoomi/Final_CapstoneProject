const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { firstname, lastname, contact, email, pass, confirmPass } = req.body;

  if (!firstname || !lastname || !contact || !email || !pass || !confirmPass) {
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
    const hashedPass = await bcrypt.hash(pass, 10);
    const sql = `
      INSERT INTO useraccount(firstname, lastname, contact_num, email, pass, date_entered)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const values = [firstname, lastname, contact, email, hashedPass];
    connectDB.query(sql, values, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      res.json({
        success: true,
        message: "Registered successfully",
        userID: result.insertId,
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass)
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });

  const query = "SELECT * FROM useraccount WHERE email = ?";
  connectDB.query(query, [email], async (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "Server error" });
    if (result.length === 0)
      return res.json({ success: false, message: "Invalid email or password" });

    const user = result[0];
    const isMatch = await bcrypt.compare(pass, user.pass.toString());
    if (!isMatch)
      return res.json({ success: false, message: "Invalid email or password" });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.user_id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  });
});

module.exports = router;
