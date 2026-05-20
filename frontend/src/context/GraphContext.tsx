import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GraphData, ToastItem, User } from "../types";
import { fetchGraph, fetchAllUsers } from "../services/api";

interface GraphContextType {
  graphData: GraphData | null;
  users: User[];
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem["type"]) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [graph, allUsers] = await Promise.all([fetchGraph(), fetchAllUsers()]);
      setGraphData(graph);
      setUsers(allUsers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = refresh;

  return (
    <GraphContext.Provider value={{ graphData, users, loading, refresh, refreshAll, toasts, addToast, removeToast }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphContext = () => {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error("useGraphContext must be inside GraphProvider");
  return ctx;
};