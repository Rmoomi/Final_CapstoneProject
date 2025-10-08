const express = require("express");

const authRoutes = require("./auth");
const userRoutes = require("./users");
const reservationRoutes = require("./reservations");
const feedbackRoutes = require("./feedback");
const adminAuthRoutes = require("./adminAuth");
const notificationRoutes = require("./notifications"); // ✅ match filename
const fcmRoutes = require("./fcm");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/reservations", reservationRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/admin", adminAuthRoutes);
router.use("/notifications", notificationRoutes);
router.use("/fcm", fcmRoutes); // ✅ added

module.exports = router;
