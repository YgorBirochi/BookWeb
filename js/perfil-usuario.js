// ===================== FUNÇÕES COMUNS DO PERFIL =====================
// Funções usadas em qualquer parte do perfil
// -------------------------------------------------------------------
import { gerarIconeUsuario, aplicarSecaoAtivaPerfil, fazerLogout, mostrarSucesso, mostrarErro } from './utils.js';

// Função utilitária para ler parâmetros da URL
function getParametroUrl(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

// Função para mostrar o conteúdo da seção ativa
function mostrarConteudo(secaoId) {
    $('.conteudo-perfil, .conteudo-info_user, .conteudo-emprestimos, .conteudo-historico, .conteudo-reserva, .conteudo-configuracoes').removeClass('active');
    const $secaoAtiva = $('#' + secaoId);
    if ($secaoAtiva.length) {
        $secaoAtiva.addClass('active');
    }
}

// Textos personalizados no header para cada seção
const textosHeader = {
    conta: 'Conta',
    info_user: 'Conta',
    emprestimos: 'Biblioteca',
    historico: 'Biblioteca',
    reserva: 'Biblioteca',
    config: 'Configurações'
};

const navLinks = document.querySelectorAll('.div-nav-perfil-usuario .item-link');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        
        const headerSpan = document.querySelector('.container-name-section span');
        const section = link.dataset.section;
        headerSpan.textContent = textosHeader[section];
    });
});


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
    if (!$('.conteudo-perfil.active, .conteudo-info_user.active, .conteudo-emprestimos.active, .conteudo-historico.active, .conteudo-configuracoes.active, .conteudo-reserva.active').length) {
        mostrarConteudo('conta');
        // Ativar o nav-item da Conta
        $(".nav-item").removeClass("active");
        $(".nav-item:first").addClass("active");
    }
});

// ===================== FUNÇÕES DO PERFIL (aba "Perfil" e subnav) =====================
// -------------------------------------------------------------------


// Função para inicializar dados do usuário
function inicializarUsuario() {
    // Verificar se já existe um usuário no localStorage
    let usuario = JSON.parse(localStorage.getItem("usuario"));

    // Atualizar a interface com os dados
    $('.user-name').text(usuario.nome_usuario);
    $('.user-email').text(usuario.email);
    $('.user-biografia').text(usuario.biografia);
    $('#num-livros').text(usuario.num_livros + " ");
    $('#num-avaliacao').text(usuario.num_avaliacao + " ");
    $('#user-curso').text(usuario.curso);
}

// Função para mostrar notificação toast
function mostrarToast(mensagem, tipo) {
    const toast = $('#toast');
    toast.removeClass('success error').addClass(tipo);
    toast.text(mensagem).addClass('show');

    setTimeout(() => {
        toast.removeClass('show');
    }, 3000);
}

// Função para validar nome completo
function validarNomeCompleto(nome) {
    // Verifica se há pelo menos um espaço (nome e sobrenome)
    return nome.trim().split(' ').length >= 2;
}

// ===== MODAL DE EDITAR PERFIL =====
function abrirModalEditarPerfil() {
    // Carregar dados atuais do usuário
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const bioAtual = $('.user-biografia').text();

    // Preencher campos da modal
    $('#input-nome-usuario-modal').val(usuario ? usuario.nome_usuario || '' : '');
    $('#input-biografia-modal').val(bioAtual);

    // Atualizar contador de caracteres
    atualizarContadorCaracteres();

    // Mostrar modal
    $('#modal-editar-perfil').addClass('show');

    // Focar no primeiro campo
    setTimeout(() => {
        $('#input-nome-usuario-modal').focus();
    }, 300);
}

function fecharModalEditarPerfil() {
    $('#modal-editar-perfil').removeClass('show');
}

// Contador de caracteres para biografia
function atualizarContadorCaracteres() {
    const texto = $('#input-biografia-modal').val();
    const caracteres = texto.length;
    const maxCaracteres = 350;
    const $contador = $('.contador-caracteres');

    $contador.text(`${caracteres}/${maxCaracteres} caracteres`);

    // Mudar cor baseado no limite
    if (caracteres > maxCaracteres) {
        $contador.addClass('limit-exceeded');
    } else if (caracteres > maxCaracteres * 0.9) {
        $contador.removeClass('limit-exceeded').css('color', '#ffc107');
    } else {
        $contador.removeClass('limit-exceeded').css('color', '#6c757d');
    }
}

// Salvar perfil
function salvarPerfil() {
    const nomeUsuario = $('#input-nome-usuario-modal').val().trim();
    const biografia = $('#input-biografia-modal').val().trim();

    // Validar nome de usuário
    if (!nomeUsuario) {
        mostrarToast('O nome de usuário é obrigatório.', 'error');
        $('#input-nome-usuario-modal').focus();
        return false;
    }

    // Validar nome completo (pelo menos nome e sobrenome)
    if (!validarNomeCompleto(nomeUsuario)) {
        mostrarToast('Por favor, insira seu nome completo (nome e sobrenome).', 'error');
        $('#input-nome-usuario-modal').focus();
        return false;
    }

    // Validar tamanho da biografia
    if (biografia.length > 350) {
        mostrarToast('A biografia deve ter no máximo 350 caracteres.', 'error');
        $('#input-biografia-modal').focus();
        return false;
    }

    // Atualizar dados na interface
    $('.user-name').text(nomeUsuario);
    $('.user-biografia').text(biografia || 'Você ainda não possui uma biografia');

    // Atualizar dados no localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    usuario.nome_usuario = nomeUsuario;
    usuario.biografia = biografia;
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Fechar modal
    fecharModalEditarPerfil();

    // Mostrar mensagem de sucesso
    mostrarToast('Seu perfil foi atualizado com sucesso!', 'success');

    return true;
}

