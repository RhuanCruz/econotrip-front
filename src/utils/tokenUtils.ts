// Utilitário para verificar se um token JWT está expirado
export function isTokenValid(token?: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true; // Se não houver exp, considera válido
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}
