import { useEffect, useState } from 'react';
import { Check, AlertCircle, X } from './Icons';

export default function Toast({ message, type = 'success', duration = 2000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <Check size={16} />,
    error: <AlertCircle size={16} />,
  };

  const styles = {
    success: {
      bg: 'bg-[var(--color-success)]',
      text: 'text-white',
    },
    error: {
      bg: 'bg-[var(--color-error)]',
      text: 'text-white',
    },
  };

  const style = styles[type] || styles.success;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${style.bg} ${style.text} transition-all duration-300 ${
        isLeaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      style={{ animation: 'slideUp 0.3s ease-out' }}
    >
      {icons[type]}
      <span className="text-[var(--text-sm)] font-medium">{message}</span>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose?.();
          }, 300);
        }}
        className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Hook pour gérer les toasts
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 2000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ bottom: `${24 + index * 60}px` }}
          className="fixed right-6 z-[9999]"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );

  return { showToast, ToastContainer };
}
