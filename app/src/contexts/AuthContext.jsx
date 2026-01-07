import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mot de passe par défaut (hashé en SHA-256)
// Le mot de passe est: azsakai2024
const DEFAULT_PASSWORD_HASH = '2488088500a1aa60231b0c16493383aba6f5bb67fddc7af836553bee08428fb6';

// Simple hash function pour le navigateur
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const authStatus = sessionStorage.getItem('contentprocess_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (password) => {
    const hashedInput = await hashPassword(password);

    // Récupérer le hash stocké ou utiliser le défaut
    const storedHash = localStorage.getItem('contentprocess_password_hash') || DEFAULT_PASSWORD_HASH;

    if (hashedInput === storedHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem('contentprocess_auth', 'true');
      return { success: true };
    }

    return { success: false, error: 'Mot de passe incorrect' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('contentprocess_auth');
  };

  const changePassword = async (currentPassword, newPassword) => {
    const currentHash = await hashPassword(currentPassword);
    const storedHash = localStorage.getItem('contentprocess_password_hash') || DEFAULT_PASSWORD_HASH;

    if (currentHash !== storedHash) {
      return { success: false, error: 'Mot de passe actuel incorrect' };
    }

    const newHash = await hashPassword(newPassword);
    localStorage.setItem('contentprocess_password_hash', newHash);

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
