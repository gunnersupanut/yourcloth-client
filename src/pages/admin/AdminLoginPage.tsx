import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";
import toast from "react-hot-toast";
import { User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = authService.adminLogin(formData);

    toast.promise(loginPromise, {
      loading: "Verifying Access...",
      success: "Welcome back, Boss! 😎",
      error: (err) => err.response?.data?.message || "Access Denied!",
    });

    try {
      const res = await loginPromise;
      login(res.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Admin Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ✅ ใช้ bg-admin-bg ที่นายเพิ่งเซ็ต */
    <div className="min-h-screen flex justify-center items-center bg-admin-bg px-4 font-kanit">
      
      {/* ✅ ใช้ bg-admin-card และ shadow-2xl */}
      <div className="bg-admin-card p-8 md:p-10 rounded-[30px] shadow-2xl w-full max-w-md border border-gray-700 relative overflow-hidden">
        
        {/* Decorative Background (ปรับสีทองนิดๆ) */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-admin-secondary opacity-10 blur-2xl"></div>

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-700 rounded-full border border-gray-600 shadow-inner">
              <ShieldCheck className="w-10 h-10 text-admin-secondary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wider uppercase">
            Admin <span className="text-admin-secondary">Portal</span>
          </h1>
          <p className="text-gray-400 text-ui">
            Restricted Area: Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          {/* Input USERNAME */}
          <div className="relative mt-6 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400 group-focus-within:text-admin-secondary transition-colors" />
            </div>
            <input
              name="username"
              onChange={handleChange}
              type="text"
              required
              placeholder="ADMIN USERNAME"
              /* ✅ ใช้สีทอง admin-secondary ตอนโฟกัส */
              className="w-full py-3 pl-12 pr-4 bg-gray-700 text-white rounded-[20px] shadow-inner focus:outline-none focus:ring-2 focus:ring-admin-secondary border border-gray-600 transition-all placeholder-gray-500"
            />
          </div>

          {/* Input Password */}
          <div className="relative mt-6 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-admin-secondary transition-colors" />
            </div>
            <input
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              placeholder="PASSWORD"
              className="w-full py-3 pl-12 pr-12 bg-gray-700 text-white rounded-[20px] shadow-inner focus:outline-none focus:ring-2 focus:ring-admin-secondary border border-gray-600 transition-all placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* ปุ่ม Submit: ใช้สีทองตามสไตล์ Admin */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-10 text-black font-bold text-button py-3 rounded-[20px] shadow-lg transition-all transform hover:scale-[1.02] active:scale-95
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-admin-secondary hover:bg-[#ffdb4d] shadow-admin-secondary/20"
              }`}
          >
            {loading ? "AUTHENTICATING..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-ui text-gray-500">
            &copy; 2026{" "}
            <span className="text-admin-secondary font-bold">YourCloth</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;