const TOKEN_KEY = 'vm_token';
const USER_KEY = 'vm_user';

export function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getUser() { const u = localStorage.getItem(USER_KEY); return u ? JSON.parse(u) : null; }
export function logout() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }