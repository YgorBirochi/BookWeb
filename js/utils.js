// atualizar labels flutuantes2
function atualizarLabelsFlutuantes() {
    // Inputs de texto e senha
    $('.div-input input').each(function () {
        const $input = $(this);
        const $label = $input.prev();

        // Para inputs de data, sempre manter o label ativo
        if ($input.attr('type') === 'date') {
            $label.addClass('active');
        } else if ($input.val().trim() !== '') {
            $label.addClass('active');
        } else {
            $label.removeClass('active');
        }
    });

    // Selects (incluindo os dentro de .div-input) - sempre manter o label ativo
    $('.div-select select, .div-date select, .div-input select').each(function () {
        const $select = $(this);
        const $label = $select.prev();
        $label.addClass('active');
    });
}

$('.div-input input, .div-select select, .div-date select, .div-date input[type="date"], .div-input select').on('input change blur', atualizarLabelsFlutuantes);

$(document).ready(atualizarLabelsFlutuantes);

// atualizar header usuario
export function atualizarHeaderUsuario() {
    const $header = $("#header-user");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!$header.length) return;

    if (usuario) {
        // Preenche os dados
        $header.find('#icone-usuario-header').html(gerarIconeUsuario(usuario.nome_usuario, 36));
        $header.find('a').hide();
        $header.find('#notificacoes').show();
        $header.find('.avatar-user').show();
    } else {
        // Se não há usuário logado, mostra apenas o link de login
        $header.find('.avatar-user').hide();
        $header.find('#notificacoes').hide();
        $header.find('a').show();
    }

    controlarExibicaoEmprestimos();
}


// Utilitário para persistir notificações lidas
function getNotificacoesLidas() {
    return JSON.parse(localStorage.getItem('notificacoesLidas') || '[]');
}
function setNotificacoesLidas(ids) {
    localStorage.setItem('notificacoesLidas', JSON.stringify(ids));
}

// Modal de notificações 
$(document).ready(function () {
    // Só inicializar notificações se o usuário estiver logado
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        inicializarModalNotificacoes();
    }
});

function inicializarModalNotificacoes() {
    // IDs das notificações (pode ser dinâmico no futuro)
    const notificacaoIds = [];
    $('.notificacao-item').each(function (i) {
        const id = 'notificacao-' + i;
        $(this).attr('data-id', id);
        notificacaoIds.push(id);
    });

    // Marcar como lidas as notificações salvas
    const lidas = getNotificacoesLidas();
    $('.notificacao-item').each(function () {
        const id = $(this).attr('data-id');
        if (lidas.includes(id)) {
            $(this).removeClass('nao-lida');
        }
    });

    // Abrir modal de notificações ao clicar no sino
    $('.fa-bell').off('click').on('click', function (e) {
        e.stopPropagation();
        $('#modal-notificacoes').addClass('show');
    });

    // Fechar modal de notificações
    $('#fechar-notificacoes').off('click').on('click', function (e) {
        e.stopPropagation();
        $('#modal-notificacoes').removeClass('show');
    });

    // Fechar modal ao clicar fora dela
    $(document).off('click.notificacoes').on('click.notificacoes', function (e) {
        if (!$(e.target).closest('#modal-notificacoes').length && !$(e.target).hasClass('fa-bell')) {
            $('#modal-notificacoes').removeClass('show');
        }
    });

    // Marcar notificação como lida ao clicar
    $('.notificacao-item').off('click').on('click', function () {
        $(this).removeClass('nao-lida');
        const id = $(this).attr('data-id');
        let lidas = getNotificacoesLidas();
        if (!lidas.includes(id)) {
            lidas.push(id);
            setNotificacoesLidas(lidas);
        }
    });

    // Marcar todas como lidas
    $('.marcar-como-lidas').off('click').on('click', function () {
        $('.notificacao-item').removeClass('nao-lida');
        setNotificacoesLidas(notificacaoIds);
    });
}

