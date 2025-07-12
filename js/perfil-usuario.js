// Importar funções do utils.js
import { aplicarSecaoAtivaPerfil, fazerLogout } from './utils.js';

$(document).ready(function() {
    // Aplicar seção ativa se vier de navegação externa
    aplicarSecaoAtivaPerfil();
    
    // Seleciona todos os nav-items
    $('.nav-item').each(function() {
        const $item = $(this);
        const $itemLink = $item.find('.item-link');
        const $chevronDown = $item.find('.chevron-down');
        const $chevronUp = $item.find('.chevron-up');
        
        // Adiciona evento para todos os nav-items (exceto logout)
        if (!$itemLink.hasClass('logout')) {
            $itemLink.on('click', function(e) {
                e.preventDefault();
                
                // Remove classe active de todos os outros itens
                $('.nav-item').not($item).removeClass('active');
                
                // Adiciona classe active ao item clicado
                $item.addClass('active');
                
                // Fecha todas as modais primeiro (independente de ter setas ou não)
                $('.modal-content').parent().removeClass('show').fadeOut(300);
                
                // Reseta todas as setas
                $('.chevron-down').show();
                $('.chevron-up').hide();
                
                // Esconde todo o conteúdo
                $('.conteudo-perfil, .conteudo-biblioteca, .conteudo-configuracoes').removeClass('active');
            
                // Se o item tem setas (modal), controla as modais
                if ($chevronDown.length && $chevronUp.length) {
                    // Identifica qual modal corresponde a este item
                    let $targetModal;
                    if ($itemLink.text().includes('Minha conta')) {
                        $targetModal = $('#modal-sub-nav-perfil');
                    } else if ($itemLink.text().includes('Biblioteca')) {
                        $targetModal = $('#modal-sub-nav-biblioteca');
                    }
                    
                    if ($targetModal) {
                        // Alterna o estado da modal atual
                        const isVisible = $targetModal.hasClass('show');
                        
                        if (isVisible) {
                            // Fecha a modal com animação
                            $targetModal.removeClass('show').fadeOut(300);
                            $chevronDown.show();
                            $chevronUp.hide();
                        } else {
                            // Abre a modal com animação
                            $targetModal.addClass('show').fadeIn(300);
                            $chevronDown.hide();
                            $chevronUp.show();
                        }
                    }
                } else {
                    // Item sem modal - mostra conteúdo direto
                    const itemText = $itemLink.text().trim();
                    if (itemText.includes('Configurações')) {
                        $('#conta').addClass('active');
                    }
                }
            });
        }
    });
    
    // Eventos para os links das sub-navegações
    $('.sub-nav-item a').on('click', function(e) {
        e.preventDefault();
        
        const targetId = $(this).attr('href').substring(1);
        const $targetElement = $('#' + targetId);
        
        if ($targetElement.length) {
            // Esconde todo o conteúdo
            $('.conteudo-perfil, .conteudo-biblioteca, .conteudo-configuracoes').removeClass('active');
            
            // Mostra o conteúdo alvo
            $targetElement.addClass('active');
            
            // Fecha as modais
            $('.modal-content').parent().removeClass('show').fadeOut(300);
            $('.chevron-down').show();
            $('.chevron-up').hide();
            
            // Remove active de todos os nav-items
            $('.nav-item').removeClass('active');
            
            // Ativa o nav-item correspondente baseado no targetId
            if (targetId === 'perfil' || targetId === 'dados-pessoais') {
                $('.nav-item:first-child').addClass('active');
            } else if (['emprestimos', 'historico', 'reservas', 'biblioteca'].includes(targetId)) {
                $('.nav-item:nth-child(2)').addClass('active');
            }
        }
    });
    
    // Fecha as modais quando clicado fora
    $(document).on('click', function(e) {
        const $clickedElement = $(e.target);
        const $navItems = $('.nav-item');
        const $modals = $('.modal-content').parent();
        
        // Verifica se o clique foi fora da área de navegação e das modais
        if (!$navItems.has($clickedElement).length && !$modals.has($clickedElement).length) {
            // Fecha todas as modais com animação
            $modals.removeClass('show').fadeOut(300);
            $('.nav-item').removeClass('active');
            
            // Reseta todas as setas
            $('.chevron-down').show();
            $('.chevron-up').hide();
        }
    });
    
    // Adiciona efeito de hover nas modais para melhor feedback visual
    $('.sub-nav-item').hover(
        function() {
            $(this).addClass('hover');
        },
        function() {
            $(this).removeClass('hover');
        }
    );
    
    // Mostra o perfil por padrão ao carregar a página (se não houver seção ativa)
    if (!$('.conteudo-perfil.active, .conteudo-biblioteca.active, .conteudo-configuracoes.active').length) {
        $('#perfil').addClass('active');
        $('.nav-item:first-child').addClass('active');
    }
    
    // Função para carregar dados do usuário
    function carregarDadosUsuario() {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        
        if (usuario) {
            // Atualizar informações do usuário na página
            $('#nome-usuario').text(usuario.nome_usuario || 'Usuário');
            $('#email-usuario').text(usuario.email || 'usuario@gmail.com');
            
            // Aqui você pode adicionar mais lógica para carregar dados específicos
            // Por exemplo, número de empréstimos, avaliações, etc.
            console.log('Dados do usuário carregados:', usuario);
        }
    }
    
    // Chama a função de carregar dados
    carregarDadosUsuario();
    
    // Evento para o botão de logout
    $('.logout').on('click', function(e) {
        e.preventDefault();
        
        // Usar a função de logout importada
        fazerLogout();
    });
    
    // Evento para o botão de editar bio
    $('.bio button').on('click', function() {
        const $bioText = $('.bio p');
        const currentText = $bioText.text();
        
        // Cria um campo de texto para edição
        const $textarea = $('<textarea>').val(currentText).css({
            width: '100%',
            minHeight: '100px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '10px',
            fontFamily: 'inherit',
            fontSize: 'inherit'
        });
        
        // Substitui o texto pelo textarea
        $bioText.hide();
        $textarea.insertAfter($bioText);
        
        // Muda o botão para salvar
        const $button = $(this);
        const originalText = $button.html();
        $button.html('<i class="fa-solid fa-check"></i> Salvar');
        
        // Adiciona evento para salvar
        $button.off('click').on('click', function() {
            const newText = $textarea.val();
            $bioText.text(newText).show();
            $textarea.remove();
            $button.html(originalText);
            
            // Restaura o evento original
            $button.off('click').on('click', function() {
                // Recria o evento de edição
                $('.bio button').off('click').on('click', arguments.callee);
            });
        });
    });
    

}); 