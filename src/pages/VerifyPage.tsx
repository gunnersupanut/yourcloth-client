import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";
import { useEffect } from "react";
const VerifyPage = () => {
  // รับ email ที่ส่งมาจากหน้า Login
  const { state } = useLocation();
  const navigate = useNavigate();

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
            <br />
            Please click the link in the email to activate account. <br />
            (Don't forget to check your Spam folder!)
          </p>
        </div>
        {/* --- Button --- */}
        <Link
          to="/"
          type="submit"
          className="w-3/4 mx-auto block mt-20 bg-secondary text-center text-text_inverse text-button py-3 rounded-[20px] shadow-custom hover:bg-yellow-400 transition-transform transform hover:scale-105"
        >
          Go to HomePage
        </Link>
        <div className="text-center mt-24">
          <p className="text-white text-bodyxl">
            Didn't receive the email?{" "}
            <button className="underline text-tertiary text-bodyxl hover:text-secondary">
              [Resend Link]
            </button>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default VerifyPage;
