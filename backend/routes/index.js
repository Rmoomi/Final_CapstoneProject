const express = require("express");

const authRoutes = require("./auth");
const userRoutes = require("./users");
const reservationRoutes = require("./reservations");
const feedbackRoutes = require("./feedback");
const notificationRoutes = require("./notifications");
const adminAuthRoutes = require("./adminAuth");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/reservations", reservationRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminAuthRoutes); // ✅ remove extra "api"

module.exports = router;
