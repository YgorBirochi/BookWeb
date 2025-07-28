// ===================== NAVEGAÇÃO BÁSICA PERFIL ADMINISTRADOR =====================
// Adaptação da navegação do perfil de usuário para o perfil de administrador

import { gerarIconeUsuario } from './utils.js';

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
