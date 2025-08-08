// ===================== IMPORTS =====================
import { API_URL } from "./api.js";

// ===================== FUNÇÕES AUXILIARES =====================

/**
 * Função auxiliar para obter headers com token de autenticação
 * @returns {Object} Headers com token se disponível
 */
function obterHeadersComToken() {
  const token = localStorage.getItem('token');
  const headers = { "Content-Type": "application/json" };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Função auxiliar para tratar erros de resposta
 * @param {Response} resposta - Resposta da API
 * @param {Object} dados - Dados da resposta
 * @param {string} mensagemPadrao - Mensagem de erro padrão
 */
function tratarErroResposta(resposta, dados, mensagemPadrao) {
  if (!resposta.ok) {
    throw dados.erro || mensagemPadrao;
  }
}

// ===================== AUTENTICAÇÃO E PERFIL =====================

/**
 * Buscar dados do usuário logado
 * @returns {Promise<Object>} Dados do usuário
 */
export async function buscarDadosUsuarioLogado() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw "Token de autenticação não encontrado.";
  }

  try {
    const resposta = await fetch(`${API_URL}/usuario/me`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    const dados = await resposta.json();
    
    tratarErroResposta(resposta, dados, "Erro ao buscar dados do usuário.");
    
    return dados.usuario;
    
  } catch (error) {
    console.error('Erro na requisição buscarDadosUsuarioLogado:', error);
    throw error;
  }
}

/**
 * Atualizar informações da conta (nome de usuário e biografia)
 * @param {number} usuarioId - ID do usuário
 * @param {Object} dados - Dados para atualização
 * @returns {Promise<Object>} Resposta da API
 */
export async function atualizarInformacoesConta(usuarioId, dados) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
      method: "PUT",
      headers: obterHeadersComToken(),
      body: JSON.stringify({
        secao: "conta",
        nome_usuario: dados.nome_usuario,
        biografia: dados.biografia
      }),
    });

    const dadosResposta = await resposta.json();
    
    tratarErroResposta(resposta, dadosResposta, "Erro ao atualizar informações da conta.");
    
    return dadosResposta;
    
  } catch (error) {
    console.error('Erro na requisição atualizarInformacoesConta:', error);
    throw error;
  }
}

// ===================== GESTÃO DE USUÁRIOS (CRUD) =====================

/**
 * Cadastrar usuário com informações básicas
 * @param {Object} dados - Dados do usuário
 * @returns {Promise<Object>} Resposta da API
 */
export async function cadastrarUsuarioSimples(dados) {
  try {
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
    
    tratarErroResposta(resposta, dadosResposta, "Erro ao cadastrar usuário.");
    
    return dadosResposta;
    
  } catch (error) {
    console.error('Erro na requisição cadastrarUsuarioSimples:', error);
    throw error;
  }
}

/**
 * Cadastrar usuário com informações completas
 * @param {Object} dados - Dados completos do usuário
 * @returns {Promise<Object>} Resposta da API
 */
export async function cadastrarUsuarioCompleto(dados) {
  try {
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
    
    tratarErroResposta(resposta, dadosResposta, "Erro ao cadastrar usuário.");
    
    return dadosResposta;
    
  } catch (error) {
    console.error('Erro na requisição cadastrarUsuarioCompleto:', error);
    throw error;
  }
}

/**
 * Listar todos os usuários (apenas para administradores)
 * @returns {Promise<Object>} Lista de usuários
 */
export async function listarUsuarios() {
  try {
    const resposta = await fetch(`${API_URL}/usuarios`, {
      method: "GET",
      headers: obterHeadersComToken(),
    });

    const dados = await resposta.json();
    
    tratarErroResposta(resposta, dados, "Erro ao listar usuários.");
    
    return dados;
    
  } catch (error) {
    console.error('Erro na requisição listarUsuarios:', error);
    throw error;
  }
}

/**
 * Buscar usuário específico por ID
 * @param {number} id - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
export async function buscarUsuarioPorId(id) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "GET",
      headers: obterHeadersComToken(),
    });

    const dados = await resposta.json();
    
    tratarErroResposta(resposta, dados, "Erro ao buscar usuário.");
    
    return dados;
    
  } catch (error) {
    console.error('Erro na requisição buscarUsuarioPorId:', error);
    throw error;
  }
}

/**
 * Atualizar usuário (função genérica)
 * @param {number} id - ID do usuário
 * @param {Object} dados - Dados para atualização
 * @returns {Promise<Object>} Resposta da API
 */
