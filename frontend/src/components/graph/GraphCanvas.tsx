import { useEffect, useCallback } from "react";
import ReactFlow, {
  Node, Edge, addEdge, useNodesState, useEdgesState, Connection, Background, Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphContext } from "../../context/GraphContext";
import { useUsers } from "../../hooks/useUsers";
import HighScoreNode from "./HighScoreNode";
import LowScoreNode from "./LowScoreNode";
import { GraphNode, GraphEdge } from "../../types";

const nodeTypes = { highScore: HighScoreNode, lowScore: LowScoreNode };

const GraphCanvas = () => {
  const { graphData, refreshAll } = useGraphContext();
  const { link } = useUsers();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!graphData) return;
    const n: Node[] = graphData.nodes.map((node: GraphNode, i: number) => ({
      id: node.id,
      type: node.popularityScore > 5 ? "highScore" : "lowScore",
      position: { x: (i % 5) * 200 + 50, y: Math.floor(i / 5) * 180 + 50 },
      data: { label: node.username, age: node.age, score: node.popularityScore },
    }));
    const e: Edge[] = graphData.edges.map((edge: GraphEdge, i: number) => ({
      id: `e-${i}`,
      source: edge.source,
      target: edge.target,
      animated: true,
    }));
    setNodes(n);
    setEdges(e);
  }, [graphData]);

  const onConnect = useCallback(
    async (params: Connection) => {
      if (params.source && params.target) {
        await link(params.source, params.target);
        await refreshAll();
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [link, refreshAll]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default GraphCanvas;