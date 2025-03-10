// 🔹 Importa os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



// 🔹 Configuração do Firebase (use a mesma do seu projeto)
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
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ Usuário autenticado:", user.uid);

        // Atualiza o nome e a foto do usuário no menu superior
        document.getElementById("userName").textContent = user.displayName || "Usuário";
        document.getElementById("userAvatar").src = user.photoURL || "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png";

        // 🔹 Obtém dados adicionais do Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();

            // Atualiza o nome e a foto, se existirem no Firestore
            if (userData.displayName) {
                document.getElementById("userName").textContent = userData.displayName;
            }
            if (userData.photoURL) {
                document.getElementById("userAvatar").src = userData.photoURL;
            }
        } else {
            console.warn("⚠️ Nenhum documento encontrado no Firestore para este usuário.");
        }
    } else {
        console.error("❌ Nenhum usuário autenticado. Redirecionando...");
        window.location.href = "index.html"; // Redireciona para login
    }
});

// Função para buscar os dados do usuário autenticado
async function getUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return userDoc.data(); // Retorna os dados do Firestore
        } else {
            console.error("❌ Usuário não encontrado no Firestore.");
            return null;
        }
    } catch (error) {
        console.error("❌ Erro ao buscar dados do Firestore:", error);
        return null;
    }
}