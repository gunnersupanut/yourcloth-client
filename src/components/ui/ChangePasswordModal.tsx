import { useState } from "react";
import { X, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { userService } from "../../services/userService";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle ดูรหัส
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate บ้านๆ
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      return toast.error("Please fill in all fields");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsLoading(true);
    try {
      await userService.changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      });
      
      toast.success("Password changed successfully.");
      onClose(); // ปิด Modal
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Reset Form
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Change password failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-kanit">
      <div className="bg-white w-full max-w-md p-6 rounded-[24px] shadow-2xl relative mx-4">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-purple-100 text-[#594a60] rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#594a60]">Change Password</h2>
          <p className="text-sm text-gray-500">Enter your current password and a new one.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#594a60] focus:ring-2 focus:ring-[#594a60]/20 outline-none transition-all text-gray-700"
                placeholder="••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#594a60] focus:ring-2 focus:ring-[#594a60]/20 outline-none transition-all text-gray-700"
              placeholder="••••••"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#594a60] focus:ring-2 focus:ring-[#594a60]/20 outline-none transition-all text-gray-700"
              placeholder="••••••"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#594a60] text-white py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#4a3e50] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;