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

        // Carregar os dados do usuário do Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        // Atualiza os elementos HTML com as informações do usuário
        document.getElementById("profileName").textContent = user.displayName || "Usuário";
        document.getElementById("profileEmail").textContent = user.email;

        if (docSnap.exists() && docSnap.data().photoURL) {
            document.getElementById("profileAvatar").src = docSnap.data().photoURL + "?t=" + new Date().getTime();
        } else {
            document.getElementById("profileAvatar").src = user.photoURL || "https://i.pravatar.cc/100";
        }
    } else {
        console.error("❌ Nenhum usuário autenticado. Redirecionando...");
        window.location.href = "login.html"; // 🔹 Redireciona para login
    }
});



// 🔹 Função para editar a foto de perfil e salvar no Firebase Storage
function editarFotoPerfil() {
    const newPhotoURL = prompt("Digite a URL da nova foto:");

    if (auth.currentUser && newPhotoURL) {
        updateProfile(auth.currentUser, {
            photoURL: newPhotoURL
        }).then(() => {
            document.getElementById("profileAvatar").src = newPhotoURL;
            alert("Foto atualizada com sucesso!");
        }).catch((error) => {
            console.error("Erro ao atualizar foto:", error);
            alert("Erro ao atualizar a foto.");
        });
    }
}



// 🔹 Função para atualizar a foto do perfil
document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM completamente carregado");

    const editPhotoBtn = document.getElementById("editPhoto");
    
    if (!editPhotoBtn) {
        console.error("❌ Botão de edição de foto não encontrado.");
        return;
    }

    console.log("✅ Botão de edição de foto encontrado!");

    editPhotoBtn.addEventListener("click", async () => {
        console.log("🖊️ Alterar foto clicado!");

        if (!auth.currentUser) {
            alert("Erro: usuário não autenticado.");
            return;
        }

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    console.log("📤 Enviando imagem para o Firebase Storage...");
                    
                    const userId = auth.currentUser.uid;
                    const storageRef = ref(storage, `profile_pictures/${userId}`);

                    await uploadBytes(storageRef, file);
                    const photoURL = await getDownloadURL(storageRef);

                    console.log("✅ Upload concluído! Nova URL da foto:", photoURL);

                    // 🔹 Atualiza o Auth e o Firestore
                    await updateProfile(auth.currentUser, { photoURL });

                    await setDoc(doc(db, "users", userId), { photoURL }, { merge: true });

                    // 🔹 Força o navegador a pegar a imagem atualizada
                    document.getElementById("profileAvatar").src = photoURL + "?t=" + new Date().getTime();

                    alert("✅ Foto de perfil atualizada!");
                } catch (error) {
                    console.error("❌ Erro ao atualizar a foto:", error);
                    alert("Erro ao atualizar a foto de perfil.");
                }
            }
        });

        fileInput.click();
    });
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

        // 🔹 Mapeia os campos corretamente para os IDs no HTML
        const campoIdMap = {
            displayName: "profileName",  // 🔹 Mapeia "displayName" corretamente
            discord: "profileDiscord",
            celular: "profileCelular",
            email: "profileEmail"
        };

        // 🔹 Obtém o elemento correto baseado no mapa
        const campoElemento = document.getElementById(campoIdMap[campo] || `profile${campo.charAt(0).toUpperCase() + campo.slice(1)}`);

        if (!campoElemento) {
            console.error(`Elemento com ID ${campoIdMap[campo]} não encontrado.`);
            return;
        }

        // 🔹 Atualiza o texto visível no perfil
        campoElemento.textContent = novoValor;

        // 🔹 Atualiza no Firestore
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { [campo]: novoValor }, { merge: true });

        alert("Perfil atualizado!");
    }
};
