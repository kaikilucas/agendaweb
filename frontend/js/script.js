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
      localStorage.setItem("usuarioId", data.usuario.id);
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
      usuario_id: localStorage.getItem("usuarioId"),
    }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Agendamento criado com sucesso!");
      listarAgendamentos();
    });
}

function listarAgendamentos() {
  const usuarioId = localStorage.getItem("usuarioId");

  fetch(`http://localhost:3000/api/agendamentos?usuario_id=${usuarioId}`)
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
            <strong>Descrição:</strong> ${a.descricao}<br><br>

            <button onclick='editarAgendamento(${a.id}, "${a.nome}", "${a.data}", "${a.horario}", "${a.descricao}")'>
              Editar
            </button>

            <button onclick="excluirAgendamento(${a.id})">
              Excluir
            </button>
          </li>
        `;
      });
    });
}

function excluirAgendamento(id) {
  fetch(`http://localhost:3000/api/agendamentos/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      alert("Agendamento excluído!");
      listarAgendamentos();
    });
}

function editarAgendamento(id, nome, data, horario, descricao) {
  const novoNome = prompt("Novo nome:", nome);
  const novaData = prompt("Nova data (AAAA-MM-DD):", data.split("T")[0]);
  const novoHorario = prompt("Novo horário:", horario);
  const novaDescricao = prompt("Nova descrição:", descricao);

  fetch(`http://localhost:3000/api/agendamentos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: novoNome,
      data: novaData,
      horario: novoHorario,
      descricao: novaDescricao,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Agendamento atualizado!");
      listarAgendamentos();
    });
  function logout() {
    localStorage.removeItem("usuarioId");

    document.getElementById("agendamento-area").style.display = "none";
    document.getElementById("login-area").style.display = "block";

    alert("Você saiu do sistema.");
  }
}
function logout() {
  localStorage.removeItem("usuarioId");

  document.getElementById("agendamento-area").style.display = "none";
  document.getElementById("login-area").style.display = "block";

  alert("Você saiu do sistema.");
}
function gerarDatasDisponiveis() {
  const selectData = document.getElementById("data");
  selectData.innerHTML = '<option value="">Selecione a data</option>';

  const hoje = new Date();
  const limite = new Date();
  limite.setDate(hoje.getDate() + 60);

  for (let d = new Date(hoje); d <= limite; d.setDate(d.getDate() + 1)) {
    const diaSemana = d.getDay(); // 0 = domingo, 1 = segunda

    if (diaSemana !== 0 && diaSemana !== 1) {
      const dataFormatada = d.toISOString().split("T")[0];

      const option = document.createElement("option");
      option.value = dataFormatada;
      option.textContent = dataFormatada;

      selectData.appendChild(option);
    }
  }
}
window.onload = function () {
  gerarDatasDisponiveis();
};

function gerarHorariosDisponiveis(dataSelecionada) {
  const selectHorario = document.getElementById("horario");
  selectHorario.innerHTML = '<option value="">Selecione o horário</option>';

  const horarios = ["07:00", "09:00", "11:00", "14:00", "16:00"];

  const data = new Date(dataSelecionada);
  const diaSemana = data.getDay(); // 6 = sábado

  let horariosPermitidos = horarios;

  if (diaSemana === 6) {
    horariosPermitidos = ["07:00", "09:00", "11:00"];
  }

  horariosPermitidos.forEach((h) => {
    const option = document.createElement("option");
    option.value = h;
    option.textContent = h;
    selectHorario.appendChild(option);
  });
}
document.getElementById("data").addEventListener("change", function () {
  gerarHorariosDisponiveis(this.value);
});
window.addEventListener("load", function () {
  flatpickr("#data", {
    locale: flatpickr.l10ns.pt,
    dateFormat: "Y/m/d", // formato que aparece
    altInput: true, // cria campo visual separado
    altFormat: "d/m/Y", // formato visual
    minDate: "today",
    maxDate: new Date().fp_incr(60),

    disable: [
      function (date) {
        return date.getDay() === 0 || date.getDay() === 1;
      },
    ],
  });
});
