import { Handle, Position } from "reactflow";

const HighScoreNode = ({ data }: { data: { label: string; age: number; score: number } }) => (
  <div style={{
    background: "#4caf50", color: "#fff", padding: "10px 16px",
    borderRadius: 12, minWidth: 120, textAlign: "center",
    boxShadow: "0 4px 12px rgba(76,175,80,0.4)",
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontWeight: "bold", fontSize: 14 }}>{data.label}</div>
    <div style={{ fontSize: 12 }}>Age: {data.age}</div>
    <div style={{ fontSize: 11 }}>⭐ {data.score.toFixed(1)}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export default HighScoreNode;