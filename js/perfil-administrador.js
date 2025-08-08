// ===================== IMPORTS =====================
import { gerarIconeUsuario, mostrarSucesso, fazerLogout, mostrarErro, atualizarLabelsFlutuantes } from './utils.js';
import { 
    cadastrarUsuarioSimples, 
    cadastrarUsuarioCompleto, 
    buscarDadosUsuarioLogado,
    atualizarInformacoesConta,
    atualizarInformacoesUsuario,
    atualizarInformacoesCurso,
    atualizarInformacoesContato 
} from './api/user.js';

// ===================== FUNÇÕES DE VALIDAÇÃO =====================

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

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length === 10 || numeros.length === 11;
}

function validarCEP(cep) {
    const numeros = cep.replace(/\D/g, '');
    return numeros.length === 8;
}

// ===================== FUNÇÕES DE FORMATAÇÃO =====================

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length <= 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
    } else {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
    }
    return telefone;
}

function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    return cep;
}

// ===================== FUNÇÕES DE NAVEGAÇÃO =====================

function mostrarConteudo(secaoId) {
    $('.conteudo-perfil, .conteudo-info_user, .conteudo-emprestimo, .conteudo-reservas, .conteudo-usuarios, .conteudo-relatorio, .conteudo-configuracoes').removeClass('active');
    const $secaoAtiva = $('#' + secaoId);
    if ($secaoAtiva.length) {
        $secaoAtiva.addClass('active');
    }
}

// ===================== INICIALIZAÇÃO DO USUÁRIO =====================

async function inicializarUsuario() {
    try {
        const dadosUsuario = await buscarDadosUsuarioLogado();

        $('.user-name').text(dadosUsuario?.nome_usuario || '');
        $('.user-email').text(dadosUsuario?.email || '');
        $('.user-biografia').text(dadosUsuario?.biografia || 'Ainda não possui uma biografia');

        const numLivros = (dadosUsuario?.num_livros && dadosUsuario.num_livros > 0) ? dadosUsuario.num_livros : 0;
        const numAvaliacao = (dadosUsuario?.num_avaliacao && dadosUsuario.num_avaliacao > 0) ? dadosUsuario.num_avaliacao : 0;

        $('#num-livros').text(numLivros + " ");
        $('#num-avaliacao').text(numAvaliacao + " ");
        $('#user-curso').text(dadosUsuario?.curso || 'Curso ainda não definido');

    } catch (error) {
        console.error("Erro ao inicializar usuário:", error);
        $('#num-livros').text("0 ");
        $('#num-avaliacao').text("0 ");
    }
}

async function exibirInformacoesUsuario() {
    try {
        const dadosUsuario = await buscarDadosUsuarioLogado();

        function exibirCampo(seletor, valor, placeholder = "Ainda não adicionado") {
            const elemento = $(seletor);
            if (valor && valor.trim && valor.trim() !== '') {
                elemento.text(valor);
                elemento.removeClass('campo-vazio');
            } else if (valor && typeof valor !== 'string') {
                elemento.text(valor);
                elemento.removeClass('campo-vazio');
            } else {
                elemento.text(placeholder);
                elemento.addClass('campo-vazio');
            }
        }

        // Informações do usuário
        exibirCampo('#info_user .container-info-usuario .item-info:nth-child(2) span', dadosUsuario.nome_completo);
        exibirCampo('#info_user .container-info-usuario .item-info:nth-child(3) span', dadosUsuario.cpf);
        
        const sexoFormatado = dadosUsuario.sexo ? 
            (dadosUsuario.sexo.charAt(0).toUpperCase() + dadosUsuario.sexo.slice(1)) : null;
        exibirCampo('#info_user .container-info-usuario .item-info:nth-child(4) span', sexoFormatado);
        
        const dataNascimento = dadosUsuario.data_nascimento ? 
            new Date(dadosUsuario.data_nascimento).toLocaleDateString('pt-BR') : null;
        exibirCampo('#info_user .container-info-usuario .item-info:nth-child(5) span', dataNascimento);

        // Informações do curso
        exibirCampo('#info_user .container-info-curso .item-info:nth-child(2) span', dadosUsuario.curso);
        exibirCampo('#info_user .container-info-curso .item-info:nth-child(3) span', dadosUsuario.periodo);
        exibirCampo('#info_user .container-info-curso .item-info:nth-child(4) span', dadosUsuario.codigo_aluno);
        
        const dataVigencia = dadosUsuario.data_vigencia ? 
            new Date(dadosUsuario.data_vigencia).toLocaleDateString('pt-BR') : null;
        exibirCampo('#info_user .container-info-curso .item-info:nth-child(5) span', dataVigencia);

        // Informações de contato
        exibirCampo('#info_user .container-info-contato .item-info:nth-child(2) span', dadosUsuario.email);
        exibirCampo('#info_user .container-info-contato .item-info:nth-child(3) span', dadosUsuario.telefone);
        exibirCampo('#info_user .container-info-contato .item-info:nth-child(4) span', dadosUsuario.cep);
        exibirCampo('#info_user .container-info-contato .item-info:nth-child(5) span', dadosUsuario.endereco);

    } catch (erro) {
        console.error('Erro ao carregar informações do usuário:', erro);
        
        if (erro.includes('Token') || erro.includes('autenticação')) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
            return;
        }

        mostrarPlaceholders();
        mostrarErro('Erro', 'Não foi possível carregar os dados do usuário.');
    }
}

