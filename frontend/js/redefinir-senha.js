function pegarTokenDaURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

async function redefinirSenha() {
  const token = pegarTokenDaURL();
  const novaSenha = document.getElementById("novaSenha").value;

  if (!novaSenha) {
    alert("Digite a nova senha");
    return;
  }

  if (!token) {
    alert("Token inválido");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/usuarios/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, novaSenha }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Senha redefinida com sucesso!");
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com servidor.");
  }
}

//URL http://localhost:3000/redefinir-senha.html?token=CODIGOGERADO