// Função para atualizar o badge do sino de notificações
export function atualizarBadgeNotificacoes() {
    const $notificacoes = $('#notificacoes');
    // Remove badge antigo, se existir
    $('.badge-notificacao').remove();
    if ($('.notificacao-item.nao-lida').length > 0 && $notificacoes.length) {
        // Calcula posição do sino na tela
        const offset = $notificacoes.offset();
        const width = $notificacoes.outerWidth();
        // Cria badge dinâmico
        const $badge = $('<span class="badge-notificacao"></span>').css({
            position: 'absolute',
            top: (offset.top - 2) + 'px',
            left: (offset.left + width - 6) + 'px',
            width: '10px',
            height: '10px',
            background: 'var(--cor-principal, #c0392b)',
            borderRadius: '50%',
            boxShadow: '0 0 2px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'block',
            border: '2px solid white',
            pointerEvents: 'none'
        });
        $('body').append($badge);
    }
}

// Atualizar badge ao carregar a página e ao abrir modal de notificações
$(document).ready(function () {
    atualizarBadgeNotificacoes();
    // Sempre que abrir a modal de notificações, atualizar badge
    $('#modal-notificacoes').on('show', atualizarBadgeNotificacoes);
    // Sempre que marcar como lidas, atualizar badge
    $('.marcar-como-lidas').on('click', function () {
        setTimeout(atualizarBadgeNotificacoes, 100);
    });
    // Sempre que clicar em uma notificação, atualizar badge
    $(document).on('click', '.notificacao-item', function () {
        setTimeout(atualizarBadgeNotificacoes, 100);
    });
    // Atualizar badge ao redimensionar ou rolar a tela
    $(window).on('resize scroll', function () {
        atualizarBadgeNotificacoes();
    });
});

// Modal de menu do usuário
$(document).ready(function () {
    inicializarModalMenu();
});

function inicializarModalMenu() {
    // Abrir modal de menu ao clicar no nome do usuário
    $(document).off('click.menu').on('click.menu', function (e) {
        const $target = $(e.target);

        if ($target.closest('#header-user span').length || $target.closest('#header-user .icone-usuario-header').length) {
            e.stopPropagation();
            const usuario = JSON.parse(localStorage.getItem("usuario"));

            if (usuario) {
                // Atualizar informações do usuário na modal
                // Substituir ícone por gerarIconeUsuario
                $('.user-info').html(`
                    <span class="icone-usuario-header-modal">${gerarIconeUsuario(usuario.nome_usuario, 40)}</span>
                    <div class="user-details">
                        <p class="user-name">${usuario.nome_usuario || 'Usuário'}</p>
                        <p class="user-email" style="font-style:italic;color:#888;">${usuario.email || 'usuario@email.com'}</p>
                    </div>
                `);
                const tipoUsuario = obterTipoUsuario();
                if (tipoUsuario === 'bibliotecario') {
                    $('.menu-section-usuario').hide();
                    $('.menu-section-bibliotecario').show();
                } else {
                    $('.menu-section-usuario').show();
                    $('.menu-section-bibliotecario').hide();
                }
                // Mostrar modal
                $('#modal-funcoes-menu').addClass('show');
            }
        }
    });

    // Fechar modal de menu
    $('#fechar-menu').off('click').on('click', function (e) {
        e.stopPropagation();
        $('#modal-funcoes-menu').removeClass('show');
    });

    // Fechar modal ao clicar fora dela
    $(document).off('click.menu-outside').on('click.menu-outside', function (e) {
        if (!$(e.target).closest('#modal-funcoes-menu').length &&
            !$(e.target).closest('#header-user').length) {
            $('#modal-funcoes-menu').removeClass('show');
        }
    });

    // Ações dos itens do menu
    $('.menu-item').off('click').on('click', function (e) {
        e.stopPropagation();
        const action = $(this).data('action');

        // Fechar modal
        $('#modal-funcoes-menu').removeClass('show');

        // Executar ação baseada no data-action
        switch (action) {
            // USUÁRIO
            case 'perfil-usuario':
                navegarParaPerfil('perfil');
                break;
            case 'biblioteca':
                navegarParaPerfilComSecao('emprestimos');
                break;
            case 'configuracoes-usuario':
                navegarParaPerfilComSecao('conta');
                break;

            // para todos os usuários
            case 'logout':
                fazerLogout();
                break;

            // ADMINISTRADOR
            case 'perfil-administrador':
                navegarParaPerfilAdministrador('perfil');
                break;
            case 'usuarios':
                navegarParaPerfilAdministrador('usuarios');
                break;
            case 'obras':
                navegarParaPerfilAdministrador('obras');
                break;
            case 'relatorios':
                navegarParaPerfilAdministrador('relatorios');
                break;
            case 'configuracoes-administrador':
                navegarParaPerfilAdministrador('configuracoes');
                break;
            default:
        }
    });
}

