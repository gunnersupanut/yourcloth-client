import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard";
import toast from "react-hot-toast";
import { useEffect } from "react";

import { authService } from "../../services/auth.service";
import { useResendTimer } from "../../hooks/useResendTimer";
const VerifyPage = () => {
  // รับ email ที่ส่งมาจากหน้า Login
  const { state } = useLocation();
  const navigate = useNavigate();

  // เรียกใช้ hook
  const { timeLeft, startCooldown, isCooldown } = useResendTimer(60);
  // ถ้าไม่มี email ติดมา ให้ดีดกลับ
  useEffect(() => {
    if (!state?.email) {
      console.log("No Email with state");
      navigate("/login");
      toast.error(
        "Please enter your email address again.",
        // แนบ id แก้เด้งซ้ำใน local
        { id: "auth-check-error" }
      );
    }
  }, [state, navigate]);
  // return null ไว้ เพื่อไม่ให้มันไปเรนเดอร์ส่วนข้างล่างระหว่างรอดีดกลับ
  if (!state?.email) {
    return null;
  }

  const handleResend = async () => {
    // กันกดซ้ำ
    if (isCooldown) {
      return;
    }
    try {
      await toast.promise(authService.resendVerification(state?.email), {
        loading: "Resending...",
        success: "Resend Complete",
        error: (err) =>
          `${err.response?.data?.message || "Something went wrong"} `,
      });
      startCooldown();
    } catch (error: any) {
      if (error.response?.data?.message === "Account already verified.") {
        // รอสักนิดให้ Toast เด้งให้อ่านก่อน ค่อยดีดไป
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
      console.error("Login Error:", error);
    }
  };
  return (
    <div className="flex justify-center items-center font-kanit">
      <AuthCard>
        <div className="text-center mt-20">
          <p className="text-xl text-secondary">
            Please Verify Your Email Address
          </p>
          <p className="text-body text-text_inverse mt-4">
            We have sent a confirmation link to <br />
            <span className="text-secondary">
              {state.email || "Your Email"}
            </span>
            <br />
            Please click the link in the email to activate account. <br />
            (Don't forget to check your Spam folder!)
          </p>
        </div>
        {/* --- Button --- */}
        <Link
          to="/"
          type="submit"
          className="w-3/4 mx-auto block mt-16 bg-secondary text-center text-text_inverse text-button py-3 rounded-[20px] shadow-custom hover:bg-yellow-400 transition-transform transform hover:scale-105"
        >
          Go to HomePage
        </Link>
        <div className="text-center mt-14">
          <p className="text-white text-bodyxl">
            Didn't receive the email?{" "}
            <button
              className="underline text-tertiary text-bodyxl hover:text-secondary"
              onClick={handleResend}
            >
              {isCooldown ? `Wait ${timeLeft}s` : "[Resend Link]"}
            </button>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default VerifyPage;
