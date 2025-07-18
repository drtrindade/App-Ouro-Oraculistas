// admin.js atualizado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se é admin
    const currentUser = JSON.parse(localStorage.getItem('ouroOracularCurrentUser'));
    
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    // Inicializar dados se não existirem
    if (!localStorage.getItem('ouroOracularUsers')) {
        localStorage.setItem('ouroOracularUsers', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('ouroOracularApps')) {
        localStorage.setItem('ouroOracularApps', JSON.stringify([
            {
                id: 'mapa-numerologico',
                name: 'Mapa Numerológico',
                url: 'https://drtrindade.github.io/Mapa-Numerologico/',
                icon: 'https://via.placeholder.com/300x120?text=Mapa+Numerológico'
            }
        ]));
    }
    
    // Carregar dados
    loadOraculistas();
    loadApps();
    
    // Configurar formulários
    document.getElementById('addOraculistaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addOraculista();
    });
    
    document.getElementById('addAppForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addApp();
    });
    
    // Botão visualizar logs
    document.getElementById('viewLogsBtn').addEventListener('click', viewLogs);
});

function loadOraculistas() {
    const users = JSON.parse(localStorage.getItem('ouroOracularUsers'));
    const tableBody = document.querySelector('#oraculistasTable tbody');
    
    tableBody.innerHTML = '';
    
    for (const username in users) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${username}</td>
            <td>••••••••</td>
            <td>
                <button class="btn-edit" data-username="${username}">Editar Senha</button>
                <button class="btn-delete" data-username="${username}">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Adicionar eventos
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', editOraculista);
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteOraculista);
    });
}

function addOraculista() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    
    if (!username || !password) {
        alert('Preencha todos os campos!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('ouroOracularUsers'));
    
    if (users[username]) {
        alert('Usuário já existe!');
        return;
    }
    
    users[username] = { password };
    localStorage.setItem('ouroOracularUsers', JSON.stringify(users));
    
    // Registrar no Firebase
    if (typeof logAdminAction === 'function') {
        logAdminAction(`Adicionou oraculista: ${username}`);
    }
    
    // Limpar e recarregar
    document.getElementById('addOraculistaForm').reset();
    loadOraculistas();
    alert('Oraculista adicionado com sucesso!');
}

function editOraculista(e) {
    const username = e.target.getAttribute('data-username');
    const newPassword = prompt(`Digite a nova senha para ${username}:`);
    
    if (newPassword && newPassword.length >= 4) {
        const users = JSON.parse(localStorage.getItem('ouroOracularUsers'));
        users[username].password = newPassword;
        localStorage.setItem('ouroOracularUsers', JSON.stringify(users));
        
        if (typeof logAdminAction === 'function') {
            logAdminAction(`Alterou senha de: ${username}`);
        }
        
        loadOraculistas();
        alert('Senha alterada com sucesso!');
    }
}

function deleteOraculista(e) {
    const username = e.target.getAttribute('data-username');
    
    if (confirm(`Tem certeza que deseja excluir o oraculista ${username}?`)) {
        const users = JSON.parse(localStorage.getItem('ouroOracularUsers'));
        delete users[username];
        localStorage.setItem('ouroOracularUsers', JSON.stringify(users));
        
        if (typeof logAdminAction === 'function') {
            logAdminAction(`Removeu oraculista: ${username}`);
        }
        
        loadOraculistas();
        alert('Oraculista removido com sucesso!');
    }
}

function loadApps() {
    const apps = JSON.parse(localStorage.getItem('ouroOracularApps'));
    const tableBody = document.querySelector('#appsTable tbody');
    
    tableBody.innerHTML = '';
    
    apps.forEach(app => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${app.name}</td>
            <td>${app.url}</td>
            <td>
                <button class="btn-delete" data-app-id="${app.id}">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adicionar eventos
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', deleteApp);
    });
}

function addApp() {
    const name = document.getElementById('newAppName').value.trim();
    const url = document.getElementById('newAppUrl').value.trim();
    const icon = document.getElementById('newAppIcon').value.trim() || 'https://via.placeholder.com/300x120?text=Oraculo';
    
    if (!name || !url) {
        alert('Preencha pelo menos nome e URL!');
        return;
    }
    
    // Validar URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('URL deve começar com http:// ou https://');
        return;
    }
    
    const apps = JSON.parse(localStorage.getItem('ouroOracularApps'));
    const newApp = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        url,
        icon
    };
    
    apps.push(newApp);
    localStorage.setItem('ouroOracularApps', JSON.stringify(apps));
    
    if (typeof logAdminAction === 'function') {
        logAdminAction(`Adicionou app: ${name}`);
    }
    
    document.getElementById('addAppForm').reset();
    loadApps();
    alert('App adicionado com sucesso!');
}

function deleteApp(e) {
    const appId = e.target.getAttribute('data-app-id');
    
    if (confirm('Tem certeza que deseja excluir este app?')) {
        let apps = JSON.parse(localStorage.getItem('ouroOracularApps'));
        apps = apps.filter(app => app.id !== appId);
        localStorage.setItem('ouroOracularApps', JSON.stringify(apps));
        
        if (typeof logAdminAction === 'function') {
            logAdminAction(`Removeu app: ${appId}`);
        }
        
        loadApps();
        alert('App removido com sucesso!');
    }
}

function viewLogs() {
    if (typeof viewLogs === 'function') {
        viewLogs();
    } else {
        alert('Conecte o Firebase para visualizar os logs');
    }
}
