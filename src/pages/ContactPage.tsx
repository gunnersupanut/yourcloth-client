import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { supportService } from "../services/supportService";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const TOPICS = [
  "General Inquiry",
  "Order Issue",
  "Payment Problem",
  "Account & Login",
  "Feedback",
  "Other",
];

const ContactPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check Login & Profile
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // ฟังก์ชันส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic || !message) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await supportService.createTicket({
        topic,
        message,
      });

      // 2. Success Message
      toast.success(
        "Your request has been successfully submitted.",
      );

      // Clear Form
      setTopic("");
      setMessage("");
    } catch (error) {
      console.error(error);
      // 3. API Error (English)
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-kanit">
      {/* Wrapper เนื้อหา: เพิ่ม Space ให้ห่างกันหน่อย */}
      <div className="space-y-6">
        {/* Header: ชิดซ้ายเหมือนเดิม */}
        <div className="text-left space-y-2 px-2">
          <h1 className="text-4xl font-extrabold text-primary">Contact Us</h1>
          <p className="text-2xl text-primary font-medium">
            Tell Us How We Can Help,{" "}
            <span className="text-black">{user.username || "User"}.</span>
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-[40px] shadow-custombutton border border-gray-200 p-6 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dropdown */}
            {/* Dropdown Topic */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-primary ml-1 block font-kanit">
                Contact topic <span className="text-red-500">*</span>
              </label>

              <div className="relative inline-block w-full md:w-auto group">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="
        w-full md:w-[350px]
        appearance-none
        bg-white
        text-secondary font-bold text-lg
        border-2 border-gray-200
        rounded-full
        px-8 py-4
        pr-12
        cursor-pointer
        outline-none
        transition-all duration-300
        
        placeholder:text-gray-400
        
        hover:border-secondary
        hover:shadow-lg hover:shadow-secondary/10
        
        focus:border-secondary
        focus:ring-4 focus:ring-secondary/20
      "
                >
                  <option value="" disabled className="text-gray-400">
                    Select a Topic...
                  </option>
                  {TOPICS.map((t) => (
                    <option
                      key={t}
                      value={t}
                      className="text-gray-700 font-medium py-2"
                    >
                      {t}
                    </option>
                  ))}
                </select>

                {/* Custom Arrow Icon: สีเหลือง (Secondary) หมุนตาม interaction */}
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-secondary group-hover:text-secondary group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-2 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={8}
                placeholder="How can i help you..."
                className="w-full border border-gray-400 rounded-[30px] px-8 py-6 text-gray-700 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition resize-none text-lg placeholder-gray-400"
              ></textarea>
              <div className="absolute bottom-5 right-8 text-gray-400 text-sm font-medium">
                {message.length}/1000
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col items-center space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-2/3 lg:w-1/2 bg-secondary text-white font-bold text-xl py-4 rounded-full shadow-md hover:shadow-lg hover:brightness-105 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={24} />}
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              <p className="text-gray-400 text-sm font-medium">
                We will respond to emails within 24–48 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
