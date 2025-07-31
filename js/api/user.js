import { API_URL } from "./api.js";

// Função para cadastrar usuário simples
export async function cadastrarUsuarioSimples(dados) {
  const resposta = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_usuario: dados.nome_usuario,
      email: dados.email,
      senha: dados.senha,
      tipo_usuario: dados.tipo_usuario,
      data_vigencia: dados.data_vigencia
    }),
  });

  const dadosResposta = await resposta.json();

  if (!resposta.ok) {
    throw dadosResposta.erro || "Erro ao cadastrar usuário.";
  }

  return dadosResposta;
}

// Função para cadastrar usuário completo
export async function cadastrarUsuarioCompleto(dados) {
  const resposta = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_usuario: dados.nome_usuario,
      email: dados.email,
      senha: dados.senha,
      tipo_usuario: dados.tipo_usuario,
      data_vigencia: dados.data_vigencia,
      nome_completo: dados.nome_completo,
      cpf: dados.cpf,
      sexo: dados.sexo,
      data_nascimento: dados.data_nascimento,
      curso: dados.curso,
      periodo: dados.periodo,
      codigo_aluno: dados.codigo,
      telefone: dados.telefone,
      cep: dados.cep,
      endereco: dados.endereco
    }),
  });

  const dadosResposta = await resposta.json();

  if (!resposta.ok) {
    throw dadosResposta.erro || "Erro ao cadastrar usuário.";
  }

  return dadosResposta;
}

// Função para listar usuários (para o administrador)
export async function listarUsuarios() {
  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw dados.erro || "Erro ao listar usuários.";
  }

  return dados;
}

// Função para buscar usuário por ID
export async function buscarUsuarioPorId(id) {
  const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw dados.erro || "Erro ao buscar usuário.";
  }

  return dados;
}

// Função para atualizar usuário
export async function atualizarUsuario(id, dados) {
  const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  const dadosResposta = await resposta.json();

  if (!resposta.ok) {
    throw dadosResposta.erro || "Erro ao atualizar usuário.";
  }

  return dadosResposta;
}

// Função para deletar usuário
export async function deletarUsuario(id) {
  const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!resposta.ok) {
    const dados = await resposta.json();
    throw dados.erro || "Erro ao deletar usuário.";
  }

  return { mensagem: "Usuário deletado com sucesso!" };
}

export async function buscarDadosUsuarioLogado() {
  // Buscar token do localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw "Token de autenticação não encontrado.";
  }

  const resposta = await fetch(`${API_URL}/usuario/me`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw dados.erro || "Erro ao buscar dados do usuário.";
  }

  return dados.usuario; // Retorna apenas os dados do usuário
}