function mostrarPlaceholders() {
    const placeholder = "Ainda não adicionado";
    
    // Informações do usuário
    $('#info_user .container-info-usuario .item-info:nth-child(2) span').text(placeholder);
    $('#info_user .container-info-usuario .item-info:nth-child(3) span').text(placeholder);
    $('#info_user .container-info-usuario .item-info:nth-child(4) span').text(placeholder);
    $('#info_user .container-info-usuario .item-info:nth-child(5) span').text(placeholder);

    // Informações do curso
    $('#info_user .container-info-curso .item-info:nth-child(2) span').text(placeholder);
    $('#info_user .container-info-curso .item-info:nth-child(3) span').text(placeholder);
    $('#info_user .container-info-curso .item-info:nth-child(4) span').text(placeholder);
    $('#info_user .container-info-curso .item-info:nth-child(5) span').text(placeholder);

    // Informações de contato
    $('#info_user .container-info-contato .item-info:nth-child(2) span').text(placeholder);
    $('#info_user .container-info-contato .item-info:nth-child(3) span').text(placeholder);
    $('#info_user .container-info-contato .item-info:nth-child(4) span').text(placeholder);
    $('#info_user .container-info-contato .item-info:nth-child(5) span').text(placeholder);
}

// ===================== MODAL EDITAR PERFIL =====================

async function abrirModalEditarPerfil() {
    try {
        const dadosUsuario = await buscarDadosUsuarioLogado();
        
        $('#input-nome-usuario-modal').val(dadosUsuario?.nome_usuario || '');
        $('#input-biografia-modal').val(dadosUsuario?.biografia || '');
        
        atualizarContadorCaracteres();
        $('#modal-editar-perfil').addClass('show');
        
        setTimeout(() => {
            $('#input-nome-usuario-modal').focus();
        }, 300);

    } catch (error) {
        console.error("Erro ao carregar dados para modal:", error);
        const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
        $('#input-nome-usuario-modal').val(usuario.nome_usuario || '');
        $('#input-biografia-modal').val('');
        $('#modal-editar-perfil').addClass('show');
    }
}

function fecharModalEditarPerfil() {
    $('#modal-editar-perfil').removeClass('show');
}

function atualizarContadorCaracteres() {
    const texto = $('#input-biografia-modal').val();
    const caracteres = texto.length;
    const maxCaracteres = 350;
    const $contador = $('.contador-caracteres');

    $contador.text(`${caracteres}/${maxCaracteres} caracteres`);

    if (caracteres > maxCaracteres) {
        $contador.addClass('limit-exceeded').removeClass('aviso').css('color', '#dc3545');
    } else if (caracteres > maxCaracteres * 0.9) {
        $contador.removeClass('limit-exceeded').addClass('aviso').css('color', '#ffc107');
    } else {
        $contador.removeClass('limit-exceeded aviso').css('color', '#6c757d');
    }
}

