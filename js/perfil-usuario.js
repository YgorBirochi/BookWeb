// ===================== IMPORTS =====================
import { gerarIconeUsuario, fazerLogout, mostrarSucesso, mostrarErro, atualizarLabelsFlutuantes } from './utils.js';
import { 
    buscarDadosUsuarioLogado,
    atualizarInformacoesConta,
    atualizarInformacoesUsuario,
    atualizarInformacoesCurso,
    atualizarInformacoesContato 
} from './api/user.js';

// ===================== CONFIGURAÇÕES GLOBAIS =====================

const configuracoes = {
    MAX_CARACTERES_BIOGRAFIA: 350,
    TEXTOS_HEADER: {
        conta: 'Conta',
        info_user: 'Conta',
        emprestimos: 'Biblioteca',
        historico: 'Biblioteca',
        reserva: 'Biblioteca',
        config: 'Configurações'
    }
};

// ===================== DADOS DE EXEMPLO =====================

const dados_exemplo = {
    emprestimos: [
        {
            id: 1,
            dataSaida: "10/1/2023",
            dataDevolucao: "17/1/2023",
            status: "em-andamento",
            multa: 0.00,
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
            livros: [
                {
                    id: 4,
                    titulo: "Dom Quixote",
                    autor: "Miguel de Cervantes",
                    capa: "../assets/img/capa-de-livro-teste.png",
                    classificacao: "14",
                    paginas: "328",
                    rating: "4,5"
                }
            ]
        }
    ],
    reservas: [
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
        }
    ]
};

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

// ===================== FUNÇÕES DE FORMATAÇÃO =====================

function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function calcularDataExpiracao(dataReserva) {
    const data = new Date(dataReserva.split('/').reverse().join('-'));
    data.setHours(data.getHours() + 48);
    return data.toLocaleDateString('pt-BR');
}

// ===================== FUNÇÕES DE NAVEGAÇÃO =====================

function mostrarConteudo(secaoId) {
    $('.conteudo-perfil, .conteudo-info_user, .conteudo-emprestimos, .conteudo-historico, .conteudo-reserva, .conteudo-configuracoes').removeClass('active');
    const $secaoAtiva = $('#' + secaoId);
    if ($secaoAtiva.length) {
        $secaoAtiva.addClass('active');
    }
}


// ===================== GERENCIADOR DE USUÁRIO =====================

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

// ===================== GERENCIADOR DE MODAIS =====================

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



// Modal Alterar Senha
// abrirAlterarSenha() {
//     $('#modal-alterar-senha').addClass('show');
//     $('#btn-salvar-senha').prop('disabled', true).addClass('btn-disabled');
//     setTimeout(() => $('#input-nova-senha').focus(), 300);
// },

// fecharAlterarSenha() {
//     $('#modal-alterar-senha').removeClass('show');
//     $('#form-alterar-senha')[0].reset();
//     this.resetarCriteriosSenha();
// },

// resetarCriteriosSenha() {
//     $('.senha-create li i').removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
//     $('#btn-salvar-senha').prop('disabled', true).addClass('btn-disabled');
// },

// atualizarCriteriosSenha() {
//     const senha = $('#input-nova-senha').val();
//     const criterios = validarSenhaForte(senha);

//     $('.senha-create li').each(function (index) {
//         const $icon = $(this).find('i');
//         let valido = false;

//         switch (index) {
//             case 0: valido = criterios.maiuscula && criterios.minuscula; break;
//             case 1: valido = criterios.numero; break;
//             case 2: valido = criterios.especial; break;
//             case 3: valido = criterios.tamanho; break;
//         }

//         if (valido) {
//             $icon.removeClass('fa-circle-xmark').addClass('fa-circle-check').css('color', '#28a745');
//         } else {
//             $icon.removeClass('fa-circle-check').addClass('fa-circle-xmark').css('color', '#dc3545');
//         }
//     });

//     this.atualizarBotaoSalvarSenha();
// },

// atualizarBotaoSalvarSenha() {
//     const novaSenha = $('#input-nova-senha').val();
//     const confirmarSenha = $('#input-confirmar-senha').val();
//     const senhaValida = senhaEForte(novaSenha);
//     const senhasCoincidem = novaSenha === confirmarSenha && novaSenha !== '';

//     if (senhaValida && senhasCoincidem) {
//         $('#btn-salvar-senha').prop('disabled', false).removeClass('btn-disabled');
//     } else {
//         $('#btn-salvar-senha').prop('disabled', true).addClass('btn-disabled');
//     }
// },

