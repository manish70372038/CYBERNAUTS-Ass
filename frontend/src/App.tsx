import { useEffect } from "react";
import { GraphProvider, useGraphContext } from "./context/GraphContext";
import GraphCanvas from "./components/graph/GraphCanvas";
import HobbySidebar from "./components/sidebar/HobbySidebar";
import UserPanel from "./components/panels/UserPanel";
import Toast from "./components/ui/Toast";

const AppInner = () => {
  const { refresh } = useGraphContext();
  useEffect(() => { refresh(); }, []);
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <HobbySidebar />
      <div style={{ flex: 1, position: "relative" }}>
        <GraphCanvas />
      </div>
      <UserPanel />
      <Toast />
    </div>
  );
};

function App() {
  return (
    <GraphProvider>
      <AppInner />
    </GraphProvider>
  );
}

export default App;