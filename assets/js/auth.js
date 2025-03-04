// 🔹 Importando os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Configuração do Firebase (Substitua pelos seus dados reais)
const firebaseConfig = {
    apiKey: "AIzaSyCmzjt8A60JQvqiARuqqySxZQ3EnxQ05Tw",
    authDomain: "shelbyauto-4c8f5.firebaseapp.com",
    projectId: "shelbyauto-4c8f5",
    storageBucket: "shelbyauto-4c8f5.appspot.com",
    messagingSenderId: "118535915272",
    appId: "1:118535915272:web:60912ed96a3d202175cebd",
    measurementId: "G-MYQG7J4YZK"
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
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("Erro ao sair:", error);
                alert("Erro ao sair. Verifique o console.");
            });
        });
    }
});
