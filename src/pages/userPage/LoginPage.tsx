import { useState } from "react";
import AuthCard from "../../components/AuthCard";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";

import toast from "react-hot-toast";
// import pictures and icons here
import UserIcon from "../assets/icons/icons8-user-48 1.png";
import PasswordIcon from "../assets/icons/icons8-password-50 1.png";
import FacebookIcon from "../assets/icons/fb icon.png";
import GoogleIcon from "../assets/icons/gg icon.png";
import ShowPassWordIcon from "../assets/icons/icons8-eye-50 1.png";
import HidePassWordIcon from "../assets/icons/hidepasswordIcon.png";

const LoginPage = () => {
  const { login } = useAuth(); // ดึงฟังก์ชันมาใช้
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ฟังก์ชันสำหรับอัปเดตค่าเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // อัปเดตเฉพาะ field ที่พิมพ์
    }));
  };

  // ฟังก์ชั่นปุ่ม Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, rememberMe };
    // ล็อคปุ่ม
    setLoading(true);

    try {
      await toast.promise(
        (async () => {
          const res = await authService.login(payload);
          login(res.token); // อัปเดต Context
        })(),
        {
          loading: "Logging in...",
          success: "Login Complete",
          error: (err) =>
            `${err.response?.data?.message || "Something went wrong"} `,
        }
      );

      navigate("/");
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.response?.data?.message === "Please verify your email.") {
        navigate("/verify", {
          state: { email: error.response?.data?.email },
        });
      }
      // ปลดล็อคปุ่ม
    } finally {
      setLoading(false);
    }
  };
  const handleSocialSignUp = () => {
    toast.success("Not ready yet, but working on it", {
      icon: "🔜",
    });
  };
  return (
    <div className="flex justify-center items-center">
      <AuthCard>
        <form onSubmit={handleSubmit} className="font-kanit">
          {/* Input UserName */}
          <div className="relative mt-8">
            {/* ไอคอน  */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={UserIcon} alt="UserIcon" />
            </div>
            <input
              name="username"
              onChange={handleChange}
              type="text"
              placeholder="USERNAME"
              className="w-full py-3 pl-16 pr-4 bg-white text-gray-800 rounded-[20px] shadow-custom focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          {/* Input Password */}
          <div className="relative mt-8">
            {/* ไอคอน  */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={PasswordIcon} alt="PasswordIcon" />
            </div>
            <input
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              className="w-full py-3 pl-16 pr-4 bg-white text-gray-800 rounded-[20px] shadow-custom focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {/* ปุ่มลูกตา */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-800"
            >
              {showPassword ? (
                <img src={HidePassWordIcon} alt="HidePassWordIcon" />
              ) : (
                <img src={ShowPassWordIcon} alt="ShowPassWordIcon" />
              )}
            </button>
          </div>
          {/* --- Remember Me & Forgot Password --- */}
          <div className="flex justify-between items-center text-sm text-white mt-6 px-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                name="rememberMe"
                type="checkbox"
                className="form-checkbox text-secondary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <Link
              to="#"
              className="underline text-tertiary hover:text-secondary"
            >
              forgot password?
            </Link>
          </div>
          {/* --- Button: Sign In --- */}
          <button
            type="submit"
            disabled={loading}
            className={`w-3/4 mx-auto block mt-12 text-text_inverse text-button py-3 rounded-[20px] shadow-custom transition-transform transform hover:scale-105
              ${
                loading ? "bg-quaternary cursor-not-allowed" : " bg-secondary"
              }`}
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="underline text-tertiary text-bodyxl hover:text-secondary"
            >
              Sign in
            </Link>
          </p>

          <div className="flex justify-center gap-4 mt-4">
            {/* Facebook Circle */}
            <button
              className="p-3 hover:scale-110 transition text-[#1877F2]"
              onClick={handleSocialSignUp}
            >
              <img src={FacebookIcon} alt="FacebookIcon" width={60}/>
            </button>

            {/* Google Circle */}
            <button
              className="p-3 hover:scale-110 transition text-red-500"
              onClick={handleSocialSignUp}
            >
              <img src={GoogleIcon} alt="GoogleIcon" width={60}/>
            </button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};
export default LoginPage;
