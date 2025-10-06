const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const routes = require("./routes");
require("./db"); // ✅ Ensure MySQL connects

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure CORS to support Firebase Hosting and ngrok
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_1,
  process.env.ALLOWED_ORIGIN_2,
  process.env.ALLOWED_ORIGIN_3,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser or same-origin requests
      if (!origin) return callback(null, true);
      try {
        const normalized = origin.trim();
        const originHost = new URL(normalized).hostname;
        const isAllowedList = allowedOrigins.some((o) => o.trim() === normalized);
        const isNgrok = /ngrok-free\.app$/.test(originHost);
        const isFirebase = /web\.app$/.test(originHost) || /firebaseapp\.com$/.test(originHost);
        if (isAllowedList || isNgrok || isFirebase) return callback(null, true);
      } catch (_) {}
      // Fallback allow to avoid blocking testing; tighten in production as needed
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Ensure uploads directory exists and serve it statically (after CORS)
const uploadsDir = path.join(__dirname, "uploads");
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (_) {}
app.use("/uploads", express.static(uploadsDir));

// ✅ API routes (all inside /api prefix)
app.use("/api", routes);

// Start server
const PORT = 8080;
const HOST = "0.0.0.0"; // ✅ allows access from other devices

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running locally on http://${HOST}:${PORT}`);
  console.log(`🌐 Try http://<your-local-ip>:${PORT} from another device`);
  console.log(`👉 Now run: ngrok http ${PORT} in a separate terminal`);
});
