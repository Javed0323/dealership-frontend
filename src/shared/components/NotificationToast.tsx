// components/NotificationToast.tsx
import { CheckCircle, XCircle } from "lucide-react";

interface NotificationToastProps {
  type: "success" | "error";
  message: string;
  visible: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  message,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div
        className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
          type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <p
          className={`text-sm ${
            type === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};
