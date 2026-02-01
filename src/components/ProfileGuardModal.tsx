import { useNavigate } from "react-router-dom";
import { User, AlertTriangle, ArrowRight } from "lucide-react";

interface ProfileGuardModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const ProfileGuardModal = ({ isOpen }: ProfileGuardModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-kanit">
      <div className="bg-white w-full max-w-md p-8 rounded-[32px] shadow-2xl transform transition-all scale-100 border border-gray-100 text-center relative mx-4">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <User size={40} strokeWidth={2.5} />
          <div className="absolute top-6 right-[4.5rem] bg-red-500 rounded-full p-1 border-2 border-white">
             <AlertTriangle size={16} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-[#594a60] mb-2">
          Profile Incomplete
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Please complete your profile information <br/>
          (Name, Phone Number) to proceed with checkout.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate("/setting/account")}
          className="w-full bg-[#FFD700] text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-yellow-400/30 hover:bg-yellow-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Update Profile <ArrowRight size={20} />
        </button>
        
        {/* Secondary Button */}
        <button
           onClick={() => navigate("/shop")}
           className="mt-4 text-sm text-gray-400 hover:text-[#594a60] underline transition-colors"
        >
            Back to Shop
        </button>
      </div>
    </div>
  );
};

export default ProfileGuardModal;