# Modal de Mensagem - BookWeb

Uma modal reutilizável para exibir mensagens de sucesso, erro e informações no sistema BookWeb.

## 📋 Características

- ✅ **Três tipos de mensagem**: Sucesso, Erro e Informação
- ✅ **Confirmações personalizadas**: Com botões de confirmar e cancelar
- ✅ **Auto-fechamento**: Opção de fechar automaticamente após um tempo
- ✅ **Responsiva**: Adaptada para dispositivos móveis
- ✅ **Acessível**: Suporte a teclado (ESC para fechar)
- ✅ **Animações suaves**: Transições elegantes
- ✅ **Fácil de usar**: API simples e intuitiva

## 🎨 Tipos de Mensagem

### Sucesso (Verde)
- Ícone: ✓ (check-circle)
- Cor: Verde (#28a745)
- Uso: Operações bem-sucedidas

### Erro (Vermelho)
- Ícone: ⚠ (exclamation-triangle)
- Cor: Vermelho (#dc3545)
- Uso: Erros e falhas

### Informação (Azul)
- Ícone: ℹ (info-circle)
- Cor: Azul (#17a2b8)
- Uso: Informações e avisos

## 🚀 Como Usar

### 1. Funções Principais

```javascript
// Mensagem de sucesso
mostrarSucesso('Título', 'Mensagem');

// Mensagem de erro
mostrarErro('Título', 'Mensagem');

// Mensagem informativa
mostrarInfo('Título', 'Mensagem');

// Confirmação
mostrarConfirmacao('Título', 'Mensagem', onConfirmar, onCancelar);
```

### 2. Exemplos Práticos

#### Login bem-sucedido
```javascript
mostrarSucesso(
    'Login Realizado',
    'Bem-vindo de volta!',
    { autoFechar: 3000 }
);
```

#### Erro de validação
```javascript
mostrarErro(
    'Campos Obrigatórios',
    'Por favor, preencha todos os campos.'
);
```

#### Confirmação de exclusão
```javascript
mostrarConfirmacao(
    'Confirmar Exclusão',
    'Tem certeza que deseja excluir esta reserva?',
    function() {
        // Ação ao confirmar
        excluirReserva();
    },
    function() {
        // Ação ao cancelar (opcional)
        console.log('Operação cancelada');
    }
);
```

### 3. API Completa

```javascript
mostrarMensagem({
    tipo: 'sucesso', // 'sucesso', 'erro', 'info'
    titulo: 'Título da Mensagem',
    mensagem: 'Texto da mensagem',
    textoConfirmar: 'OK', // Texto do botão confirmar
    textoCancelar: 'Cancelar', // Texto do botão cancelar (opcional)
    onConfirmar: function() {
        // Função executada ao confirmar
    },
    onCancelar: function() {
        // Função executada ao cancelar
    },
    autoFechar: 5000 // Tempo em ms para fechar automaticamente
});
```

## 📱 Responsividade

A modal se adapta automaticamente a diferentes tamanhos de tela:

- **Desktop**: Modal centralizada com largura máxima de 400px
- **Tablet**: Ajusta para 90% da largura da tela
- **Mobile**: Botões empilhados verticalmente para melhor usabilidade

## ⌨️ Acessibilidade

- **Teclado**: Pressione `ESC` para fechar a modal
- **Foco**: Navegação por tab entre os botões
- **Screen Readers**: Textos descritivos para leitores de tela

## 🎯 Casos de Uso Comuns

### 1. Operações de API
```javascript
async function reservarLivro(livroId) {
    try {
        const response = await fetch('/api/reservar', {
            method: 'POST',
            body: JSON.stringify({ livroId })
        });
        
        if (response.ok) {
            mostrarSucesso('Livro Reservado', 'Reserva realizada com sucesso!');
        } else {
            throw new Error('Erro na reserva');
        }
    } catch (error) {
        mostrarErro('Erro', 'Não foi possível reservar o livro.');
    }
}
```

### 2. Validação de Formulários
```javascript
function validarFormulario() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    if (!email || !senha) {
        mostrarErro('Campos Obrigatórios', 'Preencha todos os campos.');
        return false;
    }
    
    if (senha.length < 6) {
        mostrarErro('Senha Inválida', 'A senha deve ter pelo menos 6 caracteres.');
        return false;
    }
    
    return true;
}
```

### 3. Token Expirado
```javascript
function tokenExpirado() {
    mostrarInfo(
        'Sessão Expirada',
        'Sua sessão expirou. Você será redirecionado para o login.',
        {
            autoFechar: 3000,
            onConfirmar: function() {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
            }
        }
    );
}
```

## 🔧 Personalização

### Cores
As cores podem ser personalizadas editando as variáveis CSS no arquivo `modal.css`:

```css
/* Cores dos tipos de mensagem */
.tipo-sucesso .modal-content { border-top-color: #28a745; }
.tipo-erro .modal-content { border-top-color: #dc3545; }
.tipo-info .modal-content { border-top-color: #17a2b8; }
```

### Animações
As animações podem ser ajustadas modificando as propriedades de transição:

```css
#modal-mensagem {
    transition: all 0.3s ease-in-out;
}
```

## 📁 Estrutura de Arquivos

```
BookWeb/
├── index.html (contém a modal HTML)
├── css/
│   └── modal.css (estilos da modal)
├── js/
│   ├── utils.js (funções da modal)
│   └── exemplo-uso-modal.js (exemplos de uso)
└── README-Modal-Mensagem.md (esta documentação)
```

## 🐛 Solução de Problemas

### Modal não aparece
1. Verifique se o arquivo `utils.js` está sendo carregado
2. Confirme se a modal HTML está presente no DOM
3. Verifique se não há erros no console

### Estilos não aplicados
1. Certifique-se de que `modal.css` está sendo importado
2. Verifique se as variáveis CSS estão definidas
3. Confirme se não há conflitos de CSS

### Funções não definidas
1. Verifique se `utils.js` está sendo carregado antes do seu código
2. Confirme se está usando as funções exportadas corretamente
3. Verifique se não há erros de sintaxe

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte o arquivo `exemplo-uso-modal.js`
3. Verifique o console do navegador para erros
4. Teste com os exemplos básicos primeiro

---

**Desenvolvido para o projeto BookWeb** 📚 