// Inicializar ao carregar a página
$(document).ready(function () {
    // Inicializar dados do usuário
    inicializarUsuario();

    // Abrir modal de edição
    $('#editar-conta').on('click', function (e) {
        e.preventDefault();
        abrirModalEditarPerfil();
    });

    // Fechar modal
    $('#fechar-editar-perfil, #btn-cancelar-perfil').on('click', function (e) {
        e.preventDefault();
        fecharModalEditarPerfil();
    });

    // Fechar modal ao clicar fora
    $('.modal-overlay').on('click', function (e) {
        if (e.target === this) {
            fecharModalEditarPerfil();
        }
    });

    // Contador de caracteres
    $('#input-biografia-modal').on('input', atualizarContadorCaracteres);

    // Salvar perfil
    $('#btn-salvar-perfil').on('click', function (e) {
        e.preventDefault();
        salvarPerfil();
    });
});


// ===================== FUNÇÕES DE DADOS DO PERFIL (aba "Dados do Perfil") =====================
// -------------------------------------------------------------------

// função para formatação, desformatação e validação de campos ao editar dados da conta
// função para carregar dados do dados perfil

// ===================== FUNÇÕES DE CONFIGURAÇÕES (notificações, senha, e-mail) =====================
// -------------------------------------------------------------------
// ===== MODAIS DE CONFIGURAÇÕES =====
function abrirModalAlterarSenha() {
    $('#modal-alterar-senha').addClass('show');
    // Inicializar botão como desabilitado
    $('#btn-salvar-senha').prop('disabled', true).addClass('btn-disabled');
    setTimeout(() => {
        $('#input-nova-senha').focus();
    }, 300);
}
function fecharModalAlterarSenha() {
    $('#modal-alterar-senha').removeClass('show');
    // Limpar formulário
    $('#form-alterar-senha')[0].reset();
}
function abrirModalVerificarEmail() {
    $('#modal-verificar-email').addClass('show');
    setTimeout(() => {
        $('.codigo-input').first().focus();
    }, 300);
}
function fecharModalVerificarEmail() {
    $('#modal-verificar-email').removeClass('show');
    // Limpar código
    $('.codigo-input').val('');
}
// Eventos abrir/fechar modais
$('#btn-alterar-senha').on('click', function (e) {
    e.preventDefault();
    abrirModalAlterarSenha();
});
$('#btn-verificar-email').on('click', function (e) {
    e.preventDefault();
    abrirModalVerificarEmail();
});
$('#fechar-alterar-senha, #btn-cancelar-senha').on('click', function (e) {
    e.preventDefault();
    fecharModalAlterarSenha();
});
$('#fechar-verificar-email, #btn-cancelar-email').on('click', function (e) {
    e.preventDefault();
    fecharModalVerificarEmail();
});
$(document).on('click', '#modal-alterar-senha', function (e) {
    if (e.target === this) {
        fecharModalAlterarSenha();
    }
});
$(document).on('click', '#modal-verificar-email', function (e) {
    if (e.target === this) {
        fecharModalVerificarEmail();
    }
});
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
function atualizarBotaoSalvar() {
    const novaSenha = $('#input-nova-senha').val();
    const confirmarSenha = $('#input-confirmar-senha').val();
    const senhaValida = senhaEForte(novaSenha);
    const senhasCoincidem = novaSenha === confirmarSenha && novaSenha !== '';

    if (senhaValida && senhasCoincidem) {
        $('#btn-salvar-senha').prop('disabled', false).removeClass('btn-disabled');
    } else {
        $('#btn-salvar-senha').prop('disabled', true).addClass('btn-disabled');
    }
}
$('#input-nova-senha').on('input', function () {
    const senha = $(this).val();
    const criterios = validarSenhaForte(senha);

    // Atualizar ícones na lista
    $('.senha-create li').each(function (index) {
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

    atualizarBotaoSalvar();
});
$('#input-confirmar-senha').on('input', function () {
    atualizarBotaoSalvar();
});
// Mostrar/ocultar senha
$('#mostrar-nova-senha').on('click', function () {
    $('#mostrar-nova-senha').hide();
    $('#ocultar-nova-senha').css('display', 'flex');
    $('#input-nova-senha').attr('type', 'text');
});
$('#ocultar-nova-senha').on('click', function () {
    $('#ocultar-nova-senha').hide();
    $('#mostrar-nova-senha').css('display', 'flex');
    $('#input-nova-senha').attr('type', 'password');
});
$('#mostrar-confirmar-senha').on('click', function () {
    $('#mostrar-confirmar-senha').hide();
    $('#ocultar-confirmar-senha').css('display', 'flex');
    $('#input-confirmar-senha').attr('type', 'text');
});
$('#ocultar-confirmar-senha').on('click', function () {
    $('#ocultar-confirmar-senha').hide();
    $('#mostrar-confirmar-senha').css('display', 'flex');
    $('#input-confirmar-senha').attr('type', 'password');
});
// Salvar nova senha
$('#btn-salvar-senha').on('click', function (e) {
    e.preventDefault();

    const novaSenha = $('#input-nova-senha').val();
    const confirmarSenha = $('#input-confirmar-senha').val();

    // Validações
    if (!novaSenha || !confirmarSenha) {
        mostrarErro('Campos Obrigatórios', 'Todos os campos são obrigatórios.');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mostrarErro('Senhas Diferentes', 'A nova senha e a confirmação não coincidem.');
        return;
    }

    if (!senhaEForte(novaSenha)) {
        mostrarErro('Senha Fraca', 'A nova senha não atende aos critérios de segurança.');
        return;
    }

    // Aqui você implementaria a lógica para alterar a senha no backend
    mostrarSucesso('Senha Alterada', 'Sua senha foi alterada com sucesso!');
    fecharModalAlterarSenha();
});
// Código de verificação
$('.codigo-input').on('input', function () {
    const $input = $(this);
    const valor = $input.val();
    const index = parseInt($input.data('index'));

    // Permitir apenas números
    if (!/^\d*$/.test(valor)) {
        $input.val('');
        return;
    }

    // Mover para o próximo input se digitou um número
    if (valor.length === 1 && index < 3) {
        $(`.codigo-input[data-index="${index + 1}"]`).focus();
    }
});
$('.codigo-input').on('keydown', function (e) {
    const $input = $(this);
    const index = parseInt($input.data('index'));

    // Voltar para o input anterior se pressionar backspace e o campo estiver vazio
    if (e.key === 'Backspace' && $input.val() === '' && index > 0) {
        $(`.codigo-input[data-index="${index - 1}"]`).focus();
    }
});
$('#btn-verificar-email').on('click', function (e) {
    e.preventDefault();

    const codigo = Array.from($('.codigo-input')).map(input => input.value).join('');

    if (codigo.length !== 4) {
        mostrarErro('Código Incompleto', 'Por favor, preencha todos os 4 dígitos do código.');
        return;
    }

    // Aqui você implementaria a verificação do código no backend
    if (codigo === '1234') { // Código de exemplo
        mostrarSucesso('E-mail Verificado', 'Seu e-mail foi verificado com sucesso!');
        fecharModalVerificarEmail();
    } else {
        mostrarErro('Código Inválido', 'O código inserido está incorreto. Tente novamente.');
        $('.codigo-input').val('');
        $('.codigo-input').first().focus();
    }
});
$(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
        if ($('#modal-alterar-senha').hasClass('show')) {
            fecharModalAlterarSenha();
        }
        if ($('#modal-verificar-email').hasClass('show')) {
            fecharModalVerificarEmail();
        }
    }
});

