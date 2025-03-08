// profile.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔹 Configuração do Firebase (use sua configuração já existente)
const firebaseConfig = {
    apiKey: "AIzaSyCmzjt8A60JQvqiARuqqySxZQ3EnxQ05Tw",
    authDomain: "shelbyauto-4c8f5.firebaseapp.com",
    projectId: "shelbyauto-4c8f5",
    storageBucket: "shelbyauto-4c8f5.appspot.com",
    messagingSenderId: "118535915272",
    appId: "1:118535915272:web:60912ed96a3d202175cebd",
    measurementId: "G-MYQG7J4YZK"
};

// 🔹 Inicializa o Firebase e os serviços necessários
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


let userId = null; // 🔹 Definir userId globalmente

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
                document.getElementById("profileAvatar").src = user.photoURL || "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png";
                document.getElementById("userAvatar").src = user.photoURL || "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png";
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



// 🔹 Função para editar a foto de perfil e salvar no Firebase Storage
document.getElementById("editPhoto").addEventListener("click", async () => {
    const newPhotoURL = prompt("Cole o link da nova foto de perfil:");

    if (newPhotoURL && auth.currentUser) {
        try {
            await updateProfile(auth.currentUser, { photoURL: newPhotoURL });

            document.getElementById("profileAvatar").src = newPhotoURL;

            // Salva no Firestore
            const userId = auth.currentUser.uid;
            await setDoc(doc(db, "users", userId), { photoURL: newPhotoURL }, { merge: true });

            alert("Foto de perfil atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar a foto:", error);
            alert("Erro ao atualizar a foto de perfil.");
        }
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("profileAvatar").src = data.photoURL || user.photoURL || "https://i.pravatar.cc/100";
        }
    }
});


    // Ao carregar página, busca os dados adicionais no Firestore
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userId = user.uid;

        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (userRef && (await getDoc(userRef)).exists()) {
            const data = (await getDoc(userRef)).data();

            document.getElementById("profileDiscord").textContent = data.discord || "Não informado";
            document.getElementById("profileCelular").textContent = data.celular || "Não informado";
        }
    }
});

// 🔹 Editar qualquer campo
window.editarCampo = async function (campo) {
    const novoValor = prompt(`Digite o novo valor para ${campo}:`);
    if (novoValor !== null && novoValor.trim() !== "") {

        // 🔹 Obtém o usuário autenticado
        const user = auth.currentUser;
        if (!user) {
            alert("Erro: usuário não autenticado.");
            return;
        }
        const userId = user.uid; // 🔹 Obtém o ID do usuário

        // 🔹 Mapeia os campos corretamente para os IDs no HTML
        const campoIdMap = {
            displayName: "profileName",  // 🔹 Corrige "displayName" corretamente
            discord: "profileDiscord",
            celular: "profileCelular",
            email: "profileEmail"
        };

        // 🔹 Obtém o elemento correto baseado no mapa
        const campoElemento = document.getElementById(campoIdMap[campo] || `profile${campo.charAt(0).toUpperCase() + campo.slice(1)}`);

        if (!campoElemento) {
            console.error(`❌ Elemento com ID ${campoIdMap[campo]} não encontrado.`);
            return;
        }

        // 🔹 Atualiza o texto visível no perfil
        campoElemento.textContent = novoValor;

        // 🔹 Atualiza no Firestore
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { [campo]: novoValor }, { merge: true });

        // 🔹 Se o campo for "displayName", também atualiza no Firebase Authentication
        if (campo === "displayName") {
            try {
                await updateProfile(user, { displayName: novoValor });
                console.log("✅ Nome atualizado no Firebase Authentication!");
            } catch (error) {
                console.error("❌ Erro ao atualizar nome no Authentication:", error);
            }
        }

        alert("✅ Perfil atualizado!");
    }
};

