const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const user = results[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    res.json({
      message: "Login realizado com sucesso",
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });
  });
};
