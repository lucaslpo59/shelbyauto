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


// 🔹 Garante que o usuário está autenticado antes de carregar o perfil
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ Usuário autenticado:", user.uid);

        // Referência ao Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        let displayName = user.displayName || "Usuário"; // Nome padrão caso não encontre

        if (docSnap.exists()) {
            const userData = docSnap.data();

            // Se houver um nome salvo no Firestore, usa ele
            if (userData.displayName) {
                displayName = userData.displayName;
            } else {
                console.warn("⚠️ Nome não encontrado no Firestore. Usando o nome do Firebase Auth.");
            }

            // Atualiza o avatar se houver no Firestore
            if (userData.photoURL) {
                document.getElementById("profileAvatar").src = userData.photoURL + "?t=" + new Date().getTime();
                document.getElementById("userAvatar").src = userData.photoURL + "?t=" + new Date().getTime();
            } else {
                document.getElementById("profileAvatar").src = user.photoURL || "https://i.pravatar.cc/100";
                document.getElementById("userAvatar").src = user.photoURL || "https://i.pravatar.cc/50";
            }

            // Atualiza outros dados (Discord, Celular)
            document.getElementById("profileDiscord").textContent = userData.discord || "Não informado";
            document.getElementById("profileCelular").textContent = userData.celular || "Não informado";
        } else {
            console.warn("⚠️ Nenhum documento encontrado no Firestore para este usuário.");
        }

        // 🔹 Atualiza os elementos corretamente
        const profileNameElement = document.getElementById("profileName");
        if (profileNameElement) {
            profileNameElement.textContent = displayName;
        }

        const userNameElement = document.getElementById("userName");
        if (userNameElement) {
            userNameElement.textContent = displayName;
        }

        document.getElementById("profileEmail").textContent = user.email;

    } else {
        console.error("❌ Nenhum usuário autenticado. Redirecionando...");
        window.location.href = "index.html"; // 🔹 Redireciona para login
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