// salvarNovaSenha() {
//     const novaSenha = $('#input-nova-senha').val();
//     const confirmarSenha = $('#input-confirmar-senha').val();

//     // Validações
//     if (!novaSenha || !confirmarSenha) {
//         mostrarErro('Campos Obrigatórios', 'Todos os campos são obrigatórios.');
//         return;
//     }

//     if (novaSenha !== confirmarSenha) {
//         mostrarErro('Senhas Diferentes', 'A nova senha e a confirmação não coincidem.');
//         return;
//     }

//     if (!senhaEForte(novaSenha)) {
//         mostrarErro('Senha Fraca', 'A nova senha não atende aos critérios de segurança.');
//         return;
//     }

//     // Implementar lógica de alteração no backend
//     mostrarSucesso('Senha Alterada', 'Sua senha foi alterada com sucesso!');
//     this.fecharAlterarSenha();
// },

// // Modal Verificar Email
// abrirVerificarEmail() {
//     $('#modal-verificar-email').addClass('show');
//     setTimeout(() => $('.codigo-input').first().focus(), 300);
// },

// ===== Utilitário de hover com tolerância e animações =====
function setupHoverModal({ 
    triggerSelector, 
    modalSelector, 
    showClass = 'show', 
    enterDelay = 0, 
    leaveDelay = 120 
  }) {
    const $trigger = $(triggerSelector);
    const $modal = $(modalSelector);
  
    let overTrigger = false;
    let overModal = false;
    let closeTimer = null;
  
    const open = () => {
      clearTimeout(closeTimer);
      $modal.addClass(showClass).removeClass('hide'); // garante entrada
    };
  
    const close = () => {
      // adiciona classe de saída com animação e fecha ao terminar
      $modal.addClass('hide').removeClass(showClass);
      // após a duração da animação, esconder de fato (display: none)
      setTimeout(() => {
        if ($modal.hasClass('hide')) {
          $modal.removeClass('hide'); // limpa estado
          $modal.removeClass(showClass); // mantém oculto (CSS controla display)
        }
      }, 150); // deve bater com o tempo da animação de saída no CSS
    };
  
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        if (!overTrigger && !overModal) close();
      }, leaveDelay);
    };
  
    // Entrar no trigger abre a modal
    $trigger.on('mouseenter', () => {
      overTrigger = true;
      setTimeout(open, enterDelay);
    });
  
    // Sair do trigger agenda fechamento (se também não estiver sobre a modal)
    $trigger.on('mouseleave', () => {
      overTrigger = false;
      scheduleClose();
    });
  
    // Entrar na modal cancela fechamento
    $modal.on('mouseenter', () => {
      overModal = true;
      clearTimeout(closeTimer);
    });
  
    // Sair da modal agenda fechamento (se também não estiver sobre o trigger)
    $modal.on('mouseleave', () => {
      overModal = false;
      scheduleClose();
    });
  
    // Clique em ícone de fechar (se existir)
    $modal.find('[id^="fechar-informacoes"]').on('click', (e) => {
      e.preventDefault();
      overModal = false;
      overTrigger = false;
      close();
    });
  
    // Clique fora fecha (caso queira também por clique global)
    $(document).on('mousedown', (e) => {
      if (!$modal.is(e.target) && $modal.has(e.target).length === 0 &&
          !$trigger.is(e.target) && $trigger.has(e.target).length === 0) {
        overModal = false;
        overTrigger = false;
        close();
      }
    });
  }
  
  // Inicializar os dois hovers
  $(function() {
    setupHoverModal({
      triggerSelector: '#abrir-informacoes-emprestimo',
      modalSelector: '#modal-informacoes-emprestimo',
    });
  
    setupHoverModal({
      triggerSelector: '#abrir-informacoes-reservas',
      modalSelector: '#modal-informacoes-reserva',
    });
  });
  
// ===================== GERENCIADOR DE CONFIGURAÇÕES =====================

