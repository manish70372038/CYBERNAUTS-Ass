import { useGraphContext } from '../../context/GraphContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const colors = {
  success: '#00ff9d',
  error: '#ff4060',
  warning: '#ffb700',
  info: '#00d4ff',
};

export default function Toast() {
  const { state, dispatch } = useGraphContext();

  return (
    <div className="toast-container">
      {state.toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={{ borderLeft: `3px solid ${colors[t.type]}`, color: colors[t.type] }}
        >
          <span className="toast-icon">{icons[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: t.id })}
          >
            <X size={12} />
          </button>
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #0a0a0f;
          border: 1px solid #1a1a2e;
          border-radius: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          min-width: 260px;
          max-width: 380px;
          animation: slideIn 0.25s ease;
          box-shadow: 0 4px 24px rgba(0,0,0,0.5);
        }
        .toast-icon { flex-shrink: 0; }
        .toast-msg { flex: 1; }
        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          opacity: 0.5;
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .toast-close:hover { opacity: 1; }
        @keyframes slideIn {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}