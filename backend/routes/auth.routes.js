const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

  db.query(sql, [email, senha], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    res.json({
      message: "Login realizado com sucesso",
      usuario: {
        id: result[0].id,
        nome: result[0].nome,
        email: result[0].email,
      },
    });
  });
});

module.exports = router;
