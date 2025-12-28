interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const TermsModal = ({ isOpen, onClose, title, content }: TermsModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      {/* 2. กล่อง Modal */}
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-h3xl font-bold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            X
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-text_primary leading-relaxed whitespace-pre-line">
          {content}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-button text-text_inverse rounded-lg transition"
          >
            I Agree. (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
