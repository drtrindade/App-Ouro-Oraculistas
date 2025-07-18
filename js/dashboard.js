document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const currentUser = JSON.parse(localStorage.getItem('ouroOracularCurrentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nome do usuário
    document.getElementById('userName').textContent = currentUser.username;
    
    // Carregar apps
    loadApps();
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Registrar logout no Firebase
        if (typeof logAccess === 'function') {
            logAccess(currentUser.username, 'logout');
        }
        
        localStorage.removeItem('ouroOracularCurrentUser');
        window.location.href = 'index.html';
    });
});

function loadApps() {
    const apps = JSON.parse(localStorage.getItem('ouroOracularApps')) || [];
    const appsContainer = document.getElementById('appsContainer');
    
    appsContainer.innerHTML = '';
    
    apps.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        appCard.innerHTML = `
            <h3>${app.name}</h3>
            <p>Clique para acessar</p>
        `;
        
        appCard.addEventListener('click', function() {
            openApp(app);
        });
        
        appsContainer.appendChild(appCard);
    });
}

function openApp(app) {
    const currentUser = JSON.parse(localStorage.getItem('ouroOracularCurrentUser'));
    
    // Registrar acesso ao app no Firebase
    if (typeof logAppAccess === 'function') {
        logAppAccess(currentUser.username, app.name);
    }
    
    // Abrir app em iframe
    const iframeContainer = document.getElementById('iframeContainer');
    const iframe = document.createElement('iframe');
    
    iframe.src = app.url;
    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);
    iframeContainer.style.display = 'block';
    
    // Esconder a grade de apps
    document.getElementById('appsGrid').style.display = 'none';
    
    // Adicionar botão de voltar
    const backButton = document.createElement('button');
    backButton.textContent = 'Voltar para Apps';
    backButton.className = 'btn-login';
    backButton.style.marginTop = '10px';
    backButton.addEventListener('click', function() {
        iframeContainer.style.display = 'none';
        document.getElementById('appsGrid').style.display = 'grid';
    });
    
    iframeContainer.appendChild(backButton);
}