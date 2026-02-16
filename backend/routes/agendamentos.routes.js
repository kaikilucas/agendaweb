const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Criar agendamento
router.post("/", (req, res) => {
  const { nome, data, horario, descricao, usuario_id } = req.body;

  const verificarSql = `
  SELECT * FROM agendamentos
  WHERE data = ? AND horario = ?
`;

  db.query(verificarSql, [data, horario], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({
        message: "Este horário já foi agendado",
      });
    }

    // Se não existir, insere
    const sql = `
    INSERT INTO agendamentos (nome, data, horario, descricao, usuario_id)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(sql, [nome, data, horario, descricao, usuario_id], (err) => {
      if (err) return res.status(500).json(err);
      return res.json({ message: "Agendamento criado com sucesso!" });
    });
  });
});

// Listar agendamentos
router.get("/", (req, res) => {
  const { usuario_id } = req.query;
  db.query(
    "SELECT * FROM agendamentos WHERE usuario_id = ?",
    [usuario_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    },
  );
});

// Excluir agendamento
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM agendamentos WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Agendamento excluído com sucesso" });
  });
});

// Editar agendamento
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, data, horario, descricao } = req.body;

  const sql = `
    UPDATE agendamentos 
    SET nome = ?, data = ?, horario = ?, descricao = ?
    WHERE id = ?
  `;

  db.query(sql, [nome, data, horario, descricao, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Agendamento atualizado com sucesso" });
  });
});

module.exports = router;
