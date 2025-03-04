// 🔹 Importando Firebase Auth
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Obtém a instância de autenticação do Firebase
const auth = getAuth();

// 🔹 Observa mudanças no estado de autenticação (login/logout)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Se o usuário estiver logado, exibe o menu com os dados
        document.querySelector(".user-profile").style.display = "flex";
        document.getElementById("loginRegister").style.display = "none"; // Esconde o link de login

        document.getElementById("userName").textContent = user.displayName || "Usuário";
        document.getElementById("userAvatar").src = user.photoURL || "https://i.pravatar.cc/50";
    } else {
        // Se não estiver logado, esconde o menu e exibe "Fazer Login / Registrar"
        document.querySelector(".user-profile").style.display = "none";
        document.getElementById("loginRegister").style.display = "block";
    }
});

// 🔹 Logout do usuário
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Evita recarregar a página

            signOut(auth).then(() => {
                alert("Você saiu da conta!");
                window.location.href = "login.html"; // Redireciona para a página de login
            }).catch((error) => {
                console.error("Erro ao sair:", error);
                alert("Erro ao sair. Verifique o console.");
            });
        });
    }
});
