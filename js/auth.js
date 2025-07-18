// auth.js - Sistema básico de autenticação
const users = JSON.parse(localStorage.getItem('oraculistas_users')) || {
  admin: { password: 'admin123', role: 'admin' }
};

const apps = JSON.parse(localStorage.getItem('oraculistas_apps')) || [
  { id: 'mapa-numerologico', name: 'Mapa Numerológico', url: 'https://drtrindade.github.io/Mapa-Numerologico/', visible: true }
];

function login(username, password) {
  if (users[username] && users[username].password === password) {
    sessionStorage.setItem('currentUser', JSON.stringify({
      username,
      role: users[username].role
    }));
    return true;
  }
  return false;
}

function isAdmin() {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  return user && user.role === 'admin';
}