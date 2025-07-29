// ===================== NAVEGAÇÃO BÁSICA PERFIL ADMINISTRADOR =====================
// Adaptação da navegação do perfil de usuário para o perfil de administrador

import { gerarIconeUsuario } from './utils.js';

// Função para gerenciar a transição dos nav-cadastro-item
function gerenciarTransicaoNavCadastro() {
    const navItems = document.querySelectorAll('.nav-cadastro-item');

    navItems.forEach((item, index) => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove a classe active de todos os itens
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });

            // Adiciona a classe active apenas ao item clicado
            this.classList.add('active');

            // Obter a seção do item clicado
            const section = this.getAttribute('data-section');

            // Transicionar o conteúdo do formulário baseado na seção
            transicionarConteudoFormulario(section);
        });
    });

    // Garantir que o primeiro item esteja ativo por padrão se nenhum estiver
    document.querySelectorAll('.modal-nav-cadastro-completo, .modal-nav-cadastro-rapido').forEach(modal => {
        if (!modal.querySelector('.nav-cadastro-item.active')) {
            const primeiroItem = modal.querySelector('.nav-cadastro-item');
            if (primeiroItem) {
                primeiroItem.classList.add('active');
                // Ativar o conteúdo correspondente ao primeiro item
                const section = primeiroItem.getAttribute('data-section');
                transicionarConteudoFormulario(section);
            }
        }
    });
}

// Função para gerenciar a exibição dos formulários
function gerenciarExibicaoFormularios() {
    const formCompleto = document.querySelector('.div-cadastro-completo-body');
    const formRapido = document.querySelector('.div-cadastro-rapido-body');
    
    // Por padrão, mostrar o formulário rápido e esconder o completo
    if (formCompleto) formCompleto.style.display = 'none';
    if (formRapido) formRapido.style.display = 'flex';
}

// Função para transicionar o conteúdo do formulário
function transicionarConteudoFormulario(section) {
    const formCompleto = document.querySelector('.div-cadastro-completo-body');
    const formRapido = document.querySelector('.div-cadastro-rapido-body');

    // Mapear todas as seções (mesmo nome de data-section)
    const mapeamentoFormularios = {
        'inf_conta': '.form-informacoes-da-conta',
        'inf_usuario': '.form-informacoes-do-usuario',
        'inf_contato': '.form-informacoes-de-contato',
        'inf_curso': '.form-informacoes-de-curso'
    };

    // Verificar qual modal está visível
    const modalCompleto = document.querySelector('.modal-nav-cadastro-completo');
    const modalRapido = document.querySelector('.modal-nav-cadastro-rapido');
    
    let formularioAtivo = null;
    let secoesFormulario = null;

    // Verificar qual modal está sendo exibido
    if (modalCompleto && modalCompleto.style.display !== 'none') {
        formularioAtivo = formCompleto;
        secoesFormulario = formCompleto.querySelectorAll('.form-informacoes-da-conta, .form-informacoes-do-usuario, .form-informacoes-de-contato, .form-informacoes-de-curso');
    } else if (modalRapido && modalRapido.style.display !== 'none') {
        formularioAtivo = formRapido;
        secoesFormulario = formRapido.querySelectorAll('.form-informacoes-da-conta, .form-informacoes-do-usuario');
    }

    if (formularioAtivo && secoesFormulario) {
        // Esconder todas as seções do formulário
        secoesFormulario.forEach(secao => {
            secao.style.display = 'none';
        });

        // Mostrar apenas a seção correspondente
        const secaoCorrespondente = formularioAtivo.querySelector(mapeamentoFormularios[section]);
        if (secaoCorrespondente) {
            secaoCorrespondente.style.display = 'block';
        } 
    }
}

function gerenciarExibicaoNavCadastro() {
    const btnCadastroCompleto = document.querySelector('.div-cadastro-completo');
    const btnCadastroRapido = document.querySelector('.div-cadastro-rapido');

    const modalCompleto = document.querySelector('.modal-nav-cadastro-completo');
    const modalRapido = document.querySelector('.modal-nav-cadastro-rapido');

    // Exibe cadastro rápido por padrão
    modalCompleto.style.display = 'none';
    modalRapido.style.display = 'flex';
    
    // Gerenciar exibição dos formulários
    gerenciarExibicaoFormularios();

    // Clique em Cadastro Completo
    btnCadastroCompleto.addEventListener('click', () => {
        btnCadastroCompleto.classList.add('active');
        btnCadastroRapido.classList.remove('active');

        modalCompleto.style.display = 'flex';
        modalRapido.style.display = 'none';
        
        // Mostrar formulário completo e esconder o rápido
        const formCompleto = document.querySelector('.div-cadastro-completo-body');
        const formRapido = document.querySelector('.div-cadastro-rapido-body');
        if (formCompleto) formCompleto.style.display = 'flex';
        if (formRapido) formRapido.style.display = 'none';

        // Garantir que pelo menos um item esteja ativo
        const primeiroItem = modalCompleto.querySelector('.nav-cadastro-item');
        if (primeiroItem && !modalCompleto.querySelector('.nav-cadastro-item.active')) {
            primeiroItem.classList.add('active');
            // Ativar o conteúdo correspondente ao primeiro item
            const section = primeiroItem.getAttribute('data-section');
            transicionarConteudoFormulario(section);
        }
    });

    // Clique em Cadastro Rápido
    btnCadastroRapido.addEventListener('click', () => {
        btnCadastroRapido.classList.add('active');
        btnCadastroCompleto.classList.remove('active');

        modalCompleto.style.display = 'none';
        modalRapido.style.display = 'flex';
        
        // Mostrar formulário rápido e esconder o completo
        const formCompleto = document.querySelector('.div-cadastro-completo-body');
        const formRapido = document.querySelector('.div-cadastro-rapido-body');
        if (formCompleto) formCompleto.style.display = 'none';
        if (formRapido) formRapido.style.display = 'flex';

        // Garantir que pelo menos um item esteja ativo
        const primeiroItem = modalRapido.querySelector('.nav-cadastro-item');
        if (primeiroItem && !modalRapido.querySelector('.nav-cadastro-item.active')) {
            primeiroItem.classList.add('active');
            // Ativar o conteúdo correspondente ao primeiro item
            const section = primeiroItem.getAttribute('data-section');
            transicionarConteudoFormulario(section);
        }
    });
}

