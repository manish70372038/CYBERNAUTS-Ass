import { useState } from "react";

const ALL_HOBBIES = [
  "chess", "gaming", "reading", "cooking", "music",
  "art", "sports", "coding", "travel", "photography",
  "dancing", "yoga", "hiking", "gardening", "cinema",
];

const HobbySidebar = () => {
  const [search, setSearch] = useState("");
  const filtered = ALL_HOBBIES.filter((h) => h.toLowerCase().includes(search.toLowerCase()));

  const onDragStart = (e: React.DragEvent, hobby: string) => {
    e.dataTransfer.setData("hobby", hobby);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div style={{
      width: 200, background: "#0f0f1a", color: "#e2e8f0",
      padding: 16, overflowY: "auto", borderRight: "1px solid #2d2d44",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <h3 style={{ margin: 0, fontSize: 14, color: "#a78bfa", letterSpacing: 1 }}>🎯 HOBBIES</h3>
      <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>Drag onto a node to add</p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search hobbies..."
        style={{
          padding: "6px 10px", borderRadius: 8, border: "1px solid #2d2d44",
          background: "#1a1a2e", color: "#e2e8f0", fontSize: 12, outline: "none",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((hobby) => (
          <div
            key={hobby}
            draggable
            onDragStart={(e) => onDragStart(e, hobby)}
            style={{
              background: "linear-gradient(135deg, #1e1e3a, #2d2d50)",
              padding: "8px 12px", borderRadius: 8,
              cursor: "grab", userSelect: "none",
              border: "1px solid #3d3d60", fontSize: 13,
              transition: "all 0.2s",
              color: "#c4b5fd",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(135deg, #7c3aed, #4f46e5)";
              (e.currentTarget as HTMLDivElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(135deg, #1e1e3a, #2d2d50)";
              (e.currentTarget as HTMLDivElement).style.color = "#c4b5fd";
            }}
          >
            {hobby}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HobbySidebar;