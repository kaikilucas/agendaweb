const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Criar agendamento
router.post("/agendamentos", (req, res) => {
  const { nome, data, horario, descricao } = req.body;

  const sql = `
    INSERT INTO agendamentos (nome, data, horario, descricao)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, data, horario, descricao], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Agendamento criado com sucesso!" });
  });
});

// Listar agendamentos
router.get("/agendamentos", (req, res) => {
  db.query("SELECT * FROM agendamentos", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
