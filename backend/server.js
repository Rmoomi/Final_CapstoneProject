const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

// Use all routes
app.use("/", routes);

// Start server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
