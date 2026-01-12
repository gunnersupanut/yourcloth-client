import { Link } from "react-router-dom";
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-kanit">
      {/* 1. Backdrop (ฉากหลังมัวๆ กดแล้วปิดได้) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. Modal Content (กล่องขาวเด้งๆ) */}
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        {/* Close Button (กากบาทมุมขวา) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon & Text */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#5B486B"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-[#5B486B] mb-2">
            Please Login
          </h3>
          <p className="text-gray-500 mb-8">
            You need to be logged in to add items to your cart or make a
            purchase.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* ปุ่ม Login */}
            <Link
              to="/login" // หรือใช้ Link ของ Next.js
              className="block w-full py-3 px-4 bg-[#5B486B] hover:bg-[#4A3B58] text-white font-bold rounded-xl transition-transform active:scale-95 shadow-lg shadow-purple-200"
            >
              Log In Now
            </Link>

            {/* ปุ่ม Register */}
            <Link
              to="/register"
              className="block w-full py-3 px-4 bg-white border-2 border-gray-100 hover:border-[#5B486B] text-gray-700 hover:text-[#5B486B] font-bold rounded-xl transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
