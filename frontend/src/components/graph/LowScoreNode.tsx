import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { User } from '../../types';
import { useGraphContext } from '../../context/GraphContext';

interface NodeData {
  user: User;
  label: string;
}

function LowScoreNode({ data, selected }: NodeProps<NodeData>) {
  const { dispatch } = useGraphContext();
  const user = data?.user || ({} as User);
  const score = user.popularityScore ?? 0;
  const username = user.username || 'User';

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div
        className="ls-node"
        style={{ outline: selected ? '2px solid #00d4ff' : 'none' }}
        onClick={() => user.id && dispatch({ type: 'SELECT_USER', payload: user.id })}
      >
        <div className="ls-score">{score.toFixed(1)}</div>
        <div className="ls-avatar">{username.charAt(0).toUpperCase()}</div>
        <div className="ls-name">{username}</div>
        <div className="ls-age">AGE {user.age || 'N/A'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />

      <style>{`
        .ls-node {
          background: #0e0e18;
          border: 1px solid #1e1e3a;
          border-radius: 8px;
          padding: 12px 16px;
          min-width: 120px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
          text-align: center;
          position: relative;
          outline-offset: 2px;
        }
        .ls-node:hover { border-color: #00d4ff55; transform: translateY(-1px); }
        .ls-score {
          position: absolute; top: -8px; right: -8px;
          background: #1e1e3a; color: #00d4ff;
          font-family: 'Space Mono', monospace; font-size: 9px;
          padding: 2px 6px; border-radius: 10px;
          border: 1px solid #00d4ff44;
        }
        .ls-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: #1e1e3a; color: #00d4ff;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 6px;
        }
        .ls-name {
          color: #aaa; font-family: 'Syne', sans-serif;
          font-size: 12px; font-weight: 600; margin-bottom: 2px;
        }
        .ls-age {
          color: #555; font-family: 'Space Mono', monospace; font-size: 9px;
        }
      `}</style>
    </>
  );
}

const handleStyle: React.CSSProperties = {
  background: '#00d4ff',
  border: 'none',
  width: 7,
  height: 7,
};

export default memo(LowScoreNode);