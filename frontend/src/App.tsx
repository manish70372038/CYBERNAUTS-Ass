import { useEffect } from "react";
import { GraphProvider, useGraphContext } from "./context/GraphContext";
import GraphCanvas from "./components/graph/GraphCanvas";
import HobbySidebar from "./components/sidebar/HobbySidebar";
import UserPanel from "./components/panels/UserPanel";
import Toast from "./components/ui/Toast";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Spinner from "./components/ui/Spinner";

const AppInner = () => {
  const { refresh, loading } = useGraphContext();

  useEffect(() => { refresh(); }, []);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#0a0a14", overflow: "hidden" }}>
      <HobbySidebar />
      <div style={{ flex: 1, position: "relative" }}>
        {loading && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(10,10,20,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner />
          </div>
        )}
        <GraphCanvas />
      </div>
      <UserPanel />
      <Toast />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <GraphProvider>
        <AppInner />
      </GraphProvider>
    </ErrorBoundary>
  );
}

export default App;