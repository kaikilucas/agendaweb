document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      document.getElementById("login-area").style.display = "none";
      document.getElementById("agendamento-area").style.display = "block";

      alert("Bem-vindo, " + data.usuario.nome);
      listarAgendamentos();
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    }
  });

function criarAgendamento() {
  fetch("http://localhost:3000/api/agendamentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: document.getElementById("nome").value,
      data: document.getElementById("data").value,
      horario: document.getElementById("horario").value,
      descricao: document.getElementById("descricao").value,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Agendamento criado com sucesso!");
      listarAgendamentos();
    });
}

function listarAgendamentos() {
  fetch("http://localhost:3000/api/agendamentos")
    .then((res) => res.json())
    .then((dados) => {
      const lista = document.getElementById("lista");
      lista.innerHTML = "";
      dados.forEach((a) => {
        const partes = a.data.split("T")[0].split("-");
        const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

        lista.innerHTML += `
         <li>
            <strong>Nome:</strong> ${a.nome}<br>
            <strong>Data:</strong> ${dataFormatada}<br>
            <strong>Horário:</strong> ${a.horario}<br>
            <strong>Descrição:</strong> ${a.descricao}
          </li>
        `;
      });
    });
}
