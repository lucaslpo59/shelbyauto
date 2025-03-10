// 🔹 Importa os módulos do Firebase corretamente
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Configuração do Firebase (Mantenha os mesmos dados do projeto)
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
const db = getFirestore(app);

// 🔹 Garante que as informações do usuário são carregadas corretamente
document.addEventListener("DOMContentLoaded", () => {
    const userDisplay = document.getElementById("userName"); // Nome do usuário
    const userAvatar = document.getElementById("userAvatar"); // Foto do usuário
    const logoutBtn = document.getElementById("logout"); // Botão de logout
    const loginRegister = document.getElementById("loginRegister"); // Link de login
    const userMenu = document.getElementById("userMenu"); // Menu do usuário

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("✅ Usuário autenticado:", user.uid);

            // 🔹 Obtém dados adicionais do Firestore
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();

                // ✅ Atualiza a interface com os dados do usuário
                userDisplay.textContent = userData.displayName || "Usuário";
                userAvatar.src = userData.photoURL || "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png";

            } else {
                console.warn("⚠️ Nenhum documento encontrado no Firestore para este usuário.");
                userDisplay.textContent = "Usuário";
            }

            // 🔹 Exibe o menu do usuário e oculta o botão de login
            userMenu.style.display = "block";
            loginRegister.style.display = "none";

        } else {
            console.warn("⚠️ Nenhum usuário autenticado! Redirecionando...");
            
            // 🔹 Oculta o menu do usuário e exibe o botão de login
            userMenu.style.display = "none";
            loginRegister.style.display = "block";
        }
    });

    // 🔹 Função de Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                await signOut(auth);
                console.log("✅ Usuário deslogado com sucesso!");
                alert("Você saiu da conta!");
                window.location.href = "index.html"; // Redireciona para login
            } catch (error) {
                console.error("❌ Erro ao sair:", error);
                alert("Erro ao sair. Verifique o console.");
            }
        });
    }
});