const CONFIG_MANAGER = {
    carregar() {
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

        this.atualizarLabels();
        this.controlarSecundarias();
    },

    salvar() {
        const configuracoes = {
            email: $('#toggle-email').is(':checked'),
            emprestimos: $('#toggle-emprestimos').is(':checked'),
            reservas: $('#toggle-reservas').is(':checked'),
            novidades: $('#toggle-novidades').is(':checked')
        };

        localStorage.setItem('configuracoesNotificacoes', JSON.stringify(configuracoes));
    },

    atualizarLabels() {
        const toggles = ['email', 'emprestimos', 'reservas', 'novidades'];
        toggles.forEach(toggle => {
            const isChecked = $(`#toggle-${toggle}`).is(':checked');
            const label = isChecked ? 'Ativado' : 'Desativado';
            $(`#toggle-${toggle}`).closest('.config-item').find('.toggle-label').text(label);
        });
    },

    controlarSecundarias() {
        const emailAtivo = $('#toggle-email').is(':checked');
        const secundarios = ['emprestimos', 'reservas', 'novidades'];

        secundarios.forEach(toggle => {
            const $toggle = $(`#toggle-${toggle}`);
            const $container = $toggle.closest('.config-item');

            if (!emailAtivo) {
                $toggle.prop('checked', false).prop('disabled', true);
                $container.addClass('disabled');
            } else {
                $toggle.prop('disabled', false);
                $container.removeClass('disabled');
            }
        });

        this.atualizarLabels();
    }
};

// ===================== GERENCIADOR DE EMPRÉSTIMOS =====================

const EMPRESTIMOS_MANAGER = {
    renderizar(emprestimos = dados_exemplo.emprestimos) {
        const container = $('.container-emprestimos .emprestimos');
        container.empty();

        if (emprestimos.length === 0) {
            container.html('<p class="sem-emprestimos">Nenhum empréstimo encontrado.</p>');
            return;
        }

        emprestimos.forEach(emprestimo => {
            const emprestimoHTML = this.criarHTMLEmprestimo(emprestimo);
            container.append(emprestimoHTML);
        });

        $('#total-emprestimos').text(emprestimos.length);
    },

    criarHTMLEmprestimo(emprestimo) {
        let statusClass = '', statusText = '', headerColor = '';

        if (emprestimo.status === 'atrasado') {
            statusClass = 'atrasado';
            statusText = 'Atrasado';
            headerColor = '#dc3545';
        } else if (emprestimo.status === 'em-andamento') {
            statusClass = 'em-andamento';
            statusText = 'Em andamento';
            headerColor = '#ffc107';
        } else if (emprestimo.status === 'finalizado') {
            statusClass = 'finalizado';
            statusText = 'Finalizado';
            headerColor = '#28a745';
        }

        const multaColor = emprestimo.multa > 0 ? '#dc3545' :
            (emprestimo.status === 'em-andamento' ? '#ffc107' : '#28a745');

        return `
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
                        <span class="multa-valor" style="color: ${multaColor}">Multa: ${formatarMoeda(emprestimo.multa)}</span>
                        <span class="data-vencimento">Data de devolução: ${emprestimo.dataDevolucao}</span>
                        <span class="data-pagamento">Data de pagamento: ${emprestimo.dataPagamento || '-'}</span>
                    </div>
                </div>
                <div class="emprestimo-livros">
                    ${emprestimo.livros.map(livro => this.criarHTMLLivroEmprestimo(livro)).join('')}
                </div>
            </div>
        `;
    },

    criarHTMLLivroEmprestimo(livro) {
        return `
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
        `;
    },

    filtrar() {
        const filtroLivro = $('input[name="livro"]').val().toLowerCase();
        const filtroTipo = $('#select-tipo').val();
        const filtroDia = $('#select-dia').val();
        const filtroMes = $('#input-mes').val();
        const filtroAno = $('#select-ano').val();

        let emprestimosFiltrados = dados_exemplo.emprestimos.filter(emprestimo => {
            const matchTipo = filtroTipo === 'todos' || emprestimo.status === filtroTipo;
            const matchLivro = filtroLivro === '' || emprestimo.livros.some(livro =>
                livro.titulo.toLowerCase().includes(filtroLivro) ||
                livro.autor.toLowerCase().includes(filtroLivro)
            );

            const [diaSaida, mesSaida, anoSaida] = emprestimo.dataSaida.split('/');
            const matchDia = filtroDia === 'crescente' || filtroDia === 'decrescente' ||
                filtroDia === '' || diaSaida === filtroDia;
            const matchMes = filtroMes === 'crescente' || filtroMes === 'decrescente' ||
                filtroMes === '' || mesSaida === filtroMes;
            const matchAno = filtroAno === 'crescente' || filtroAno === 'decrescente' ||
                filtroAno === '' || anoSaida === filtroAno;

            return matchLivro && matchTipo && matchDia && matchMes && matchAno;
        });

        // Aplicar ordenação
        emprestimosFiltrados = this.aplicarOrdenacao(emprestimosFiltrados, filtroDia, filtroMes, filtroAno);
        this.renderizar(emprestimosFiltrados);
    },

    aplicarOrdenacao(array, filtroDia, filtroMes, filtroAno) {
        const ordenarPorCampo = (array, campo, ordem) => {
            return array.sort((a, b) => {
                const [diaA, mesA, anoA] = a.dataSaida.split('/').map(Number);
                const [diaB, mesB, anoB] = b.dataSaida.split('/').map(Number);

                let valA, valB;
                if (campo === 'ano') { valA = anoA; valB = anoB; }
                else if (campo === 'mes') { valA = mesA; valB = mesB; }
                else if (campo === 'dia') { valA = diaA; valB = diaB; }

                return ordem === 'crescente' ? valA - valB : valB - valA;
            });
        };

        // Ordenação hierárquica: ano > mês > dia
        if (filtroAno === 'crescente' || filtroAno === 'decrescente') {
            array = ordenarPorCampo(array, 'ano', filtroAno);
        } else {
            array = ordenarPorCampo(array, 'ano', 'decrescente');
        }

        if (filtroMes === 'crescente' || filtroMes === 'decrescente') {
            array = ordenarPorCampo(array, 'mes', filtroMes);
        }

        if (filtroDia === 'crescente' || filtroDia === 'decrescente') {
            array = ordenarPorCampo(array, 'dia', filtroDia);
        }

        return array;
    }
};

