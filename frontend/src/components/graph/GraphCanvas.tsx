import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import HighScoreNode from './HighScoreNode';
import LowScoreNode from './LowScoreNode';
import EdgeComponent from './EdgeComponent';
import { useGraph } from '../../hooks/useGraph';
import { useUsers } from '../../hooks/useUsers';
import { useGraphContext } from '../../context/GraphContext';
import Spinner from '../ui/Spinner';
import type { GraphEdge, GraphNode } from '../../types';

const nodeTypes = { highScore: HighScoreNode, lowScore: LowScoreNode };
const edgeTypes = { custom: EdgeComponent };

function toRFNodes(gnodes: GraphNode[]): Node[] {
  return gnodes.map((n) => {
    let userData = n;
    if (n.data && typeof n.data === 'object' && 'username' in n.data) {
      userData = n.data as any;
    }

    const mergedUser = {
      id: n.id,
      username: (userData as any).username || 'User',
      age: (userData as any).age || (n as any).age,
      popularityScore: (userData as any).popularityScore !== undefined ? (userData as any).popularityScore : (n as any).popularityScore,
      hobbies: (userData as any).hobbies || (n as any).hobbies || [],
    };

    return {
      id: n.id,
      type: n.type || 'lowScore',
      position: n.position,
      data: {
        user: mergedUser,
        label: mergedUser.username,
      },
    };
  });
}

function toRFEdges(gedges: GraphEdge[]) {
  return gedges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'custom',
    animated: e.animated ?? false,
    data: { sourceId: e.source, targetId: e.target },
  }));
}

function withPositions(nodes: Node[]): Node[] {
  const cols = Math.ceil(Math.sqrt(nodes.length)) || 1;
  return nodes.map((n, i) => ({
    ...n,
    position:
      n.position && (n.position.x !== 0 || n.position.y !== 0)
        ? n.position
        : { x: (i % cols) * 220, y: Math.floor(i / cols) * 180 },
  }));
}

export default function GraphCanvas() {
  const { graphData, loading, refreshAll } = useGraph();
  const { link } = useUsers();
  const { dispatch } = useGraphContext();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!graphData) return;
    const rawNodes = (graphData.nodes ?? []) as GraphNode[];
    const rawEdges = (graphData.edges ?? []) as GraphEdge[];
    setNodes(withPositions(toRFNodes(rawNodes)));
    setEdges(toRFEdges(rawEdges));
  }, [graphData, setNodes, setEdges]);

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      try {
        await link(connection.source, connection.target);
        if (refreshAll) refreshAll();
      } catch {
        // Error handled in hook
      }
    },
    [link, refreshAll]
  );

  // 1. ब्राउज़र के डिफ़ॉल्ट ड्राप-रिजेक्शन को रोकने के लिए सबसे ज़रूरी फंक्शन
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // माउस के पास '+' आइकॉन दिखाएगा
    setDragOver(true);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
    },
    []
  );

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // ग्लोबल विंडो ऑब्जेक्ट में टारगेट आईडी सेव करें
      (window as any).__hoveredNodeId = node.id;
      if (dispatch) dispatch({ type: 'SET_CONNECTING_FROM', payload: node.id });
    },
    [dispatch]
  );

  const onNodeMouseLeave = useCallback(() => {
    // इसे तुरंत खाली नहीं करेंगे, क्योंकि जब हम चिप लाकर छोड़ते हैं तो माउस थोड़ा लीव हो सकता है
    if (dispatch) dispatch({ type: 'SET_CONNECTING_FROM', payload: null });
  }, [dispatch]);

  // 🎯 ड्रॉप होने पर कस्टम इवेंट ट्रिगर करने वाला इफ़ेक्ट
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const hobby = e.dataTransfer?.getData('hobby');
      const userId = (window as any).__hoveredNodeId;
      
      if (!hobby || !userId) return;
      
      window.dispatchEvent(
        new CustomEvent('hobby-dropped-on-node', { detail: { hobby, userId } })
      );
      
      // ड्रॉप सफल होने के बाद आईडी साफ़ करें
      (window as any).__hoveredNodeId = '';
    };

    window.addEventListener('drop', handleDrop);
    return () => window.removeEventListener('drop', handleDrop);
  }, []);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  if (loading && !graphData) {
    return (
      <div className="graph-loading">
        <Spinner size={40} />
        <span>Loading network…</span>
        <style>{`.graph-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;color:#555;font-family:'Space Mono',monospace;font-size:13px;}`}</style>
      </div>
    );
  }

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onDragOver={onDragOver} // यहाँ ड्रैग ओवर हैंडलर अटैच है
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {dragOver && (
        <div style={{
          position: 'absolute', inset: 0, border: '2px dashed #00ff9d55',
          borderRadius: 8, zIndex: 10, pointerEvents: 'none', background: 'rgba(0, 255, 157, 0.02)'
        }} />
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeClick={(_e, node) => {
          if (dispatch) dispatch({ type: 'SELECT_USER', payload: node.id });
        }}
        onPaneClick={() => {
          if (dispatch) dispatch({ type: 'SELECT_USER', payload: null });
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1a1a2e" />
        <Controls
          style={{ background: '#0a0a0f', border: '1px solid #1a1a2e', borderRadius: 6 }}
        />
        <MiniMap
          nodeColor={(n) => (n.type === 'highScore' ? '#00ff9d33' : '#1e1e3a')}
          maskColor="#0a0a0f99"
          style={{ background: '#06060c', border: '1px solid #1a1a2e', borderRadius: 6 }}
        />
      </ReactFlow>
    </div>
  );
}