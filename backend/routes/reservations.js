const express = require("express");
const multer = require("multer");
const path = require("path");
const connectDB = require("../db");
const admin = require("../services/firebaseAdmin"); // ✅ Firebase Admin SDK

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

  const sql = `INSERT INTO reservations 
    (cemetery, fullname, contact, date, photo, user_id, status) 
    VALUES (?, ?, ?, ?, ?, ?, 'pending')`;

  connectDB.query(
    sql,
    [cemetery, fullname, contact, date, photo, user_id],
    (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
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
    "SELECT id, cemetery, fullname, contact, date, photo, user_id, status FROM reservations ORDER BY id DESC",
    (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({ success: true, reservations: results });
    }
  );
});

// UPDATE reservation (Admin Approval)
router.put("/:id", (req, res) => {
  const { cemetery, fullname, contact, date, status, user_id } = req.body;

  const sql = `UPDATE reservations 
    SET cemetery=?, fullname=?, contact=?, date=?, status=? 
    WHERE id=?`;

  connectDB.query(
    sql,
    [cemetery, fullname, contact, date, status, req.params.id],
    (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      // ✅ If approved, save notification & send push
      if (status === "approved" && user_id) {
        const title = "Reservation Approved";
        const body = "Your reservation has been approved.";

        // 1️⃣ Save notification in DB
        const notifSql = `
          INSERT INTO notifications (user_id, title, message, status, date)
          VALUES (?, ?, ?, 'unread', NOW())
        `;
        connectDB.query(notifSql, [user_id, title, body], (notifErr) => {
          if (notifErr) console.error("Error saving notification:", notifErr);
        });

        // 2️⃣ Fetch tokens for that user
        connectDB.query(
          "SELECT token FROM fcm_tokens WHERE user_id = ?",
          [user_id],
          async (tokenErr, rows) => {
            if (tokenErr) {
              console.error("Error fetching tokens:", tokenErr);
              return;
            }

            const tokens = rows.map((r) => r.token).filter(Boolean);
            if (!tokens.length) {
              console.log("⚠️ No FCM tokens found for user:", user_id);
              return;
            }

            try {
              // 3️⃣ Send push via Firebase Admin
              const message = {
                notification: { title, body },
                tokens,
              };

              const response = await admin.messaging().sendMulticast(message);
              console.log(
                `✅ FCM sent: ${response.successCount} success, ${response.failureCount} failed`
              );

              // 4️⃣ Remove invalid tokens
              const invalidTokens = [];
              response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  const errCode = resp.error?.code;
                  if (
                    errCode === "messaging/registration-token-not-registered" ||
                    errCode === "messaging/invalid-registration-token"
                  ) {
                    invalidTokens.push(tokens[idx]);
                  } else {
                    console.warn("FCM send error:", resp.error);
                  }
                }
              });

              if (invalidTokens.length) {
                const delSql = `DELETE FROM fcm_tokens WHERE token IN (${invalidTokens
                  .map(() => "?")
                  .join(",")})`;
                connectDB.query(delSql, invalidTokens, (delErr) => {
                  if (delErr)
                    console.error("Failed to remove invalid tokens:", delErr);
                });
              }
            } catch (sendErr) {
              console.error("Error sending FCM:", sendErr);
            }
          }
        );
      }

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
      if (err) {
        console.error("DB Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Reservation deleted" });
    }
  );
});

module.exports = router;
