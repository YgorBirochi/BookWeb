// ===================== NAVEGAÇÃO BÁSICA PERFIL ADMINISTRADOR =====================
// Adaptação da navegação do perfil de usuário para o perfil de administrador

import { gerarIconeUsuario, mostrarSucesso, mostrarErro } from './utils.js';
import { cadastrarUsuarioSimples, cadastrarUsuarioCompleto, buscarDadosUsuarioLogado } from './api/user.js';

// ===================== FUNÇÕES DE VALIDAÇÃO DE SENHA FORTE =====================
// Validação senha forte (movida para escopo global)
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

// Função para mostrar o conteúdo da seção ativa
function mostrarConteudo(secaoId) {
    $('.conteudo-perfil, .conteudo-info_user, .conteudo-emprestimo, .conteudo-reservas, .conteudo-usuarios, .conteudo-relatorio, .conteudo-configuracoes').removeClass('active');
    const $secaoAtiva = $('#' + secaoId);
    if ($secaoAtiva.length) {
        $secaoAtiva.addClass('active');
    }
}

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

// funções da modal de adicionar usuario completo
function transferirDadosParaModalCompleta() {
    // Obter dados da modal simples
    const nomeUsuario = $('#modal-adicionar-usuarios input[name="nome_usuario"]').val();
    const emailUsuario = $('#modal-adicionar-usuarios input[name="email_usuario"]').val();
    const senha = $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val();
    const tipoUsuario = $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val();
    const dataVigencia = $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val();

    // Preencher campos correspondentes na modal completa
    $('#modal-adicionar-usuarios-completo input[name="nome_usuario"]').val(nomeUsuario);
    $('#modal-adicionar-usuarios-completo input[name="email_usuario"]').val(emailUsuario);
    $('#modal-adicionar-usuarios-completo input[name="senha"]').val(senha);
    $('#modal-adicionar-usuarios-completo select[name="tipo_usuario"]').val(tipoUsuario);
    $('#modal-adicionar-usuarios-completo input[name="data_vigencia"]').val(dataVigencia);

    // Atualizar validação de senha forte na modal completa
    if (senha) {
        const criterios = validarSenhaForte(senha);

        // Atualizar ícones na lista de validação da modal completa
        $('#modal-adicionar-usuarios-completo ul li').each(function (index) {
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
    }
}

function abrirModalCadastrarUsuariosCompleto() {
    // Transferir dados da modal simples para a modal completa
    transferirDadosParaModalCompleta();
    // Mostrar modal
    $('#modal-adicionar-usuarios-completo').addClass('show');
}

function fecharModalCadastrarUsuariosCompleto() {
    $('#modal-adicionar-usuarios-completo').removeClass('show');
    limparModalCadastrarUsuariosCompleto();
}

function limparModalCadastrarUsuariosCompleto() {
    // Limpar os campos
    $('#modal-adicionar-usuarios-completo input[type="text"], #modal-adicionar-usuarios-completo input[type="email"], #modal-adicionar-usuarios-completo input[type="password"], #modal-adicionar-usuarios-completo input[type="date"], #modal-adicionar-usuarios-completo input[type="tel"]').val('');
    $('#modal-adicionar-usuarios-completo select').val('');

    // Resetar ícones de validação
    $('#modal-adicionar-usuarios-completo ul li i')
        .removeClass('fa-circle-check')
        .addClass('fa-circle-xmark')
        .css('color', '#dc3545');

    // Resetar botão cadastrar
    $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

    // Resetar visibilidade dos botões de mostrar/ocultar senha
    $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').hide();
    $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').show();
    $('#modal-adicionar-usuarios-completo input[name="senha"]').attr('type', 'password');
}

// Função para verificar se todos os campos obrigatórios estão preenchidos na modal completa
function verificarCamposObrigatoriosCompleto() {
    const nomeUsuario = $('#modal-adicionar-usuarios-completo input[name="nome_usuario"]').val().trim();
    const emailUsuario = $('#modal-adicionar-usuarios-completo input[name="email_usuario"]').val().trim();
    const senha = $('#modal-adicionar-usuarios-completo input[name="senha"]').val();
    const tipoUsuario = $('#modal-adicionar-usuarios-completo select[name="tipo_usuario"]').val();
    const dataVigencia = $('#modal-adicionar-usuarios-completo input[name="data_vigencia"]').val();
    const nomeCompleto = $('#modal-adicionar-usuarios-completo input[name="nome_completo"]').val().trim();
    const dataNascimento = $('#modal-adicionar-usuarios-completo input[name="data_nascimento"]').val();
    const curso = $('#modal-adicionar-usuarios-completo select[name="curso"]').val();
    const codigo = $('#modal-adicionar-usuarios-completo input[name="codigo"]').val().trim();
    const telefone = $('#modal-adicionar-usuarios-completo input[name="telefone"]').val().trim();

    return nomeUsuario !== '' &&
        emailUsuario !== '' &&
        senha !== '' &&
        tipoUsuario !== '' &&
        dataVigencia !== '' &&
        nomeCompleto !== '' &&
        dataNascimento !== '' &&
        curso !== '' &&
        codigo !== '' &&
        telefone !== '';
}

// Função para atualizar o botão de cadastrar da modal completa
function atualizarBotaoCadastrarCompleto() {
    const senha = $('#modal-adicionar-usuarios-completo input[name="senha"]').val();
    const senhaValida = senhaEForte(senha);
    const camposPreenchidos = verificarCamposObrigatoriosCompleto();

    if (senhaValida && camposPreenchidos) {
        $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', false).removeClass('btn-disabled');
    } else {
        $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', true).addClass('btn-disabled');
    }
}

// Função melhorada para exibir informações do usuário
async function exibirInformacoesUsuario() {
    try {
        const dadosUsuario = await buscarDadosUsuarioLogado();
        
        // Preencher informações do usuário com verificação de existência
        if (dadosUsuario.nome_completo) {
            $('#info_user .item-info:nth-child(2) span').text(dadosUsuario.nome_completo);
        }
        
        if (dadosUsuario.cpf) {
            $('#info_user .item-info:nth-child(3) span').text(dadosUsuario.cpf);
        }
        
        if (dadosUsuario.sexo) {
            const sexoFormatado = dadosUsuario.sexo.charAt(0).toUpperCase() + dadosUsuario.sexo.slice(1);
            $('#info_user .item-info:nth-child(4) span').text(sexoFormatado);
        }
        
        if (dadosUsuario.data_nascimento) {
            const dataFormatada = new Date(dadosUsuario.data_nascimento).toLocaleDateString('pt-BR');
            $('#info_user .item-info:nth-child(5) span').text(dataFormatada);
        }
        
        // Preencher informações do curso
        if (dadosUsuario.curso) {
            $('#info_user .container-info-curso .item-info:nth-child(2) span').text(dadosUsuario.curso);
        }
        
        if (dadosUsuario.periodo) {
            $('#info_user .container-info-curso .item-info:nth-child(3) span').text(dadosUsuario.periodo);
        }
        
        if (dadosUsuario.codigo_aluno) {
            $('#info_user .container-info-curso .item-info:nth-child(4) span').text(dadosUsuario.codigo_aluno);
        }
        
        if (dadosUsuario.data_vigencia) {
            const dataVigenciaFormatada = new Date(dadosUsuario.data_vigencia).toLocaleDateString('pt-BR');
            $('#info_user .container-info-curso .item-info:nth-child(5) span').text(dataVigenciaFormatada);
        }
        
        // Preencher informações de contato
        if (dadosUsuario.email) {
            $('#info_user .container-info-contato .item-info:nth-child(2) span').text(dadosUsuario.email);
        }
        
        if (dadosUsuario.telefone) {
            $('#info_user .container-info-contato .item-info:nth-child(3) span').text(dadosUsuario.telefone);
        }
        
        if (dadosUsuario.cep) {
            $('#info_user .container-info-contato .item-info:nth-child(4) span').text(dadosUsuario.cep);
        }
        
        if (dadosUsuario.endereco) {
            $('#info_user .container-info-contato .item-info:nth-child(5) span').text(dadosUsuario.endereco);
        }
        
    } catch (erro) {
        console.error('Erro ao carregar informações do usuário:', erro);
        
        // Se o erro for de autenticação, redirecionar para login
        if (erro.includes('Token') || erro.includes('autenticação')) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login'
            return;
        }
        
        // Caso contrário, mostrar dados mockados ou mensagem de erro
        mostrarErro('Erro', 'Não foi possível carregar os dados do usuário.');
        exibirDadosMockados(); // Manter como fallback
    }
}

// Função para exibir dados mockados (para demonstração)
function exibirDadosMockados() {
    const dadosMockados = {
        nome_completo: "-",
        cpf: "-",
        sexo: "-",
        data_nascimento: "-",
        curso: "-",
        periodo: "-",
        codigo_aluno: "-",
        data_vigencia: "-",
        email: "-",
        telefone: "-",
        cep: "-",
        endereco: "-"
    };
    
    // Preencher informações do usuário
    $('#info_user .item-info:nth-child(2) span').text(dadosMockados.nome_completo);
    $('#info_user .item-info:nth-child(3) span').text(dadosMockados.cpf);
    $('#info_user .item-info:nth-child(4) span').text(dadosMockados.sexo);
    $('#info_user .item-info:nth-child(5) span').text(new Date(dadosMockados.data_nascimento).toLocaleDateString('pt-BR'));
    
    // Preencher informações do curso
    $('#info_user .container-info-curso .item-info:nth-child(2) span').text(dadosMockados.curso);
    $('#info_user .container-info-curso .item-info:nth-child(3) span').text(dadosMockados.periodo);
    $('#info_user .container-info-curso .item-info:nth-child(4) span').text(dadosMockados.codigo_aluno);
    $('#info_user .container-info-curso .item-info:nth-child(5) span').text(new Date(dadosMockados.data_vigencia).toLocaleDateString('pt-BR'));
    
    // Preencher informações de contato
    $('#info_user .container-info-contato .item-info:nth-child(2) span').text(dadosMockados.email);
    $('#info_user .container-info-contato .item-info:nth-child(3) span').text(dadosMockados.telefone);
    $('#info_user .container-info-contato .item-info:nth-child(4) span').text(dadosMockados.cep);
    $('#info_user .container-info-contato .item-info:nth-child(5) span').text(dadosMockados.endereco);
}

$(document).ready(function () {
    // Preencher informações do usuário 
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        $(".user-info .icon-user").html(gerarIconeUsuario(usuario.nome_usuario, 40));
        $(".user-info .user-name").text(usuario.nome_usuario);
        $(".user-info .user-email").text(usuario.email);
    }
    
    // Carregar informações detalhadas do usuário
    exibirInformacoesUsuario();
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

    // Abrir modal completa
    $('#cadastro-completo').on('click', function (e) {
        e.preventDefault();
        abrirModalCadastrarUsuariosCompleto();
    });

    // Fechar modal completa
    $('#fechar-cadastro-usuario-completo').on('click', function (e) {
        e.preventDefault();
        fecharModalCadastrarUsuariosCompleto();
    });

    // ===================== FUNÇÕES DE VALIDAÇÃO DE SENHA FORTE =====================

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

    $('#modal-adicionar-usuarios .btn-confirmar').on('click', async function (e) {
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

        try {
            // Desabilitar botão durante o cadastro
            $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

            // Chamar API para cadastrar usuário
            const dadosUsuario = {
                nome_usuario: nomeUsuario,
                email: emailUsuario,
                senha: senha,
                tipo_usuario: tipoUsuario,
                data_vigencia: dataVigencia
            };

            await cadastrarUsuarioSimples(dadosUsuario);

            // Sucesso
            mostrarSucesso('Usuário Cadastrado', 'O usuário foi cadastrado com sucesso!');

            // Limpar formulário
            $('#modal-adicionar-usuarios input[name="nome_usuario"]').val('');
            $('#modal-adicionar-usuarios input[name="email_usuario"]').val('');
            $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val('');
            $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val('');
            $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val('');

            // Resetar ícones de validação
            $('#modal-adicionar-usuarios ul li i').removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');

            // Fechar modal
            fecharModalCadastrarUsuarios();

        } catch (erro) {
            mostrarErro('Erro no Cadastro', erro);
        } finally {
            // Reabilitar botão
            $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', false).removeClass('btn-disabled');
        }
    });

    // ===================== FUNÇÕES DE VALIDAÇÃO DE SENHA FORTE - MODAL COMPLETA =====================

    // Função para atualizar o botão de cadastrar da modal completa
    // (atualizarBotaoCadastrarCompleto já está definida globalmente)

    // Event listener para validação de senha forte na modal completa
    $('#modal-adicionar-usuarios-completo input[name="senha"]').on('input', function () {
        const senha = $(this).val();
        const criterios = validarSenhaForte(senha);

        // Atualizar ícones na lista de validação
        $('#modal-adicionar-usuarios-completo ul li').each(function (index) {
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

        atualizarBotaoCadastrarCompleto();
    });

    // Event listeners para verificar campos preenchidos na modal completa
    $('#modal-adicionar-usuarios-completo input, #modal-adicionar-usuarios-completo select').on('input change', function () {
        atualizarBotaoCadastrarCompleto();
    });

    // ===================== FUNÇÕES MOSTRAR/OCULTAR SENHA - MODAL COMPLETA =====================

    // Mostrar senha
    $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').on('click', function () {
        $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').hide();
        $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').show();
        $('#modal-adicionar-usuarios-completo input[name="senha"]').attr('type', 'text');
    });

    // Ocultar senha
    $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').on('click', function () {
        $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').hide();
        $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').show();
        $('#modal-adicionar-usuarios-completo input[name="senha"]').attr('type', 'password');
    });

    // ===================== FUNÇÃO DE CADASTRO DE USUÁRIO COMPLETO =====================

    $('#modal-adicionar-usuarios-completo .btn-confirmar').on('click', async function (e) {
        e.preventDefault();

        const nomeUsuario = $('#modal-adicionar-usuarios-completo input[name="nome_usuario"]').val().trim();
        const emailUsuario = $('#modal-adicionar-usuarios-completo input[name="email_usuario"]').val().trim();
        const senha = $('#modal-adicionar-usuarios-completo input[name="senha"]').val();
        const tipoUsuario = $('#modal-adicionar-usuarios-completo select[name="tipo_usuario"]').val();
        const dataVigencia = $('#modal-adicionar-usuarios-completo input[name="data_vigencia"]').val();
        const nomeCompleto = $('#modal-adicionar-usuarios-completo input[name="nome_completo"]').val().trim();
        const cpf = $('#modal-adicionar-usuarios-completo input[name="cpf"]').val().trim();
        const sexo = $('#modal-adicionar-usuarios-completo select[name="sexo"]').val();
        const dataNascimento = $('#modal-adicionar-usuarios-completo input[name="data_nascimento"]').val();
        const curso = $('#modal-adicionar-usuarios-completo select[name="curso"]').val();
        const periodo = $('#modal-adicionar-usuarios-completo select[name="periodo"]').val();
        const codigo = $('#modal-adicionar-usuarios-completo input[name="codigo"]').val().trim();
        const telefone = $('#modal-adicionar-usuarios-completo input[name="telefone"]').val().trim();
        const cep = $('#modal-adicionar-usuarios-completo input[name="cep"]').val().trim();
        const endereco = $('#modal-adicionar-usuarios-completo input[name="endereco"]').val().trim();

        // Validações
        if (!nomeUsuario || !emailUsuario || !senha || !tipoUsuario || !dataVigencia ||
            !nomeCompleto || !dataNascimento || !curso || !codigo || !telefone) {
            mostrarErro('Campos Obrigatórios', 'Todos os campos marcados com * são obrigatórios.');
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

        try {
            // Desabilitar botão durante o cadastro
            $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

            // Chamar API para cadastrar usuário completo
            const dadosUsuario = {
                nome_usuario: nomeUsuario,
                email: emailUsuario,
                senha: senha,
                tipo_usuario: tipoUsuario,
                data_vigencia: dataVigencia,
                nome_completo: nomeCompleto,
                cpf: cpf,
                sexo: sexo,
                data_nascimento: dataNascimento,
                curso: curso,
                periodo: periodo,
                codigo: codigo,
                telefone: telefone,
                cep: cep,
                endereco: endereco
            };

            await cadastrarUsuarioCompleto(dadosUsuario);

            // Sucesso
            mostrarSucesso('Usuário Cadastrado', 'O usuário foi cadastrado com sucesso!');

            // Fechar modal
            fecharModalCadastrarUsuariosCompleto();

        } catch (erro) {
            mostrarErro('Erro no Cadastro', erro);
        } finally {
            // Reabilitar botão
            $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', false).removeClass('btn-disabled');
        }
    });
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