import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../types";

const UserPanel = () => {
  const { users, create, remove, update } = useUsers();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!username || !age) return;
    await create({ username, age: Number(age), hobbies: [] });
    setUsername(""); setAge("");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this user?")) await remove(id);
  };

  const handleEdit = (u: User) => {
    setEditId(u.id); setUsername(u.username); setAge(String(u.age));
  };

  const handleUpdate = async () => {
    if (!editId) return;
    await update(editId, { username, age: Number(age) });
    setEditId(null); setUsername(""); setAge("");
  };

  return (
    <div style={{ width: 260, background: "#181825", color: "#fff", padding: 16, overflowY: "auto" }}>
      <h3>👤 Users</h3>
      <input value={username} onChange={(e) => setUsername(e.target.value)}
        placeholder="Username" style={{ width: "100%", padding: 6, marginBottom: 8, borderRadius: 6, border: "none" }} />
      <input value={age} onChange={(e) => setAge(e.target.value)}
        placeholder="Age" type="number" style={{ width: "100%", padding: 6, marginBottom: 8, borderRadius: 6, border: "none" }} />
      <button
        onClick={editId ? handleUpdate : handleCreate}
        style={{ width: "100%", padding: 8, background: "#4caf50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: 16 }}
      >
        {editId ? "Update User" : "Create User"}
      </button>

      {users.map((u: User) => (
        <div key={u.id} style={{ background: "#313244", padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <div style={{ fontWeight: "bold" }}>{u.username}</div>
          <div style={{ fontSize: 12 }}>Age: {u.age} | Score: {u.popularityScore?.toFixed(1)}</div>
          <div style={{ fontSize: 11, color: "#aaa" }}>Friends: {u.friends?.length || 0}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button onClick={() => handleEdit(u)}
              style={{ flex: 1, padding: 4, background: "#2196f3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(u.id)}
              style={{ flex: 1, padding: 4, background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPanel;