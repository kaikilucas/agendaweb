const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth.routes");

app.use(cors()); // 👈 ESSENCIAL
app.use(express.json());

app.use("/api", authRoutes);

module.exports = app;
