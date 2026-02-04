import { X, Copy, Facebook } from "lucide-react";
import { toast } from "react-hot-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string; 
}

const ShareModal = ({ isOpen, onClose, url }: ShareModalProps) => {
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
      onClose();
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleFacebook = () => {
    let shareUrl = url;
    if (shareUrl.includes("localhost")) {
        console.warn("Facebook cannot scrape localhost! Sharing might look empty.");
    }

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose} 
    >
      <div 
        className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 font-kanit">Share this Product</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-3 font-kanit">
          <button
            onClick={handleFacebook}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all group"
          >
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
              <Facebook size={20} />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-blue-700">Share to Facebook</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group"
          >
            <div className="bg-gray-100 p-2 rounded-full text-gray-600 group-hover:scale-110 transition-transform">
              <Copy size={20} />
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
               <span className="font-medium text-gray-700">Copy Link</span>
               <span className="text-xs text-gray-400 truncate w-full max-w-[200px]">{url}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;