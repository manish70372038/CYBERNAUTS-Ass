import { EdgeProps, getBezierPath } from "reactflow";

const EdgeComponent = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  return <path id={id} d={edgePath} stroke="#999" strokeWidth={2} fill="none" />;
};

export default EdgeComponent;