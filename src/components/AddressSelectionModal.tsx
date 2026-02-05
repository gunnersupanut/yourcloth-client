import { useState, useEffect } from "react";
import type { Address } from "../types/addressTypes";
import { Pencil, Plus, Check, X } from "lucide-react"; // ใช้ Icon จาก Lib สวยกว่า

interface AddressSelectionModalProps {
  isOpen: boolean;
  addresses: Address[];
  selectedId: number | null;
  onConfirm: (address: Address) => void;
  onClose: () => void;
  AddnewAddress: (addr?: Address) => void;
}

const AddressSelectionModal = ({
  isOpen,
  onClose,
  addresses,
  selectedId,
  onConfirm,
  AddnewAddress,
}: AddressSelectionModalProps) => {
  const [tempSelectedId, setTempSelectedId] = useState<number | null>(
    selectedId,
  );

  useEffect(() => {
    setTempSelectedId(selectedId);
  }, [isOpen, selectedId]);

  if (!isOpen) return null;

  const handleEditClick = (e: React.MouseEvent, addr: Address) => {
    e.stopPropagation(); // กันไม่ให้ไป trigger การเลือก Address
    AddnewAddress(addr);
  };

  const handleConfirm = () => {
    const selectedAddress = addresses.find(
      (addr) => addr.id === tempSelectedId,
    );
    if (selectedAddress) {
      onConfirm(selectedAddress);
      onClose();
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 font-kanit">
      {/* Modal Container: Full height on mobile, Centered on desktop */}
      <div className="bg-white w-full sm:max-w-lg h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slide-up-mobile sm:animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-h2xl text-primary font-bold">Select Address</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Choose where to ship your order
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🏠</span>
              </div>
              <p>No address found.</p>
            </div>
          ) : (
            addresses.map((addr) => {
              const isSelected = tempSelectedId === addr.id;

              return (
                <div
                  key={addr.id}
                  onClick={() => setTempSelectedId(addr.id)}
                  className={`group relative flex flex-col sm:flex-row items-stretch rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
                    ${
                      isSelected
                        ? "border-[#6B4B6E] bg-white shadow-md ring-1 ring-[#6B4B6E]/20 scale-[1.01]"
                        : "border-transparent bg-white shadow-sm hover:border-gray-200"
                    }`}
                >
                  {/* Selected Badge (Mobile Only) */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 sm:hidden text-[#6B4B6E]">
                      <Check size={20} strokeWidth={3} />
                    </div>
                  )}

                  {/* Left Side: Contact Info */}
                  <div
                    className={`w-full sm:w-[35%] p-4 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 sm:gap-1 transition-colors
                      ${
                        isSelected
                          ? "bg-[#6B4B6E] text-white sm:text-white"
                          : "bg-gray-100 sm:bg-gray-50 text-gray-600"
                      }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-0 sm:flex-col sm:items-start">
                      {/* Desktop Indicator */}
                      <div
                        className={`hidden sm:block w-3 h-3 rounded-full mb-2 ${isSelected ? "bg-secondary box-shadow-glow" : "bg-gray-300"}`}
                      />

                      <div className="flex flex-col">
                        <p className="text-base sm:text-lg font-bold truncate capitalize leading-tight">
                          {addr.recipient_name}
                        </p>
                        <p
                          className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}
                        >
                          {addr.phone_number}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Indicator (Radio) */}
                    <div
                      className={`sm:hidden w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? "border-white bg-white" : "border-gray-400"}`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6B4B6E]" />
                      )}
                    </div>
                  </div>

                  {/* Right Side: Address Detail */}
                  <div className="flex-1 p-4 flex items-center relative pr-12">
                    <p className="text-gray-600 text-sm leading-relaxed break-words">
                      <span className="font-medium text-gray-800 block mb-1">
                        {addr.address_detail}
                      </span>
                      <span className="text-xs text-gray-500">
                        {addr.sub_district}, {addr.district},{" "}
                        <br className="hidden sm:inline" />
                        {addr.province} {addr.zip_code}
                      </span>
                    </p>

                    {/* Edit Button */}
                    <button
                      onClick={(e) => handleEditClick(e, addr)}
                      className="absolute bottom-3 right-3 sm:top-auto sm:bottom-3 p-2 text-secondary hover:scale-105 hover:bg-secondary/10 rounded-full transition-all"
                      title="Edit address"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Buttons (Fixed Bottom) */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white space-y-3 pb-8 sm:pb-6">
          {/* Add New Address */}
          <button
            onClick={() => AddnewAddress()}
            className="w-full py-3.5 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold flex items-center justify-center gap-2 hover:bg-purple-50 hover:border-primary transition-colors group"
          >
            <div className="bg-primary/10 p-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus size={18} />
            </div>
            Add New Address
          </button>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!tempSelectedId}
            className={`w-full py-4 rounded-xl text-white text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2
              ${
                tempSelectedId
                  ? "bg-secondary hover:bg-yellow-400 active:scale-[0.98] shadow-yellow-200"
                  : "bg-gray-300 cursor-not-allowed shadow-none"
              }`}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
