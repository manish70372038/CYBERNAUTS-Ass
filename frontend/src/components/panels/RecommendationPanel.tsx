import { useRecommendations } from "../../hooks/useRecommendations";
import { Recommendation } from "../../types";

const RecommendationPanel = ({ userId }: { userId: string }) => {
  const { recommendations, loading, load, feedback } = useRecommendations();

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => load(userId)}
        style={{ padding: "8px 16px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Get Recommendations
      </button>
      {loading && <p>Loading...</p>}
      {recommendations && (
        <>
          <h4>👥 Friend Recommendations</h4>
          {recommendations.friendRecommendations.map((r: Recommendation) => (
            <div key={r.userId} style={{ background: "#313244", padding: 8, borderRadius: 6, marginBottom: 6 }}>
              <div>{r.username} — Score: {r.score}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{r.reason}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <button onClick={() => feedback(userId, { type: "friend", value: r.userId!, action: "accept" })}
                  style={{ padding: "2px 8px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>✓</button>
                <button onClick={() => feedback(userId, { type: "friend", value: r.userId!, action: "reject" })}
                  style={{ padding: "2px 8px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>✗</button>
              </div>
            </div>
          ))}
          <h4>🎯 Hobby Recommendations</h4>
          {recommendations.hobbyRecommendations.map((r: Recommendation) => (
            <div key={r.hobby} style={{ background: "#313244", padding: 8, borderRadius: 6, marginBottom: 6 }}>
              <div>{r.hobby} — Score: {r.score}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{r.reason}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <button onClick={() => feedback(userId, { type: "hobby", value: r.hobby!, action: "accept" })}
                  style={{ padding: "2px 8px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>✓</button>
                <button onClick={() => feedback(userId, { type: "hobby", value: r.hobby!, action: "reject" })}
                  style={{ padding: "2px 8px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>✗</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default RecommendationPanel;