function navegarParaPerfilAdministrador(secao = 'perfil') {
    const currentPath = window.location.pathname;
    const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
    const perfilPath = isRoot ? 'pages/perfil-administrador.html' : 'perfil-administrador.html';

    localStorage.setItem('perfilSecaoAtiva', secao);

    window.location.href = perfilPath;
}

// Função para navegar para o perfil do usuário
function navegarParaPerfil(secao = 'perfil') {
    const currentPath = window.location.pathname;
    const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
    const perfilPath = isRoot ? 'pages/perfil-usuario.html' : 'perfil-usuario.html';

    // Salvar seção ativa no localStorage para ser usada na página de perfil
    localStorage.setItem('perfilSecaoAtiva', secao);

    window.location.href = perfilPath;
}

// Função para navegar para o perfil com uma seção específica
function navegarParaPerfilComSecao(secao) {
    const currentPath = window.location.pathname;
    const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
    const perfilPath = isRoot ? 'pages/perfil-usuario.html' : 'perfil-usuario.html';

    // Salvar seção ativa no localStorage
    localStorage.setItem('perfilSecaoAtiva', secao);

    window.location.href = perfilPath;
}

// Função para aplicar seção ativa na página de perfil
export function aplicarSecaoAtivaPerfil() {
    const secaoAtiva = localStorage.getItem('perfilSecaoAtiva');

    if (secaoAtiva) {
        // Função para mostrar conteúdo usando display flex/none
        function mostrarConteudo(secaoId) {
            // Esconder todos os conteúdos primeiro
            $('.conteudo-perfil, .conteudo-biblioteca, .conteudo-configuracoes').removeClass('active');

            // Mostrar o conteúdo da seção especificada
            const $secaoAtiva = $('#' + secaoId);
            if ($secaoAtiva.length) {
                $secaoAtiva.addClass('active');
            }
        }

        // Fechar todas as modais primeiro
        $('.modal-content').parent().removeClass('show').fadeOut(300);
        $('.chevron-down').show();
        $('.chevron-up').hide();

        // Mostrar a seção ativa usando display flex/none
        mostrarConteudo(secaoAtiva);

        // Ativar o nav-item correspondente
        $('.nav-item').removeClass('active');

        // Determinar qual nav-item ativar baseado na seção
        if (secaoAtiva === 'perfil' || secaoAtiva === 'dados-pessoais') {
            $('.nav-item:first-child').addClass('active');
            // Abrir modal do perfil
            $('#modal-sub-nav-perfil').addClass('show').fadeIn(300);
            $('.nav-item:first-child .chevron-down').hide();
            $('.nav-item:first-child .chevron-up').show();
        } else if (['emprestimos', 'historico', 'reservas'].includes(secaoAtiva)) {
            $('.nav-item:nth-child(2)').addClass('active');
            // Abrir modal da biblioteca
            $('#modal-sub-nav-biblioteca').addClass('show').fadeIn(300);
            $('.nav-item:nth-child(2) .chevron-down').hide();
            $('.nav-item:nth-child(2) .chevron-up').show();
        } else if (secaoAtiva === 'conta') {
            $('.nav-item:nth-child(3)').addClass('active');
        }

        // Limpar a seção ativa do localStorage após aplicar
        localStorage.removeItem('perfilSecaoAtiva');
    }
}

import { logoutUsuario } from './api/auth.js';
export async function fazerLogout() {
    // Mostrar confirmação antes de fazer logout
    mostrarConfirmacao(
        'Sair da Conta',
        'Tem certeza que deseja sair da sua conta?',
        async function () {
            const token = localStorage.getItem("token");
            try {
                if (token) {
                    await logoutUsuario(token);
                }
            } catch (e) {
                // Se der erro, ainda assim prosseguir com o logout local
                console.warn('Erro ao fazer logout na API:', e);
            }
            // Limpar dados do usuário do localStorage
            localStorage.removeItem("usuario"); 
            localStorage.removeItem("token");
            localStorage.removeItem("perfilSecaoAtiva");
            localStorage.removeItem("notificacoesLidas");

            // Fechar modais abertas
            $('.modal').removeClass('show');
            $('#modal-funcoes-menu').removeClass('show');
            $('#modal-notificacoes').removeClass('show');

            // Determinar para onde redirecionar baseado na página atual
            const currentPath = window.location.pathname;
            const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
            const isPerfil = currentPath.includes('perfil-usuario.html');
            const isLogin = currentPath.includes('login.html');

            // Atualizar o header imediatamente
            atualizarHeaderUsuario();

            // Recarregar a seção de empréstimos se estiver na página inicial
            if (isRoot) {
                recarregarSecaoEmprestimos();
            }

            // Redirecionar baseado na página atual
            if (isPerfil) {
                // Se estiver na página de perfil, redirecionar para login
                window.location.href = 'login.html';
            } else if (isLogin) {
                // Se estiver na página de login, apenas recarregar
                window.location.reload();
            } else {
                // Para outras páginas, redirecionar para a página inicial
                window.location.href = isRoot ? 'index.html' : '../index.html';
            }

            // Mostrar mensagem de sucesso
            mostrarSucesso('Logout Realizado', 'Você saiu da sua conta com sucesso!', {
                autoFechar: 2000
            });
        }
    );
}

