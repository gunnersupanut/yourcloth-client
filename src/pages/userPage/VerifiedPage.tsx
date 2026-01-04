import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import VerifiedIcon from "../assets/icons/correctIcon.png";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/auth.service";
const VerifiedPage = () => {
  // ดึง  token จาก Params
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const effectRan = useRef(false);
  useEffect(() => {
    // เช็คว่าเคยรันไปยัง? ถ้าเคยแล้วให้หยุดเลย
    if (effectRan.current === true) return;
    if (!token) {
      toast.error("No verification link found.", { id: "no-token" });
      navigate("/login", { replace: true });
      return;
    }
    // ตรวจสอบ token
    const verifyToken = async () => {
      setLoading(true);
      try {
        await toast.promise(
          (async () => {
            await authService.verifyEmail(token);
          })(),
          {
            loading: "Verifying...",
            success: "Verify complete.",
            error: (error: any) =>
              `${error.response?.data?.message || "Something went wrong"}`,
          }
        );
      } catch (error) {
        console.error("Fail to verify token", error);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
    return () => {
      effectRan.current = true;
    };
  }, [token]);

  return (
    <div className="flex justify-center items-center font-kanit">
      <AuthCard>
        {loading ? (
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
          <>
            <div className="flex justify-center pointer-events-none mt-12">
              {" "}
              <img src={VerifiedIcon} alt="VerifiedIcon" />
            </div>
            <div className="text-center">
              <p className="text-xl text-secondary">Your account is verified</p>
              <p className="text-body text-text_inverse mt-4">
                Your email has been successfully verified.
                <br />
                You can now log in to access <br />
                your account and start shopping.
              </p>
            </div>
            {/* --- Button --- */}
            <Link
              to="/login"
              type="submit"
              className="w-3/4 mx-auto block mt-20 bg-secondary text-center text-text_inverse text-button py-3 rounded-[20px] shadow-custom hover:bg-yellow-400 transition-transform transform hover:scale-105"
            >
              Back to Login
            </Link>
          </>
        )}
      </AuthCard>
    </div>
  );
};

export default VerifiedPage;