async function salvarPerfil() {
    const nomeUsuario = $('#input-nome-usuario-modal').val().trim();
    const biografia = $('#input-biografia-modal').val().trim();

    if (!nomeUsuario) {
        mostrarErro('Campo Obrigatório', 'O nome de usuário é obrigatório.');
        $('#input-nome-usuario-modal').focus();
        return false;
    }

    if (biografia.length > 350) {
        mostrarErro('Biografia muito longa', 'A biografia deve ter no máximo 350 caracteres.');
        $('#input-biografia-modal').focus();
        return false;
    }

    try {
        $('#btn-salvar-perfil').prop('disabled', true).text('Salvando...');

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const usuarioId = usuario.id;

        const dados = {
            nome_usuario: nomeUsuario,
            biografia: biografia || null
        };
        
        await atualizarInformacoesConta(usuarioId, dados);

        $('.user-name').text(nomeUsuario);
        $('.user-biografia').text(biografia || 'Ainda não possui uma biografia');

        usuario.nome_usuario = nomeUsuario;
        usuario.biografia = biografia;
        localStorage.setItem("usuario", JSON.stringify(usuario));

        fecharModalEditarPerfil();
        mostrarSucesso('Perfil Atualizado', 'Seu perfil foi atualizado com sucesso!');

        setTimeout(() => {
            inicializarUsuario();
        }, 1000);

        return true;

    } catch (erro) {
        console.error('Erro ao salvar perfil:', erro);
        mostrarErro('Erro', erro);
        return false;
    } finally {
        $('#btn-salvar-perfil').prop('disabled', false).text('Salvar');
    }
}

// ===================== MODAIS DE EDIÇÃO DE INFORMAÇÕES =====================

function abrirModalEditarUsuario() {
    $('#modal-editar-informações-usuario').addClass('show');
}

function fecharModalEditarUsuario() {
    $('#modal-editar-informações-usuario').removeClass('show');
}

function abrirModalEditarCurso() {
    $('#modal-editar-informações-curso').addClass('show');
}

function fecharModalEditarCurso() {
    $('#modal-editar-informações-curso').removeClass('show');
}

function abrirModalEditarContato() {
    $('#modal-editar-informações-contato').addClass('show');
}

function fecharModalEditarContato() {
    $('#modal-editar-informações-contato').removeClass('show');
}

async function editarUsuarioEspecifico(tipoModal) {
    try {
        const dadosUsuario = await buscarDadosUsuarioLogado();

        setTimeout(() => {
            if (tipoModal === 'usuario') {
                $('#modal-editar-informações-usuario [name="nome_completo"]').val(dadosUsuario?.nome_completo || '');
                $('#modal-editar-informações-usuario [name="cpf"]').val(dadosUsuario?.cpf || '');
                $('#modal-editar-informações-usuario [name="sexo"]').val(dadosUsuario?.sexo || '');
                $('#modal-editar-informações-usuario [name="data_nascimento"]').val(dadosUsuario?.data_nascimento || '');
            } 
            else if (tipoModal === 'curso') {
                $('#modal-editar-informações-curso [name="curso"]').val(dadosUsuario?.curso || '');
                $('#modal-editar-informações-curso [name="periodo"]').val(dadosUsuario?.periodo || '');
                $('#modal-editar-informações-curso [name="codigo"]').val(dadosUsuario?.codigo_aluno || '');
            } 
            else if (tipoModal === 'contato') {
                $('#modal-editar-informações-contato [name="email"]').val(dadosUsuario?.email || '');
                $('#modal-editar-informações-contato [name="telefone"]').val(dadosUsuario?.telefone || '');
                $('#modal-editar-informações-contato [name="cep"]').val(dadosUsuario?.cep || '');
                $('#modal-editar-informações-contato [name="endereco"]').val(dadosUsuario?.endereco || '');
            }

            atualizarLabelsFlutuantes();
        }, 100);

    } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        mostrarErro('Erro', 'Não foi possível carregar os dados para edição.');
    }
}

