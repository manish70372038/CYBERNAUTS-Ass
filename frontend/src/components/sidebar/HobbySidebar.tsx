import { useState } from "react";
import { useGraphContext } from "../../context/GraphContext";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../types";

const HOBBIES = ["chess", "gaming", "reading", "cooking", "music", "art", "sports", "coding", "travel", "photography"];

const HobbySidebar = () => {
  const [search, setSearch] = useState("");
  const { graphData, addToast } = useGraphContext();
  const { update } = useUsers();

  const filtered = HOBBIES.filter((h) => h.includes(search.toLowerCase()));

  const onDrop = async (hobby: string, userId: string) => {
    const user = graphData?.nodes.find((n) => n.id === userId);
    if (!user) return;
    const fullUser = user as unknown as User;
    if (fullUser.hobbies?.includes(hobby)) {
      addToast(`${hobby} already added!`, "error");
      return;
    }
    await update(userId, { hobbies: [...(fullUser.hobbies || []), hobby] });
    addToast(`Added ${hobby}!`, "success");
  };

  return (
    <div style={{ width: 200, background: "#1e1e2e", color: "#fff", padding: 16, overflowY: "auto" }}>
      <h3 style={{ marginBottom: 12 }}>🎯 Hobbies</h3>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        style={{ width: "100%", padding: 6, borderRadius: 6, border: "none", marginBottom: 12 }}
      />
      {filtered.map((hobby) => (
        <div
          key={hobby}
          draggable
          onDragEnd={(e) => {
            const el = document.elementFromPoint(e.clientX, e.clientY);
            const nodeEl = el?.closest("[data-id]");
            const userId = nodeEl?.getAttribute("data-id");
            if (userId) onDrop(hobby, userId);
          }}
          style={{
            background: "#313244", padding: "8px 10px", borderRadius: 8,
            marginBottom: 8, cursor: "grab", userSelect: "none",
          }}
        >
          {hobby}
        </div>
      ))}
    </div>
  );
};

export default HobbySidebar;