// Função para controlar a seção de empréstimos na página inicial
function controlarSecaoEmprestimos() {
    // O ranking sempre fica visível
    controlarExibicaoEmprestimos();
}

// Função para controlar a exibição dos empréstimos (logado/não logado)
function controlarExibicaoEmprestimos() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const tipoUsuario = obterTipoUsuario();
    if (tipoUsuario === 'bibliotecario') {
        $('.container-rank-emprestimos').hide();
        return;
    }
    const $emprestimosLogado = $('#emprestimos-logado');
    const $emprestimosNaoLogado = $('#emprestimos-nao-logado');

    if ($emprestimosLogado.length && $emprestimosNaoLogado.length) {
        if (usuario) {
            $emprestimosLogado.show();
            $emprestimosNaoLogado.hide();
        } else {
            $emprestimosLogado.hide();
            $emprestimosNaoLogado.show();
        }
    }
}

// Função para recarregar a seção de empréstimos
export function recarregarSecaoEmprestimos() {
    controlarSecaoEmprestimos();
    controlarExibicaoEmprestimos();
}

// ===== MODAL DE MENSAGEM =====

/**
 * Exibe uma modal de mensagem
 * @param {Object} options - Opções da modal
 * @param {string} options.tipo - Tipo da mensagem: 'sucesso', 'erro', 'info'
 * @param {string} options.titulo - Título da mensagem
 * @param {string} options.mensagem - Texto da mensagem
 * @param {string} options.textoConfirmar - Texto do botão confirmar (padrão: 'OK')
 * @param {string} options.textoCancelar - Texto do botão cancelar (opcional)
 * @param {Function} options.onConfirmar - Função executada ao confirmar
 * @param {Function} options.onCancelar - Função executada ao cancelar
 * @param {number} options.autoFechar - Tempo em ms para fechar automaticamente (opcional)
 */
export function mostrarMensagem(options) {
    const {
        tipo = 'info',
        titulo = 'Mensagem',
        mensagem = '',
        textoConfirmar = 'OK',
        textoCancelar = null,
        onConfirmar = null,
        onCancelar = null,
        autoFechar = null
    } = options;

    const $modal = $('#modal-mensagem');
    const $titulo = $('#mensagem-titulo');
    const $texto = $('#mensagem-texto');
    const $btnConfirmar = $('#btn-confirmar');
    const $btnCancelar = $('#btn-cancelar');

    // Limpar classes anteriores
    $modal.removeClass('tipo-sucesso tipo-erro tipo-info');

    // Configurar tipo
    $modal.addClass(`tipo-${tipo}`);

    // Configurar conteúdo
    $titulo.text(titulo);
    $texto.text(mensagem);
    $btnConfirmar.text(textoConfirmar);

    // Configurar botão cancelar
    if (textoCancelar) {
        $btnCancelar.text(textoCancelar).show();
    } else {
        $btnCancelar.hide();
    }

    // Mostrar modal
    $modal.addClass('show');

    // Configurar eventos dos botões
    $btnConfirmar.off('click.mensagem').on('click.mensagem', function () {
        fecharMensagem();
        if (onConfirmar && typeof onConfirmar === 'function') {
            onConfirmar();
        }
    });

    $btnCancelar.off('click.mensagem').on('click.mensagem', function () {
        fecharMensagem();
        if (onCancelar && typeof onCancelar === 'function') {
            onCancelar();
        }
    });

    // Fechar com X
    $('#fechar-mensagem').off('click.mensagem').on('click.mensagem', function () {
        fecharMensagem();
        if (onCancelar && typeof onCancelar === 'function') {
            onCancelar();
        }
    });

    // Fechar ao clicar fora
    $modal.find('.modal-overlay').off('click.mensagem').on('click.mensagem', function () {
        fecharMensagem();
        if (onCancelar && typeof onCancelar === 'function') {
            onCancelar();
        }
    });

    // Fechar com ESC
    $(document).off('keydown.mensagem').on('keydown.mensagem', function (e) {
        if (e.key === 'Escape') {
            fecharMensagem();
            if (onCancelar && typeof onCancelar === 'function') {
                onCancelar();
            }
        }
    });

    // Auto fechar
    if (autoFechar && typeof autoFechar === 'number') {
        setTimeout(() => {
            fecharMensagem();
            if (onConfirmar && typeof onConfirmar === 'function') {
                onConfirmar();
            }
        }, autoFechar);
    }
}