async function salvarInformacoesUsuario() {
    const $modal = $('#modal-editar-informações-usuario');
    const nomeCompleto = $modal.find('[name="nome_completo"]').val().trim();
    const cpf = $modal.find('[name="cpf"]').val().trim();
    const sexo = $modal.find('[name="sexo"]').val();
    const dataNascimento = $modal.find('[name="data_nascimento"]').val();

    if (!nomeCompleto) {
        mostrarErro('Campo Obrigatório', 'Nome completo é obrigatório.');
        return;
    }

    if (!dataNascimento) {
        mostrarErro('Campo Obrigatório', 'Data de nascimento é obrigatória.');
        return;
    }

    if (cpf && !validarCPF(cpf)) {
        mostrarErro('CPF Inválido', 'Por favor, insira um CPF válido.');
        return;
    }

    try {
        $modal.find('.btn-confirmar').prop('disabled', true).text('Salvando...');

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const usuarioId = usuario.id;

        const dados = {
            nome_completo: nomeCompleto,
            cpf: cpf || null,
            sexo: sexo || null,
            data_nascimento: dataNascimento
        };

        await atualizarInformacoesUsuario(usuarioId, dados);

        mostrarSucesso('Sucesso', 'Informações pessoais atualizadas com sucesso!');
        fecharModalEditarUsuario();

        setTimeout(() => {
            exibirInformacoesUsuario();
        }, 1000);

    } catch (erro) {
        mostrarErro('Erro', erro);
    } finally {
        $modal.find('.btn-confirmar').prop('disabled', false).text('Salvar alterações');
    }
}

async function salvarInformacoesCurso() {
    const $modal = $('#modal-editar-informações-curso');
    const curso = $modal.find('[name="curso"]').val();
    const periodo = $modal.find('[name="periodo"]').val();
    const codigo = $modal.find('[name="codigo"]').val().trim();

    if (!curso) {
        mostrarErro('Campo Obrigatório', 'Curso é obrigatório.');
        return;
    }

    if (!codigo) {
        mostrarErro('Campo Obrigatório', 'Registro de aluno é obrigatório.');
        return;
    }

    try {
        $modal.find('.btn-confirmar').prop('disabled', true).text('Salvando...');

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const usuarioId = usuario.id;

        const dados = {
            curso: curso,
            periodo: periodo || null,
            codigo_aluno: codigo
        };

        await atualizarInformacoesCurso(usuarioId, dados);

        mostrarSucesso('Sucesso', 'Informações do curso atualizadas com sucesso!');
        fecharModalEditarCurso();

        setTimeout(() => {
            exibirInformacoesUsuario();
        }, 1000);

    } catch (erro) {
        mostrarErro('Erro', erro);
    } finally {
        $modal.find('.btn-confirmar').prop('disabled', false).text('Salvar alterações');
    }
}

async function salvarInformacoesContato() {
    const $modal = $('#modal-editar-informações-contato');
    const email = $modal.find('[name="email"]').val().trim();
    const telefone = $modal.find('[name="telefone"]').val().trim();
    const cep = $modal.find('[name="cep"]').val().trim();
    const endereco = $modal.find('[name="endereco"]').val().trim();

    if (!email) {
        mostrarErro('Campo Obrigatório', 'Email é obrigatório.');
        return;
    }

    if (!validarEmail(email)) {
        mostrarErro('Email Inválido', 'Por favor, insira um email válido.');
        return;
    }

    if (!telefone) {
        mostrarErro('Campo Obrigatório', 'Telefone é obrigatório.');
        return;
    }

    if (!validarTelefone(telefone)) {
        mostrarErro('Telefone Inválido', 'Por favor, insira um telefone válido.');
        return;
    }

    if (cep && !validarCEP(cep)) {
        mostrarErro('CEP Inválido', 'Por favor, insira um CEP válido.');
        return;
    }

    try {
        $modal.find('.btn-confirmar').prop('disabled', true).text('Salvando...');

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const usuarioId = usuario.id;

        const dados = {
            email: email,
            telefone: telefone,
            cep: cep || null,
            endereco: endereco || null
        };

        await atualizarInformacoesContato(usuarioId, dados);

        mostrarSucesso('Sucesso', 'Informações de contato atualizadas com sucesso!');
        fecharModalEditarContato();

        if (email !== usuario.email) {
            usuario.email = email;
            localStorage.setItem('usuario', JSON.stringify(usuario));
            $(".user-info .user-email").text(email);
        }

        setTimeout(() => {
            exibirInformacoesUsuario();
        }, 1000);

    } catch (erro) {
        mostrarErro('Erro', erro);
    } finally {
        $modal.find('.btn-confirmar').prop('disabled', false).text('Salvar alterações');
    }
}

