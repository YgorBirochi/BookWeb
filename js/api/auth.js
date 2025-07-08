import { API_URL } from "./api.js";

export async function loginUsuario(email, senha) {
  const resposta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw dados.erro || "Erro ao fazer login.";
  }

  return dados;
}

