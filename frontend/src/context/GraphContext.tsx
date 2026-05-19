import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { User, GraphData, ToastMessage } from '../types';
import { fetchGraph, fetchUsers } from '../services/api';

interface GraphState {
  users: User[];
  graphData: GraphData | null;
  selectedUserId: string | null;
  toasts: ToastMessage[];
  loading: boolean;
  connectingFrom: string | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_GRAPH'; payload: GraphData }
  | { type: 'SELECT_USER'; payload: string | null }
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_CONNECTING_FROM'; payload: string | null }
  | { type: 'UPSERT_USER'; payload: User }
  | { type: 'REMOVE_USER'; payload: string };

// Normalize whatever backend sends into a plain User[]
function normalizeUsers(raw: unknown): User[] {
  if (Array.isArray(raw)) return raw as User[];
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r.data)) return r.data as User[];
    if (Array.isArray(r.users)) return r.users as User[];
  }
  return [];
}

function reducer(state: GraphState, action: Action): GraphState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return { ...state, users: normalizeUsers(action.payload) };
    case 'SET_GRAPH':
      return { ...state, graphData: action.payload };
    case 'SELECT_USER':
      return { ...state, selectedUserId: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    case 'SET_CONNECTING_FROM':
      return { ...state, connectingFrom: action.payload };
    case 'UPSERT_USER': {
      const exists = state.users.find((u) => u.id === action.payload.id);
      const users = exists
        ? state.users.map((u) => (u.id === action.payload.id ? action.payload : u))
        : [...state.users, action.payload];
      return { ...state, users };
    }
    case 'REMOVE_USER':
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
    default:
      return state;
  }
}

interface GraphContextValue {
  state: GraphState;
  dispatch: React.Dispatch<Action>;
  refreshAll: () => Promise<void>;
  addToast: (type: ToastMessage['type'], message: string) => void;
}

const GraphContext = createContext<GraphContextValue | null>(null);
let toastId = 0;

export function GraphProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    users: [],
    graphData: null,
    selectedUserId: null,
    toasts: [],
    loading: false,
    connectingFrom: null,
  });

  const refreshAll = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [usersRaw, graphData] = await Promise.all([fetchUsers(), fetchGraph()]);
      dispatch({ type: 'SET_USERS', payload: usersRaw });
      dispatch({ type: 'SET_GRAPH', payload: graphData });
    } catch (err) {
      console.error('[refreshAll]', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = String(++toastId);
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  const initialised = useRef(false);
  React.useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      refreshAll();
    }
  }, [refreshAll]);

  return (
    <GraphContext.Provider value={{ state, dispatch, refreshAll, addToast }}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraphContext() {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error('useGraphContext must be used inside GraphProvider');
  return ctx;
}