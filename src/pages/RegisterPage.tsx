import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
// import pictures and icons here
import UserIcon from "../assets/icons/icons8-user-48 1.png";
import PasswordIcon from "../assets/icons/icons8-password-50 1.png";
import ShowPassWordIcon from "../assets/icons/icons8-eye-50 1.png";
import HidePassWordIcon from "../assets/icons/hidepasswordIcon.png";
import EmailIcon from "../assets/icons/icons8-email-50 3.png";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);
  return (
    <div className="flex justify-center items-center">
      <AuthCard>
        <form onSubmit={(e) => e.preventDefault()} className="font-kanit">
          {/* Input UserName */}
          <div className="relative mt-8">
            {/* ไอคอน */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={UserIcon} alt="UserIcon" />
            </div>
            <input
              type="text"
              placeholder="USERNAME"
              className="w-full py-3 pl-16  bg-white text-gray-800 rounded-[20px] shadow-custom focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          {/* Email UserName */}
          <div className="relative mt-6">
            {/* ไอคอน */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={EmailIcon} alt="EmailIcon" />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full py-3 pl-16  bg-white text-gray-800 rounded-[20px] shadow-custom focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          {/* Input Password */}
          <div className="relative mt-6">
            {/* ไอคอน  */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={PasswordIcon} alt="PasswordIcon" />
            </div>
            <input
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
          {/* Input ComfirmPassword */}
          <div className="relative mt-6">
            {/* ไอคอน  */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={PasswordIcon} alt="PasswordIcon" />
            </div>
            <input
              type={showComfirmPassword ? "text" : "password"}
              placeholder="PASSWORD"
              className="w-full py-3 pl-16 pr-4 bg-white text-gray-800 rounded-[20px] shadow-custom focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {/* ปุ่มลูกตา */}
            <button
              type="button"
              onClick={() => setShowComfirmPassword(!showComfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-800"
            >
              {showComfirmPassword ? (
                <img src={HidePassWordIcon} alt="HidePassWordIcon" />
              ) : (
                <img src={ShowPassWordIcon} alt="ShowPassWordIcon" />
              )}
            </button>
          </div>
          <div className="flex justify-between items-center text-sm text-white mt-10 px-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="form-checkbox text-secondary" />
              <span className="text-tertiary underline">
                I agree to the Terms and Conditions and Privacy Policy
              </span>
            </label>
          </div>
          {/* --- Button: Sign In --- */}
          <button
            type="submit"
            className="w-3/4 mx-auto block mt-4 bg-secondary text-text_inverse text-button py-3 rounded-[20px] shadow-custom hover:bg-yellow-400 transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="underline text-tertiary text-bodyxl hover:text-secondary"
          >
            Back to Sign in
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;
