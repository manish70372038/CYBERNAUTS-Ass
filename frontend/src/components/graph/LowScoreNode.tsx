import { Handle, Position } from "reactflow";

interface Props { data: { label: string; age: number; score: number; hobbies: string[] } }

const LowScoreNode = ({ data }: Props) => (
  <div data-id={data.label} style={{
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff", padding: "12px 16px", borderRadius: 14,
    minWidth: 130, textAlign: "center",
    boxShadow: "0 6px 20px rgba(102,126,234,0.4)",
    border: "2px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontSize: 18 }}>👤</div>
    <div style={{ fontWeight: 700, fontSize: 14 }}>{data.label}</div>
    <div style={{ fontSize: 11, opacity: 0.9 }}>Age: {data.age}</div>
    <div style={{ fontSize: 11, marginTop: 4, background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: "2px 6px" }}>
      📊 {data.score.toFixed(1)}
    </div>
    {data.hobbies?.length > 0 && (
      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.85 }}>
        {data.hobbies.slice(0, 2).join(", ")}{data.hobbies.length > 2 ? "..." : ""}
      </div>
    )}
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export default LowScoreNode;