// modal ver rank emprestimos
$(document).ready(function() {
    $('#ver-mais').click(function() {
        $('#modal-ver-rank-emprestimos').addClass('show');
    });

    $('#fechar-modal, .modal-overlay').click(function() {
        $('#modal-ver-rank-emprestimos').removeClass('show');
    });

    // Fechar modal com tecla ESC
    $(document).keydown(function(e) {
        if (e.key === "Escape") {
            $('#modal-ver-rank-emprestimos').removeClass('show');
        }
    });
});

// Funcionalidades da seção de empréstimos
$(document).ready(function() {
    inicializarEmprestimos();
});

function inicializarEmprestimos() {
    // Botão ver detalhes
    $('.btn-detalhes').off('click').on('click', function(e) {
        e.stopPropagation();
        const $item = $(this).closest('.emprestimo-item');
        const titulo = $item.find('h4').text();
        const autor = $item.find('.autor').text();
        
        // Redirecionar para página de detalhes do livro
        // Você pode implementar uma modal ou redirecionamento
        console.log(`Ver detalhes: ${titulo} - ${autor}`);
        
        // Exemplo: abrir modal com detalhes
        mostrarDetalhesEmprestimo(titulo, autor);
    });

    // Fechar modal de detalhes
    $('#fechar-detalhes, #modal-detalhes-emprestimo .modal-overlay').off('click').on('click', function() {
        $('#modal-detalhes-emprestimo').removeClass('show');
    });

    // Botão ver todos os empréstimos
    $('.btn-ver-todos').off('click').on('click', function(e) {
        e.stopPropagation();
        
        // Redirecionar para página completa de empréstimos
        console.log('Ver todos os empréstimos');
        
        // Exemplo: redirecionamento
        // window.location.href = 'pages/emprestimos.html';
        
        // Ou abrir modal com lista completa
        mostrarTodosEmprestimos();
    });

    // Clique no item do empréstimo
    $('.emprestimo-item').off('click').on('click', function(e) {
        // Não executar se clicou em um botão
        if ($(e.target).closest('button').length) {
            return;
        }
        
        const titulo = $(this).find('h4').text();
        const autor = $(this).find('.autor').text();
        
        // Abrir detalhes do empréstimo
        mostrarDetalhesEmprestimo(titulo, autor);
    });
}

function mostrarDetalhesEmprestimo(titulo, autor) {
    // Atualizar informações da modal
    $('#livro-titulo').text(titulo);
    $('#livro-autor').text(autor);
    
    // Mostrar modal
    $('#modal-detalhes-emprestimo').addClass('show');
}

function mostrarTodosEmprestimos() {
    window.location.href = 'pages/perfil-usuario.html?secao=emprestimos';
}

// Funcionalidades do ranking
$(document).ready(function() {
    inicializarRanking();
});

// Exemplo de dados de usuários do ranking
const usuariosRanking = [
  {
    posicao: '1º',
    nome: 'João Santos',
    nivel: 'Ouro',
    emprestimos: 18,
    avaliacoes: 12,
    livrosLidos: 18,
    horas: 210,
    conquistas: 7
  },
  {
    posicao: '2º',
    nome: 'Ana Costa',
    nivel: 'Prata',
    emprestimos: 15,
    avaliacoes: 10,
    livrosLidos: 15,
    horas: 180,
    conquistas: 5
  },
  {
    posicao: '3º',
    nome: 'Maria Silva',
    nivel: 'Bronze',
    emprestimos: 13,
    avaliacoes: 8,
    livrosLidos: 13,
    horas: 150,
    conquistas: 4
  }
];

function inicializarRanking() {
    // Clique nos usuários do pódio
    $('.user-link').off('click').on('click', function(e) {
        e.preventDefault();
        const userName = $(this).find('.user-name').text();
        // Buscar usuário pelo nome no array de exemplo
        const usuario = usuariosRanking.find(u => u.nome === userName);
        if (usuario) {
            mostrarPerfilUsuario(usuario);
        }
    });

    // Fechar modal de perfil do usuário (garantindo overlay)
    $('#fechar-perfil, #modal-perfil-usuario .modal-overlay').off('click').on('click', function() {
        $('#modal-perfil-usuario').removeClass('show').fadeOut(300);
    });

    // Clique nas conquistas
    $('.achievement-item').off('click').on('click', function(e) {
        e.preventDefault();
        const achievementName = $(this).find('span').text();
        const achievementIcon = $(this).find('i').attr('class');
        
        mostrarDetalhesConquista(achievementName, achievementIcon);
    });

    // Fechar modal de conquista
    $('#fechar-conquista, #modal-conquista .modal-overlay').off('click').on('click', function() {
        $('#modal-conquista').removeClass('show');
    });

    // Hover nos elementos do pódio (agora controlado via CSS)

    // Animação de entrada dos elementos
    animarEntradaRanking();
}

function mostrarPerfilUsuario(usuario) {
    // Atualizar informações da modal
    $('#nome-usuario').text(usuario.nome);
    $('#email-usuario').text(usuario.email || 'usuario@gmail.com');
    $('#total-emprestimos-numero').text(usuario.emprestimos);
    $('#total-avaliacoes-numero').text(usuario.avaliacoes);
    $('#curso-usuario').text(usuario.curso || 'Engenharia de Software');
    // Mostrar modal usando a função dedicada
    abrirModalPerfilUsuario();
}

function mostrarDetalhesConquista(nome, icone) {
    // Atualizar informações da modal
    $('#conquista-nome').text(nome);
    $('#modal-conquista .conquista-icon i').attr('class', icone);
    
    // Mostrar modal
    $('#modal-conquista').addClass('show');
}

function animarEntradaRanking() {
    // Animação de entrada dos elementos do pódio
    $('.podium-three').addClass('animate-in');
    setTimeout(() => {
        $('.podium-one').addClass('animate-in');
    }, 200);
    setTimeout(() => {
        $('.podium-two').addClass('animate-in');
    }, 400);
    
}

function abrirModalPerfilUsuario() {
    $('#modal-perfil-usuario').addClass('show');
}
function fecharModalPerfilUsuario() {
    $('#modal-perfil-usuario').removeClass('show');
}

// Eventos de abrir/fechar robustos
$(document).ready(function() {
    // Fechar pelo botão X ou overlay
    $('#fechar-perfil, #modal-perfil-usuario .modal-overlay').off('click').on('click', function() {
        fecharModalPerfilUsuario();
    });
    // Fechar pelo ESC
    $(document).on('keydown.fecharPerfilUsuario', function(e) {
        if (e.key === 'Escape' && $('#modal-perfil-usuario').hasClass('show')) {
            fecharModalPerfilUsuario();
        }
    });
});
