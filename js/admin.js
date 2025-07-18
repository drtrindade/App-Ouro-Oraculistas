document.addEventListener('DOMContentLoaded', function() {
    // Verificar se é admin
    const currentUser = JSON.parse(localStorage.getItem('ouroOracularCurrentUser'));
    
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    // Carregar lista de oraculistas
    loadOraculistas();
    
    // Carregar lista de apps
    loadApps();
    
    // Configurar listeners
    document.getElementById('addOraculistaForm').addEventListener('submit', addOraculista);
    document.getElementById('addAppForm').addEventListener('submit', addApp);
});

function loadOraculistas() {
    const users = JSON.parse(localStorage.getItem('ouroOracularUsers')) || {};
    const tableBody = document.querySelector('#oraculistasTable tbody');
    
    tableBody.innerHTML = '';
    
    for (const username in users) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${username}</td>
            <td>
                <button class="btn-admin btn-edit" data-username="${username}">Editar</button>
                <button class="btn-admin btn-delete" data-username="${username}">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', editOraculista);
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteOraculista);
    });
}

function addOraculista(e) {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    
    if (!username || !password) {
        alert('Preencha todos os campos');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('ouroOracularUsers')) || {};
    
    if (users[username]) {
        alert('Usuário já existe');
        return;
    }
    
    users[username] = { password };
    localStorage.setItem('ouroOracularUsers', JSON.stringify(users));
    
    // Registrar no Firebase
    if (typeof logAdminAction === 'function') {
        logAdminAction(`Adicionou oraculista: ${username}`);
    }
    
    document.getElementById('addOraculistaForm').reset();
    loadOraculistas();
}

function editOraculista(e) {
    const username = e.target.getAttribute('data-username');
    const newPassword = prompt('Nova senha para ' + username);
    
    if (newPassword) {
        const users = JSON.parse(localStorage.getItem('ouroOracularUsers'));
        users[username].password = newPassword;
        localStorage.setItem('ouroOracularUsers', JSON.stringify(users));
        
        // Registrar no Firebase
        if (typeof logAdminAction === 'function') {
            logAdminAction(`Editou senha de: ${username}`);
        }
        
        loadOraculistas();
    }
}

function deleteOraculista(e) {
    const username = e.target.getAttribute('data-username');
    
    if (confirm(`Tem certeza que deseja excluir o oraculista ${username}?`)) {
        const users = JSON.parse(localStorage.getItem('ouroOracularUsers'));
        delete users[username];
        localStorage.setItem('ouroOracularUsers', JSON.stringify(users));
        
        // Registrar no Firebase
        if (typeof logAdminAction === 'function') {
            logAdminAction(`Removeu oraculista: ${username}`);
        }
        
        loadOraculistas();
    }
}

function loadApps() {
    const apps = JSON.parse(localStorage.getItem('ouroOracularApps')) || [
        { id: 'mapa-numerologico', name: 'Mapa Numerológico', url: 'https://drtrindade.github.io/Mapa-Numerologico/' }
    ];
    
    const tableBody = document.querySelector('#appsTable tbody');
    
    tableBody.innerHTML = '';
    
    apps.forEach(app => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${app.name}</td>
            <td>${app.url}</td>
            <td>
                <button class="btn-admin btn-delete" data-app-id="${app.id}">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('#appsTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteApp);
    });
}

function addApp(e) {
    e.preventDefault();
    
    const appName = document.getElementById('newAppName').value;
    const appUrl = document.getElementById('newAppUrl').value;
    
    if (!appName || !appUrl) {
        alert('Preencha todos os campos');
        return;
    }
    
    const apps = JSON.parse(localStorage.getItem('ouroOracularApps')) || [];
    const appId = appName.toLowerCase().replace(/\s+/g, '-');
    
    apps.push({
        id: appId,
        name: appName,
        url: appUrl
    });
    
    localStorage.setItem('ouroOracularApps', JSON.stringify(apps));
    
    // Registrar no Firebase
    if (typeof logAdminAction === 'function') {
        logAdminAction(`Adicionou app: ${appName}`);
    }
    
    document.getElementById('addAppForm').reset();
    loadApps();
}

function deleteApp(e) {
    const appId = e.target.getAttribute('data-app-id');
    
    if (confirm('Tem certeza que deseja excluir este app?')) {
        let apps = JSON.parse(localStorage.getItem('ouroOracularApps'));
        apps = apps.filter(app => app.id !== appId);
        localStorage.setItem('ouroOracularApps', JSON.stringify(apps));
        
        // Registrar no Firebase
        if (typeof logAdminAction === 'function') {
            logAdminAction(`Removeu app: ${appId}`);
        }
        
        loadApps();
    }
}