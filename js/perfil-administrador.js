// ===================== NAVEGAÇÃO BÁSICA PERFIL ADMINISTRADOR =====================
// Adaptação da navegação do perfil de usuário para o perfil de administrador

import { gerarIconeUsuario, mostrarSucesso, mostrarErro } from './utils.js';

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

// funções para ações da modal de cadastrar usuários

function limparModalCadastrarUsuarios() {
    // Limpar os campos
    $('#modal-adicionar-usuarios input[type="text"], #modal-adicionar-usuarios input[type="email"], #modal-adicionar-usuarios input[type="password"], #modal-adicionar-usuarios input[type="date"]').val('');
    $('#modal-adicionar-usuarios select').val('');

    // Resetar ícones de validação
    $('#modal-adicionar-usuarios ul li i')
        .removeClass('fa-circle-check')
        .addClass('fa-circle-xmark')
        .css('color', '#dc3545');

    // Resetar botão cadastrar
    $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

    // Resetar visibilidade dos botões de mostrar/ocultar senha
    $('#modal-adicionar-usuarios #ocultar-senha').hide();
    $('#modal-adicionar-usuarios #mostrar-senha').show();
    $('#modal-adicionar-usuarios input[name="confirmar_senha"]').attr('type', 'password');
}


function abrirModalCadastrarUsuarios() {
    // Mostrar modal
    $('#modal-adicionar-usuarios').addClass('show');
}

function fecharModalCadastrarUsuarios() {
    $('#modal-adicionar-usuarios').removeClass('show');
    limparModalCadastrarUsuarios();
}

$(document).ready(function () {
    // Abrir modal 
    $('#cadastre-usuario').on('click', function (e) {
        e.preventDefault();
        abrirModalCadastrarUsuarios();
    });

    // Fechar modal
    $('#fechar-cadastro-usuario').on('click', function (e) {
        e.preventDefault();
        fecharModalCadastrarUsuarios();
    });

    // ===================== FUNÇÕES DE VALIDAÇÃO DE SENHA FORTE =====================
    
    // Validação senha forte
    function validarSenhaForte(senha) {
        const criterios = {
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            numero: /\d/.test(senha),
            especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
            tamanho: senha.length >= 8
        };

        return criterios;
    }

    function senhaEForte(senha) {
        const criterios = validarSenhaForte(senha);
        return Object.values(criterios).every(criterio => criterio);
    }

    // Função para verificar se todos os campos estão preenchidos
    function verificarCamposPreenchidos() {
        const nomeUsuario = $('#modal-adicionar-usuarios input[name="nome_usuario"]').val().trim();
        const emailUsuario = $('#modal-adicionar-usuarios input[name="email_usuario"]').val().trim();
        const senha = $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val();
        const tipoUsuario = $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val();
        const dataVigencia = $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val();

        return nomeUsuario !== '' && 
               emailUsuario !== '' && 
               senha !== '' && 
               tipoUsuario !== '' && 
               dataVigencia !== '';
    }

    // Função para atualizar o botão de cadastrar
    function atualizarBotaoCadastrar() {
        const senha = $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val();
        const senhaValida = senhaEForte(senha);
        const camposPreenchidos = verificarCamposPreenchidos();

        if (senhaValida && camposPreenchidos) {
            $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', false).removeClass('btn-disabled');
        } else {
            $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', true).addClass('btn-disabled');
        }
    }

    // Event listener para validação de senha forte
    $('#modal-adicionar-usuarios input[name="confirmar_senha"]').on('input', function () {
        const senha = $(this).val();
        const criterios = validarSenhaForte(senha);

        // Atualizar ícones na lista de validação
        $('#modal-adicionar-usuarios ul li').each(function (index) {
            const $li = $(this);
            const $icon = $li.find('i');

            switch (index) {
                case 0: // Maiúsculas e minúsculas
                    if (criterios.maiuscula && criterios.minuscula) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 1: // Número
                    if (criterios.numero) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 2: // Caractere especial
                    if (criterios.especial) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 3: // 8 caracteres
                    if (criterios.tamanho) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
            }
        });

        atualizarBotaoCadastrar();
    });

    // Event listeners para verificar campos preenchidos
    $('#modal-adicionar-usuarios input[name="nome_usuario"], #modal-adicionar-usuarios input[name="email_usuario"], #modal-adicionar-usuarios select[name="tipo_usuario"], #modal-adicionar-usuarios input[name="data_vigencia_usuario"]').on('input change', function () {
        atualizarBotaoCadastrar();
    });

    // ===================== FUNÇÕES MOSTRAR/OCULTAR SENHA =====================
    
    // Mostrar senha
    $('#modal-adicionar-usuarios #mostrar-senha').on('click', function () {
        $('#modal-adicionar-usuarios #mostrar-senha').hide();
        $('#modal-adicionar-usuarios #ocultar-senha').show();
        $('#modal-adicionar-usuarios input[name="confirmar_senha"]').attr('type', 'text');
    });

    // Ocultar senha
    $('#modal-adicionar-usuarios #ocultar-senha').on('click', function () {
        $('#modal-adicionar-usuarios #ocultar-senha').hide();
        $('#modal-adicionar-usuarios #mostrar-senha').show();
        $('#modal-adicionar-usuarios input[name="confirmar_senha"]').attr('type', 'password');
    });

    // ===================== FUNÇÃO DE CADASTRO DE USUÁRIO =====================
    
    $('#modal-adicionar-usuarios .btn-confirmar').on('click', function (e) {
        e.preventDefault();

        const nomeUsuario = $('#modal-adicionar-usuarios input[name="nome_usuario"]').val().trim();
        const emailUsuario = $('#modal-adicionar-usuarios input[name="email_usuario"]').val().trim();
        const senha = $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val();
        const tipoUsuario = $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val();
        const dataVigencia = $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val();

        // Validações
        if (!nomeUsuario || !emailUsuario || !senha || !tipoUsuario || !dataVigencia) {
            mostrarErro('Campos Obrigatórios', 'Todos os campos são obrigatórios.');
            return;
        }

        if (!senhaEForte(senha)) {
            mostrarErro('Senha Fraca', 'A senha não atende aos critérios de segurança.');
            return;
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailUsuario)) {
            mostrarErro('Email Inválido', 'Por favor, insira um email válido.');
            return;
        }

        // Aqui você implementaria a lógica para cadastrar o usuário no backend
        // Por enquanto, vamos simular um sucesso
        mostrarSucesso('Usuário Cadastrado', 'O usuário foi cadastrado com sucesso!');
        
        // Limpar formulário
        $('#modal-adicionar-usuarios input[name="nome_usuario"]').val('');
        $('#modal-adicionar-usuarios input[name="email_usuario"]').val('');
        $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val('');
        $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val('');
        $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val('');
        
        // Resetar ícones de validação
        $('#modal-adicionar-usuarios ul li i').removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
        
        // Desabilitar botão
        $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', true).addClass('btn-disabled');
        
        // Fechar modal
        fecharModalCadastrarUsuarios();
    });
});
