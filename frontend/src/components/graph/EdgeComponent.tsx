import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from 'reactflow';
import { X } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';

function EdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const { unlink } = useUsers();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const handleUnlink = async () => {
    if (data?.sourceId && data?.targetId) {
      await unlink(data.sourceId, data.targetId);
    }
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: '#00d4ff33', strokeWidth: 1.5 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="edge-label-btn"
        >
          <button onClick={handleUnlink} title="Unlink">
            <X size={9} />
          </button>
        </div>
      </EdgeLabelRenderer>
      <style>{`
        .edge-label-btn button {
          background: #1a1a2e;
          border: 1px solid #ff406066;
          color: #ff4060;
          border-radius: 50%;
          width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
          padding: 0;
        }
        .react-flow__edge:hover .edge-label-btn button { opacity: 1; }
      `}</style>
    </>
  );
}

export default memo(EdgeComponent);