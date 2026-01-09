import { useState } from 'react';
import { Info } from './Icons';

export default function Tooltip({ content, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-text)] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-text)] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-text)] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-text)] border-y-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-fadeIn`}
          role="tooltip"
        >
          <div className="bg-[var(--color-text)] text-white text-[var(--text-xs)] px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-normal">
            {content}
          </div>
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}

// Composant HelpIcon avec tooltip intégré
export function HelpTooltip({ content, size = 14 }) {
  return (
    <Tooltip content={content} position="top">
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors cursor-help"
        aria-label="Aide"
      >
        <Info size={size} />
      </button>
    </Tooltip>
  );
}
