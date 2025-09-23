const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path"); // ✅ Add this
const connectDB = require("./db");

const router = express.Router();

/**
 * ✅ REGISTER user
 */
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

/**
 * ✅ LOGIN user
 */
router.post("/login", (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  const query = "SELECT * FROM useraccount WHERE email = ?";
  connectDB.query(query, [email], async (err, result) => {
    if (err) {
      console.error("DB Select Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.length === 0) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(pass, user.pass.toString());

      if (!isMatch) {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }

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
    } catch (compareErr) {
      console.error("Compare Error:", compareErr);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
});

/**
 * ✅ GET all users
 */
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

/**
 * ✅ ADD user manually (admin)
 */
router.post("/users", async (req, res) => {
  const { firstname, lastname, contact, email, pass } = req.body;

  if (!firstname || !lastname || !contact || !email || !pass) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
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
        message: "User added successfully",
        userID: result.insertId,
      });
    });
  } catch (error) {
    console.error("Hashing Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ UPDATE user
 */
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, contact, email } = req.body;

  if (!firstname || !lastname || !contact || !email) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const sql = `
    UPDATE useraccount
    SET firstname=?, lastname=?, contact_num=?, email=?
    WHERE user_id=?
  `;

  connectDB.query(sql, [firstname, lastname, contact, email, id], (err) => {
    if (err) {
      console.error("DB Update Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "User updated" });
  });
});

/**
 * ✅ DELETE user
 */
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM useraccount WHERE user_id=?";
  connectDB.query(sql, [id], (err) => {
    if (err) {
      console.error("DB Delete Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "User deleted" });
  });
});

//SUBMIT RESERVATION TO DATABASE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // save in backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * ✅ SUBMIT RESERVATION
 */
router.post("/reservation", upload.single("photo"), (req, res) => {
  const { cemetery, fullname, contact, date, user_id } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (!cemetery || !fullname || !contact || !date || !photo || !user_id) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const sql = `
    INSERT INTO reservations (cemetery, fullname, contact, date, photo, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [cemetery, fullname, contact, date, photo, user_id];

  connectDB.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting reservation:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }
    res.json({
      success: true,
      message: "Reservation saved successfully!",
      id: result.insertId,
    });
  });
});
// Fetch all reservations
// Fetch all reservations
router.get("/reservations", (req, res) => {
  const sql = "SELECT * FROM reservations ORDER BY id DESC";
  connectDB.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching reservations:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }
    res.json({ success: true, reservations: results });
  });
});

// Update reservation (edit details or update status)
router.put("/reservations/:id", (req, res) => {
  const { cemetery, fullname, contact, date, status } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE reservations 
    SET cemetery=?, fullname=?, contact=?, date=?, status=?
    WHERE id=?
  `;
  const values = [cemetery, fullname, contact, date, status, id];

  connectDB.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating reservation:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }
    res.json({ success: true, message: "Reservation updated successfully!" });
  });
});

// Delete reservation
router.delete("/reservations/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM reservations WHERE id=?";
  connectDB.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting reservation:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }
    res.json({ success: true, message: "Reservation deleted successfully!" });
  });
});

module.exports = router;
