import { X, Keyboard } from './Icons';

const shortcuts = [
  { keys: ['←'], description: 'Étape précédente' },
  { keys: ['→'], description: 'Étape suivante' },
  { keys: ['Escape'], description: 'Fermer le panneau/modal' },
  { keys: ['?'], description: 'Afficher les raccourcis' },
  { keys: ['R'], description: 'Ouvrir le récapitulatif' },
];

export default function KeyboardShortcuts({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-bg)] rounded-2xl shadow-2xl w-full max-w-md p-6 fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-accent-light)] rounded-xl flex items-center justify-center">
              <Keyboard size={22} className="text-[var(--color-accent)]" />
            </div>
            <h2
              className="text-[var(--text-xl)] font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Raccourcis clavier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-xl"
            >
              <span className="text-[var(--text-sm)] text-[var(--color-text)]">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <kbd
                    key={i}
                    className="px-2.5 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--text-xs)] font-mono font-semibold text-[var(--color-text-secondary)] shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[var(--text-xs)] text-[var(--color-text-tertiary)] text-center">
          Appuyez sur <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[var(--color-text-secondary)]">?</kbd> à tout moment pour afficher cette aide
        </p>
      </div>
    </div>
  );
}
