let calendario;
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

async function criarAgendamento() {
  const nome = document.getElementById("nome").value;
  const whatsapp = document.getElementById("whatsapp").value.replace(/\D/g, "");
  const dataSelecionada = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;
  const descricao = document.getElementById("descricao").value;
  const usuario_id = localStorage.getItem("usuarioId");

  if (!nome || !whatsapp || !dataSelecionada || !horario || !descricao) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        whatsapp,
        data: dataSelecionada,
        horario,
        descricao,
        usuario_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Agendamento criado com sucesso!");

    await listarAgendamentos();
    await carregarHorarios(dataSelecionada);
    await atualizarDatasLotadas();

    document.getElementById("horario").value = "";
  } catch (error) {
    console.error(error);
    alert("Erro ao criar agendamento.");
  }
}
async function listarAgendamentos() {
  const usuarioId = localStorage.getItem("usuarioId");

  const response = await fetch(
    `http://localhost:3000/api/agendamentos?usuario_id=${usuarioId}`,
  );

  const dados = await response.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  dados.forEach((a) => {
    const partes = a.data.split("T")[0].split("-");
    const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    const diaSemana = obterDiaSemana(a.data.split("T")[0]);

    lista.innerHTML += `
      <li>
        <strong>Nome:</strong> ${a.nome}<br>
      <strong>WhatsApp:</strong> 
<a href="https://wa.me/55${a.whatsapp}" target="_blank">
  ${formatarWhatsApp(a.whatsapp)}
</a><br>
        <strong>Data:</strong> ${dataFormatada} - ${diaSemana}<br>

        <strong>Horário:</strong> ${a.horario.substring(0, 5)}<br>
        <strong>Serviço:</strong> ${a.descricao}<br><br>

        <button onclick='editarAgendamento(${a.id}, "${a.nome}", "${a.whatsapp}", "${a.data}", "${a.horario}", "${a.descricao}")'>
          Editar
        </button>

        <button onclick="excluirAgendamento(${a.id})">
        Cancelar Agendamento
        </button>
      </li>
    `;
  });
}

async function excluirAgendamento(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este agendamento?");

  if (!confirmar) return;

  await fetch(`http://localhost:3000/api/agendamentos/${id}`, {
    method: "DELETE",
  });

  alert("Agendamento excluído!");

  await listarAgendamentos();
  await atualizarDatasLotadas();

  const dataSelecionada = document.getElementById("data").value;
  if (dataSelecionada) {
    await carregarHorarios(dataSelecionada);
  }
}

function editarAgendamento(id, nome, whatsapp, data, horario, descricao) {
  const confirmar = confirm("Tem certeza que deseja editar o agendamento?");

  if (!confirmar) return;
  const novoNome = prompt("Novo nome:", nome);
  const novoWhatsapp = prompt("Novo whatsapp:", whatsapp);
  const novaData = prompt("Nova data (AAAA-MM-DD):", data.split("T")[0]);
  const novoHorario = prompt("Novo horário:", horario);
  const novaDescricao = prompt("Novo serviço:", descricao);

  fetch(`http://localhost:3000/api/agendamentos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: novoNome,
      whatsapp: novoWhatsapp,
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
}
function logout() {
  const confirmar = confirm("Tem certeza que deseja sair?");

  if (!confirmar) return;

  localStorage.removeItem("usuarioId");

  document.getElementById("agendamento-area").style.display = "none";
  document.getElementById("login-area").style.display = "block";

  alert("Você saiu do sistema.");
}

window.addEventListener("load", async function () {
  calendario = flatpickr("#data", {
    locale: flatpickr.l10ns.pt,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d-m-Y",
    minDate: "today",
    maxDate: new Date().fp_incr(60),
    disable: [
      function (date) {
        return date.getDay() === 0 || date.getDay() === 1;
      },
    ],
    onChange: function (selectedDates, dateStr) {
      carregarHorarios(dateStr);
    },
  });

  await atualizarDatasLotadas();
});

async function atualizarDatasLotadas() {
  const resposta = await fetch(
    "http://localhost:3000/api/agendamentos/datas-lotadas",
  );

  const datasLotadas = await resposta.json();

  calendario.set("disable", [
    function (date) {
      const diaSemana = date.getDay();
      if (diaSemana === 0 || diaSemana === 1) return true;

      const dataFormatada = date.toISOString().split("T")[0];
      return datasLotadas.includes(dataFormatada);
    },
  ]);

  calendario.redraw();
}

async function carregarHorarios(dataSelecionada) {
  const resposta = await fetch(
    `http://localhost:3000/api/agendamentos/ocupados/${dataSelecionada}`,
  );

  const horariosOcupados = await resposta.json();

  const select = document.getElementById("horario");
  select.innerHTML = '<option value="">Selecione o horário</option>';

  const data = new Date(dataSelecionada + "T00:00:00");
  const diaSemana = data.getDay(); // 6 = sábado

  let listaHorarios;

  if (diaSemana === 6) {
    // 🔥 SÁBADO
    listaHorarios = ["07:00", "09:00", "11:00"];
  } else {
    // 🔥 TERÇA A SEXTA
    listaHorarios = ["07:00", "09:00", "11:00", "14:00", "16:00"];
  }

  listaHorarios.forEach((hora) => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;

    const ocupado = horariosOcupados.some(
      (item) => item.horario.substring(0, 5) === hora,
    );

    if (ocupado) {
      option.disabled = true;
      option.textContent = hora + " (Ocupado)";
    }

    select.appendChild(option);
  });
}
async function carregarDatasLotadas() {
  const resposta = await fetch(
    "http://localhost:3000/api/agendamentos/datas-lotadas",
  );

  const datasLotadas = await resposta.json();

  flatpickr("#data", {
    locale: flatpickr.l10ns.pt,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d-m-Y",
    minDate: "today",
    maxDate: new Date().fp_incr(60),

    disable: [
      function (date) {
        const diaSemana = date.getDay();
        if (diaSemana === 0 || diaSemana === 1) return true;

        const dataFormatada = date.toISOString().split("T")[0];
        return datasLotadas.includes(dataFormatada);
      },
    ],

    onChange: function (selectedDates, dateStr) {
      carregarHorarios(dateStr);
    },
  });
}
document.getElementById("whatsapp").addEventListener("input", function (e) {
  let valor = e.target.value;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, "");

  // Limita a 11 números
  valor = valor.substring(0, 11);

  // Aplica a máscara
  if (valor.length > 6) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
  } else if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
  } else if (valor.length > 0) {
    valor = valor.replace(/^(\d*)$/, "($1");
  }

  e.target.value = valor;
});

function formatarWhatsApp(numero) {
  if (!numero) return "";

  numero = numero.replace(/\D/g, "");

  if (numero.length === 11) {
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  return numero;
}
function obterDiaSemana(dataString) {
  const data = new Date(dataString + "T00:00:00");

  const dias = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  return dias[data.getDay()];
}
