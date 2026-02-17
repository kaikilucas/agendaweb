async function recuperarSenha() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Digite seu email");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/usuarios/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    // Verifica se é JSON antes de converter
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      alert(data.message);
    } else {
      const text = await response.text();
      console.error("Resposta não é JSON:", text);
      alert("Erro inesperado no servidor.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor.");
  }
}