// ===== FUNCIONALIDADE DE NOTIFICAÇÕES =====
function carregarConfiguracoesNotificacoes() {
    const configuracoes = JSON.parse(localStorage.getItem('configuracoesNotificacoes')) || {
        email: true,
        emprestimos: true,
        reservas: true,
        novidades: false
    };

    // Aplicar configurações aos toggles
    $('#toggle-email').prop('checked', configuracoes.email);
    $('#toggle-emprestimos').prop('checked', configuracoes.emprestimos);
    $('#toggle-reservas').prop('checked', configuracoes.reservas);
    $('#toggle-novidades').prop('checked', configuracoes.novidades);

    // Atualizar labels
    atualizarLabelsNotificacoes();

    // Aplicar estado inicial baseado na notificação de email
    controlarNotificacoesSecundarias();
}
function salvarConfiguracoesNotificacoes() {
    const configuracoes = {
        email: $('#toggle-email').is(':checked'),
        emprestimos: $('#toggle-emprestimos').is(':checked'),
        reservas: $('#toggle-reservas').is(':checked'),
        novidades: $('#toggle-novidades').is(':checked')
    };

    localStorage.setItem('configuracoesNotificacoes', JSON.stringify(configuracoes));
}
function atualizarLabelsNotificacoes() {
    $('#toggle-email').closest('.config-item').find('.toggle-label').text(
        $('#toggle-email').is(':checked') ? 'Ativado' : 'Desativado'
    );

    $('#toggle-emprestimos').closest('.config-item').find('.toggle-label').text(
        $('#toggle-emprestimos').is(':checked') ? 'Ativado' : 'Desativado'
    );

    $('#toggle-reservas').closest('.config-item').find('.toggle-label').text(
        $('#toggle-reservas').is(':checked') ? 'Ativado' : 'Desativado'
    );

    $('#toggle-novidades').closest('.config-item').find('.toggle-label').text(
        $('#toggle-novidades').is(':checked') ? 'Ativado' : 'Desativado'
    );
}
function controlarNotificacoesSecundarias() {
    const emailAtivo = $('#toggle-email').is(':checked');

    if (!emailAtivo) {
        // Desativar todas as notificações secundárias
        $('#toggle-emprestimos').prop('checked', false);
        $('#toggle-reservas').prop('checked', false);
        $('#toggle-novidades').prop('checked', false);

        // Desabilitar os toggles
        $('#toggle-emprestimos').prop('disabled', true);
        $('#toggle-reservas').prop('disabled', true);
        $('#toggle-novidades').prop('disabled', true);

        // Adicionar classe visual para indicar desabilitado
        $('#toggle-emprestimos, #toggle-reservas, #toggle-novidades').closest('.config-item').addClass('disabled');
    } else {
        // Habilitar os toggles
        $('#toggle-emprestimos').prop('disabled', false);
        $('#toggle-reservas').prop('disabled', false);
        $('#toggle-novidades').prop('disabled', false);

        // Remover classe visual
        $('#toggle-emprestimos, #toggle-reservas, #toggle-novidades').closest('.config-item').removeClass('disabled');
    }

    // Atualizar labels
    atualizarLabelsNotificacoes();
}
$('#toggle-email').on('change', function () {
    controlarNotificacoesSecundarias();
    salvarConfiguracoesNotificacoes();

    // Mostrar mensagem informativa
    if ($(this).is(':checked')) {
        mostrarSucesso('Notificações por E-mail', 'Notificações por e-mail ativadas. Você pode agora configurar as notificações específicas.');
    } else {
        mostrarSucesso('Notificações por E-mail', 'Notificações por e-mail desativadas. Todas as outras notificações foram desativadas automaticamente.');
    }
});
$('#toggle-emprestimos').on('change', function () {
    if ($('#toggle-email').is(':checked')) {
        salvarConfiguracoesNotificacoes();
        atualizarLabelsNotificacoes();

        const status = $(this).is(':checked') ? 'ativadas' : 'desativadas';
        mostrarSucesso('Notificações de Empréstimos', `Notificações de empréstimos ${status}.`);
    }
});
$('#toggle-reservas').on('change', function () {
    if ($('#toggle-email').is(':checked')) {
        salvarConfiguracoesNotificacoes();
        atualizarLabelsNotificacoes();

        const status = $(this).is(':checked') ? 'ativadas' : 'desativadas';
        mostrarSucesso('Notificações de Reservas', `Notificações de reservas ${status}.`);
    }
});
$('#toggle-novidades').on('change', function () {
    if ($('#toggle-email').is(':checked')) {
        salvarConfiguracoesNotificacoes();
        atualizarLabelsNotificacoes();

        const status = $(this).is(':checked') ? 'ativadas' : 'desativadas';
        mostrarSucesso('Notificações de Novidades', `Notificações de novidades ${status}.`);
    }
});
carregarConfiguracoesNotificacoes();