// ===================== GERENCIADOR DE HISTÓRICO =====================

const HISTORICO_MANAGER = {
    renderizar() {
        const container = $('.container-livros .livros');
        container.empty();
        let totalLivros = 0;

        dados_exemplo.emprestimos.forEach(emprestimo => {
            let statusClass = (emprestimo.status === 'em-andamento' || emprestimo.status === 'atrasado') ?
                'em-andamento' : 'devolvido';
            let statusText = statusClass === 'em-andamento' ? 'Em andamento' : 'Devolvido';

            emprestimo.livros.forEach(livro => {
                totalLivros++;
                const livroHTML = this.criarHTMLLivroHistorico(livro, emprestimo, statusClass, statusText);
                container.append(livroHTML);
            });
        });

        $('#total-livros-emprestados').text(totalLivros);
    },

    criarHTMLLivroHistorico(livro, emprestimo, statusClass, statusText) {
        return `
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
    }
};

// ===================== GERENCIADOR DE RESERVAS =====================

const RESERVAS_MANAGER = {
    renderizar() {
        const container = $('.reservas');
        container.empty();
        let totalReservas = 0;

        dados_exemplo.reservas.forEach(reserva => {
            totalReservas++;
            const livroHTML = this.criarHTMLReserva(reserva);
            container.append(livroHTML);
        });

        $('#total-reservas').text(totalReservas);
    },

    criarHTMLReserva(reserva) {
        const livro = reserva.livro;
        let statusClass = '', statusText = '', dataExpiracao = '';

        if (livro.exemplaresDisponiveis > 0) {
            statusClass = 'disponivel';
            statusText = 'Disponível para empréstimo';
            dataExpiracao = calcularDataExpiracao(reserva.dataReserva);
        } else {
            statusClass = 'aguardando';
            statusText = 'Aguardando disponibilidade';
            dataExpiracao = 'Indefinida';
        }

        return `
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
    }
};

// ===================== INICIALIZAÇÃO PRINCIPAL =====================

