import { Component, ReactNode } from "react";

interface State { hasError: boolean }

class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError)
      return <div style={{ padding: 40, color: "#ef4444", textAlign: "center" }}>
        <h2>Something went wrong.</h2>
        <button onClick={() => this.setState({ hasError: false })} style={{ padding: "8px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Retry
        </button>
      </div>;
    return this.props.children;
  }
}

export default ErrorBoundary;