// ===================== FUNÇÕES DA BIBLIOTECA (e subnav) =====================
// -------------------------------------------------------------------
// ===== FUNCIONALIDADE DE EMPRÉSTIMOS =====
// Dados de exemplo para empréstimos
const emprestimosExemplo = [
    {
        id: 1,
        dataSaida: "10/1/2023",
        dataDevolucao: "17/1/2023",
        status: "em-andamento",
        multa: 0.00,
        dataDevolucao: "17/01/2023",
        dataPagamento: "-",
        livros: [
            {
                id: 1,
                titulo: "Pescar truta na América",
                autor: "Richard Brautigan",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "12",
                paginas: "239",
                rating: "5,0"
            },
            {
                id: 2,
                titulo: "O Senhor dos Anéis",
                autor: "J.R.R. Tolkien",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "12",
                paginas: "576",
                rating: "4,8"
            }
        ]
    },
    {
        id: 2,
        dataSaida: "10/12/2024",
        dataDevolucao: "17/12/2024",
        status: "atrasado",
        multa: 15.00,
        dataDevolucao: "17/12/2024",
        dataPagamento: "20/12/2024",
        livros: [
            {
                id: 3,
                titulo: "1984",
                autor: "George Orwell",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "14",
                paginas: "328",
                rating: "4,5"
            }
        ]
    },
    {
        id: 3,
        dataSaida: "10/6/2025",
        dataDevolucao: "20/6/2025",
        status: "finalizado",
        multa: 0.00,
        dataDevolucao: "20/06/2025",
        dataPagamento: "20/06/2025",
        livros: [
            {
                id: 4,
                titulo: "O Senhor dos Anéis",
                autor: "J.R.R. Tolkien",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "14",
                paginas: "328",
                rating: "4,5"
            },
            {
                id: 6,
                titulo: "O Senhor dos Anéis",
                autor: "J.R.R. Tolkien",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "14",
                paginas: "328",
                rating: "4,5"
            },
            {
                id: 5,
                titulo: "O Senhor dos Anéis",
                autor: "J.R.R. Tolkien",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "14",
                paginas: "328",
                rating: "4,5"
            }
        ]
    },
    {
        id: 4,
        dataSaida: "15/12/2023",
        dataDevolucao: "22/12/2023",
        status: "em-andamento",
        multa: 0.00,
        dataDevolucao: "22/12/2023",
        dataPagamento: "-",
        livros: [
            {
                id: 7,
                titulo: "Dom Quixote",
                autor: "Miguel de Cervantes",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "12",
                paginas: "400",
                rating: "4,7"
            }
        ]
    },
    {
        id: 5,
        dataSaida: "1/1/2025",
        dataDevolucao: "8/1/2025",
        status: "finalizado",
        multa: 0.00,
        dataDevolucao: "8/01/2025",
        dataPagamento: "8/01/2025",
        livros: [
            {
                id: 8,
                titulo: "A Revolução dos Bichos",
                autor: "George Orwell",
                capa: "../assets/img/capa-de-livro-teste.png",
                classificacao: "12",
                paginas: "112",
                rating: "4,6"
            }
        ]
    }
];
function renderizarEmprestimos(emprestimos) {
    const container = $('.container-emprestimos .emprestimos');
    container.empty();



    if (emprestimos.length === 0) {
        container.html('<p class="sem-emprestimos">Nenhum empréstimo encontrado.</p>');
        return;
    }

    emprestimos.forEach(emprestimo => {
        let statusClass = '';
        let statusText = '';
        let headerColor = '';
        if (emprestimo.status === 'atrasado') {
            statusClass = 'atrasado';
            statusText = 'Atrasado';
            headerColor = '#dc3545'; // vermelho
        } else if (emprestimo.status === 'em-andamento') {
            statusClass = 'em-andamento';
            statusText = 'Em andamento';
            headerColor = '#ffc107'; // amarelo
        } else if (emprestimo.status === 'finalizado') {
            statusClass = 'finalizado';
            statusText = 'Finalizado';
            headerColor = '#28a745'; // verde
        }
        const multaColor = emprestimo.multa > 0 ? '#dc3545' : (emprestimo.status === 'em-andamento' ? '#ffc107' : '#28a745');

        // Criar o container do empréstimo
        const emprestimoHTML = `
                <div class="emprestimo" data-id="${emprestimo.id}">
                    <div class="emprestimo-header" style="border-bottom: 3px solid ${headerColor};">
                        <div class="emprestimo-datas">
                            <span class="emprestimo-data">Data de saída: ${emprestimo.dataSaida}</span>
                            <span class="emprestimo-data">Data de devolução: ${emprestimo.dataDevolucao}</span>
                        </div>
                        <div class="emprestimo-status">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="emprestimo-multa">
                            <span class="multa-valor" style="color: ${multaColor}">Multa: R$ ${emprestimo.multa.toFixed(2).replace('.', ',')}</span>
                            <span class="data-vencimento">Data de devolução: ${emprestimo.dataDevolucao}</span>
                            <span class="data-pagamento">Data de pagamento: ${emprestimo.dataPagamento}</span>
                        </div>
                    </div>
                    <div class="emprestimo-livros">
                        ${emprestimo.livros.map(livro => `
                            <div class="livro-emprestimo" data-livro-id="${livro.id}">
                                <div class="livro-capa">
                                    <div class="rating-badge">
                                        <i class="fa-solid fa-star"></i>
                                        <span>${livro.rating}</span>
                                    </div>
                                    <img src="${livro.capa}" alt="${livro.titulo}">
                                </div>
                                <div class="livro-info">
                                    <h3 class="livro-title">${livro.titulo}</h3>
                                    <p class="livro-autor">${livro.autor}</p>
                                    <div class="livro-stats">
                                        <span class="classification">${livro.classificacao}</span>
                                        <span class="pages">${livro.paginas} Páginas</span>
                                        <a href="obra.html" class="see-more">
                                            <i class="fa-solid fa-chevron-down"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        container.append(emprestimoHTML);
    });
    // Atualizar contador
    $('#total-emprestimos').text(emprestimos.length);
}
function ordenarEmprestimos(emprestimos, ordenacao) {
    if (ordenacao === 'crescente') {
        return emprestimos.sort((a, b) => new Date(a.dataSaida) - new Date(b.dataSaida));
    } else if (ordenacao === 'decrescente') {
        return emprestimos.sort((a, b) => new Date(b.dataSaida) - new Date(a.dataSaida));
    }
    return emprestimos;
}
function filtrarEmprestimos() {
    const filtroLivro = $('input[name="livro"]').val().toLowerCase();
    const filtroTipo = $('#select-tipo').val();
    const filtroDia = $('#select-dia').val();
    const filtroMes = $('#input-mes').val();
    const filtroAno = $('#select-ano').val();

    let emprestimosFiltrados = emprestimosExemplo.filter(emprestimo => {
        // Filtro por tipo
        const matchTipo = filtroTipo === 'todos' || emprestimo.status === filtroTipo;

        // Filtro por livro
        const matchLivro = filtroLivro === '' || emprestimo.livros.some(livro =>
            livro.titulo.toLowerCase().includes(filtroLivro) ||
            livro.autor.toLowerCase().includes(filtroLivro)
        );

        // Extrair dia, mês e ano da data de saída
        const [diaSaida, mesSaida, anoSaida] = emprestimo.dataSaida.split('/');

        // Filtro por dia (se não for crescente/decrescente)
        const matchDia = filtroDia === 'crescente' || filtroDia === 'decrescente' || filtroDia === '' || diaSaida === filtroDia;

        // Filtro por mês (se não for crescente/decrescente)
        const matchMes = filtroMes === 'crescente' || filtroMes === 'decrescente' || filtroMes === '' || mesSaida === filtroMes;

        // Filtro por ano (se não for crescente/decrescente)
        const matchAno = filtroAno === 'crescente' || filtroAno === 'decrescente' || filtroAno === '' || anoSaida === filtroAno;

        return matchLivro && matchTipo && matchDia && matchMes && matchAno;
    });

    // Função auxiliar para ordenar por campo
    function ordenarPorCampo(array, campo, ordem) {
        return array.sort((a, b) => {
            const [diaA, mesA, anoA] = a.dataSaida.split('/').map(Number);
            const [diaB, mesB, anoB] = b.dataSaida.split('/').map(Number);
            let valA, valB;
            if (campo === 'ano') {
                valA = anoA; valB = anoB;
            } else if (campo === 'mes') {
                valA = mesA; valB = mesB;
            } else if (campo === 'dia') {
                valA = diaA; valB = diaB;
            }
            return ordem === 'crescente' ? valA - valB : valB - valA;
        });
    }

    // Ordenação composta: ano > mês > dia
    if (filtroAno === 'crescente' || filtroAno === 'decrescente') {
        emprestimosFiltrados = ordenarPorCampo(emprestimosFiltrados, 'ano', filtroAno);
    } else {
        // padrão: decrescente
        emprestimosFiltrados = ordenarPorCampo(emprestimosFiltrados, 'ano', 'decrescente');
    }

    if (filtroMes === 'crescente' || filtroMes === 'decrescente') {
        emprestimosFiltrados = ordenarPorCampo(emprestimosFiltrados, 'mes', filtroMes);
    } else {
        emprestimosFiltrados = ordenarPorCampo(emprestimosFiltrados, 'mes', 'decrescente');
    }

    if (filtroDia === 'crescente' || filtroDia === 'decrescente') {
        emprestimosFiltrados = ordenarPorCampo(emprestimosFiltrados, 'dia', filtroDia);
    } else {
        emprestimosFiltrados = ordenarPorCampo(emprestimosFiltrados, 'dia', 'decrescente');
    }

    renderizarEmprestimos(emprestimosFiltrados);
}
$('input[name="livro"]').on('input', filtrarEmprestimos);
$('#select-tipo').on('change', filtrarEmprestimos);
$('#select-dia, #input-mes, #select-ano').on('change', filtrarEmprestimos);
$(document).on('click', '.see-more', function (e) {
    e.preventDefault();
    const livroId = $(this).closest('.livro-emprestimo').data('id');
    // Aqui você pode implementar a navegação para a página do livro

});
renderizarEmprestimos(emprestimosExemplo);
function atualizarLivrosLidosPerfil() {
    // Considere emprestimosExemplo como fonte dos dados
    let totalLivrosLidos = 0;
    emprestimosExemplo.forEach(emprestimo => {
        if (emprestimo.status === 'finalizado') {
            totalLivrosLidos += emprestimo.livros.length;
        }
    });
    $('#total-emprestimos-numero').text(totalLivrosLidos);
}
atualizarLivrosLidosPerfil();
function renderizarHistoricoLivros() {
    const container = $('.container-livros .livros');
    container.empty();
    let totalLivros = 0;

    emprestimosExemplo.forEach(emprestimo => {
        // Definir status do livro 
        let statusClass = '';
        let statusText = '';
        if (emprestimo.status === 'em-andamento' || emprestimo.status === 'atrasado') {
            statusClass = 'em-andamento';
            statusText = 'Em andamento';
        } else if (emprestimo.status === 'finalizado') {
            statusClass = 'devolvido';
            statusText = 'Devolvido';
        }

        emprestimo.livros.forEach(livro => {
            totalLivros++;
            const livroHTML = `
                    <div class="livro" data-livro-id="${livro.id}">
                        <div class="livro-capa">
                            <div class="rating-badge">
                                <i class="fa-solid fa-star"></i>
                                <span>${livro.rating}</span>
                            </div>
                            <img src="${livro.capa}" alt="${livro.titulo}">
                        </div>
                        <div class="livro-info">
                            <h3 class="livro-title">${livro.titulo}</h3>
                            <p class="livro-autor">${livro.autor}</p>
                            <div class="livro-stats">
                                <span class="classification">${livro.classificacao}</span>
                                <span class="pages">${livro.paginas} Páginas</span>
                                <a href="obra.html" class="see-more">
                                    <i class="fa-solid fa-chevron-down"></i>
                                </a>
                            </div>
                            <div class="emprestimo-datas">
                                <span class="emprestimo-data">Data de saída: ${emprestimo.dataSaida}</span>
                                <span class="emprestimo-data">Data de devolução: ${emprestimo.dataDevolucao}</span>
                            </div>
                        </div>
                        <div class="livro-opcoes">
                            <div class="livro-status">
                                <span class="status-badge ${statusClass}">${statusText}</span>
                            </div>
                            ${statusClass === 'devolvido' ? `
                            <a class="btn-reservar-livro">
                                <i class="fa-solid fa-bookmark"></i>
                                
                                Ler novamente
                            </a>
                            ` : ''}
                        </div>
                    </div>
                `;
            container.append(livroHTML);
        });
    });
    $('#total-livros-emprestados').text(totalLivros);
}
renderizarHistoricoLivros();
// Exemplo de dados de reservas
const reservasExemplo = [
    {
        id: 1,
        dataReserva: "05/06/2025",
        livro: {
            id: 10,
            titulo: "O Pequeno Príncipe",
            autor: "Antoine de Saint-Exupéry",
            capa: "../assets/img/capa-de-livro-teste.png",
            classificacao: "10",
            paginas: "96",
            rating: "4,9",
            exemplaresDisponiveis: 2
        }
    },
    {
        id: 2,
        dataReserva: "01/06/2025",
        livro: {
            id: 11,
            titulo: "Harry Potter e a Pedra Filosofal",
            autor: "J.K. Rowling",
            capa: "../assets/img/capa-de-livro-teste.png",
            classificacao: "10",
            paginas: "223",
            rating: "4,8",
            exemplaresDisponiveis: 0
        }
    },
    {
        id: 3,
        dataReserva: "03/06/2025",
        livro: {
            id: 12,
            titulo: "O Senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            capa: "../assets/img/capa-de-livro-teste.png",
            classificacao: "12",
            paginas: "576",
            rating: "4,7",
            exemplaresDisponiveis: 1
        }
    }
];
function calcularDataExpiracao(dataReserva) {
    const data = new Date(dataReserva.split('/').reverse().join('-'));
    data.setHours(data.getHours() + 48);
    return data.toLocaleDateString('pt-BR');
}
function renderizarReservas() {
    const container = $('.reservas');
    container.empty();
    let totalReservas = 0;

    reservasExemplo.forEach(reserva => {
        totalReservas++;
        const livro = reserva.livro;

        // Determinar status baseado na disponibilidade
        let statusClass = '';
        let statusText = '';
        let dataExpiracao = '';

        if (livro.exemplaresDisponiveis > 0) {
            statusClass = 'disponivel';
            statusText = 'Disponível para empréstimo';
            dataExpiracao = calcularDataExpiracao(reserva.dataReserva);
        } else {
            statusClass = 'aguardando';
            statusText = 'Aguardando disponibilidade';
            dataExpiracao = 'Indefinida';
        }

        const livroHTML = `
                <div class="livro" data-livro-id="${livro.id}">
                    <div class="livro-capa">
                        <div class="rating-badge">
                            <i class="fa-solid fa-star"></i>
                            <span>${livro.rating}</span>
                        </div>
                        <img src="${livro.capa}" alt="${livro.titulo}">
                    </div>
                    <div class="livro-info">
                        <h3 class="livro-title">${livro.titulo}</h3>
                        <p class="livro-autor">${livro.autor}</p>
                        <div class="livro-stats">
                            <span class="classification">${livro.classificacao}</span>
                            <span class="pages">${livro.paginas} Páginas</span>
                            <a href="obra.html" class="see-more">
                                <i class="fa-solid fa-chevron-down"></i>
                            </a>
                        </div>
                    </div>
                    <div class="livro-opcoes">
                        <div class="livro-status">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="reserva-datas">
                            <span class="reserva-data">Data de reserva: ${reserva.dataReserva}</span>
                            <span class="reserva-data">Expira em: ${dataExpiracao}</span>
                        </div>
                    </div>
                </div>
            `;
        container.append(livroHTML);
    });

    // Atualizar contador
    $('#total-reservas').text(totalReservas);
}
renderizarReservas();

