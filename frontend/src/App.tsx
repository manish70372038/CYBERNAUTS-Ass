import ErrorBoundary from './components/ui/ErrorBoundary';
import Toast from './components/ui/Toast';
import HobbySidebar from './components/sidebar/HobbySidebar';
import GraphCanvas from './components/graph/GraphCanvas';
import UserPanel from './components/panels/UserPanel';
import RecommendationPanel from './components/panels/RecommendationPanel';
import { GraphProvider } from './context/GraphContext';
import { useGraphContext } from './context/GraphContext';
import { RefreshCw, GitBranch } from 'lucide-react';

function Inner() {
  const { state, refreshAll } = useGraphContext();
  return (
    <div className="app-shell">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-brand">
          <GitBranch size={16} color="#00ff9d" />
          <span className="brand-name">CYBERNAUTS</span>
          <span className="brand-sub">NETWORK</span>
        </div>
        <div className="topbar-stats">
          <span className="stat">
            <span className="stat-val">{state.users.length}</span> USERS
          </span>
          <span className="stat">
            <span className="stat-val">
              {state.graphData?.edges?.length ?? 0}
            </span>{' '}
            CONNECTIONS
          </span>
        </div>
        <button className="refresh-btn" onClick={() => refreshAll()} title="Refresh">
          <RefreshCw size={13} />
          <span>REFRESH</span>
        </button>
      </header>

      {/* Main layout */}
      <div className="main-layout">
        <HobbySidebar />
        <main className="canvas-area">
          <ErrorBoundary>
            <GraphCanvas />
          </ErrorBoundary>
        </main>
        <div className="right-panels">
          <UserPanel />
          <RecommendationPanel />
        </div>
      </div>

      <Toast />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; background: #06060c; }

        .app-shell {
          height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Space Mono', monospace;
          background: #06060c;
          color: #ccc;
        }

        .topbar {
          height: 52px;
          background: #06060c;
          border-bottom: 1px solid #1a1a2e;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 24px;
          flex-shrink: 0;
        }
        .topbar-brand {
          display: flex; align-items: center; gap: 8px;
        }
        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          color: #00ff9d;
          letter-spacing: 0.12em;
        }
        .brand-sub {
          font-size: 9px; color: #333; letter-spacing: 0.15em;
          align-self: flex-end; margin-bottom: 2px;
        }
        .topbar-stats {
          display: flex; gap: 16px; margin-left: auto;
        }
        .stat {
          font-size: 10px; color: #555; letter-spacing: 0.08em;
        }
        .stat-val { color: #00ff9d; font-weight: 700; }
        .refresh-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: 1px solid #1e1e3a;
          color: #555; font-family: 'Space Mono', monospace; font-size: 10px;
          padding: 6px 12px; border-radius: 4px; cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          letter-spacing: 0.05em;
        }
        .refresh-btn:hover { color: #00ff9d; border-color: #00ff9d55; }

        .main-layout {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .canvas-area {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .right-panels {
          display: flex;
          overflow: hidden;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <GraphProvider>
      <Inner />
    </GraphProvider>
  );
}