// ===================== MODAL CADASTRAR USUÁRIOS =====================

function abrirModalCadastrarUsuarios() {
    $('#modal-adicionar-usuarios').addClass('show');
}

function fecharModalCadastrarUsuarios() {
    $('#modal-adicionar-usuarios').removeClass('show');
    limparModalCadastrarUsuarios();
}

function limparModalCadastrarUsuarios() {
    $('#modal-adicionar-usuarios input[type="text"], #modal-adicionar-usuarios input[type="email"], #modal-adicionar-usuarios input[type="password"], #modal-adicionar-usuarios input[type="date"]').val('');
    $('#modal-adicionar-usuarios select').val('');

    $('#modal-adicionar-usuarios ul li i')
        .removeClass('fa-circle-check')
        .addClass('fa-circle-xmark')
        .css('color', '#dc3545');

    $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

    $('#modal-adicionar-usuarios #ocultar-senha').hide();
    $('#modal-adicionar-usuarios #mostrar-senha').show();
    $('#modal-adicionar-usuarios input[name="confirmar_senha"]').attr('type', 'password');
}

function abrirModalCadastrarUsuariosCompleto() {
    transferirDadosParaModalCompleta();
    $('#modal-adicionar-usuarios-completo').addClass('show');
}

function fecharModalCadastrarUsuariosCompleto() {
    $('#modal-adicionar-usuarios-completo').removeClass('show');
    limparModalCadastrarUsuariosCompleto();
}

function limparModalCadastrarUsuariosCompleto() {
    $('#modal-adicionar-usuarios-completo input[type="text"], #modal-adicionar-usuarios-completo input[type="email"], #modal-adicionar-usuarios-completo input[type="password"], #modal-adicionar-usuarios-completo input[type="date"], #modal-adicionar-usuarios-completo input[type="tel"]').val('');
    $('#modal-adicionar-usuarios-completo select').val('');

    $('#modal-adicionar-usuarios-completo ul li i')
        .removeClass('fa-circle-check')
        .addClass('fa-circle-xmark')
        .css('color', '#dc3545');

    $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

    $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').hide();
    $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').show();
    $('#modal-adicionar-usuarios-completo input[name="senha"]').attr('type', 'password');
}

