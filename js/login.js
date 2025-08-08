import { loginUsuario } from "./api/auth.js";
import { atualizarHeaderUsuario, recarregarSecaoEmprestimos, mostrarErro, mostrarInfo } from "./utils.js";

// ===================== CONTROLES DE INTERFACE =====================

$(document).ready(function () {
    let $mostrarSenha = $('#mostrarSenha');
    let $ocultarSenha = $('#ocultarSenha');
    let $senha = $('#input-senha');

    $mostrarSenha.on('click', function () {
        $mostrarSenha.hide();
        $ocultarSenha.css('display', 'flex');
        $senha.attr('type', 'text');
    });

    $ocultarSenha.on('click', function () {
        $ocultarSenha.hide();
        $mostrarSenha.css('display', 'flex');
        $senha.attr('type', 'password');
    });
});

// ===================== FUNÇÕES DE AVISO DE EXPIRAÇÃO =====================

/**
 * Mostrar modal de aviso de expiração
 */
function mostrarAvisoExpiracao(aviso) {
    const titulo = aviso.dias_restantes === 1 ? 'URGENTE!' : 'AVISO IMPORTANTE';
    
    // Mensagem mais detalhada
    const mensagemCompleta = `
        ${aviso.mensagem}
        
        Data de expiração: ${aviso.data_expiracao}
        
        Para renovar sua conta, procure o bibliotecário do sistema.
    `;

    // Mostrar usando sua função existente
    mostrarInfo(titulo, mensagemCompleta);
    
    // Redirecionar após um tempo
    setTimeout(() => {
        redirecionarAposLogin();
    }, aviso.dias_restantes === 1 ? 10000 : 10000); 
}


/**
 * Função para redirecionar após o login
 */
function redirecionarAposLogin() {
    window.location.href = "../pages/acervo.html";
}

/**
 * Processar aviso de expiração salvo no sessionStorage
 * Chamar essa função em outras páginas se necessário
 */
export function processarAvisoExpiracaoSalvo() {
    const avisoSalvo = sessionStorage.getItem('aviso_expiracao');

    if (avisoSalvo) {
        try {
            const aviso = JSON.parse(avisoSalvo);

            // Aguardar um pouco para a página carregar completamente
            setTimeout(() => {
                mostrarAvimsoExpiracao(aviso);
            }, 1000);

            // Remover do sessionStorage após mostrar
            sessionStorage.removeItem('aviso_expiracao');

        } catch (error) {
            mostrarErro('Erro', 'Não foi possível processar o aviso de expiração:');
            sessionStorage.removeItem('aviso_expiracao');
        }
    }
}

// ===================== LOGIN COM API E VERIFICAÇÃO DE VIGÊNCIA =====================

$(document).ready(function () {
    $(".form-login").on("submit", async function (e) {
        e.preventDefault();

        const email = $("input[name='email']").val().trim();
        const senha = $("input[name='senha']").val();

        // Validações básicas
        if (!email || !senha) {
            mostrarErro("Email e senha são obrigatórios", "Coloque email e senha para fazer o login.");
            return;
        }

        // Desabilitar botão de submit durante a requisição
        const $submitBtn = $(this).find('button[type="submit"]');
        const textoOriginal = $submitBtn.text();
        $submitBtn.prop('disabled', true).text('Entrando...');

        try {
            const res = await loginUsuario(email, senha);

            // Armazenar dados do usuário e token
            localStorage.setItem("usuario", JSON.stringify(res.usuario));
            localStorage.setItem("token", res.token);

            // Atualizar header e recarregar seções
            atualizarHeaderUsuario();
            recarregarSecaoEmprestimos();

            // Reinicializar notificações após login
            setTimeout(() => {
                if (typeof inicializarModalNotificacoes === 'function') {
                    inicializarModalNotificacoes();
                }
            }, 100);

            if (res.aviso_expiracao) {
                // Armazenar no sessionStorage para uso posterior se necessário
                sessionStorage.setItem('aviso_expiracao', JSON.stringify(res.aviso_expiracao));

                // Mostrar modal de aviso (que incluirá o redirecionamento)
                mostrarAvisoExpiracao(res.aviso_expiracao);
            } else {
                // Sem aviso, redirecionar imediatamente
                redirecionarAposLogin();
            }

        } catch (error) {
            // Tratar diferentes tipos de erro
            let mensagemErro = "Erro ao fazer login.";

            if (typeof error === 'string') {
                mensagemErro = error;
            } else if (error.message) {
                mensagemErro = error.message;
            }

            mostrarErro(mensagemErro);

        } finally {
            // Reabilitar botão de submit
            $submitBtn.prop('disabled', false).text(textoOriginal);
        }
    });
});
