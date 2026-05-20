import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { GraphData, ToastItem } from "../types";
import { fetchGraph } from "../services/api";

interface GraphContextType {
  graphData: GraphData | null;
  loading: boolean;
  refresh: () => Promise<void>;
  refreshAll: () => Promise<void>;
  toasts: ToastItem[];
  addToast: (message: string, type: ToastItem["type"]) => void;
  removeToast: (id: string) => void;
}

const GraphContext = createContext<GraphContextType | null>(null);

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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

  const addToast = useCallback(
    (message: string, type: ToastItem["type"]) => {
      const id = Math.random().toString(36).substring(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <GraphContext.Provider
      value={{ graphData, loading, refresh, refreshAll, toasts, addToast, removeToast }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphContext = () => {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error("useGraphContext must be used within GraphProvider");
  return ctx;
};

export const useGraph = () => useGraphContext();