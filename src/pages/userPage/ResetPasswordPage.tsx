import { useState } from "react";
import AuthCard from "../../components/AuthCard";
import PasswordIcon from "../../assets/icons/icons8-password-50 1.png";
import ShowPassWordIcon from "../../assets/icons/icons8-eye-50 1.png";
import HidePassWordIcon from "../../assets/icons/hidepasswordIcon.png";
import { Link } from "react-router-dom";
const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);
  // ฟังก์ชันสำหรับอัปเดตค่าเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // อัปเดตเฉพาะ field ที่พิมพ์
    }));
  };
  // ฟังก์ชั่นส่ง
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit");
  };
  return (
    <div className="flex justify-center items-center">
      <AuthCard>
        <form onSubmit={handleSubmit} className="font-kanitw">
          {/* Input Password */}
          <div className="relative mt-20">
            {/* ไอคอน  */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <img src={PasswordIcon} alt="PasswordIcon" />
            </div>
            <input
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="YOUR NEW PASSWORD"
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
              name="confirmpassword"
              onChange={handleChange}
              type={showComfirmPassword ? "text" : "password"}
              placeholder="CONFIRM YOUR NEW PASSWORD"
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
          <button
            type="submit"
            disabled={loading}
            className={`w-3/4 mx-auto block mt-20 text-text_inverse text-button py-3 rounded-[20px] shadow-custom transition-transform transform hover:scale-105
              ${
                loading ? "bg-quaternary cursor-not-allowed" : " bg-secondary"
              }`}
          >
            Reset Password
          </button>
          <div className="text-center mt-28">
            <Link
              to="/login"
              className="underline text-tertiary text-bodyxl hover:text-secondary"
            >
              Back to Sign in
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default ResetPasswordPage;
