const express = require("express");
const cors = require("cors");
const path = require("path"); // precisa para servir arquivos
const app = express();
const agendamentoRoutes = require("./routes/agendamentos.routes");
const authRoutes = require("./routes/auth.routes");

app.use(cors()); // 👈 ESSENCIAL
app.use(express.json());
// Rotas da API
app.use("/api", authRoutes);

app.use("/api", agendamentoRoutes);

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

module.exports = app;
