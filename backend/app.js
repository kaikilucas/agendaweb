const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use((req, res, next) => {
  next();
});

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json()); // 🔥 TEM QUE VIR ANTES DAS ROTAS

const usuariosRoutes = require("./routes/usuarios.routes");
const agendamentoRoutes = require("./routes/agendamentos.routes");
const authRoutes = require("./routes/auth.routes");

// Rotas da API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api", authRoutes);
app.use("/api/agendamentos", agendamentoRoutes);

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

module.exports = app;
