import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { User } from '../../types';
import { useGraphContext } from '../../context/GraphContext';

interface NodeData {
  user: User;
  label: string;
}

function HighScoreNode({ data, selected }: NodeProps<NodeData>) {
  const { dispatch } = useGraphContext();
  const user = data?.user || ({} as User);
  const score = user.popularityScore ?? 0;
  const username = user.username || 'User';
  const hobbies = user.hobbies || [];

  const glow = `0 0 ${Math.min(score * 4, 40)}px rgba(0,255,157,${Math.min(score * 0.06, 0.7)})`;

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div
        className="hs-node"
        style={{ boxShadow: selected ? '0 0 0 2px #00ff9d, ' + glow : glow }}
        onClick={() => user.id && dispatch({ type: 'SELECT_USER', payload: user.id })}
      >
        <div className="hs-badge">★ {score.toFixed(1)}</div>
        <div className="hs-avatar">{username.charAt(0).toUpperCase()}</div>
        <div className="hs-name">{username}</div>
        <div className="hs-age">AGE {user.age || 'N/A'}</div>
        <div className="hs-hobbies">{hobbies.slice(0, 2).join(' · ') || 'No Hobbies'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />

      <style>{`
        .hs-node {
          background: linear-gradient(135deg, #0d1f1a 0%, #0a1510 100%);
          border: 1px solid #00ff9d55;
          border-radius: 10px;
          padding: 14px 18px;
          min-width: 140px;
          cursor: pointer;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          text-align: center;
          position: relative;
        }
        .hs-node:hover { transform: translateY(-2px); }
        .hs-badge {
          position: absolute; top: -10px; right: -10px;
          background: #00ff9d; color: #0a0a0f;
          font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700;
          padding: 2px 6px; border-radius: 10px;
        }
        .hs-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #00ff9d, #00a860);
          color: #0a0a0f; font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 8px;
        }
        .hs-name {
          color: #e0ffe8; font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700; margin-bottom: 2px;
        }
        .hs-age {
          color: #00ff9d88; font-family: 'Space Mono', monospace;
          font-size: 9px; margin-bottom: 4px; letter-spacing: 0.05em;
        }
        .hs-hobbies {
          color: #555; font-family: 'Space Mono', monospace;
          font-size: 9px; white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; max-width: 120px; margin: 0 auto;
        }
      `}</style>
    </>
  );
}

const handleStyle: React.CSSProperties = {
  background: '#00ff9d',
  border: 'none',
  width: 8,
  height: 8,
};

export default memo(HighScoreNode);