// ===================== FUNÇÕES DE MODAIS DE INFORMAÇÕES (biblioteca) =====================
// -------------------------------------------------------------------
function abrirModalInformacoesEmprestimo() {
    $('#modal-informacoes-emprestimo').addClass('show');
}
function fecharModalInformacoesEmprestimo() {
    $('#modal-informacoes-emprestimo').removeClass('show');
}
function abrirModalInformacoesReserva() {
    $('#modal-informacoes-reserva').addClass('show');
}
function fecharModalInformacoesReserva() {
    $('#modal-informacoes-reserva').removeClass('show');
}
$('#abrir-informacoes-emprestimo').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    abrirModalInformacoesEmprestimo();
});
$('#abrir-informacoes-reservas').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    abrirModalInformacoesReserva();
});
$('#fechar-informacoes-emprestimo').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    fecharModalInformacoesEmprestimo();
});
$('#fechar-informacoes-reserva').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    fecharModalInformacoesReserva();
});
$(document).off('click.informacoes-emprestimo').on('click.informacoes-emprestimo', function (e) {
    if (!$(e.target).closest('#modal-informacoes-emprestimo').length &&
        !$(e.target).closest('#abrir-informacoes-emprestimo').length) {
        fecharModalInformacoesEmprestimo();
    }
});
$(document).off('click.informacoes-reserva').on('click.informacoes-reserva', function (e) {
    if (!$(e.target).closest('#modal-informacoes-reserva').length &&
        !$(e.target).closest('#abrir-informacoes-reservas').length) {
        fecharModalInformacoesReserva();
    }
});
$(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
        if ($('#modal-informacoes-emprestimo').hasClass('show')) {
            fecharModalInformacoesEmprestimo();
        }
        if ($('#modal-informacoes-reserva').hasClass('show')) {
            fecharModalInformacoesReserva();
        }
    }
});

