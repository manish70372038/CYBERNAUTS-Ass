import { useGraphContext } from "../../context/GraphContext";
import { ToastItem } from "../../types";

const bgColor: Record<ToastItem["type"], string> = {
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
  info: "#2196f3",
};

const Toast = () => {
  const { toasts, removeToast } = useGraphContext();
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {toasts.map((t: ToastItem) => (
        <div
          key={t.id}
          onClick={() => removeToast(t.id)}
          style={{
            background: bgColor[t.type],
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            marginTop: 8,
            cursor: "pointer",
            minWidth: 200,
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;