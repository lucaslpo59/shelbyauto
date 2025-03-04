// 🔹 Importando os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Configuração do Firebase (Substitua pelos seus dados reais)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// 🔹 Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔹 Observa mudanças no estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector(".user-profile").style.display = "flex";
        document.getElementById("loginRegister").style.display = "none";

        document.getElementById("userName").textContent = user.displayName || "Usuário";
        document.getElementById("userAvatar").src = user.photoURL || "https://i.pravatar.cc/50";
    } else {
        document.querySelector(".user-profile").style.display = "none";
        document.getElementById("loginRegister").style.display = "block";
    }
});

// 🔹 Logout do usuário
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault();
            signOut(auth).then(() => {
                alert("Você saiu da conta!");
                window.location.href = "login.html";
            }).catch((error) => {
                console.error("Erro ao sair:", error);
                alert("Erro ao sair. Verifique o console.");
            });
        });
    }
});
