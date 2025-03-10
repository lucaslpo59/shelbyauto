// 🔹 Importa os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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


// 🔹 Captura o clique do botão de proposta
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("form-btn")) {
        const index = event.target.getAttribute("data-index");

        console.log(`Botão ${index} clicado!`);

        // Verifica se o usuário está autenticado
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await getUserData(user.uid);
                if (!userData) {
                    alert("❌ Erro: Não foi possível recuperar os dados do usuário.");
                    return;
                }

                // 🔹 Pegando os dados do usuário autenticado
                const nome = userData.displayName || "Desconhecido";
                const discord = userData.discord || "Não informado";
                const celular = userData.celular || "Não informado";

                // 🔹 Pegando os dados do carro correspondente
                const carro = carros[index];

                if (!carro) {
                    console.error("❌ Carro não encontrado!");
                    alert("❌ Erro ao encontrar o carro.");
                    return;
                }

                // ✅ Correção: Agora a lógica está correta!
                const statusVenda = carro.vendido ? "🟢 Disponível" : "❌ Vendido";

                // 🔹 URL do Webhook do Discord
                const webhookURL = "https://discord.com/api/webhooks/1343741774644117534/zoYLMvqda0hJRJNjDtBzE_3DNN9-EY651LjHIdpNSCygGjHE-Xjxln0uxjBSIbq8RiiZ";

                // 🔹 Criando a mensagem para enviar ao Discord
                const mensagem = {
                    content: `📩 **Nova Proposta Recebida!** 📩\n\n` +
                             `🚗 **Carro:** ${carro.nome}\n` +
                             `💰 **Preço:** ${carro.preco}\n` +
                             `📊 **FIPE:** ${carro.fipe}\n` +
                             `⏳ **KM:** ${carro.km}\n` +
                             `⚙ **Câmbio:** ${carro.cambio}\n` +
                             `🔢 **Placa:** ${carro.placa}\n` +
                             `📌 **Status:** ${statusVenda}\n\n` +
                             `👤 **Nome In-Game:** ${nome}\n` +
                             `🎮 **Discord:** ${discord}\n` +
                             `📱 **Celular:** ${celular}`
                };

                // 🔹 Enviando a mensagem para o Discord
                fetch(webhookURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(mensagem)
                })
                .then(response => {
                    if (response.ok) {
                        alert("✅ Proposta enviada com sucesso!");
                    } else {
                        alert("❌ Erro ao enviar a proposta.");
                    }
                })
                .catch(error => {
                    alert("❌ Erro ao conectar com o Discord.");
                    console.error("Erro:", error);
                });

            } else {
                alert("❌ Você precisa estar autenticado para enviar uma proposta.");
            }
        });
    }
});

// 🔹 Função para verificar o login e bloquear o botão
function verificarLogin() {
    onAuthStateChanged(auth, (user) => {
        const botoesProposta = document.querySelectorAll(".form-btn");

        botoesProposta.forEach(botao => {
            if (user) {
                botao.disabled = false; // ✅ Habilita o botão se estiver logado
                botao.style.opacity = "1"; // Mantém a aparência normal
                botao.style.cursor = "pointer";
            } else {
                botao.disabled = true; // ❌ Desabilita o botão se não estiver logado
                botao.style.opacity = "0.5"; // Deixa o botão meio transparente
                botao.style.cursor = "not-allowed";
                botao.addEventListener("click", () => {
                    alert("❌ Você precisa estar logado para enviar uma proposta!");
                });
            }
        });
    });
}

// 🔹 Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", verificarLogin);

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function(event) {
            event.preventDefault();

            try {
                await signOut(auth);
                console.log("✅ Usuário saiu com sucesso!");
                alert("Você saiu da conta!");
                
                // Verifica se realmente deslogou
                setTimeout(() => {
                    console.log("Usuário após logout:", auth.currentUser);
                }, 2000);
                
                window.location.href = "index.html";
            } catch (error) {
                console.error("❌ Erro ao sair:", error);
                alert("Erro ao sair. Verifique o console.");
            }
        });
    }
});