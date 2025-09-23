const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
require("./db"); // ✅ Ensure MySQL connects

const app = express();
app.use(express.json());
app.use(cors());

// ✅ API routes (prefix with /api)
app.use("/api", routes);

// Start server
const PORT = 8080;
const HOST = "0.0.0.0"; // ✅ allows access from other devices

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running locally on http://${HOST}:${PORT}`);
  console.log(`🌐 Try http://<your-local-ip>:${PORT} from another device`);
  console.log(`👉 Now run: ngrok http ${PORT} in a separate terminal`);
});
