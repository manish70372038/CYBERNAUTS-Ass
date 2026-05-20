import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useRecommendations } from "../../hooks/useRecommendations";
import { User } from "../../types";

const UserPanel = () => {
  const { users, create, update, remove, unlink } = useUsers();
  const { recommendations, loading: recLoading, load: loadRecs, feedback } = useRecommendations();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [tab, setTab] = useState<"users" | "recs">("users");
  const [recUserId, setRecUserId] = useState("");

  const handleSubmit = async () => {
    if (!username.trim() || !age) return;
    if (editId) {
      await update(editId, { username, age: Number(age) });
      setEditId(null);
    } else {
      await create({ username, age: Number(age), hobbies: [] });
    }
    setUsername(""); setAge("");
  };

  const handleEdit = (u: User) => {
    setEditId(u.id); setUsername(u.username); setAge(String(u.age));
  };

  const handleDelete = async (u: User) => {
    if (!window.confirm(`Delete "${u.username}"? Unlink friends first if any.`)) return;
    await remove(u.id);
  };

  const s = (v: string) => ({
    padding: "4px 10px", border: "none", borderRadius: 6,
    cursor: "pointer", fontSize: 11, background: v, color: "#fff"
  });

  return (
    <div style={{
      width: 280, background: "#0f0f1a", color: "#e2e8f0",
      padding: 16, overflowY: "auto", borderLeft: "1px solid #2d2d44",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {(["users", "recs"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "6px", border: "none", borderRadius: 8, cursor: "pointer",
            background: tab === t ? "#7c3aed" : "#1e1e3a", color: "#fff", fontSize: 12,
          }}>
            {t === "users" ? "👤 Users" : "🤖 Recs"}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Username *"
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #2d2d44", background: "#1a1a2e", color: "#e2e8f0", fontSize: 13 }} />
            <input value={age} onChange={(e) => setAge(e.target.value)}
              placeholder="Age *" type="number"
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #2d2d44", background: "#1a1a2e", color: "#e2e8f0", fontSize: 13 }} />
            <button onClick={handleSubmit} style={{
              padding: "9px", background: editId ? "#059669" : "#7c3aed",
              color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
            }}>
              {editId ? "✏️ Update User" : "➕ Create User"}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setUsername(""); setAge(""); }}
                style={{ padding: "6px", background: "#374151", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                Cancel
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {users.map((u: User) => (
              <div key={u.id} style={{ background: "#1a1a2e", padding: 10, borderRadius: 10, border: "1px solid #2d2d44" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{u.username}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Age: {u.age} | Score: {u.popularityScore?.toFixed(1) ?? 0}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Friends: {u.friends?.length ?? 0} | Hobbies: {u.hobbies?.length ?? 0}</div>
                {u.hobbies?.length > 0 && (
                  <div style={{ fontSize: 10, color: "#a78bfa", marginTop: 3 }}>{u.hobbies.join(", ")}</div>
                )}
                {u.friends?.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Friends:</div>
                    {u.friends.map((fid: string) => {
                      const friend = users.find((x: User) => x.id === fid);
                      return friend ? (
                        <div key={fid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, marginBottom: 2 }}>
                          <span>{friend.username}</span>
                          <button onClick={() => unlink(u.id, fid)}
                            style={s("#ef4444")}>unlink</button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button onClick={() => handleEdit(u)} style={s("#2563eb")}>✏️ Edit</button>
                  <button onClick={() => handleDelete(u)} style={s("#dc2626")}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "recs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <select value={recUserId} onChange={(e) => setRecUserId(e.target.value)}
            style={{ padding: "8px", borderRadius: 8, border: "1px solid #2d2d44", background: "#1a1a2e", color: "#e2e8f0", fontSize: 13 }}>
            <option value="">Select user...</option>
            {users.map((u: User) => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
          <button onClick={() => recUserId && loadRecs(recUserId)} disabled={!recUserId}
            style={{ padding: "9px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
            {recLoading ? "Loading..." : "🤖 Get Recommendations"}
          </button>

          {recommendations && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa" }}>👥 Friend Suggestions</div>
              {recommendations.friendRecommendations.length === 0 && (
                <div style={{ fontSize: 11, color: "#64748b" }}>No suggestions — add more users!</div>
              )}
              {recommendations.friendRecommendations.map((r) => (
                <div key={r.userId} style={{ background: "#1a1a2e", padding: 10, borderRadius: 8, border: "1px solid #2d2d44" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{r.username}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{r.reason}</div>
                  <div style={{ fontSize: 10, color: "#a78bfa" }}>Score: {r.score}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button onClick={() => feedback(recUserId, { type: "friend", value: r.userId!, action: "accept" })}
                      style={s("#059669")}>✓ Accept</button>
                    <button onClick={() => feedback(recUserId, { type: "friend", value: r.userId!, action: "reject" })}
                      style={s("#dc2626")}>✗ Reject</button>
                  </div>
                </div>
              ))}

              <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginTop: 8 }}>🎯 Hobby Suggestions</div>
              {recommendations.hobbyRecommendations.length === 0 && (
                <div style={{ fontSize: 11, color: "#64748b" }}>No hobby suggestions yet!</div>
              )}
              {recommendations.hobbyRecommendations.map((r) => (
                <div key={r.hobby} style={{ background: "#1a1a2e", padding: 10, borderRadius: 8, border: "1px solid #2d2d44" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>🎮 {r.hobby}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{r.reason}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button onClick={() => feedback(recUserId, { type: "hobby", value: r.hobby!, action: "accept" })}
                      style={s("#059669")}>✓ Accept</button>
                    <button onClick={() => feedback(recUserId, { type: "hobby", value: r.hobby!, action: "reject" })}
                      style={s("#dc2626")}>✗ Reject</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPanel;