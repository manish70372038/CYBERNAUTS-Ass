import { useEffect, useCallback, useState } from "react";
import ReactFlow, {
  Node, Edge, addEdge, useNodesState, useEdgesState,
  Connection, Background, Controls, MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphContext } from "../../context/GraphContext";
import { useUsers } from "../../hooks/useUsers";
import HighScoreNode from "./HighScoreNode";
import LowScoreNode from "./LowScoreNode";
import { GraphNode, GraphEdge } from "../../types";
import { updateUser } from "../../services/api";

const nodeTypes = { highScore: HighScoreNode, lowScore: LowScoreNode };

const GraphCanvas = ({ onNodeClick }: { onNodeClick?: (id: string) => void }) => {
  const { graphData, refreshAll, addToast } = useGraphContext();
  const { link } = useUsers();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dragHobby, setDragHobby] = useState<string | null>(null);

  useEffect(() => {
    if (!graphData) return;
    const n: Node[] = graphData.nodes.map((node: GraphNode, i: number) => ({
      id: node.id,
      type: node.popularityScore > 5 ? "highScore" : "lowScore",
      position: { x: (i % 5) * 220 + 60, y: Math.floor(i / 5) * 200 + 60 },
      data: {
        label: node.username,
        age: node.age,
        score: node.popularityScore,
        hobbies: node.hobbies,
        nodeId: node.id,
      },
    }));
    const e: Edge[] = graphData.edges.map((edge: GraphEdge, i: number) => ({
      id: `e-${i}-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: "#a78bfa", strokeWidth: 2 },
    }));
    setNodes(n);
    setEdges(e);
  }, [graphData]);

  // Listen for hobby drag from sidebar
  useEffect(() => {
    const handler = (e: CustomEvent) => setDragHobby(e.detail);
    window.addEventListener("hobby-drag-start" as any, handler);
    return () => window.removeEventListener("hobby-drag-start" as any, handler);
  }, []);

  const onConnect = useCallback(
    async (params: Connection) => {
      if (params.source && params.target) {
        await link(params.source, params.target);
        setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#a78bfa" } }, eds));
      }
    },
    [link]
  );

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      const hobby = event.dataTransfer.getData("hobby");
      if (!hobby || !graphData) return;

      // Find which node was dropped on
      const el = document.elementFromPoint(event.clientX, event.clientY);
      const nodeEl = el?.closest(".react-flow__node");
      if (!nodeEl) { addToast("Drop on a user node!", "warning"); return; }

      const nodeId = nodeEl.getAttribute("data-id");
      if (!nodeId) return;

      const user = graphData.nodes.find((n) => n.id === nodeId);
      if (!user) return;

      if (user.hobbies?.includes(hobby)) {
        addToast(`${user.username} already has "${hobby}"!`, "warning");
        return;
      }

      try {
        await updateUser(nodeId, { hobbies: [...(user.hobbies || []), hobby] });
        await refreshAll();
        addToast(`Added "${hobby}" to ${user.username}!`, "success");
      } catch {
        addToast("Failed to add hobby", "error");
      }
    },
    [graphData, refreshAll, addToast]
  );

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
      >
        <Background color="#a78bfa" gap={20} />
        <Controls />
        <MiniMap nodeColor={(n) => n.type === "highScore" ? "#38ef7d" : "#764ba2"} />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;