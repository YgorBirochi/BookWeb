import { API_URL } from "./api.js";

// ===================== AUTENTICAÇÃO =====================

/**
 * Fazer login do usuário com verificação de vigência
 */
export async function loginUsuario(email, senha) {
  try {
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
    
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    throw error;
  }
}

/**
 * Fazer logout do usuário
 */
export async function logoutUsuario(token) {
  try {
    const resposta = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
    });

    if (!resposta.ok) {
      throw new Error("Erro ao fazer logout.");
    }

    return resposta.json();
    
  } catch (error) {
    console.error('Erro na requisição de logout:', error);
    throw error;
  }
}

// ===================== UTILITÁRIOS DE AUTENTICAÇÃO =====================

/**
 * Verificar se usuário está autenticado
 */
export function usuarioEstaLogado() {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  
  return !!(token && usuario);
}

/**
 * Obter dados do usuário logado
 */
export function obterUsuarioLogado() {
  try {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

/**
 * Limpar dados de autenticação
 */
export function limparDadosAutenticacao() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  sessionStorage.removeItem('aviso_expiracao');
}

/**
 * Verificar se token está válido (básico)
 */
export function tokenEValido() {
  const token = localStorage.getItem('token');
  return !!token;
}
