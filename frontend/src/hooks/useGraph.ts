import { useGraphContext } from "../context/GraphContext";

export const useGraph = () => {
  return useGraphContext();
};