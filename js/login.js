import { API_URL } from "./api/api.js";
import { atualizarHeaderUsuario, recarregarSecaoEmprestimos } from "./utils.js";

$(document).ready(function() {
    let $mostrarSenha = $('#mostrarSenha');
    let $ocultarSenha = $('#ocultarSenha');
    let $senha = $('#input-senha');


    $mostrarSenha.on('click', function() {
        $mostrarSenha.hide();
        $ocultarSenha.css('display', 'flex');
        $senha.attr('type', 'text');
    });

    $ocultarSenha.on('click', function() {
        $ocultarSenha.hide();
        $mostrarSenha.css('display', 'flex');
        $senha.attr('type', 'password');
    });
});
// login com api
$(document).ready(function () {
    $(".form-login").on("submit", function (e) {
        e.preventDefault();

        const email = $("input[name='email']").val();
        const senha = $("input[name='senha']").val();

        $.ajax({
            url: `${API_URL}/login`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email, senha }),
            success: function (res) {
                localStorage.setItem("usuario", JSON.stringify(res.usuario));
                localStorage.setItem("token", res.token);
                atualizarHeaderUsuario(); // Atualiza o header antes do redirecionamento
                recarregarSecaoEmprestimos(); // Recarrega a seção de empréstimos
                
                // Reinicializar notificações após login
                setTimeout(() => {
                    if (typeof inicializarModalNotificacoes === 'function') {
                        inicializarModalNotificacoes();
                    }
                }, 100);
                
                window.location.href = "../pages/acervo.html"; // redireciona após login para o acervo
            },
            error: function (xhr) {
                alert(xhr.responseJSON?.erro || "Erro ao fazer login.");
            }
        });
    });
});
