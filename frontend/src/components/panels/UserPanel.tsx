import { useEffect, useState } from 'react';
import { X, Plus, Trash2, UserPlus, Edit3, Link2, Unlink, Heart } from 'lucide-react';
import { useGraphContext } from '../../context/GraphContext';
import { useUsers } from '../../hooks/useUsers';
import { useRecommendations } from '../../hooks/useRecommendations';
import ConfirmModal from '../ui/ConfirmModal';
import Spinner from '../ui/Spinner';
import type { User } from '../../types';

type Mode = 'create' | 'edit';

export default function UserPanel() {
  const { state, dispatch } = useGraphContext();
  const { create, update, remove, link, unlink } = useUsers();
  const { sendFeedback } = useRecommendations();

  const selectedUser: User | undefined = state.users.find(
    (u) => u.id === state.selectedUserId
  );

  const [mode, setMode] = useState<Mode>('create');
  const [form, setForm] = useState({ username: '', age: '', hobbies: '' });
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [linkTarget, setLinkTarget] = useState('');
  const [unlinkTarget, setUnlinkTarget] = useState('');
  const [likeBusy, setLikeBusy] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setMode('edit');
      setForm({
        username: selectedUser.username,
        age: String(selectedUser.age),
        hobbies: selectedUser.hobbies.join(', '),
      });
    } else {
      setMode('create');
      setForm({ username: '', age: '', hobbies: '' });
    }
  }, [selectedUser]);

  const handleSubmit = async () => {
    if (!form.username.trim() || !form.age) return;
    setBusy(true);
    try {
      const payload = {
        username: form.username.trim(),
        age: Number(form.age),
        hobbies: form.hobbies
          .split(',')
          .map((h) => h.trim())
          .filter(Boolean),
      };
      if (mode === 'create') {
        await create(payload);
        setForm({ username: '', age: '', hobbies: '' });
      } else if (selectedUser) {
        await update(selectedUser.id, payload);
      }
    } finally {
      setBusy(false);
    }
  };

  // 🛠️ 100% फिक्स्ड फीडबैक/लाइक फ़ंक्शन
  const handleLikeToggle = async (targetUserId: string) => {
    if (!selectedUser || likeBusy) return;
    setLikeBusy(true);
    try {
      // चेक करो कि क्या यह टारगेट यूजर पहले से ही एक्सेप्टेड लिस्ट में है
      const isCurrentlyAccepted = selectedUser.feedbackData?.accepted?.includes(targetUserId) ?? false;
      
      // बैकएंड की डिमांड के हिसाब से साफ़ 'accept' या 'reject' स्ट्रिंग भेजना
      const nextAction = isCurrentlyAccepted ? 'reject' : 'accept';

      // API कॉल: URL के लिए 'selectedUser.id' और बॉडी पेलोड के लिए टारगेट डेटा
      await sendFeedback(selectedUser.id, {
        type: 'friend',
        value: targetUserId,
        action: nextAction
      });
    } catch (err) {
      console.error("Failed to toggle recommendation feedback:", err);
    } finally {
      setLikeBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setBusy(true);
    setConfirmDelete(false);
    try {
      await remove(selectedUser.id);
    } finally {
      setBusy(false);
    }
  };

  const handleLink = async () => {
    if (!selectedUser || !linkTarget) return;
    await link(selectedUser.id, linkTarget);
    setLinkTarget('');
  };

  const handleUnlink = async () => {
    if (!selectedUser || !unlinkTarget) return;
    await unlink(selectedUser.id, unlinkTarget);
    setUnlinkTarget('');
  };

  const otherUsers = state.users.filter((u) => u.id !== selectedUser?.id);
  const friendIds = selectedUser?.friends ?? [];
  const friends = state.users.filter((u) => friendIds.includes(u.id));
  const nonFriends = otherUsers.filter((u) => !friendIds.includes(u.id));

  return (
    <aside className="user-panel">
      {/* Header */}
      <div className="panel-header">
        <div>
          <div className="panel-title">
            {mode === 'create' ? (
              <><UserPlus size={14} /> NEW USER</>
            ) : (
              <><Edit3 size={14} /> EDIT USER</>
            )}
          </div>
          {selectedUser && (
            <div className="panel-score">
              SCORE: <span>{selectedUser.popularityScore?.toFixed(1)}</span>
            </div>
          )}
        </div>
        {selectedUser && (
          <button
            className="btn-icon-danger"
            onClick={() => setConfirmDelete(true)}
            title="Delete user"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Form */}
      <div className="panel-form">
        <label className="field-label">USERNAME</label>
        <input
          className="field-input"
          placeholder="e.g. alice"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        />

        <label className="field-label">AGE</label>
        <input
          className="field-input"
          type="number"
          min={1}
          max={120}
          placeholder="e.g. 25"
          value={form.age}
          onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
        />

        <label className="field-label">INPUT HOBBIES <span style={{ color: '#555' }}>(comma separated)</span></label>
        <textarea
          className="field-textarea"
          placeholder="Gaming, Music, Coding"
          value={form.hobbies}
          onChange={(e) => setForm((f) => ({ ...f, hobbies: e.target.value }))}
          rows={3}
        />

        <button className="btn-primary" onClick={handleSubmit} disabled={busy}>
          {busy ? <Spinner size={14} /> : mode === 'create' ? <><Plus size={13} /> CREATE</> : 'UPDATE'}
        </button>
      </div>

      {/* Link section — only in edit mode */}
      {selectedUser && (
        <div className="panel-links">
          <div className="section-label"><Link2 size={11} /> CONNECT FRIEND</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <select
              className="field-select"
              value={linkTarget}
              onChange={(e) => setLinkTarget(e.target.value)}
            >
              <option value="">Select user…</option>
              {nonFriends.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <button className="btn-sm-green" onClick={handleLink} disabled={!linkTarget}>
              <Plus size={12} />
            </button>
          </div>

          {/* ⭐ Recommendations List with Like Toggle */}
          <div className="section-label" style={{ marginTop: 16 }}><Heart size={11} /> RECOMMENDATIONS</div>
          <div className="recommendations-list" style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '150px', overflowY: 'auto' }}>
            {otherUsers.slice(0, 5).map((u) => {
              const isLiked = selectedUser.feedbackData?.accepted?.includes(u.id) ?? false;
              return (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e0e18', padding: '6px 10px', borderRadius: '4px', border: '1px solid #1e1e3a' }}>
                  <span style={{ fontSize: '11px', color: '#ccc' }}>{u.username}</span>
                  <button
                    onClick={() => handleLikeToggle(u.id)}
                    disabled={likeBusy}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Heart size={12} fill={isLiked ? "#ff4060" : "none"} color="#ff4060" />
                  </button>
                </div>
              );
            })}
          </div>

          {friends.length > 0 && (
            <>
              <div className="section-label" style={{ marginTop: 16 }}>
                <Unlink size={11} /> UNLINK FRIEND
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  className="field-select"
                  value={unlinkTarget}
                  onChange={(e) => setUnlinkTarget(e.target.value)}
                >
                  <option value="">Select friend…</option>
                  {friends.map((u) => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <button className="btn-sm-red" onClick={handleUnlink} disabled={!unlinkTarget}>
                  <X size={12} />
                </button>
              </div>

              {/* Friend chips */}
              <div className="friend-chips">
                {friends.map((f) => (
                  <span key={f.id} className="friend-chip">{f.username}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Deselect */}
      {selectedUser && (
        <button
          className="btn-ghost"
          onClick={() => dispatch({ type: 'SELECT_USER', payload: null })}
        >
          + New user instead
        </button>
      )}

      {confirmDelete && selectedUser && (
        <ConfirmModal
          message={`Delete "${selectedUser.username}"? Unlink all friends first or this will fail.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      <style>{`
        .user-panel {
          width: 240px; min-width: 240px;
          height: 100%;
          background: #06060c;
          border-left: 1px solid #1a1a2e;
          display: flex; flex-direction: column;
          overflow-y: auto;
          font-family: 'Space Mono', monospace;
        }
        .user-panel::-webkit-scrollbar { width: 4px; }
        .user-panel::-webkit-scrollbar-thumb { background: #1e1e3a; }
        .panel-header {
          padding: 20px 16px 14px;
          border-bottom: 1px solid #1a1a2e;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .panel-title {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; color: #00ff9d;
          font-family: 'Syne', sans-serif; letter-spacing: 0.08em;
        }
        .panel-score {
          font-size: 10px; color: #555; margin-top: 4px;
        }
        .panel-score span { color: #ffb700; }
        .btn-icon-danger {
          background: none; border: 1px solid #ff406033; color: #ff4060;
          border-radius: 4px; padding: 5px 7px; cursor: pointer;
          display: flex; align-items: center;
          transition: background 0.15s;
        }
        .btn-icon-danger:hover { background: #ff406022; }
        .panel-form {
          padding: 16px;
          display: flex; flex-direction: column; gap: 8px;
          border-bottom: 1px solid #1a1a2e;
        }
        .field-label {
          font-size: 9px; color: #555; letter-spacing: 0.1em;
          display: block; margin-bottom: 2px;
        }
        .field-input, .field-textarea, .field-select {
          width: 100%; background: #0e0e18; border: 1px solid #1e1e3a;
          color: #ccc; font-family: 'Space Mono', monospace; font-size: 11px;
          padding: 7px 10px; border-radius: 4px; outline: none;
          box-sizing: border-box; transition: border-color 0.15s;
        }
        .field-input:focus, .field-textarea:focus, .field-select:focus {
          border-color: #00ff9d55;
        }
        .field-textarea { resize: vertical; min-height: 60px; }
        .field-select { appearance: none; cursor: pointer; }
        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 9px 0;
          background: linear-gradient(135deg, #00ff9d, #00c87a);
          border: none; border-radius: 5px;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800;
          color: #06060c; cursor: pointer;
          transition: opacity 0.15s;
          letter-spacing: 0.05em;
        }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; }
        .panel-links { padding: 16px; border-bottom: 1px solid #1a1a2e; }
        .section-label {
          display: flex; align-items: center; gap: 5px;
          font-size: 9px; color: #555; letter-spacing: 0.1em; margin-bottom: 8px;
        }
        .btn-sm-green, .btn-sm-red {
          border: none; border-radius: 4px;
          width: 32px; min-width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .btn-sm-green { background: #00ff9d22; color: #00ff9d; }
        .btn-sm-green:hover { background: #00ff9d44; }
        .btn-sm-green:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-sm-red { background: #ff406022; color: #ff4060; }
        .btn-sm-red:hover { background: #ff406044; }
        .btn-sm-red:disabled { opacity: 0.4; cursor: not-allowed; }
        .friend-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
        .friend-chip {
          background: #1e1e3a; color: #00d4ff;
          font-size: 9px; padding: 3px 8px; border-radius: 10px;
          font-family: 'Space Mono', monospace;
        }
        .btn-ghost {
          margin: 12px 16px 16px;
          background: none; border: 1px dashed #1e1e3a;
          color: #444; font-family: 'Space Mono', monospace; font-size: 10px;
          padding: 8px; border-radius: 4px; cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .btn-ghost:hover { color: #00d4ff; border-color: #00d4ff55; }
      `}</style>
    </aside>
  );
}