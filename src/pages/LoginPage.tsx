import { useState } from "react";
import AuthCard from "../components/AuthCard";

// import pictures and icons here
import UserIcon from "../assets/icons/icons8-user-48 1.png";
import PasswordIcon from "../assets/icons/icons8-password-50 1.png";
import FacebookIcon from "../assets/icons/fb icon.png";
import GoogleIcon from "../assets/icons/gg icon.png";
import ShowPassWordIcon from "../assets/icons/icons8-eye-50 1.png";
import HidePassWordIcon from "../assets/icons/hidepasswordIcon.png";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex justify-center items-center">
      <AuthCard>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Input UserName */}
          <div className="relative mt-8">
            {/* ไอคอนคน (Absolute Position เพื่อลอยอยู่เหนือ Input) */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={UserIcon} alt="UserIcon" />
            </div>
            <input
              type="text"
              placeholder="USERNAME"
              className="w-full py-3 pl-16 pr-4 bg-white text-gray-800 rounded-[20px] shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          {/* Input Password */}
          <div className="relative mt-8">
            {/* ไอคอนคน (Absolute Position เพื่อลอยอยู่เหนือ Input) */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={PasswordIcon} alt="PasswordIcon" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              className="w-full py-3 pl-16 pr-4 bg-white text-gray-800 rounded-[20px] shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary"
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
          <div className="flex justify-between items-center text-sm text-white mt-3 px-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="form-checkbox text-secondary" />
              <span>Remember Me</span>
            </label>
            <a href="#" className="underline text-tertiary hover:text-secondary">
              forgot password?
            </a>
          </div>
          {/* --- Button: Sign In --- */}
          <button
            type="submit"
            className="w-3/4 mx-auto block mt-6 bg-secondary text-white font-bold py-3 rounded-full shadow-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="underline text-tertiary hover:text-secondary">
              Sign up
            </a>
          </p>

          <div className="flex justify-center gap-4 mt-4">
            {/* Facebook Circle */}
            <button className="p-3 hover:scale-110 transition text-[#1877F2]">
              <img src={FacebookIcon} alt="FacebookIcon" />
            </button>

            {/* Google Circle */}
            <button className="p-3 hover:scale-110 transition text-red-500">
              <img src={GoogleIcon} alt="GoogleIcon" />
            </button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
