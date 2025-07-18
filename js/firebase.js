// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para registrar acesso
function logAccess(username, action) {
    db.collection("access_logs").add({
        username: username,
        action: action,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .catch(error => {
        console.error("Erro ao registrar acesso: ", error);
    });
}

// Função para registrar ações de admin
function logAdminAction(action) {
    const currentUser = JSON.parse(localStorage.getItem('ouroOracularCurrentUser'));
    
    if (currentUser && currentUser.isAdmin) {
        db.collection("admin_actions").add({
            admin: currentUser.username,
            action: action,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(error => {
            console.error("Erro ao registrar ação de admin: ", error);
        });
    }
}

// Função para registrar acesso a apps
function logAppAccess(username, appName) {
    db.collection("app_access").add({
        username: username,
        app: appName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .catch(error => {
        console.error("Erro ao registrar acesso ao app: ", error);
    });
}

// Função para visualizar logs (apenas admin)
function viewLogs() {
    const logsContainer = document.getElementById('logsContainer');
    logsContainer.innerHTML = '<h3>Carregando logs...</h3>';
    
    db.collection("access_logs")
        .orderBy("timestamp", "desc")
        .limit(50)
        .get()
        .then((querySnapshot) => {
            let logsHTML = '<h3>Últimos Acessos</h3><table class="admin-table"><tr><th>Usuário</th><th>Ação</th><th>Data/Hora</th></tr>';
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                logsHTML += `
                    <tr>
                        <td>${data.username}</td>
                        <td>${data.action}</td>
                        <td>${new Date(data.timestamp?.toDate()).toLocaleString()}</td>
                    </tr>
                `;
            });
            
            logsHTML += '</table>';
            logsContainer.innerHTML = logsHTML;
        })
        .catch((error) => {
            logsContainer.innerHTML = '<p>Erro ao carregar logs: ' + error.message + '</p>';
        });
}