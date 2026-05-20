import { useGraphContext } from "../../context/GraphContext";
import { ToastItem } from "../../types";

const colors: Record<ToastItem["type"], string> = {
  success: "#059669", error: "#dc2626", warning: "#d97706", info: "#2563eb",
};

const Toast = () => {
  const { toasts, removeToast } = useGraphContext();
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t: ToastItem) => (
        <div key={t.id} onClick={() => removeToast(t.id)} style={{
          background: colors[t.type], color: "#fff",
          padding: "10px 16px", borderRadius: 10, cursor: "pointer",
          minWidth: 220, boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          fontSize: 13, fontWeight: 500,
          animation: "slideIn 0.3s ease",
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;