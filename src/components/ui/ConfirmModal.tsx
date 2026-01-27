import React from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react"; // เพิ่ม Icon ให้ดูโปร

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  isLoading?: boolean;
  //  เลือกสีปุ่มได้ (danger=แดง, success=เขียว, primary=น้ำเงิน)
  variant?: "danger" | "success" | "primary"; 
  confirmText?: string; 
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  isLoading = false,
  variant = "danger", // default 
  confirmText = "Confirm",
}) => {
  if (!isOpen) return null;

  // เลือกสีตาม Variant
  const getButtonColor = () => {
    switch (variant) {
      case "success": return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      case "primary": return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      default: return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
    }
  };

  const getIcon = () => {
      switch (variant) {
          case "success": return <CheckCircle className="w-6 h-6 text-green-600" />;
          case "primary": return <Info className="w-6 h-6 text-blue-600" />;
          default: return <AlertTriangle className="w-6 h-6 text-red-600" />;
      }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-kanit">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-50' : variant === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}>
                {getIcon()}
            </div>
            <h3 className={`text-lg font-bold ${variant === 'danger' ? 'text-red-600' : 'text-black'}`}>
                {title}
            </h3>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-bold text-gray-600 border-2 border-transparent hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className={`rounded-xl px-6 py-2 text-sm font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-2 ${getButtonColor()}`}
          >
            {isLoading && (
               <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;