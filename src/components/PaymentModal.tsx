import React, { useState, useRef } from "react";
import { X, Wallet, Upload, CheckCircle, Copy } from "lucide-react";
import type { PaymentModalProps } from "../types/orderTypes";
import MyQrCode from "../assets/icons/myQRCode.jpg";
import { uploadService } from "../services/uploadService";
import toast from "react-hot-toast";
import { orderService } from "../services/orderService";
import { useNavigate } from "react-router-dom";

type Step = "PAYMENT" | "UPLOAD" | "COMPLETE";

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  totalAmount,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("PAYMENT");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BANK_INFO = {
    bankName: "KBank",
    accNumber: "1343988113",
    accName: "ศุภณัฐ องค์เจริญสุข",
  };

  if (!isOpen) return null;

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // สร้าง URL สำหรับ Preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      toast.error("Please upload slip first!");
      return;
    }
    try {
      setIsLoading(true);
      // อัปโหลดรูป
      const image = await uploadService.upload(selectedFile, orderId, "SLIP");
      const payload = {
        imageObj: {
          imageUrl: image?.file_url,
          filePath: image?.file_path,
        },
      };
      // ย้ายออร์เดอร์
      await orderService.moveOrdertoInspecting(orderId, payload);
      // รีเฟรชหน้าหลัก
      onSuccess();
      setCurrentStep("COMPLETE");
      toast.success(`Payment completed.`);
    } catch (error: any) {
      console.error("Confirm payment Error:", error);

      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Components: Stepper ---
  const renderStepper = () => {
    const steps = [
      { id: "PAYMENT", label: "Payment", icon: Wallet },
      { id: "UPLOAD", label: "Upload Slip", icon: Upload },
      { id: "COMPLETE", label: "Complete", icon: CheckCircle },
    ];

    const getStepStatus = (stepId: string, index: number) => {
      if (currentStep === stepId) return "current";

      // Logic เช็คว่าผ่านมารึยัง
      const stepOrder = ["PAYMENT", "UPLOAD", "COMPLETE"];
      const currentIndex = stepOrder.indexOf(currentStep);
      if (index < currentIndex) return "completed";

      return "pending";
    };

    return (
      // 🔥 ปรับ Padding ให้เหมาะกับมือถือ (px-2) และคอม (px-8)
      <div className="flex justify-between items-center w-full px-2 md:px-8 mb-6 md:mb-8 relative select-none">
        {/* Background Line */}
        {/* 🔥 ปรับตำแหน่งเส้นให้ตรงกลางวงกลม (top-4 สำหรับมือถือ, top-6 สำหรับคอม) */}
        <div className="absolute top-4 md:top-6 left-0 w-full h-0.5 bg-gray-200 z-0" />

        {steps.map((step, idx) => {
          const status = getStepStatus(step.id, idx);
          const Icon = step.icon;

          let circleClass = "bg-white border-2 border-gray-200 text-gray-400";
          let textClass = "text-gray-400";

          if (status === "completed") {
            circleClass = "bg-white border-2 border-green-500 text-green-500";
            textClass = "text-green-500";
          } else if (status === "current") {
            circleClass =
              "bg-white border-2 border-yellow-400 text-yellow-500 scale-110 shadow-lg";
            textClass = "text-yellow-500 font-bold";
          }

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-1 md:gap-2 bg-white px-2"
            >
              {/* 🔥 ปรับขนาดวงกลม: มือถือ w-8, คอม w-12 */}
              <div
                className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${circleClass}`}
              >
                {/* 🔥 ปรับขนาด Icon: มือถือ w-4, คอม w-6 */}
                <Icon className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              {/* 🔥 ปรับขนาด Font: มือถือเล็กหน่อย คอมปกติ */}
              <span
                className={`text-[10px] md:text-sm font-medium ${textClass}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // --- Step 1: Payment Content ---
  const renderPaymentStep = () => (
    <div className="flex flex-col items-center animate-fadeIn w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
        Order <span className="text-yellow-500">#{orderId}</span>
      </h2>
      <h3 className="text-lg md:text-xl font-bold text-gray-600 mb-4 md:mb-6 text-center">
        Total Price{" "}
        <span className="text-yellow-500">
          {totalAmount.toLocaleString()} ฿
        </span>
      </h3>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center w-full mb-4">
        {/* QR Code Section */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold text-gray-700">QR CODE</p>
          <div className="p-2 border-2 border-gray-200 rounded-lg bg-white">
            {/* Mock QR - เปลี่ยนรูปจริงตรงนี้ */}
            <div className="w-32 h-44 bg-gray-100 flex items-center justify-center rounded">
              <img src={MyQrCode} alt="QRCode" />
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Scan with any banking app.
          </p>
        </div>

        {/* Divider for Desktop */}
        <div className="hidden md:block h-32 w-[1px] bg-gray-300 relative">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-yellow-500 font-bold text-sm">
            OR
          </span>
        </div>

        {/* Divider for Mobile */}
        <div className="md:hidden w-full flex items-center gap-2">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-yellow-500 font-bold text-sm">OR</span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        {/* Bank Details Section */}
        <div className="flex flex-col gap-3 md:gap-4 text-left w-full md:w-auto px-4 md:px-0">
          <p className="font-bold text-gray-700 text-lg text-center md:text-left">
            Bank Transfer
          </p>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              K
            </div>
            <span className="font-bold text-green-600 text-lg">
              {BANK_INFO.bankName}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg md:bg-transparent md:p-0">
            <p className="text-gray-600 font-bold flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-center md:text-left">
              <span className="text-sm md:text-base">Account Number</span>
              <span className="flex items-center justify-center gap-2">
                <span className="text-yellow-500 text-lg">
                  {BANK_INFO.accNumber}
                </span>
                <Copy
                  className="w-4 h-4 text-secondary cursor-pointer hover:text-gray-600 active:scale-90 transition-transform"
                  onClick={() => {
                    navigator.clipboard.writeText(BANK_INFO.accNumber || "");
                    toast.success("Copy Bank Account Number.");
                  }}
                />
              </span>
            </p>
          </div>

          <div className="text-center md:text-left">
            <p className="text-gray-600 font-bold flex flex-col md:flex-row gap-1">
              <span className="text-sm md:text-base">Account Name</span>
              <span className="text-yellow-500 text-lg">
                {BANK_INFO.accName}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 md:gap-4 w-full justify-center mt-2">
        <button
          onClick={onClose}
          className="px-6 md:px-8 py-2 rounded-full border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors min-w-[100px]"
        >
          Cancel
        </button>
        <button
          onClick={() => setCurrentStep("UPLOAD")}
          className="px-6 md:px-8 py-2 rounded-full bg-yellow-400 text-white font-bold hover:bg-yellow-500 shadow-md transition-all hover:scale-105 min-w-[100px]"
        >
          Next
        </button>
      </div>
    </div>
  );

  // --- Step 2: Upload Slip Content ---
  const renderUploadStep = () => (
    <div className="flex flex-col items-center animate-fadeIn w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6 text-center">
        Upload Slip
      </h2>

      {/* Upload Box */}
      <div className="relative w-64 h-64 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center mb-8 overflow-hidden bg-gray-50 shadow-inner">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Slip Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 transition-colors group z-10"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
            </button>
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center text-yellow-500 mb-3 bg-white">
              <span className="text-3xl font-light leading-none pb-1">+</span>
            </div>
            <span className="text-yellow-500 font-bold">Tap to Upload</span>
            <span className="text-gray-400 text-xs mt-1">
              Supports JPG, PNG
            </span>
          </div>
        )}

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex gap-3 md:gap-4 w-full justify-center">
        <button
          onClick={() => setCurrentStep("PAYMENT")}
          className="px-6 md:px-8 py-2 rounded-full border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors min-w-[100px]"
        >
          Back
        </button>
        <button
          onClick={handleConfirmUpload}
          disabled={!selectedFile || isLoading}
          className={`px-6 md:px-8 py-2 rounded-full font-bold shadow-md transition-all min-w-[120px] flex justify-center items-center
    ${
      selectedFile && !isLoading
        ? "bg-yellow-400 text-white hover:bg-yellow-500 hover:scale-105"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
        >
          {isLoading ? (
            /* Spinner */
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-current"
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
            /* ข้อความปกติ */
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );

  // --- Step 3: Complete Content ---
  const renderCompleteStep = () => (
    <div className="flex flex-col items-center animate-fadeIn text-center py-4">
      <div className="mb-6 animate-bounce-slow">
        <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-green-500" />
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
        Payment Completed
      </h2>

      <p className="text-gray-500 text-sm md:text-base max-w-md mb-8 px-4">
        The Verification Process Will Be Completed Within{" "}
        <span className="text-yellow-500 font-bold">24 Hours</span>, And You
        Will Be Notified Of The Results Via Email.
      </p>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full justify-center px-8">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-full border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors w-full md:w-auto"
        >
          Home Page
        </button>
        <button
          onClick={() => {
            // Navigate to order list logic
            console.log("Go to Order List");
            onClose();
          }}
          className="px-6 py-2 rounded-full bg-yellow-400 text-white font-bold hover:bg-yellow-500 shadow-md transition-all hover:scale-105 w-full md:w-auto"
        >
          My Orders
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl z-10 flex flex-col 
                      max-h-[90vh] overflow-y-auto  
                      p-4 md:p-10                  
      "
      >
        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Stepper Header */}
        <div className="shrink-0 mt-2 md:mt-0">{renderStepper()}</div>

        {/* Dynamic Body */}
        <div className="flex-1 flex flex-col justify-center pb-4">
          {currentStep === "PAYMENT" && renderPaymentStep()}
          {currentStep === "UPLOAD" && renderUploadStep()}
          {currentStep === "COMPLETE" && renderCompleteStep()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
