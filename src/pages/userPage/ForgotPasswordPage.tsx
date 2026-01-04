// import pictures and component here
import { useState } from "react";
import AuthCard from "../../components/AuthCard";
import EmailIcon from "../../assets/icons/icons8-email-50 3.png";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  // ฟังก์ชันสำหรับอัปเดตค่าเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // อัปเดตเฉพาะ field ที่พิมพ์
    }));
  };
  const handleSubmit = async () => {
    console.log("Submit");
  };
  return (
    <div className="flex justify-center items-center">
      <AuthCard>
        <form onSubmit={handleSubmit} className="font-kanitw">
          <div className="text-center mt-14">
            <p className="text-tertiary text-bodyxl">
              Please enter your registered email address.
              <br />
              We'll send you a link to reset your password.
            </p>
          </div>
          <div className="relative mt-8">
            <div className="relative mt-6">
              {/* ไอคอน */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <img src={EmailIcon} alt="EmailIcon" />
              </div>
              <input
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full py-3 pl-16  bg-white text-gray-800 rounded-[20px] shadow-custom focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-3/4 mx-auto block mt-20 text-text_inverse text-button py-3 rounded-[20px] shadow-custom transition-transform transform hover:scale-105
              ${
                loading ? "bg-quaternary cursor-not-allowed" : " bg-secondary"
              }`}
            >
              Send Email
            </button>
            <div className="text-center mt-28"> 
              <Link
                to="/login"
                className="underline text-tertiary text-bodyxl hover:text-secondary"
              >
                Back to Sign in
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default ForgotPasswordPage;
