const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

// Use all routes
app.use("/", routes);

// Start server on all network interfaces
const PORT = 8080;
const HOST = "0.0.0.0"; // 👈 allows external devices to connect

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`🌐 Try http://<your-local-ip>:${PORT} from another device`);
});
