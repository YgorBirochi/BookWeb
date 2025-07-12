// Exemplo de uso da Modal de Mensagem
// Este arquivo demonstra como usar as funções da modal de mensagem

// Importar as funções (se estiver usando módulos)
// import { mostrarMensagem, mostrarSucesso, mostrarErro, mostrarInfo, mostrarConfirmacao } from './utils.js';

// ===== EXEMPLOS DE USO =====

// 1. Mensagem de Sucesso Simples
function exemploSucesso() {
    mostrarSucesso(
        'Operação Concluída',
        'O livro foi reservado com sucesso!'
    );
}

// 2. Mensagem de Sucesso com Auto-fechamento
function exemploSucessoAutoFechar() {
    mostrarSucesso(
        'Login Realizado',
        'Bem-vindo de volta!',
        {
            autoFechar: 3000 // Fecha automaticamente após 3 segundos
        }
    );
}

// 3. Mensagem de Erro
function exemploErro() {
    mostrarErro(
        'Erro na Operação',
        'Não foi possível reservar o livro. Tente novamente.'
    );
}

// 4. Mensagem Informativa
function exemploInfo() {
    mostrarInfo(
        'Informação Importante',
        'Este livro deve ser devolvido até a próxima semana.'
    );
}

// 5. Confirmação Simples
function exemploConfirmacao() {
    mostrarConfirmacao(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir esta reserva?',
        function() {
            // Ação executada ao confirmar
            console.log('Reserva excluída');
            mostrarSucesso('Reserva Excluída', 'A reserva foi removida com sucesso.');
        },
        function() {
            // Ação executada ao cancelar (opcional)
            console.log('Operação cancelada');
        }
    );
}

// 6. Confirmação com Ações Personalizadas
function exemploConfirmacaoPersonalizada() {
    mostrarConfirmacao(
        'Atualizar Perfil',
        'Deseja salvar as alterações no seu perfil?',
        function() {
            // Salvar alterações
            salvarPerfil();
        },
        function() {
            // Descartar alterações
            descartarAlteracoes();
        }
    );
}

// 7. Modal Personalizada Completa
function exemploModalPersonalizada() {
    mostrarMensagem({
        tipo: 'info',
        titulo: 'Configurações Avançadas',
        mensagem: 'Esta ação irá alterar as configurações padrão do sistema. Deseja continuar?',
        textoConfirmar: 'Aplicar',
        textoCancelar: 'Cancelar',
        onConfirmar: function() {
            aplicarConfiguracoes();
            mostrarSucesso('Configurações Aplicadas', 'As novas configurações foram salvas.');
        },
        onCancelar: function() {
            console.log('Configurações não aplicadas');
        }
    });
}

// 8. Exemplo de uso em operações de API
async function exemploOperacaoAPI() {
    try {
        // Simular uma chamada de API
        const response = await fetch('/api/reservar-livro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ livroId: 123 })
        });

        if (response.ok) {
            const data = await response.json();
            mostrarSucesso(
                'Livro Reservado',
                `O livro "${data.titulo}" foi reservado com sucesso!`
            );
        } else {
            throw new Error('Erro na reserva');
        }
    } catch (error) {
        mostrarErro(
            'Erro na Reserva',
            'Não foi possível reservar o livro. Verifique sua conexão e tente novamente.'
        );
    }
}

// 9. Exemplo de validação de formulário
function exemploValidacaoFormulario() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        mostrarErro(
            'Campos Obrigatórios',
            'Por favor, preencha todos os campos obrigatórios.'
        );
        return false;
    }

    if (senha.length < 6) {
        mostrarErro(
            'Senha Inválida',
            'A senha deve ter pelo menos 6 caracteres.'
        );
        return false;
    }

    // Se tudo estiver ok, continuar com o login
    realizarLogin(email, senha);
    return true;
}

// 10. Exemplo de notificação de token expirado
function exemploTokenExpirado() {
    mostrarInfo(
        'Sessão Expirada',
        'Sua sessão expirou. Você será redirecionado para a página de login.',
        {
            autoFechar: 3000,
            onConfirmar: function() {
                // Limpar dados e redirecionar
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                window.location.href = '/login.html';
            }
        }
    );
}

// ===== FUNÇÕES AUXILIARES PARA OS EXEMPLOS =====

function salvarPerfil() {
    console.log('Perfil salvo');
}

function descartarAlteracoes() {
    console.log('Alterações descartadas');
}

function aplicarConfiguracoes() {
    console.log('Configurações aplicadas');
}

async function realizarLogin(email, senha) {
    // Simular login
    console.log('Realizando login...');
}

// ===== BOTÕES DE TESTE (para usar no HTML) =====

// Adicione estes botões ao seu HTML para testar:

/*
<button onclick="exemploSucesso()">Teste Sucesso</button>
<button onclick="exemploErro()">Teste Erro</button>
<button onclick="exemploInfo()">Teste Info</button>
<button onclick="exemploConfirmacao()">Teste Confirmação</button>
<button onclick="exemploModalPersonalizada()">Teste Modal Personalizada</button>
<button onclick="exemploOperacaoAPI()">Teste API</button>
<button onclick="exemploTokenExpirado()">Teste Token Expirado</button>
*/

// ===== COMO USAR EM OUTROS ARQUIVOS =====

/*
// 1. Importar as funções (se estiver usando módulos ES6)
import { mostrarSucesso, mostrarErro, mostrarInfo, mostrarConfirmacao } from './utils.js';

// 2. Ou usar diretamente se o arquivo utils.js estiver carregado globalmente
// As funções estarão disponíveis globalmente

// 3. Exemplo de uso em um formulário de login
document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    if (!email || !senha) {
        mostrarErro('Erro', 'Preencha todos os campos');
        return;
    }
    
    // Fazer login
    fazerLogin(email, senha);
});

async function fazerLogin(email, senha) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        if (response.ok) {
            mostrarSucesso('Login Realizado', 'Bem-vindo!');
            // Redirecionar ou atualizar página
        } else {
            mostrarErro('Erro no Login', 'Email ou senha incorretos');
        }
    } catch (error) {
        mostrarErro('Erro de Conexão', 'Verifique sua internet e tente novamente');
    }
}
*/ 