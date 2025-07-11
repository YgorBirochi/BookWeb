// atualizar labels flutuantes2
function atualizarLabelsFlutuantes() {
    // Inputs de texto e senha
    $('.div-input input').each(function() {
        const $input = $(this);
        const $label = $input.prev();
        if ($input.val().trim() !== '') {
            $label.addClass('active');
        } else {
            $label.removeClass('active');
        }
    });

    // Selects
    $('.div-select select, .div-date select').each(function() {
        const $select = $(this);
        const $label = $select.prev();
        if ($select.val() && $select.val() !== '') {
            $label.addClass('active');
        } else {
            $label.removeClass('active');
        }
    });
}

$('.div-input input, .div-select select, .div-date select, .div-date input[type="date"]').on('input change blur', atualizarLabelsFlutuantes);

$(document).ready(atualizarLabelsFlutuantes);  

// atualizar header usuario
export function atualizarHeaderUsuario() {
  const header = document.getElementById("header-user");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!header) return;

  if (usuario) {
      header.innerHTML = `
          <i class="fa-solid fa-bell"></i>
          <span><i class="fa-solid fa-circle-user"></i> ${usuario.nome_usuario}</span>
      `;
  } else {
      // Se não há usuário logado, remove o sino e mantém apenas o link de login
      const currentPath = window.location.pathname;
      const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
      const loginPath = isRoot ? 'pages/login.html' : '../pages/login.html';
      
      header.innerHTML = `
          <a href="${loginPath}"><i class="fa-solid fa-circle-user"></i> Entrar</a>
      `;
  }
}


// Utilitário para persistir notificações lidas
function getNotificacoesLidas() {
    return JSON.parse(localStorage.getItem('notificacoesLidas') || '[]');
}
function setNotificacoesLidas(ids) {
    localStorage.setItem('notificacoesLidas', JSON.stringify(ids));
}

// Modal de notificações 
$(document).ready(function() {
    // Só inicializar notificações se o usuário estiver logado
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        // Carregar modal de notificações se não existir
        if (!document.getElementById('modal-notificacoes')) {
            carregarComponente('modal-notificacoes', 'modal-container').then(() => {
                inicializarModalNotificacoes();
            });
        } else {
            inicializarModalNotificacoes();
        }
    }
});

function inicializarModalNotificacoes() {
    // IDs das notificações (pode ser dinâmico no futuro)
    const notificacaoIds = [];
    $('.notificacao-item').each(function(i) {
        const id = 'notificacao-' + i;
        $(this).attr('data-id', id);
        notificacaoIds.push(id);
    });

    // Marcar como lidas as notificações salvas
    const lidas = getNotificacoesLidas();
    $('.notificacao-item').each(function() {
        const id = $(this).attr('data-id');
        if (lidas.includes(id)) {
            $(this).removeClass('nao-lida');
        }
    });

    // Abrir modal de notificações ao clicar no sino
    $('.fa-bell').off('click').on('click', function(e) {
        e.stopPropagation();
        $('#modal-notificacoes').addClass('show');
    });

    // Fechar modal de notificações
    $('#fechar-notificacoes').off('click').on('click', function(e) {
        e.stopPropagation();
        $('#modal-notificacoes').removeClass('show');
    });

    // Fechar modal ao clicar fora dela
    $(document).off('click.notificacoes').on('click.notificacoes', function(e) {
        if (!$(e.target).closest('#modal-notificacoes').length && !$(e.target).hasClass('fa-bell')) {
            $('#modal-notificacoes').removeClass('show');
        }
    });

    // Marcar notificação como lida ao clicar
    $('.notificacao-item').off('click').on('click', function() {
        $(this).removeClass('nao-lida');
        const id = $(this).attr('data-id');
        let lidas = getNotificacoesLidas();
        if (!lidas.includes(id)) {
            lidas.push(id);
            setNotificacoesLidas(lidas);
        }
    });

    // Marcar todas como lidas
    $('.marcar-como-lidas').off('click').on('click', function() {
        $('.notificacao-item').removeClass('nao-lida');
        setNotificacoesLidas(notificacaoIds);
    });
}

// Modal de menu do usuário
$(document).ready(function() {
    inicializarModalMenu();
});

