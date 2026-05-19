import { GripVertical } from 'lucide-react';

interface Props {
  hobby: string;
}

export default function HobbyItem({ hobby }: Props) {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('hobby', hobby);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="hobby-item"
      title={`Drag onto a user node to add "${hobby}"`}
    >
      <GripVertical size={12} color="#333" />
      <span>{hobby}</span>
      <style>{`
        .hobby-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px;
          background: #0e0e18;
          border: 1px solid #1e1e3a;
          border-radius: 5px;
          cursor: grab;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #aaa;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          user-select: none;
        }
        .hobby-item:hover {
          border-color: #00ff9d55; color: #00ff9d; background: #0d1f1a;
        }
        .hobby-item:active { cursor: grabbing; }
      `}</style>
    </div>
  );
}