// Simples sistema de autenticação (para GitHub Pages)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Verificar credenciais locais
    const users = JSON.parse(localStorage.getItem('ouroOracularUsers')) || {};
    
    if (username === 'admin' && password === 'admin123') {
        // Login como admin
        localStorage.setItem('ouroOracularCurrentUser', JSON.stringify({
            username: 'admin',
            isAdmin: true
        }));
        window.location.href = 'admin.html';
    } else if (users[username] && users[username].password === password) {
        // Login como oraculista
        localStorage.setItem('ouroOracularCurrentUser', JSON.stringify({
            username: username,
            isAdmin: false
        }));
        
        // Registrar acesso no Firebase
        if (typeof logAccess === 'function') {
            logAccess(username, 'login');
        }
        
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('loginMessage').textContent = 'Usuário ou senha incorretos';
        document.getElementById('loginMessage').className = 'message error';
    }
});

// Verificar se já está logado ao carregar a página
window.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('ouroOracularCurrentUser'));
    
    if (currentUser) {
        if (currentUser.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
});