// ===================== FILTRO HISTÓRICO DE LIVROS =====================
// -------------------------------------------------------------------
function filtrarHistoricoLivros() {
    // Seletores específicos para o histórico
    const $container = $('.conteudo-biblioteca#historico');
    const filtroLivro = $container.find('input[name="livro"]').val().toLowerCase();
    const filtroTipo = $container.find('select[name="tipo"]').val();
    const filtroDia = $container.find('select[name="dia"]').val();
    const filtroMes = $container.find('select[name="mes"]').val();
    const filtroAno = $container.find('select[name="ano"]').val();

    // Montar lista de livros do histórico
    let livrosHistorico = [];
    emprestimosExemplo.forEach(emprestimo => {
        let statusLivro = (emprestimo.status === 'finalizado') ? 'devolvido' : 'sob-emprestimo';
        emprestimo.livros.forEach(livro => {
            // Extrair data de saída
            const [diaSaida, mesSaida, anoSaida] = emprestimo.dataSaida.split('/');
            livrosHistorico.push({
                ...livro,
                status: statusLivro,
                dataSaida: emprestimo.dataSaida,
                diaSaida,
                mesSaida,
                anoSaida
            });
        });
    });

    // Filtros
    livrosHistorico = livrosHistorico.filter(livro => {
        const matchTipo = filtroTipo === 'todos' || livro.status === filtroTipo;
        const matchLivro = filtroLivro === '' || livro.titulo.toLowerCase().includes(filtroLivro) || livro.autor.toLowerCase().includes(filtroLivro);
        const matchDia = filtroDia === 'crescente' || filtroDia === 'decrescente' || filtroDia === '' || livro.diaSaida === filtroDia;
        const matchMes = filtroMes === 'crescente' || filtroMes === 'decrescente' || filtroMes === '' || livro.mesSaida === filtroMes;
        const matchAno = filtroAno === 'crescente' || filtroAno === 'decrescente' || filtroAno === '' || livro.anoSaida === filtroAno;
        return matchTipo && matchLivro && matchDia && matchMes && matchAno;
    });

    // Ordenação composta
    function ordenarPorCampo(array, campo, ordem) {
        return array.sort((a, b) => {
            let valA = Number(a[campo + 'Saida']);
            let valB = Number(b[campo + 'Saida']);
            return ordem === 'crescente' ? valA - valB : valB - valA;
        });
    }
    if (filtroAno === 'crescente' || filtroAno === 'decrescente') {
        livrosHistorico = ordenarPorCampo(livrosHistorico, 'ano', filtroAno);
    } else {
        livrosHistorico = ordenarPorCampo(livrosHistorico, 'ano', 'decrescente');
    }
    if (filtroMes === 'crescente' || filtroMes === 'decrescente') {
        livrosHistorico = ordenarPorCampo(livrosHistorico, 'mes', filtroMes);
    } else {
        livrosHistorico = ordenarPorCampo(livrosHistorico, 'mes', 'decrescente');
    }
    if (filtroDia === 'crescente' || filtroDia === 'decrescente') {
        livrosHistorico = ordenarPorCampo(livrosHistorico, 'dia', filtroDia);
    } else {
        livrosHistorico = ordenarPorCampo(livrosHistorico, 'dia', 'decrescente');
    }

    // Renderizar
    const $livrosContainer = $('.container-livros .livros');
    $livrosContainer.empty();
    let totalLivros = 0;
    livrosHistorico.forEach(livro => {
        totalLivros++;
        const statusClass = livro.status === 'devolvido' ? 'devolvido' : 'em-andamento';
        const statusText = livro.status === 'devolvido' ? 'Devolvido' : 'Em andamento';
        const livroHTML = `
                <div class="livro" data-livro-id="${livro.id}">
                    <div class="livro-capa">
                        <div class="rating-badge">
                            <i class="fa-solid fa-star"></i>
                            <span>${livro.rating}</span>
                        </div>
                        <img src="${livro.capa}" alt="${livro.titulo}">
                    </div>
                    <div class="livro-info">
                        <h3 class="livro-title">${livro.titulo}</h3>
                        <p class="livro-autor">${livro.autor}</p>
                        <div class="livro-stats">
                            <span class="classification">${livro.classificacao}</span>
                            <span class="pages">${livro.paginas} Páginas</span>
                            <a href="obra.html" class="see-more">
                                <i class="fa-solid fa-chevron-down"></i>
                            </a>
                        </div>
                        <div class="emprestimo-datas">
                            <span class="emprestimo-data">Data de saída: ${livro.dataSaida}</span>
                        </div>
                    </div>
                    <div class="livro-opcoes">
                        <div class="livro-status">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                        ${statusClass === 'devolvido' ? `
                        <a class="btn-reservar-livro">
                            <i class="fa-solid fa-bookmark"></i>
                            Ler novamente
                        </a>
                        ` : ''}
                    </div>
                </div>
            `;
        $livrosContainer.append(livroHTML);
    });
    $('#total-livros-emprestados').text(totalLivros);
}
$('.conteudo-biblioteca#historico input[name="livro"]').on('input', filtrarHistoricoLivros);
$('.conteudo-biblioteca#historico select[name="tipo"]').on('change', filtrarHistoricoLivros);
$('.conteudo-biblioteca#historico select[name="dia"], .conteudo-biblioteca#historico select[name="mes"], .conteudo-biblioteca#historico select[name="ano"]').on('change', filtrarHistoricoLivros);
filtrarHistoricoLivros();

