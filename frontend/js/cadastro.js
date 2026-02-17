async function cadastrar() {
  const nome = document.getElementById("nome").value;
  const sobrenome = document.getElementById("sobrenome").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!nome || !sobrenome || !whatsapp || !email || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  const response = await fetch("http://localhost:3000/api/usuarios/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, sobrenome, whatsapp, email, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert("Usuário criado com sucesso!");
  window.location.href = "index.html";
}
document.getElementById("whatsapp").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
  } else {
    value = value.replace(/^(\d*)/, "($1");
  }

  e.target.value = value;
});
