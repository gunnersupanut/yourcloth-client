import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import VerifiedIcon from "../assets/icons/correctIcon.png";
const VerifiedPage = () => {
  return (
    <div className="flex justify-center items-center font-kanit">
      <AuthCard>
        <div className="flex justify-center pointer-events-none mt-12">
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
      </AuthCard>
    </div>
  );
};

export default VerifiedPage;