// ===================== FILTRO RESERVAS =====================
// -------------------------------------------------------------------
function filtrarReservas() {
    // Seletores específicos para reservas
    const $container = $('.conteudo-biblioteca#reservas');
    const filtroLivro = $container.find('input[name="livro"]').val().toLowerCase();
    const filtroTipo = $container.find('select[name="tipo"]').val();
    const filtroDia = $container.find('select[name="dia"]').val();
    const filtroMes = $container.find('select[name="mes"]').val();
    const filtroAno = $container.find('select[name="ano"]').val();

    let reservasFiltradas = reservasExemplo.map(reserva => {
        const [diaReserva, mesReserva, anoReserva] = reserva.dataReserva.split('/');
        let status = reserva.livro.exemplaresDisponiveis > 0 ? 'disponivel' : 'indisponivel';
        return {
            ...reserva,
            status,
            diaReserva,
            mesReserva,
            anoReserva
        };
    });

    reservasFiltradas = reservasFiltradas.filter(reserva => {
        const matchTipo = filtroTipo === 'todos' || reserva.status === filtroTipo;
        const matchLivro = filtroLivro === '' || reserva.livro.titulo.toLowerCase().includes(filtroLivro) || reserva.livro.autor.toLowerCase().includes(filtroLivro);
        const matchDia = filtroDia === 'crescente' || filtroDia === 'decrescente' || filtroDia === '' || reserva.diaReserva === filtroDia;
        const matchMes = filtroMes === 'crescente' || filtroMes === 'decrescente' || filtroMes === '' || reserva.mesReserva === filtroMes;
        const matchAno = filtroAno === 'crescente' || filtroAno === 'decrescente' || filtroAno === '' || reserva.anoReserva === filtroAno;
        return matchTipo && matchLivro && matchDia && matchMes && matchAno;
    });

    // Ordenação composta
    function ordenarPorCampo(array, campo, ordem) {
        return array.sort((a, b) => {
            let valA = Number(a[campo + 'Reserva']);
            let valB = Number(b[campo + 'Reserva']);
            return ordem === 'crescente' ? valA - valB : valB - valA;
        });
    }
    if (filtroAno === 'crescente' || filtroAno === 'decrescente') {
        reservasFiltradas = ordenarPorCampo(reservasFiltradas, 'ano', filtroAno);
    } else {
        reservasFiltradas = ordenarPorCampo(reservasFiltradas, 'ano', 'decrescente');
    }
    if (filtroMes === 'crescente' || filtroMes === 'decrescente') {
        reservasFiltradas = ordenarPorCampo(reservasFiltradas, 'mes', filtroMes);
    } else {
        reservasFiltradas = ordenarPorCampo(reservasFiltradas, 'mes', 'decrescente');
    }
    if (filtroDia === 'crescente' || filtroDia === 'decrescente') {
        reservasFiltradas = ordenarPorCampo(reservasFiltradas, 'dia', filtroDia);
    } else {
        reservasFiltradas = ordenarPorCampo(reservasFiltradas, 'dia', 'decrescente');
    }

    // Renderizar
    const $containerReservas = $('.container-reservas .reservas');
    $containerReservas.empty();
    let totalReservas = 0;
    reservasFiltradas.forEach(reserva => {
        totalReservas++;
        const livro = reserva.livro;
        let statusClass = reserva.status === 'disponivel' ? 'disponivel' : 'aguardando';
        let statusText = reserva.status === 'disponivel' ? 'Disponível para empréstimo' : 'Aguardando disponibilidade';
        let dataExpiracao = reserva.status === 'disponivel' ? calcularDataExpiracao(reserva.dataReserva) : 'Indefinida';
        const livroHTML = `
                <div class="livro" data-livro-id="${livro.id}">
                    <div class="livro-capa">
                        <div class="rating-badge">
                            <i class="fa-solid fa-star"></i>
                            <span>${livro.rating}</span>
                        </div>
                        <img src="${livro.capa}" alt="${livro.titulo}">
                    </div>
                    <div class="livro-info">
                        <h3 class="livro-title">${livro.titulo}</h3>
                        <p class="livro-autor">${livro.autor}</p>
                        <div class="livro-stats">
                            <span class="classification">${livro.classificacao}</span>
                            <span class="pages">${livro.paginas} Páginas</span>
                            <a href="obra.html" class="see-more">
                                <i class="fa-solid fa-chevron-down"></i>
                            </a>
                        </div>
                    </div>
                    <div class="livro-opcoes">
                        <div class="livro-status">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="reserva-datas">
                            <span class="reserva-data">Data de reserva: ${reserva.dataReserva}</span>
                            <span class="reserva-data">Expira em: ${dataExpiracao}</span>
                        </div>
                    </div>
                </div>
            `;
        $containerReservas.append(livroHTML);
    });
    $('#total-reservas').text(totalReservas);
}
$('.conteudo-biblioteca#reservas input[name="livro"]').on('input', filtrarReservas);
$('.conteudo-biblioteca#reservas select[name="tipo"]').on('change', filtrarReservas);
$('.conteudo-biblioteca#reservas select[name="dia"], .conteudo-biblioteca#reservas select[name="mes"], .conteudo-biblioteca#reservas select[name="ano"]').on('change', filtrarReservas);
filtrarReservas();

// ===================== EVENTO LOGOUT =====================
// -------------------------------------------------------------------
$('.logout').on('click', function (e) {
    e.preventDefault();
    fazerLogout();
});

// ===================== INICIALIZAÇÃO DE LABELS FLUTUANTES =====================
// -------------------------------------------------------------------
setTimeout(function () {
    $('.div-input input[type="date"]').each(function () {
        const $input = $(this);
        const $label = $input.prev();
        $label.addClass('active');
    });
    $('.div-input select').each(function () {
        const $select = $(this);
        const $label = $select.prev();
        $label.addClass('active');
    });
}, 100);