/**
 * Fecha a modal de mensagem
 */
export function fecharMensagem() {
    const $modal = $('#modal-mensagem');
    $modal.removeClass('show');

    // Limpar eventos
    $(document).off('keydown.mensagem');
    $('#btn-confirmar, #btn-cancelar, #fechar-mensagem').off('click.mensagem');
    $modal.find('.modal-overlay').off('click.mensagem');
}

/**
 * Exibe uma mensagem de sucesso
 * @param {string} titulo - Título da mensagem
 * @param {string} mensagem - Texto da mensagem
 * @param {Object} options - Opções adicionais
 */
export function mostrarSucesso(titulo, mensagem, options = {}) {
    mostrarMensagem({
        tipo: 'sucesso',
        titulo,
        mensagem,
        ...options
    });
}

/**
 * Exibe uma mensagem de erro
 * @param {string} titulo - Título da mensagem
 * @param {string} mensagem - Texto da mensagem
 * @param {Object} options - Opções adicionais
 */
export function mostrarErro(titulo, mensagem, options = {}) {
    mostrarMensagem({
        tipo: 'erro',
        titulo,
        mensagem,
        ...options
    });
}

/**
 * Exibe uma mensagem informativa
 * @param {string} titulo - Título da mensagem
 * @param {string} mensagem - Texto da mensagem
 * @param {Object} options - Opções adicionais
 */
export function mostrarInfo(titulo, mensagem, options = {}) {
    mostrarMensagem({
        tipo: 'info',
        titulo,
        mensagem,
        ...options
    });
}

/**
 * Exibe uma confirmação
 * @param {string} titulo - Título da confirmação
 * @param {string} mensagem - Texto da confirmação
 * @param {Function} onConfirmar - Função executada ao confirmar
 * @param {Function} onCancelar - Função executada ao cancelar
 * @param {Object} options - Opções adicionais
 */
export function mostrarConfirmacao(titulo, mensagem, onConfirmar, onCancelar = null, options = {}) {
    mostrarMensagem({
        tipo: 'info',
        titulo,
        mensagem,
        textoConfirmar: 'Confirmar',
        textoCancelar: 'Cancelar',
        onConfirmar,
        onCancelar,
        ...options
    });
}

// Inicializar modal de mensagem
$(document).ready(function () {
    // Garantir que a modal existe no DOM
    if ($('#modal-mensagem').length === 0) {
        console.warn('Modal de mensagem não encontrada no DOM');
    }
});

/**
 * Retorna o tipo do usuário logado, ou null se não houver usuário.
 * @returns {string|null}
 */
export function obterTipoUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario && usuario.tipo_usuario ? usuario.tipo_usuario : null;
}

// Gera um ícone circular com cor aleatória e as iniciais do nome do usuário
export function gerarIconeUsuario(nomeUsuario, tamanho = 40) {
    // Extrai as iniciais do nome
    const iniciais = nomeUsuario
        .split(' ')
        .filter(Boolean)
        .map(p => p[0].toUpperCase())
        .slice(0, 2)
        .join('');
        
    const cor = '#B8B8B8';

    // Retorna o HTML do círculo com as iniciais
    return `
        <div style="
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: ${cor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${Math.floor(tamanho/2)}px;
            color: #fff;
            user-select: none;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        ">
            ${iniciais}
        </div>
    `;
}