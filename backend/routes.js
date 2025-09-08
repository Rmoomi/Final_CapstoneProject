const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./db");

const router = express.Router();

// ✅ REGISTER user
router.post("/register", async (req, res) => {
  const { firstname, lastname, contact, email, pass, confirmPass } = req.body;

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
      if (err) {
        console.error("DB Insert Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({
        success: true,
        message: "Registered successfully",
        userID: result.insertId,
      });
    });
  } catch (error) {
    console.error("Hashing Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ LOGIN user
router.post("/login", (req, res) => {
  const { email, pass } = req.body;

  console.log("Login attempt with:", email, pass);

  const query = "SELECT * FROM useraccount WHERE email = ?";
  connectDB.query(query, [email], async (err, result) => {
    if (err) {
      console.error("DB Select Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.length === 0) {
      console.log("❌ No user found with email:", email);
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const user = result[0];
    console.log("🟢 Found user:", user);

    try {
      const isMatch = await bcrypt.compare(pass, user.pass.toString());
      console.log("Password match?", isMatch);

      if (isMatch) {
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
          },
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }
    } catch (compareErr) {
      console.error("Compare Error:", compareErr);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
});

// ✅ GET all users
router.get("/users", (req, res) => {
  connectDB.query(
    "SELECT user_id, firstname, lastname, email, contact_num, date_entered FROM useraccount",
    (err, result) => {
      if (err) {
        console.error("DB Select Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({ success: true, users: result });
    }
  );
});

// ✅ ADD user manually (admin)
router.post("/users", async (req, res) => {
  const { firstname, lastname, contact, email, pass } = req.body;

  try {
    const hashedPass = await bcrypt.hash(pass, 10);
    const sql = `
      INSERT INTO useraccount(firstname, lastname, contact_num, email, pass, date_entered)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const values = [firstname, lastname, contact, email, hashedPass];

    connectDB.query(sql, values, (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({
        success: true,
        message: "User added successfully",
        userID: result.insertId,
      });
    });
  } catch (error) {
    console.error("Hashing Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ UPDATE user
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, contact, email } = req.body;

  const sql = `
    UPDATE useraccount
    SET firstname=?, lastname=?, contact_num=?, email=?
    WHERE user_id=?
  `;

  connectDB.query(
    sql,
    [firstname, lastname, contact, email, id],
    (err, result) => {
      if (err) {
        console.error("DB Update Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "User updated" });
    }
  );
});

// ✅ DELETE user
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM useraccount WHERE user_id=?";
  connectDB.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Delete Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "User deleted" });
  });
});

module.exports = router;
