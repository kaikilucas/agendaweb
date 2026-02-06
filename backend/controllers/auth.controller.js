const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = bcrypt.hashSync(senha, 8);

  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  db.query(sql, [nome, email, hash], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Usuário cadastrado com sucesso" });
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const user = results[0];
    const senhaValida = bcrypt.compareSync(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    res.json({ message: "Login realizado com sucesso" });
  });
};
