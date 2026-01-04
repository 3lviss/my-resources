import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success"
    ? "bg-green-500/20 border-green-500 text-green-400"
    : "bg-red-500/20 border-red-500 text-red-400";

  return (
    <div className={`p-3 border rounded text-sm ${bgColor}`}>
      {message}
    </div>
  );
}