function inicializarModalMenu() {
    // Abrir modal de menu ao clicar no nome do usuário
    $(document).off('click.menu').on('click.menu', function(e) {
        const $target = $(e.target);
        
        // Verificar se clicou no nome do usuário ou no ícone
        if ($target.closest('#header-user span').length || $target.closest('#header-user i.fa-circle-user').length) {
            e.stopPropagation();
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            
            if (usuario) {
                // Atualizar informações do usuário na modal
                $('.user-name').text(usuario.nome_usuario || 'Usuário');
                $('.user-email').text(usuario.email || 'usuario@email.com');
                
                // Mostrar modal
                $('#modal-funcoes-menu').addClass('show');
            }
        }
    });

    // Fechar modal de menu
    $('#fechar-menu').off('click').on('click', function(e) {
        e.stopPropagation();
        $('#modal-funcoes-menu').removeClass('show');
    });

    // Fechar modal ao clicar fora dela
    $(document).off('click.menu-outside').on('click.menu-outside', function(e) {
        if (!$(e.target).closest('#modal-funcoes-menu').length && 
            !$(e.target).closest('#header-user').length) {
            $('#modal-funcoes-menu').removeClass('show');
        }
    });

    // Ações dos itens do menu
    $('.menu-item').off('click').on('click', function(e) {
        e.stopPropagation();
        const action = $(this).data('action');
        
        // Fechar modal
        $('#modal-funcoes-menu').removeClass('show');
        
        // Executar ação baseada no data-action
        switch(action) {
            case 'perfil':
                const currentPath = window.location.pathname;
                const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
                const perfilPath = isRoot ? 'pages/perfil-usuário.html' : 'perfil-usuário.html';
                window.location.href = perfilPath;
                break;
            case 'configuracoes':
                // Implementar página de configurações
                console.log('Abrir configurações');
                break;
            case 'preferencias':
                // Implementar página de preferências
                console.log('Abrir preferências');
                break;
            case 'emprestimos':
                // Implementar página de empréstimos
                console.log('Abrir empréstimos');
                break;
            case 'reservas':
                // Implementar página de reservas
                console.log('Abrir reservas');
                break;
            case 'historico':
                // Implementar página de histórico
                console.log('Abrir histórico');
                break;
            case 'favoritos':
                // Implementar página de favoritos
                console.log('Abrir favoritos');
                break;
            case 'avaliacoes':
                // Implementar página de avaliações
                console.log('Abrir avaliações');
                break;
            case 'recomendacoes':
                // Implementar página de recomendações
                console.log('Abrir recomendações');
                break;
            case 'ranking':
                // Mostrar modal de ranking
                $('#modal-ver-rank-emprestimos').addClass('show');
                break;
            case 'ajuda':
                // Implementar página de ajuda
                console.log('Abrir ajuda');
                break;
            case 'sobre':
                // Implementar página sobre
                console.log('Abrir sobre');
                break;
            case 'logout':
                // Fazer logout
                fazerLogout();
                break;
        }
    });
}

function fazerLogout() {
    // Limpar dados do usuário do localStorage
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    
    // Recarregar a seção de empréstimos se estiver na página inicial
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        recarregarSecaoEmprestimos();
    }
    
    // Redirecionar para a página inicial
    const currentPath = window.location.pathname;
    const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
    const redirectPath = isRoot ? 'index.html' : '../index.html';
    
    window.location.href = redirectPath;
}

// Atualizar contadores do menu (pode ser chamado quando necessário)
function atualizarContadoresMenu() {
    // Exemplo de como atualizar os badges
    // Aqui você pode fazer chamadas para a API para buscar dados reais
    
    // Empréstimos ativos
    const emprestimosAtivos = 3; // Buscar da API
    $('.menu-item[data-action="emprestimos"] .badge').text(emprestimosAtivos);
    
    // Reservas ativas
    const reservasAtivas = 1; // Buscar da API
    $('.menu-item[data-action="reservas"] .badge').text(reservasAtivas);
    
    // Ocultar badges se não houver contagem
    $('.menu-item .badge').each(function() {
        if ($(this).text() === '0') {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

// Controlar exibição da seção de empréstimos baseada no status de login
function controlarSecaoEmprestimos() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const emprestimosLogado = document.getElementById('emprestimos-logado');
    const emprestimosNaoLogado = document.getElementById('emprestimos-nao-logado');
    
    if (emprestimosLogado && emprestimosNaoLogado) {
        if (usuario) {
            // Usuário logado - mostrar empréstimos
            emprestimosLogado.style.display = 'flex';
            emprestimosNaoLogado.style.display = 'none';
        } else {
            // Usuário não logado - mostrar mensagem de login
            emprestimosLogado.style.display = 'none';
            emprestimosNaoLogado.style.display = 'flex';
        }
    }
}

// Função para recarregar a seção de empréstimos (pode ser chamada após login/logout)
export function recarregarSecaoEmprestimos() {
    controlarSecaoEmprestimos();
}

// Inicializar controle da seção de empréstimos quando a página carregar
$(document).ready(function() {
    controlarSecaoEmprestimos();
});
