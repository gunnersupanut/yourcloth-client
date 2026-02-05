import { useState, useEffect, useMemo } from "react";
import DropdownFilter from "../components/ui/DropdownFilter";
import { thaiLocations } from "../data/thaiAddressData";
import type { AddressFormState } from "../types/addressTypes";
import { X } from "lucide-react"; // แนะนำให้ใช้ Icon จาก Lib จะสวยกว่า SVG ดิบ

interface AddNewAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addressData: any) => void;
  initialData?: any;
}

const defaultFormState = {
  recipientName: "",
  phoneNumber: "",
  addressDetail: "",
  province: "",
  district: "",
  subDistrict: "",
  zipCode: "",
  isDefault: false,
};

const AddNewAddressModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
}: AddNewAddressModalProps) => {
  const [formData, setFormData] = useState<AddressFormState>(defaultFormState);

  // --- Logic: Init Data ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          recipientName: initialData.recipient_name || "",
          phoneNumber:
            initialData.phone_number || initialData.phoneNumber || "",
          addressDetail:
            initialData.address_detail || initialData.adddressDetail || "", // Handle Typo from DB if any
          province: initialData.province || "",
          district: initialData.district || "",
          subDistrict:
            initialData.sub_district || initialData.subDistrict || "",
          zipCode: initialData.zip_code || initialData.zipCode || "",
          isDefault: initialData.is_default || initialData.isDefault || false,
        });
      } else {
        setFormData(defaultFormState);
      }
    }
  }, [isOpen, initialData]);

  // --- Logic: Cascading Dropdown ---
  const selectedProvinceData = useMemo(() => {
    return thaiLocations.find((p) => p.province === formData.province);
  }, [formData.province]);

  const selectedDistrictData = useMemo(() => {
    return selectedProvinceData?.districts.find(
      (d) => d.name === formData.district,
    );
  }, [selectedProvinceData, formData.district]);

  // Auto Zipcode
  useEffect(() => {
    if (formData.subDistrict && selectedDistrictData) {
      const sub = selectedDistrictData.subDistricts.find(
        (s) => s.name === formData.subDistrict,
      );
      if (sub) {
        setFormData((prev) => ({ ...prev, zipCode: sub.zipCode }));
      }
    }
  }, [formData.subDistrict, selectedDistrictData]);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "province") {
        newState.district = "";
        newState.subDistrict = "";
        newState.zipCode = "";
      } else if (name === "district") {
        newState.subDistrict = "";
        newState.zipCode = "";
      }
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.recipientName ||
      !formData.phoneNumber ||
      !formData.addressDetail
    ) {
      alert("Please fill in all required fields!");
      return;
    }
    const payload = { ...formData };
    onConfirm(payload);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-[#6B4B6E] focus:ring-1 focus:ring-[#6B4B6E] transition placeholder-gray-400";

  return (
    // Overlay: Fixed เต็มจอ + Scroll ได้เมื่อเนื้อหายาวเกิน
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm font-kanit">
      {/* Container: จัดกึ่งกลาง Flex + Padding กันขอบ */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Modal Box: Responsive Width & Padding */}
        <div
          className="relative transform overflow-hidden rounded-2xl md:rounded-[32px] bg-white text-left shadow-2xl transition-all 
          w-full max-w-3xl my-8 p-5 md:p-8 animate-fade-in-up"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-red-500 transition p-1 bg-gray-100 rounded-full hover:bg-red-50"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-6 md:mb-8">
            <h2 className="text-h2xl md:text-h1xl text-primary font-bold">
              {initialData ? "Edit Address" : "Add New Address"}
            </h2>
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md w-fit">
              *All fields are required
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* --- Row 1: Name & Default Checkbox --- */}
            {/* Mobile: Stack, Desktop: 2 Cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[#563F58] font-bold text-sm ml-1">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="recipientName"
                  placeholder="Name Surname"
                  className={inputClass}
                  value={formData.recipientName}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>

              {/* Checkbox Container */}
              <div className="flex items-end pb-1 md:pl-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-dashed border-gray-300 hover:border-[#563F58] hover:bg-purple-50 transition w-full group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-400 transition-all checked:border-[#563F58] checked:bg-[#563F58] group-hover:border-[#563F58]"
                    />
                    <svg
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-gray-600 font-bold text-sm cursor-pointer select-none group-hover:text-[#563F58]">
                    Set as default address
                  </span>
                </label>
              </div>
            </div>

            {/* --- Row 2: Province & Phone --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Province (Z-Index 30) */}
              <div className="space-y-1.5 relative z-30">
                <label className="text-[#563F58] font-bold text-sm ml-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <DropdownFilter
                  label="Select Province"
                  options={thaiLocations.map((p) => p.province)}
                  selected={formData.province}
                  onChange={(val) => handleDropdownChange("province", val)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#563F58] font-bold text-sm ml-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="08X-XXX-XXXX"
                  className={inputClass}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={20} // เพิ่มกันเหนียว
                />
              </div>
            </div>

            {/* --- Row 3: District, Sub, Zip --- */}
            {/* Mobile: 1 Col, Desktop: 3 Cols */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* District (Z-Index 20) */}
              <div className="space-y-1.5 relative z-20">
                <label className="text-[#563F58] font-bold text-sm ml-1">
                  District <span className="text-red-500">*</span>
                </label>
                <DropdownFilter
                  label="Select District"
                  options={
                    selectedProvinceData
                      ? selectedProvinceData.districts.map((d) => d.name)
                      : []
                  }
                  selected={formData.district}
                  onChange={(val) => handleDropdownChange("district", val)}
                  disabled={!formData.province}
                />
              </div>

              {/* Sub-District (Z-Index 10) */}
              <div className="space-y-1.5 relative z-10">
                <label className="text-[#563F58] font-bold text-sm ml-1">
                  Sub-district <span className="text-red-500">*</span>
                </label>
                <DropdownFilter
                  label="Select Sub-district"
                  options={
                    selectedDistrictData
                      ? selectedDistrictData.subDistricts.map((s) => s.name)
                      : []
                  }
                  selected={formData.subDistrict}
                  onChange={(val) => handleDropdownChange("subDistrict", val)}
                  disabled={!formData.district}
                />
              </div>

              {/* Zip Code */}
              <div className="space-y-1.5 relative">
                <label className="text-[#563F58] font-bold text-sm ml-1">
                  Zip code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.zipCode}
                  placeholder="Auto"
                  className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200`}
                />
              </div>
            </div>

            {/* --- Row 4: Address Details --- */}
            <div className="space-y-1.5 relative z-0">
              <label className="text-[#563F58] font-bold text-sm ml-1">
                Address Details <span className="text-red-500">*</span>
              </label>
              <textarea
                name="addressDetail"
                rows={3}
                placeholder="House No., Building, Street, Soi..."
                className={`${inputClass} resize-none pt-3 min-h-[100px]`}
                value={formData.addressDetail}
                onChange={handleChange}
                maxLength={200}
              />
            </div>

            {/* Footer Button */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full text-lg md:text-xl font-bold py-3.5 md:py-4 rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2
                  ${
                    formData.recipientName &&
                    formData.phoneNumber &&
                    formData.addressDetail &&
                    formData.zipCode
                      ? "bg-secondary hover:bg-yellow-400 text-white transform active:scale-95 cursor-pointer hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Confirm Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewAddressModal;
