const app = require("./app");

app.use((req, res, next) => {
  console.log("Requisição recebida:", req.method, req.url);
  next();
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
