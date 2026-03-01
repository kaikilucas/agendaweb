function gerarLinkWhatsApp(numero) {
  const numeroLimpo = numero.replace(/\D/g, ""); // remove tudo que não é número
  return `https://wa.me/55${numeroLimpo}`;
}

document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "index.html"; // volta para login
});

async function cancelar(id) {
  await fetch(`http://localhost:3000/api/agendamentos/cancelar/${id}`, {
    method: "PUT",
  });

  carregarAgendamentos();
}

function formatarData(dataISO) {
  return new Date(dataISO).toLocaleDateString("pt-BR");
}

async function confirmar(id) {
  await fetch(`http://localhost:3000/api/agendamentos/confirmar/${id}`, {
    method: "PUT",
  });

  carregarAgendamentos();
}

async function carregarAgendamentos() {
  const response = await fetch(
    "http://localhost:3000/api/agendamentos/admin/agendamentos",
  );
  const data = await response.json();

  const tabela = document.getElementById("tabelaAgendamentos");
  tabela.innerHTML = "";

  data.forEach((ag) => {
    tabela.innerHTML += `
      <tr>
       
        <td>${ag.email}</td>
        <td>${ag.nome} ${ag.sobrenome || ""}</td>
      <td>
  <a href="${gerarLinkWhatsApp(ag.whatsapp)}" target="_blank" style="color: green; text-decoration: none;">
    📱 ${ag.whatsapp}
  </a>
</td>

        <td>${formatarData(ag.data)}</td>
        <td>${ag.horario}</td>
        <td>${ag.descricao}</td>
        <td>
        ${
          ag.status === "confirmado"
            ? "<span class='status-confirmado'>Confirmado</span>"
            : ag.status === "cancelado"
              ? "<span class='status-cancelado'>Cancelado</span>"
              : "<span class='status-pendente'>Pendente</span>"
        }
      </td>

      <td>
        ${
          ag.status === "pendente"
            ? `
            <button onclick="confirmar(${ag.id})" class="btn-confirmar">
              Confirmar
            </button>
            <button onclick="cancelar(${ag.id})" class="btn-cancelar">
              Cancelar
            </button>
          `
            : ag.status === "confirmado"
              ? `
            <button onclick="cancelar(${ag.id})" class="btn-cancelar">
              Cancelar
            </button>
          `
              : ""
        }
      </td>
      </tr>
    `;
  });
}

carregarAgendamentos();
