import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GraphData } from "../types";
import { fetchGraph } from "../services/api";

interface GraphContextType {
  graphData: GraphData | null;
  loading: boolean;
  refresh: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const GraphContext = createContext<GraphContextType | null>(null);

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGraph();
      setGraphData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await refresh();
  }, [refresh]);

  return (
    <GraphContext.Provider value={{ graphData, loading, refresh, refreshAll }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error("useGraph must be used within GraphProvider");
  return ctx;
};