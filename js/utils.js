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
      // Se não há usuário logado, mantém o link de login
      const currentPath = window.location.pathname;
      const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
      const loginPath = isRoot ? 'pages/login.html' : '../pages/login.html';
      
      header.innerHTML = `
          <i class="fa-solid fa-bell"></i>
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
    // Carregar modal de notificações se não existir
    if (!document.getElementById('modal-notificacoes')) {
        carregarComponente('modal-notificacoes', 'modal-container').then(() => {
            inicializarModalNotificacoes();
        });
    } else {
        inicializarModalNotificacoes();
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
