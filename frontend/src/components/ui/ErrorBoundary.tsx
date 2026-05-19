import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: 16,
          fontFamily: 'Space Mono, monospace', color: '#ff4060',
        }}>
          <div style={{ fontSize: 48 }}>⚠</div>
          <div style={{ fontSize: 14 }}>Something crashed.</div>
          <pre style={{ fontSize: 11, color: '#555', maxWidth: 400, overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 20px', background: '#ff4060', border: 'none',
              color: '#0a0a0f', fontFamily: 'inherit', cursor: 'pointer',
              borderRadius: 4, fontSize: 12,
            }}
          >
            RETRY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}