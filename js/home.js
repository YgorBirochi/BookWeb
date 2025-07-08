// modal ver rank emprestimos
$(document).ready(function() {
    $('#ver-mais').click(function() {
        $('#modal-ver-rank-emprestimos').addClass('show');
    });

    $('#fechar-modal, .modal-overlay').click(function() {
        $('#modal-ver-rank-emprestimos').removeClass('show');
    });

    // Fechar modal com tecla ESC
    $(document).keydown(function(e) {
        if (e.key === "Escape") {
            $('#modal-ver-rank-emprestimos').removeClass('show');
        }
    });
});


