import { useGraphContext } from '../context/GraphContext';

export function useGraph() {
  const { state, refreshAll } = useGraphContext();
  return {
    graphData: state.graphData,
    loading: state.loading,
    refresh: refreshAll,
  };
}