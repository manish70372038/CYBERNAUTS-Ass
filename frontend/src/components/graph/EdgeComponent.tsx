import { EdgeProps, getBezierPath } from "reactflow";

const EdgeComponent = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <g>
      <path id={id} d={edgePath} stroke="#a78bfa" strokeWidth={2} fill="none" strokeDasharray="5,3" />
    </g>
  );
};

export default EdgeComponent;