function transferirDadosParaModalCompleta() {
    const nomeUsuario = $('#modal-adicionar-usuarios input[name="nome_usuario"]').val();
    const emailUsuario = $('#modal-adicionar-usuarios input[name="email_usuario"]').val();
    const senha = $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val();
    const tipoUsuario = $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val();
    const dataVigencia = $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val();

    $('#modal-adicionar-usuarios-completo input[name="nome_usuario"]').val(nomeUsuario);
    $('#modal-adicionar-usuarios-completo input[name="email_usuario"]').val(emailUsuario);
    $('#modal-adicionar-usuarios-completo input[name="senha"]').val(senha);
    $('#modal-adicionar-usuarios-completo select[name="tipo_usuario"]').val(tipoUsuario);
    $('#modal-adicionar-usuarios-completo input[name="data_vigencia"]').val(dataVigencia);

    if (senha) {
        const criterios = validarSenhaForte(senha);

        $('#modal-adicionar-usuarios-completo ul li').each(function (index) {
            const $li = $(this);
            const $icon = $li.find('i');

            switch (index) {
                case 0:
                    if (criterios.maiuscula && criterios.minuscula) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 1:
                    if (criterios.numero) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 2:
                    if (criterios.especial) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 3:
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

// ===================== CONFIGURAÇÕES AUXILIARES =====================

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

const textosHeader = {
    conta: 'Conta',
    info_user: 'Conta',
    emprestimos: 'Biblioteca',
    reservas: 'Biblioteca',
    users: 'Biblioteca',
    relatorio: 'Biblioteca',
    config: 'Configurações'
};

// ===================== EVENT LISTENERS =====================

$(document).ready(function () {
    // Inicialização
    inicializarUsuario();

    // Preencher informações básicas do usuário
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        $(".user-info .icon-user").html(gerarIconeUsuario(usuario.nome_usuario, 40));
        $(".user-info .user-name").text(usuario.nome_usuario);
        $(".user-info .user-email").text(usuario.email);
    }

    exibirInformacoesUsuario();

    // Navegação
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
        $(".nav-item").removeClass("active");
        $(".nav-item:first").addClass("active");
    }

    // Logout
    $('.logout').on('click', function (e) {
        e.preventDefault();
        fazerLogout();
    });

    // ===== EVENT LISTENERS MODAL EDITAR PERFIL =====
    $('#editar-conta').on('click', function (e) {
        e.preventDefault();
        abrirModalEditarPerfil();
    });

    $('#fechar-editar-perfil, #btn-cancelar-perfil').on('click', function (e) {
        e.preventDefault();
        fecharModalEditarPerfil();
    });

    $('.modal-overlay').on('click', function (e) {
        if (e.target === this) {
            fecharModalEditarPerfil();
        }
    });

    $('#input-biografia-modal').on('input', function() {
        atualizarContadorCaracteres();
        
        const length = $(this).val().length;
        if (length > 350) {
            $(this).val($(this).val().substring(0, 350));
            atualizarContadorCaracteres();
        }
    });

    $('#btn-salvar-perfil').on('click', function (e) {
        e.preventDefault();
        salvarPerfil();
    });

    // ===== EVENT LISTENERS MODAIS EDIÇÃO INFORMAÇÕES =====
    $('#editar-perfil').on('click', async function (e) {
        e.preventDefault();
        abrirModalEditarUsuario();
        await editarUsuarioEspecifico('usuario');
    });

    $('#editar-curso').on('click', async function (e) {
        e.preventDefault();
        abrirModalEditarCurso();
        await editarUsuarioEspecifico('curso');
    });

    $('#editar-contato').on('click', async function (e) {
        e.preventDefault();
        abrirModalEditarContato();
        await editarUsuarioEspecifico('contato');
    });

    $('#fechar-editar-informações-usuario').on('click', function (e) {
        e.preventDefault();
        fecharModalEditarUsuario();
    });

    $('#fechar-editar-informações-curso').on('click', function (e) {
        e.preventDefault();
        fecharModalEditarCurso();
    });

    $('#fechar-editar-informações-contato').on('click', function (e) {
        e.preventDefault();
        fecharModalEditarContato();
    });

    $('#modal-editar-informações-usuario .btn-confirmar').on('click', function (e) {
        e.preventDefault();
        salvarInformacoesUsuario();
    });

    $('#modal-editar-informações-curso .btn-confirmar').on('click', function (e) {
        e.preventDefault();
        salvarInformacoesCurso();
    });

    $('#modal-editar-informações-contato .btn-confirmar').on('click', function (e) {
        e.preventDefault();
        salvarInformacoesContato();
    });

    // ===== EVENT LISTENERS CADASTRO USUÁRIOS =====
    $('#cadastre-usuario').on('click', function (e) {
        e.preventDefault();
        abrirModalCadastrarUsuarios();
    });

    $('#fechar-cadastro-usuario').on('click', function (e) {
        e.preventDefault();
        fecharModalCadastrarUsuarios();
    });

    $('#cadastro-completo').on('click', function (e) {
        e.preventDefault();
        abrirModalCadastrarUsuariosCompleto();
    });

    $('#fechar-cadastro-usuario-completo').on('click', function (e) {
        e.preventDefault();
        fecharModalCadastrarUsuariosCompleto();
    });

    // ===== FORMATAÇÃO AUTOMÁTICA =====
    $('[name="cpf"]').on('input', function () {
        const valor = formatarCPF($(this).val());
        $(this).val(valor);
    });

    $('[name="telefone"]').on('input', function () {
        const valor = formatarTelefone($(this).val());
        $(this).val(valor);
    });

    $('[name="cep"]').on('input', function () {
        const valor = formatarCEP($(this).val());
        $(this).val(valor);
    });

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    $('[name="email"]').on('blur', function () {
        const email = $(this).val().trim();
        if (email && !validarEmail(email)) {
            $(this).addClass('input-erro');
        } else {
            $(this).removeClass('input-erro');
        }
    });

    $('[name="cpf"]').on('blur', function () {
        const cpf = $(this).val().trim();
        if (cpf && !validarCPF(cpf)) {
            $(this).addClass('input-erro');
        } else {
            $(this).removeClass('input-erro');
        }
    });

    $('[name="telefone"]').on('blur', function () {
        const telefone = $(this).val().trim();
        if (telefone && !validarTelefone(telefone)) {
            $(this).addClass('input-erro');
        } else {
            $(this).removeClass('input-erro');
        }
    });

    $('[name="cep"]').on('blur', function () {
        const cep = $(this).val().trim();
        if (cep && !validarCEP(cep)) {
            $(this).addClass('input-erro');
        } else {
            $(this).removeClass('input-erro');
        }
    });

    // ===== VALIDAÇÃO SENHA FORTE - MODAL SIMPLES =====
    $('#modal-adicionar-usuarios input[name="confirmar_senha"]').on('input', function () {
        const senha = $(this).val();
        const criterios = validarSenhaForte(senha);

        $('#modal-adicionar-usuarios ul li').each(function (index) {
            const $li = $(this);
            const $icon = $li.find('i');

            switch (index) {
                case 0:
                    if (criterios.maiuscula && criterios.minuscula) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 1:
                    if (criterios.numero) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 2:
                    if (criterios.especial) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 3:
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

    $('#modal-adicionar-usuarios input[name="nome_usuario"], #modal-adicionar-usuarios input[name="email_usuario"], #modal-adicionar-usuarios select[name="tipo_usuario"], #modal-adicionar-usuarios input[name="data_vigencia_usuario"]').on('input change', function () {
        atualizarBotaoCadastrar();
    });

    // ===== MOSTRAR/OCULTAR SENHA - MODAL SIMPLES =====
    $('#modal-adicionar-usuarios #mostrar-senha').on('click', function () {
        $('#modal-adicionar-usuarios #mostrar-senha').hide();
        $('#modal-adicionar-usuarios #ocultar-senha').show();
        $('#modal-adicionar-usuarios input[name="confirmar_senha"]').attr('type', 'text');
    });

    $('#modal-adicionar-usuarios #ocultar-senha').on('click', function () {
        $('#modal-adicionar-usuarios #ocultar-senha').hide();
        $('#modal-adicionar-usuarios #mostrar-senha').show();
        $('#modal-adicionar-usuarios input[name="confirmar_senha"]').attr('type', 'password');
    });

    // ===== CADASTRO USUÁRIO SIMPLES =====
    $('#modal-adicionar-usuarios .btn-confirmar').on('click', async function (e) {
        e.preventDefault();

        const nomeUsuario = $('#modal-adicionar-usuarios input[name="nome_usuario"]').val().trim();
        const emailUsuario = $('#modal-adicionar-usuarios input[name="email_usuario"]').val().trim();
        const senha = $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val();
        const tipoUsuario = $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val();
        const dataVigencia = $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val();

        if (!nomeUsuario || !emailUsuario || !senha || !tipoUsuario || !dataVigencia) {
            mostrarErro('Campos Obrigatórios', 'Todos os campos são obrigatórios.');
            return;
        }

        if (!senhaEForte(senha)) {
            mostrarErro('Senha Fraca', 'A senha não atende aos critérios de segurança.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailUsuario)) {
            mostrarErro('Email Inválido', 'Por favor, insira um email válido.');
            return;
        }

        try {
            $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

            const dadosUsuario = {
                nome_usuario: nomeUsuario,
                email: emailUsuario,
                senha: senha,
                tipo_usuario: tipoUsuario,
                data_vigencia: dataVigencia
            };

            await cadastrarUsuarioSimples(dadosUsuario);

            mostrarSucesso('Usuário Cadastrado', 'O usuário foi cadastrado com sucesso!');

            $('#modal-adicionar-usuarios input[name="nome_usuario"]').val('');
            $('#modal-adicionar-usuarios input[name="email_usuario"]').val('');
            $('#modal-adicionar-usuarios input[name="confirmar_senha"]').val('');
            $('#modal-adicionar-usuarios select[name="tipo_usuario"]').val('');
            $('#modal-adicionar-usuarios input[name="data_vigencia_usuario"]').val('');

            $('#modal-adicionar-usuarios ul li i').removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');

            fecharModalCadastrarUsuarios();

        } catch (erro) {
            mostrarErro('Erro no Cadastro', erro);
        } finally {
            $('#modal-adicionar-usuarios .btn-confirmar').prop('disabled', false).removeClass('btn-disabled');
        }
    });

    // ===== VALIDAÇÃO SENHA FORTE - MODAL COMPLETA =====
    $('#modal-adicionar-usuarios-completo input[name="senha"]').on('input', function () {
        const senha = $(this).val();
        const criterios = validarSenhaForte(senha);

        $('#modal-adicionar-usuarios-completo ul li').each(function (index) {
            const $li = $(this);
            const $icon = $li.find('i');

            switch (index) {
                case 0:
                    if (criterios.maiuscula && criterios.minuscula) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 1:
                    if (criterios.numero) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 2:
                    if (criterios.especial) {
                        $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
                    } else {
                        $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
                    }
                    break;
                case 3:
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

    $('#modal-adicionar-usuarios-completo input, #modal-adicionar-usuarios-completo select').on('input change', function () {
        atualizarBotaoCadastrarCompleto();
    });

    // ===== MOSTRAR/OCULTAR SENHA - MODAL COMPLETA =====
    $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').on('click', function () {
        $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').hide();
        $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').show();
        $('#modal-adicionar-usuarios-completo input[name="senha"]').attr('type', 'text');
    });

    $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').on('click', function () {
        $('#modal-adicionar-usuarios-completo #ocultar-senha-completo').hide();
        $('#modal-adicionar-usuarios-completo #mostrar-senha-completo').show();
        $('#modal-adicionar-usuarios-completo input[name="senha"]').attr('type', 'password');
    });

    // ===== CADASTRO USUÁRIO COMPLETO =====
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

        if (!nomeUsuario || !emailUsuario || !senha || !tipoUsuario || !dataVigencia ||
            !nomeCompleto || !dataNascimento || !curso || !codigo || !telefone) {
            mostrarErro('Campos Obrigatórios', 'Todos os campos marcados com * são obrigatórios.');
            return;
        }

        if (!senhaEForte(senha)) {
            mostrarErro('Senha Fraca', 'A senha não atende aos critérios de segurança.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailUsuario)) {
            mostrarErro('Email Inválido', 'Por favor, insira um email válido.');
            return;
        }

        try {
            $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', true).addClass('btn-disabled');

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

            mostrarSucesso('Usuário Cadastrado', 'O usuário foi cadastrado com sucesso!');

            fecharModalCadastrarUsuariosCompleto();

        } catch (erro) {
            mostrarErro('Erro no Cadastro', erro);
        } finally {
            $('#modal-adicionar-usuarios-completo .btn-confirmar').prop('disabled', false).removeClass('btn-disabled');
        }
    });

    // ===== CONFIGURAÇÕES AUXILIARES =====
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

    const navLinks = document.querySelectorAll('.div-nav-perfil-administrador .item-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const headerSpan = document.querySelector('.container-name-section span');
            const section = link.dataset.section;
            headerSpan.textContent = textosHeader[section];
        });
    });
});
