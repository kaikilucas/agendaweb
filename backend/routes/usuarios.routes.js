const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Esqueci senha
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email é obrigatório" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.json({
          message: "Se o email existir, você receberá instruções.",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      db.query(
        "UPDATE usuarios SET reset_token = ? WHERE email = ?",
        [token, email],
        (err) => {
          if (err) return res.status(500).json(err);

          console.log("Token gerado:", token);

          res.json({
            message: "Concluido verifique sua caixa de mensagem",
          });
        },
      );
    },
  );
});

// Criar usuário
router.post("/register", async (req, res) => {
  const { nome, sobrenome, whatsapp, email, senha } = req.body;
  const whatsappLimpo = whatsapp ? whatsapp.replace(/\D/g, "") : null;

  if (!whatsappLimpo || whatsappLimpo.length < 10) {
    return res.status(400).json({ error: "WhatsApp inválido" });
  }

  if (!nome || !sobrenome || !whatsapp || !email || !senha) {
    return res.status(400).json({
      message: "Todos os campos são obrigatórios",
    });
  }

  try {
    // Verificar se email já existe
    db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email já cadastrado",
          });
        }

        //Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);

        db.query(
          "INSERT INTO usuarios (nome, sobrenome, whatsapp, email, senha) VALUES (?, ?, ?, ? , ?)",
          [nome, sobrenome, whatsappLimpo, email, senhaHash],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "Usuário criado com sucesso!" });
          },
        );
      },
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, novaSenha } = req.body;

  if (!token || !novaSenha) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE reset_token = ?",
    [token],
    async (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
      }

      const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

      db.query(
        "UPDATE usuarios SET senha = ?, reset_token = NULL WHERE reset_token = ?",
        [senhaCriptografada, token],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Senha atualizada com sucesso" });
        },
      );
    },
  );
});

module.exports = router;
