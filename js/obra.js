// Funcionalidades da página de obra
$(document).ready(function() {
    // Inicializar funcionalidades específicas da obra
    inicializarFuncionalidadesObra();
});

// Funcionalidades específicas da página de obra
function inicializarFuncionalidadesObra() {
    // Botão reservar
    $('.btn-reservar').off('click').on('click', function() {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        
        if (!usuario) {
            alert('Você precisa estar logado para reservar um livro.');
            window.location.href = 'login.html';
            return;
        }
        
        // Simular processo de reserva
        $(this).html('<i class="fa-solid fa-spinner fa-spin"></i> Reservando...');
        $(this).prop('disabled', true);
        
        setTimeout(() => {
            $(this).html('<i class="fa-solid fa-check"></i> Reservado!');
            $(this).removeClass('btn-reservar').addClass('btn-reservado');
            $(this).css('background-color', '#27ae60');
            
            // Reset após 3 segundos
            setTimeout(() => {
                $(this).html('Reservar');
                $(this).removeClass('btn-reservado').addClass('btn-reservar');
                $(this).prop('disabled', false);
                $(this).css('background-color', '');
            }, 3000);
        }, 1500);
    });

    // Avaliação por estrelas
    $('.avaliacao i').off('click').on('click', function() {
        const $stars = $(this).parent().find('i');
        const clickedIndex = $stars.index(this);
        
        $stars.removeClass('ativ').addClass('desativ');
        
        for (let i = 0; i <= clickedIndex; i++) {
            $stars.eq(i).removeClass('desativ').addClass('ativ');
        }
        
        // Aqui você pode implementar a lógica para salvar a avaliação
        console.log('Avaliação:', clickedIndex + 1, 'estrelas');
    });

    // Hover nas estrelas
    $('.avaliacao i').hover(
        function() {
            const $stars = $(this).parent().find('i');
            const hoverIndex = $stars.index(this);
            
            $stars.removeClass('ativ').addClass('desativ');
            
            for (let i = 0; i <= hoverIndex; i++) {
                $stars.eq(i).removeClass('desativ').addClass('ativ');
            }
        },
        function() {
            // Restaurar estado original (se não houver avaliação salva)
            // Você pode implementar lógica para manter a avaliação atual
        }
    );
} 