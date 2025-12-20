import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
const VerifyPage = () => {
  return (
    <div className="flex justify-center items-center font-kanit">
      <AuthCard>
        <div className="text-center mt-20">
          <p className="text-xl text-secondary">
            Please Verify Your Email Address
          </p>
          <p className="text-body text-text_inverse mt-4">
            We have sent a confirmation link to Your Email
            <br />
            Please click the link in the email 
            to activate account. <br />
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
            Didn't receive the email? {" "}
            <button
              className="underline text-tertiary text-bodyxl hover:text-secondary"
            >
              [Resend Link]
            </button>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default VerifyPage;
