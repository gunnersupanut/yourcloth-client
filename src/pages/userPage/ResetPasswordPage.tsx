import { useEffect, useRef, useState } from "react";
import AuthCard from "../../components/AuthCard";
import PasswordIcon from "../../assets/icons/icons8-password-50 1.png";
import ShowPassWordIcon from "../../assets/icons/icons8-eye-50 1.png";
import HidePassWordIcon from "../../assets/icons/hidepasswordIcon.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service";
const ResetPasswordPage = () => {
  // ดึง  token จาก Params
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingToken, setcheckingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);

  const effectRan = useRef(false);
  useEffect(() => {
    // เช็คว่าเคยรันไปยัง? ถ้าเคยแล้วให้หยุดเลย
    if (effectRan.current === true) return;
    if (!token) {
      toast.error("No verification link found.", { id: "no-token" });
      navigate("/login", { replace: true });
      return;
    } // ตรวจสอบ token
    const checkresetpasswordToken = async () => {
      setcheckingToken(true);
      try {
        await toast.promise(authService.checkResetPasswordToken(token), {
          loading: "Checking reset password token...",
          success: "Token correct.",
          error: (error: any) =>
            `${error.response?.data?.message || "Something went wrong"}`,
        });
      } catch (error) {
        console.error("Fail to Check reset password token", error);
        navigate("/login", { replace: true });
      } finally {
        setcheckingToken(false);
      }
    };
    checkresetpasswordToken();
    return () => {
      effectRan.current = true;
    };
  }, [token]);

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
    // เช็ครหัสผ่านตรงกันไหม
    if (formData.password !== formData.confirmpassword) {
      toast.error("The passwords don't match.");
      return;
    }
    // เช็คความยาว
    if (formData.password.length < 6) {
      toast.error("Please provide at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await toast.promise(
        authService.resetPassword(formData.password, token as string),
        {
          loading: "Reset Pasword...",
          success: "Reset Pasword Complete",
          error: (err) =>
            `${err.response?.data?.message || "Something went wrong"} `,
        }
      );
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Reset Pasword", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center">
      <AuthCard>
        {checkingToken ? (
          <div className="flex justify-center items-center pointer-events-none mt-40">
            <svg
              className="animate-spin -ml-1 mr-3 h-16 w-16 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
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
        )}
      </AuthCard>
    </div>
  );
};

export default ResetPasswordPage;
