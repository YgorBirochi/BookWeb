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
    // Implementar modal ou redirecionamento para página completa
    console.log('Mostrando todos os empréstimos');
    
    // Exemplo: redirecionamento para página de empréstimos
    // window.location.href = 'pages/emprestimos.html';
    
    // Ou criar modal com lista completa
    alert('Funcionalidade: Ver todos os empréstimos\n\nAqui você pode implementar uma modal ou redirecionamento para uma página completa com todos os empréstimos do usuário.');
}

// Funcionalidades do ranking
$(document).ready(function() {
    inicializarRanking();
});

function inicializarRanking() {
    // Clique nos usuários do pódio
    $('.user-link').off('click').on('click', function(e) {
        e.preventDefault();
        const userName = $(this).find('.user-name').text();
        const userLevel = $(this).find('.user-level').text();
        const position = $(this).find('.position-badge').text();
        
        mostrarPerfilUsuario(userName, userLevel, position);
    });

    // Fechar modal de perfil
    $('#fechar-perfil, #modal-perfil-usuario .modal-overlay').off('click').on('click', function() {
        $('#modal-perfil-usuario').removeClass('show');
    });

    // Clique nas conquistas
    $('.achievement-item').off('click').on('click', function(e) {
        e.preventDefault();
        const achievementName = $(this).find('span').text();
        const achievementIcon = $(this).find('i').attr('class');
        
        mostrarDetalhesConquista(achievementName, achievementIcon);
    });

    // Hover nos elementos do pódio
    $('.podium-stats').hover(
        function() {
            $(this).find('.progress-fill').css('animation', 'progress-glow 1s ease-in-out');
        },
        function() {
            $(this).find('.progress-fill').css('animation', '');
        }
    );

    // Animação de entrada dos elementos
    animarEntradaRanking();
}

function mostrarPerfilUsuario(nome, nivel, posicao) {
    // Atualizar informações da modal
    $('#position-badge-grande').text(posicao);
    $('#perfil-nome').text(nome);
    $('#perfil-nivel').text(nivel);
    
    // Aqui você pode adicionar lógica para buscar dados reais do usuário
    // Por exemplo, baseado na posição, mostrar estatísticas diferentes
    const dadosUsuario = obterDadosUsuario(posicao);
    
    $('#perfil-emprestimos').text(dadosUsuario.emprestimos + ' empréstimos');
    $('#perfil-avaliacoes').text(dadosUsuario.avaliacoes + ' avaliações');
    $('#perfil-livros-lidos').text(dadosUsuario.livrosLidos);
    $('#perfil-horas').text(dadosUsuario.horas);
    $('#perfil-conquistas').text(dadosUsuario.conquistas);
    
    // Mostrar modal
    $('#modal-perfil-usuario').addClass('show');
}

function obterDadosUsuario(posicao) {
    // Simular dados baseados na posição do ranking
    const dados = {
        '1º': {
            emprestimos: 12,
            avaliacoes: 8,
            livrosLidos: 12,
            horas: 156,
            conquistas: 5
        },
        '2º': {
            emprestimos: 11,
            avaliacoes: 7,
            livrosLidos: 11,
            horas: 142,
            conquistas: 4
        },
        '3º': {
            emprestimos: 10,
            avaliacoes: 6,
            livrosLidos: 10,
            horas: 128,
            conquistas: 3
        }
    };
    
    return dados[posicao] || dados['1º'];
}

function mostrarDetalhesConquista(nome, icone) {
    const modalHtml = `
        <div class="modal" id="modal-conquista">
            <div class="modal-content">
                <i class="fa-solid fa-xmark" id="fechar-conquista"></i>
                <h2>Conquista</h2>
                <div class="conquista-detalhes">
                    <div class="conquista-icon">
                        <i class="${icone}"></i>
                    </div>
                    <h3>${nome}</h3>
                    <p>Parabéns! Você desbloqueou esta conquista por sua dedicação à leitura.</p>
                    <div class="conquista-progress">
                        <div class="progress-info">
                            <span>Progresso: 100%</span>
                            <span>Concluída!</span>
                        </div>
                        <div class="progress-bar-conquista">
                            <div class="progress-fill-conquista" style="width: 100%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-overlay"></div>
        </div>
    `;
    
    // Remover modal anterior se existir
    $('#modal-conquista').remove();
    
    // Adicionar novo modal
    $('body').append(modalHtml);
    
    // Mostrar modal
    $('#modal-conquista').addClass('show');
    
    // Fechar modal
    $('#fechar-conquista, .modal-overlay').off('click').on('click', function() {
        $('#modal-conquista').removeClass('show');
        setTimeout(() => {
            $('#modal-conquista').remove();
        }, 300);
    });
}

function animarEntradaRanking() {
    // Animação de entrada dos elementos do pódio
    $('.podium-three').css('opacity', '0').css('transform', 'translateY(20px)');
    $('.podium-one').css('opacity', '0').css('transform', 'translateY(20px)');
    $('.podium-two').css('opacity', '0').css('transform', 'translateY(20px)');
    
    setTimeout(() => {
        $('.podium-three').animate({opacity: 1, transform: 'translateY(0)'}, 600);
    }, 200);
    
    setTimeout(() => {
        $('.podium-one').animate({opacity: 1, transform: 'translateY(0)'}, 600);
    }, 400);
    
    setTimeout(() => {
        $('.podium-two').animate({opacity: 1, transform: 'translateY(0)'}, 600);
    }, 600);
    
    // Animação das barras de progresso
    setTimeout(() => {
        $('.progress-fill').each(function() {
            const width = $(this).css('width');
            $(this).css('width', '0').animate({width: width}, 1000, 'easeOutQuart');
        });
    }, 1200);
}


