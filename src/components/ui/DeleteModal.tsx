import type { DeleteModalProps } from "../../types/modalTypes";

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    // Overlay ดำๆ
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* กล่อง Modal */}
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        {/* หัวข้อ */}
        <h3 className="text-lg font-bold text-red-600 mb-2">{title}</h3>

        {/* ข้อความ */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* ปุ่ม Action */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            {isLoading ? (
              <div className="px-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
