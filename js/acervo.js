// function para mudar a class active do botao de categoria
$(document).ready(function() {
    $('.category-btn').click(function() {
        $('.category-btn').removeClass('active');
        $(this).addClass('active');
    });
});

