// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
require("dotenv").config();
require("./db");

const app = express();
app.use(express.json());

// ✅ Allow your Firebase Hosting domain + ngrok to call your backend
app.use("*", cors());

// ✅ Make uploads folder accessible to frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Use routes
app.use("/api", routes);

// ✅ Server listener — no need to hardcode ngrok
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log("✅ Server running locally");
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(
    `🌐 Accessible via ngrok: https://<your-ngrok-subdomain>.ngrok-free.app`
  );
});
