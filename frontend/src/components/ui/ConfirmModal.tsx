import { AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <AlertTriangle size={28} color="#ffb700" />
        <p className="modal-msg">{message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>CANCEL</button>
          <button className="btn-confirm" onClick={onConfirm}>DELETE</button>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex; align-items: center; justify-content: center;
          z-index: 9998;
          backdrop-filter: blur(4px);
        }
        .modal-box {
          background: #0a0a0f;
          border: 1px solid #1a1a2e;
          border-radius: 8px;
          padding: 32px;
          display: flex; flex-direction: column; align-items: center; gap: 20px;
          min-width: 320px;
          font-family: 'Space Mono', monospace;
        }
        .modal-msg {
          color: #ccc; font-size: 13px; text-align: center; margin: 0;
        }
        .modal-actions {
          display: flex; gap: 12px;
        }
        .btn-cancel {
          padding: 8px 20px; border: 1px solid #333; background: transparent;
          color: #777; font-family: inherit; font-size: 12px; cursor: pointer;
          border-radius: 4px;
        }
        .btn-cancel:hover { border-color: #555; color: #aaa; }
        .btn-confirm {
          padding: 8px 20px; border: none; background: #ff4060;
          color: #0a0a0f; font-family: inherit; font-size: 12px;
          font-weight: 700; cursor: pointer; border-radius: 4px;
        }
        .btn-confirm:hover { background: #ff6080; }
      `}</style>
    </div>
  );
}