import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(password);

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--notion-bg-secondary)]">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--notion-border)] p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📝</div>
          <h1 className="text-2xl font-semibold text-[var(--notion-text)]">Content Process</h1>
          <p className="text-[var(--notion-text-secondary)] mt-2">Gestionnaire de contenu SEO</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--notion-text)] mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white focus:border-[var(--notion-accent)]"
              placeholder="Entrez votre mot de passe"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[var(--notion-error-light)] text-[var(--notion-error)] rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-2 px-4 bg-[var(--notion-text)] text-white rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
