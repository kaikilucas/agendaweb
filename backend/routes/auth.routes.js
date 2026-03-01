const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    const user = result[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    res.json({
      message: "Login realizado com sucesso",
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  });
});

module.exports = router;