$(document).ready(function () {
    // Inicializar componentes
    CONFIG_MANAGER.carregar();
    EMPRESTIMOS_MANAGER.renderizar();
    HISTORICO_MANAGER.renderizar();
    RESERVAS_MANAGER.renderizar();

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

    // ===== NAVEGAÇÃO =====
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

    // Mostrar seção padrão
    if (!$('.conteudo-perfil.active, .conteudo-info_user.active, .conteudo-emprestimos.active, .conteudo-historico.active, .conteudo-configuracoes.active, .conteudo-reserva.active').length) {
        mostrarConteudo('conta');
        $(".nav-item").removeClass("active").first().addClass("active");
    }

    // ===== EVENT LISTENERS PRINCIPAIS =====

    // Logout
    $('.logout').on('click', e => {
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

    // Modais - Configurações
    $('#btn-alterar-senha').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.abrirAlterarSenha();
    });

    $('#fechar-alterar-senha, #btn-cancelar-senha').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.fecharAlterarSenha();
    });

    $('#btn-salvar-senha').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.salvarNovaSenha();
    });

    // Validação de senha
    $('#input-nova-senha').on('input', () => MODAL_MANAGER.atualizarCriteriosSenha());
    $('#input-confirmar-senha').on('input', () => MODAL_MANAGER.atualizarBotaoSalvarSenha());

    // Mostrar/Ocultar senha
    $('#mostrar-nova-senha').on('click', function () {
        $(this).hide();
        $('#ocultar-nova-senha').css('display', 'flex');
        $('#input-nova-senha').attr('type', 'text');
    });

    $('#ocultar-nova-senha').on('click', function () {
        $(this).hide();
        $('#mostrar-nova-senha').css('display', 'flex');
        $('#input-nova-senha').attr('type', 'password');
    });

    // Modal Verificar Email
    $('#btn-verificar-email').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.abrirVerificarEmail();
    });

    $('#fechar-verificar-email, #btn-cancelar-email').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.fecharVerificarEmail();
    });

    // Código de verificação
    $('.codigo-input').on('input', function () {
        const $input = $(this);
        const valor = $input.val();
        const index = parseInt($input.data('index'));

        if (!/^\d*$/.test(valor)) {
            $input.val('');
            return;
        }

        if (valor.length === 1 && index < 3) {
            $(`.codigo-input[data-index="${index + 1}"]`).focus();
        }
    });

    $('.codigo-input').on('keydown', function (e) {
        const $input = $(this);
        const index = parseInt($input.data('index'));

        if (e.key === 'Backspace' && $input.val() === '' && index > 0) {
            $(`.codigo-input[data-index="${index - 1}"]`).focus();
        }
    });

    // Configurações de Notificação
    $('#toggle-email').on('change', function () {
        CONFIG_MANAGER.controlarSecundarias();
        CONFIG_MANAGER.salvar();

        const status = $(this).is(':checked') ? 'ativadas' : 'desativadas';
        mostrarSucesso('Notificações por E-mail', `Notificações por e-mail ${status}.`);
    });

    $('#toggle-emprestimos, #toggle-reservas, #toggle-novidades').on('change', function () {
        if ($('#toggle-email').is(':checked')) {
            CONFIG_MANAGER.salvar();
            CONFIG_MANAGER.atualizarLabels();

            const tipo = $(this).attr('id').replace('toggle-', '');
            const status = $(this).is(':checked') ? 'ativadas' : 'desativadas';
            const nome = tipo.charAt(0).toUpperCase() + tipo.slice(1);
            mostrarSucesso(`Notificações de ${nome}`, `Notificações de ${tipo} ${status}.`);
        }
    });

    // Filtros
    $('input[name="livro"]').on('input', () => EMPRESTIMOS_MANAGER.filtrar());
    $('#select-tipo').on('change', () => EMPRESTIMOS_MANAGER.filtrar());
    $('#select-dia, #input-mes, #select-ano').on('change', () => EMPRESTIMOS_MANAGER.filtrar());

    // Modais de Informação
    $('#abrir-informacoes-emprestimo').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.abrirInformacoesEmprestimo();
    });

    $('#abrir-informacoes-reservas').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.abrirInformacoesReserva();
    });

    $('#fechar-informacoes-emprestimo').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.fecharInformacoesEmprestimo();
    });

    $('#fechar-informacoes-reserva').on('click', e => {
        e.preventDefault();
        MODAL_MANAGER.fecharInformacoesReserva();
    });

    // Atualizar header baseado na seção
    $('.div-nav-perfil-usuario .item-link').each(function () {
        $(this).on('click', function (e) {
            e.preventDefault();
            const section = $(this).data('section');
            $('.container-name-section span').text(configuracoes.TEXTOS_HEADER[section]);
        });
    });

    // Fechar modais com ESC
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('.modal.show, [id^="modal-"].show').removeClass('show');
        }
    });

    // Fechar modais ao clicar fora
    $('.modal-overlay').on('click', function (e) {
        if (e.target === this) {
            $(this).parent().removeClass('show');
        }
    });

    // Inicializar labels flutuantes
    setTimeout(() => {
        $('.div-input input[type="date"], .div-input select').each(function () {
            $(this).prev('label').addClass('active');
        });
    }, 100);
});
