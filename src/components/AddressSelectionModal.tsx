import { useState, useEffect } from "react";
import type { Address } from "../types/addressTypes";

// Type

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[]; // รับรายการที่อยู่เข้ามา
  selectedId: number | null; // ID ที่ถูกเลือกอยู่ปัจจุบัน
  onConfirm: (address: Address) => void; // ส่งค่ากลับเมื่อกด Confirm
}

const AddressSelectionModal = ({
  isOpen,
  onClose,
  addresses,
  selectedId,
  onConfirm,
}: AddressSelectionModalProps) => {
  // State สำหรับเลือกใน Modal (ยังไม่กระทบของจริงจนกว่าจะกด Confirm)
  const [tempSelectedId, setTempSelectedId] = useState<number | null>(
    selectedId
  );

  // Sync state เมื่อ modal เปิดขึ้นมาใหม่
  useEffect(() => {
    setTempSelectedId(selectedId);
  }, [isOpen, selectedId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selectedAddress = addresses.find(
      (addr) => addr.id === tempSelectedId
    );

    if (selectedAddress) {
      onConfirm(selectedAddress);
      onClose();
    }
  };

  return (
    // Overlay (Background สีดำจางๆ)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-h1xl text-primary">Address</h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-yellow-500 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4 custom-scrollbar">
          {addresses.map((addr) => {
            const isSelected = tempSelectedId === addr.id;

            return (
              <div
                key={addr.id}
                onClick={() => setTempSelectedId(addr.id)}
                className={`group flex items-stretch rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm hover:scale-105
                  ${isSelected ? "border-primary" : "border-gray-200"}`}
              >
                {/* Name & Phone */}
                <div
                  className={`w-[40%] p-5 flex flex-col justify-center gap-1 rounded-l-[14px] transition-colors
                    ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                >
                  {/* Dot Indicator */}
                  <div
                    className={`w-4 h-4 rounded-full mb-2 ${
                      isSelected ? "bg-secondary" : "bg-white"
                    }`}
                  />

                  <p className="text-body leading-tight">
                    {addr.recipient_name}
                  </p>
                  <p className="text-body">{addr.phone}</p>
                </div>

                {/* Address Detail */}
                <div className="w-[60%] p-5 flex items-center bg-white rounded-r-[14px]">
                  <p className="text-gray-600 text-body font-medium leading-relaxed">
                    {addr.address}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 pt-2 flex flex-col gap-4">
          {/* Add New Address Button */}
          <button className="w-full text-button py-6 rounded-full border-2 border-primary text-primary flex items-center justify-center gap-2 hover:bg-purple-50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Adress
          </button>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!tempSelectedId}
            className={`w-full py-4 rounded-full text-white text-lg font-bold shadow-lg transition transform active:scale-95
              ${
                tempSelectedId
                  ? "bg-[#FFD700] hover:bg-yellow-400 text-white"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