// Função para mostrar o conteúdo da seção ativa
function mostrarConteudo(secaoId) {
    $('.conteudo-perfil, .conteudo-info_user, .conteudo-emprestimo, .conteudo-reservas, .conteudo-usuarios, .conteudo-relatorio, .conteudo-configuracoes').removeClass('active');
    const $secaoAtiva = $('#' + secaoId);
    if ($secaoAtiva.length) {
        $secaoAtiva.addClass('active');
    }
}


$(document).ready(function () {
    // Preencher informações do usuário 
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        $(".user-info .icon-user").html(gerarIconeUsuario(usuario.nome_usuario, 40));
        $(".user-info .user-name").text(usuario.nome_usuario);
        $(".user-info .user-email").text(usuario.email);
    }
    $('.nav-item').each(function () {
        const $item = $(this);
        const $itemLink = $item.find('.item-link');

        if (!$itemLink.hasClass('logout')) {
            $itemLink.on('click', function (e) {
                e.preventDefault();
                const secaoId = $(this).data('section');
                $('.nav-item').not($item).removeClass('active');
                $item.addClass('active');
                mostrarConteudo(secaoId);
            });
        }
    });

    // Mostrar perfil por padrão
    if (!$('.conteudo-perfil.active, .conteudo-usuarios.active, .conteudo-obras.active, .conteudo-relatorio.active, .conteudo-configuracoes.active').length) {
        mostrarConteudo('conta');
        // Ativar o nav-item da Conta
        $(".nav-item").removeClass("active");
        $(".nav-item:first").addClass("active");
    }

    // Inicializar a funcionalidade de transição dos nav-cadastro-item
    gerenciarTransicaoNavCadastro();
    gerenciarExibicaoNavCadastro();
});

// label de emprestimos
const textosLabel = {
    titulo: 'Digite o título do livro',
    autor: 'Digite o nome do autor',
    cod_emprestimo: 'Digite o código do empréstimo',
    cod_reserva: 'Digite o código da reserva',
    cod_livro: 'Digite o código do livro',
    usuario: 'Digite o nome do usuário',
    cod_usuario: 'Digite o código do usuário',
    cpf_usuario: 'Digite o CPF do usuário'
};

const selects = document.querySelectorAll('.select-categoria');

selects.forEach(select => {
    select.addEventListener('change', function () {
        const valorSelecionado = select.value;
        const container = select.closest('.filtro-input');
        const label = container.querySelector('.div-input label');

        if (label) {
            label.textContent = textosLabel[valorSelecionado] || 'Insira uma categoria de busca';
        }
    });
});

// Textos personalizados no header para cada seção
const textosHeader = {
    conta: 'Conta',
    info_user: 'Conta',
    emprestimos: 'Biblioteca',
    reservas: 'Biblioteca',
    users: 'Biblioteca',
    relatorio: 'Biblioteca',
    config: 'Configurações'
};

const navLinks = document.querySelectorAll('.div-nav-perfil-administrador .item-link');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const headerSpan = document.querySelector('.container-name-section span');
        const section = link.dataset.section;
        headerSpan.textContent = textosHeader[section];
    });
});

// funções para ações da modal de editar usuários

function abrirModalCadastrarUsuarios() {
    // Mostrar modal
    $('#modal-adicionar-usuarios').addClass('show');
}

function fecharModalCadastrarUsuarios() {
    $('#modal-adicionar-usuarios').removeClass('show');
}

$(document).ready(function () {

    // Abrir modal 
    $('#cadastre-usuario').on('click', function (e) {
        e.preventDefault();
        abrirModalCadastrarUsuarios();
        
        // Inicializar o primeiro item do cadastro rápido por padrão
        setTimeout(() => {
            // Garantir que o formulário rápido seja exibido
            gerenciarExibicaoFormularios();
            
            const modalRapido = document.querySelector('.modal-nav-cadastro-rapido');
            const primeiroItem = modalRapido.querySelector('.nav-cadastro-item');
            if (primeiroItem && !modalRapido.querySelector('.nav-cadastro-item.active')) {
                primeiroItem.classList.add('active');
                const section = primeiroItem.getAttribute('data-section');
                transicionarConteudoFormulario(section);
            }
        }, 100);
    });

    // Fechar modal
    $('#fechar-cadastro-usuario').on('click', function (e) {
        e.preventDefault();
        fecharModalCadastrarUsuarios();
    });
});