export async function atualizarUsuario(id, dados) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: obterHeadersComToken(),
      body: JSON.stringify(dados),
    });

    const dadosResposta = await resposta.json();
    
    tratarErroResposta(resposta, dadosResposta, "Erro ao atualizar usuário.");
    
    return dadosResposta;
    
  } catch (error) {
    console.error('Erro na requisição atualizarUsuario:', error);
    throw error;
  }
}

/**
 * Deletar usuário
 * @param {number} id - ID do usuário
 * @returns {Promise<Object>} Confirmação da exclusão
 */
export async function deletarUsuario(id) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: obterHeadersComToken(),
    });

    if (!resposta.ok) {
      const dados = await resposta.json();
      throw dados.erro || "Erro ao deletar usuário.";
    }

    return { mensagem: "Usuário deletado com sucesso!" };
    
  } catch (error) {
    console.error('Erro na requisição deletarUsuario:', error);
    throw error;
  }
}

// ===================== ATUALIZAÇÃO DE INFORMAÇÕES ESPECÍFICAS =====================

/**
 * Atualizar informações pessoais do usuário
 * @param {number} usuarioId - ID do usuário
 * @param {Object} dados - Dados pessoais
 * @returns {Promise<Object>} Resposta da API
 */
export async function atualizarInformacoesUsuario(usuarioId, dados) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
      method: "PUT",
      headers: obterHeadersComToken(),
      body: JSON.stringify({
        secao: "usuario",
        nome_completo: dados.nome_completo,
        cpf: dados.cpf,
        sexo: dados.sexo,
        data_nascimento: dados.data_nascimento
      }),
    });

    const dadosResposta = await resposta.json();
    
    tratarErroResposta(resposta, dadosResposta, "Erro ao atualizar informações pessoais.");
    
    return dadosResposta;
    
  } catch (error) {
    console.error('Erro na requisição atualizarInformacoesUsuario:', error);
    throw error;
  }
}

/**
 * Atualizar informações do curso do usuário
 * @param {number} usuarioId - ID do usuário
 * @param {Object} dados - Dados do curso
 * @returns {Promise<Object>} Resposta da API
 */
export async function atualizarInformacoesCurso(usuarioId, dados) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
      method: "PUT",
      headers: obterHeadersComToken(),
      body: JSON.stringify({
        secao: "curso",
        curso: dados.curso,
        periodo: dados.periodo,
        codigo_aluno: dados.codigo_aluno,
        data_vigencia: dados.data_vigencia // Incluir se fornecida
      }),
    });

    const dadosResposta = await resposta.json();
    
    tratarErroResposta(resposta, dadosResposta, "Erro ao atualizar informações do curso.");
    
    return dadosResposta;
    
  } catch (error) {
    console.error('Erro na requisição atualizarInformacoesCurso:', error);
    throw error;
  }
}

/**
 * Atualizar informações de contato do usuário
 * @param {number} usuarioId - ID do usuário
 * @param {Object} dados - Dados de contato
 * @returns {Promise<Object>} Resposta da API
 */
export async function atualizarInformacoesContato(usuarioId, dados) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
      method: "PUT",
      headers: obterHeadersComToken(),
      body: JSON.stringify({
        secao: "contato",
        email: dados.email,
        telefone: dados.telefone,
        cep: dados.cep,
        endereco: dados.endereco
      }),
    });

    const dadosResposta = await resposta.json();
    
    tratarErroResposta(resposta, dadosResposta, "Erro ao atualizar informações de contato.");
    
    return dadosResposta;
    
  } catch (error) {
    console.error('Erro na requisição atualizarInformacoesContato:', error);
    throw error;
  }
}

// ===================== FUNÇÕES DE UTILIDADE =====================

/**
 * Verificar se usuário está autenticado
 * @returns {boolean} Status de autenticação
 */
export function usuarioEstaAutenticado() {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  
  return !!(token && usuario);
}

/**
 * Obter dados básicos do usuário do localStorage
 * @returns {Object|null} Dados do usuário ou null
 */
export function obterUsuarioLocal() {
  try {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    console.error('Erro ao obter usuário do localStorage:', error);
    return null;
  }
}

/**
 * Limpar dados de autenticação
 */
export function limparAutenticacao() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

/**
 * Verificar se usuário é administrador
 * @returns {boolean} Se é administrador
 */
export function usuarioEhAdmin() {
  const usuario = obterUsuarioLocal();
  return usuario && ['administrador', 'bibliotecario'].includes(usuario.tipo_usuario);
}
