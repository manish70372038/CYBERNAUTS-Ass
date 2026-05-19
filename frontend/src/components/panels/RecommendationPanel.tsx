import { useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Sparkles, User, Zap } from 'lucide-react';
import { useGraphContext } from '../../context/GraphContext';
import { useRecommendations } from '../../hooks/useRecommendations';
import Spinner from '../ui/Spinner';
import type { Recommendation, HobbyRecommendation } from '../../types';

export default function RecommendationPanel() {
  const { state } = useGraphContext();
  const { recommendations, loading, fetch, sendFeedback } = useRecommendations();

  const userId = state.selectedUserId;

  useEffect(() => {
    if (userId) fetch(userId);
  }, [userId, fetch]);

  if (!userId) {
    return (
      <div className="rec-panel rec-empty">
        <Sparkles size={24} color="#333" />
        <span>Select a user to see recommendations</span>
        <style>{recStyles}</style>
      </div>
    );
  }

  return (
    <div className="rec-panel">
      <div className="rec-header">
        <Sparkles size={13} color="#ffb700" />
        <span>AI RECOMMENDATIONS</span>
        {loading && <Spinner size={12} />}
      </div>

      {recommendations && (
        <>
          {/* Friend recommendations */}
          <div className="rec-section-title"><User size={11} /> TOP FRIEND PICKS</div>
          {recommendations.friendRecommendations.length === 0 && (
            <div className="rec-none">No suggestions right now.</div>
          )}
          {recommendations.friendRecommendations.map((r: Recommendation, i: number) => (
            <div key={r.userId} className="rec-card">
              <div className="rec-rank">#{i + 1}</div>
              <div className="rec-info">
                <div className="rec-name">{r.username}</div>
                <div className="rec-reason">{r.reason}</div>
                <div className="rec-signals">
                  {r.sourceSignals.map((s, idx) => (
                    <span key={idx} className="signal-tag">{s}</span>
                  ))}
                </div>
              </div>
              <div className="rec-score-col">
                <div className="rec-score">{r.score.toFixed(1)}</div>
                <div className="rec-fb">
                  {/* 🛠️ फिक्स्ड पेलोड: स्ट्रक्चर को बैकएंड के हिसाब से सिंक किया */}
                  <button
                    className="fb-btn fb-yes"
                    onClick={() => sendFeedback(userId, { type: 'friend', value: r.userId, action: 'accept' })}
                    title="Accept"
                  >
                    <ThumbsUp size={11} />
                  </button>
                  <button
                    className="fb-btn fb-no"
                    onClick={() => sendFeedback(userId, { type: 'friend', value: r.userId, action: 'reject' })}
                    title="Reject"
                  >
                    <ThumbsDown size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Hobby recommendations */}
          <div className="rec-section-title" style={{ marginTop: 16 }}>
            <Zap size={11} /> TOP HOBBY PICKS
          </div>
          {recommendations.hobbyRecommendations.length === 0 && (
            <div className="rec-none">No suggestions right now.</div>
          )}
          {recommendations.hobbyRecommendations.map((r: HobbyRecommendation, i: number) => (
            <div key={r.hobby} className="rec-card">
              <div className="rec-rank" style={{ color: '#00d4ff' }}>#{i + 1}</div>
              <div className="rec-info">
                <div className="rec-name" style={{ color: '#00d4ff' }}>{r.hobby}</div>
                <div className="rec-reason">{r.reason}</div>
                <div className="rec-signals">
                  {r.sourceSignals.map((s, idx) => (
                    <span key={idx} className="signal-tag" style={{ borderColor: '#00d4ff33', color: '#00d4ff88' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="rec-score-col">
                <div className="rec-score" style={{ color: '#00d4ff' }}>{r.score.toFixed(1)}</div>
                <div className="rec-fb">
                  {/* 🛠️ फिक्स्ड पेलोड: हॉबी सिलेक्शन के लिए भी सेम पेलोड अलाइनमेंट */}
                  <button
                    className="fb-btn fb-yes"
                    onClick={() => sendFeedback(userId, { type: 'hobby', value: r.hobby, action: 'accept' })}
                    title="Accept"
                  >
                    <ThumbsUp size={11} />
                  </button>
                  <button
                    className="fb-btn fb-no"
                    onClick={() => sendFeedback(userId, { type: 'hobby', value: r.hobby, action: 'reject' })}
                    title="Reject"
                  >
                    <ThumbsDown size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <style>{recStyles}</style>
    </div>
  );
}

const recStyles = `
  .rec-panel {
    width: 260px; min-width: 260px;
    height: 100%;
    background: #06060c;
    border-left: 1px solid #1a1a2e;
    display: flex; flex-direction: column;
    overflow-y: auto;
    font-family: 'Space Mono', monospace;
  }
  .rec-panel::-webkit-scrollbar { width: 4px; }
  .rec-panel::-webkit-scrollbar-thumb { background: #1e1e3a; }
  .rec-empty {
    align-items: center; justify-content: center; gap: 10px;
    color: #333; font-size: 11px; text-align: center; padding: 20px;
  }
  .rec-header {
    display: flex; align-items: center; gap: 8px;
    padding: 20px 16px 14px;
    font-size: 11px; font-weight: 700; color: #ffb700;
    font-family: 'Syne', sans-serif; letter-spacing: 0.08em;
    border-bottom: 1px solid #1a1a2e;
  }
  .rec-section-title {
    display: flex; align-items: center; gap: 6px;
    font-size: 9px; color: #555; letter-spacing: 0.1em;
    padding: 12px 14px 6px;
  }
  .rec-none {
    font-size: 10px; color: #333; padding: 6px 14px;
  }
  .rec-card {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 10px 14px;
    border-bottom: 1px solid #0e0e18;
    transition: background 0.15s;
  }
  .rec-card:hover { background: #0a0a14; }
  .rec-rank {
    font-size: 10px; color: #00ff9d44; font-weight: 700;
    min-width: 20px; padding-top: 2px;
  }
  .rec-info { flex: 1; }
  .rec-name { font-size: 12px; color: #00ff9d; font-weight: 700; margin-bottom: 3px; }
  .rec-reason { font-size: 9px; color: #555; line-height: 1.5; margin-bottom: 5px; }
  .rec-signals { display: flex; flex-wrap: wrap; gap: 4px; }
  .signal-tag {
    font-size: 8px; border: 1px solid #00ff9d33; color: #00ff9d66;
    padding: 2px 5px; border-radius: 3px;
  }
  .rec-score-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .rec-score { font-size: 14px; color: #00ff9d; font-weight: 700; }
  .rec-fb { display: flex; flex-direction: column; gap: 4px; }
  .fb-btn {
    background: none; border: 1px solid #1e1e3a;
    border-radius: 3px; cursor: pointer;
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.15s, color 0.15s;
  }
  .fb-yes { color: #00ff9d66; }
  .fb-yes:hover { border-color: #00ff9d; color: #00ff9d; }
  .fb-no { color: #ff406066; }
  .fb-no:hover { border-color: #ff4060; color: #ff4060; }
`;