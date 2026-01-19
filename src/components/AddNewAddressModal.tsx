import { useState, useEffect, useMemo } from "react";
import DropdownFilter from "../components/ui/DropdownFilter";

import { thaiLocations } from "../data/thaiAddressData";
import type { AddressFormState } from "../types/addressTypes";

// 🔥 Mock Data (ฝังไว้ที่นี่ก่อน ขี้เกียจแยกไฟล์)

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

  // ให้ State เปลี่ยนตาม initialData
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // แปลง DB -> Form
        // ห้ามให้หลุด undefined
        setFormData({
          recipientName: initialData.recipient_name || "",
          phoneNumber:
            initialData.phone_number || initialData.phoneNumber || "",
          addressDetail:
            initialData.address_detail || initialData.adddressDetail || "",
          province: initialData.province || "",
          district: initialData.district || "",
          subDistrict:
            initialData.sub_district || initialData.subDistrict || "",
          zipCode: initialData.zip_code || initialData.zipCode || "",
          isDefault: initialData.is_default || initialData.isDefault || false,
        });
      } else {
        // AddnewAddress ล้างค่าทิ้งให้เกลี้ยง
        setFormData(defaultFormState);
      }
    }
  }, [isOpen, initialData]);
  useEffect(() => {
    if (initialData) console.log("FormData:", initialData);
  }, [initialData]);
  const isFormValid =
    formData.recipientName &&
    formData.phoneNumber &&
    formData.province &&
    formData.district &&
    formData.subDistrict &&
    formData.zipCode &&
    formData.addressDetail;
  // Logic: Cascading Dropdown (เลือกแม่ -> ลูกเปลี่ยน)
  // หาข้อมูลจังหวัดที่เลือก
  const selectedProvinceData = useMemo(() => {
    return thaiLocations.find((p) => p.province === formData.province);
  }, [formData.province]);

  // หาข้อมูลอำเภอที่เลือก
  const selectedDistrictData = useMemo(() => {
    return selectedProvinceData?.districts.find(
      (d) => d.name === formData.district
    );
  }, [selectedProvinceData, formData.district]);

  // Auto Zipcode
  useEffect(() => {
    if (formData.subDistrict && selectedDistrictData) {
      const sub = selectedDistrictData.subDistricts.find(
        (s) => s.name === formData.subDistrict
      );
      if (sub) {
        setFormData((prev) => ({ ...prev, zipCode: sub.zipCode }));
      }
    }
  }, [formData.subDistrict, selectedDistrictData]);

  // --- Handlers ---

  // สำหรับ Input ปกติ (Text, Checkbox)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // สำหรับ Dropdown (รับค่า value ตรงๆ)
  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => {
      // สร้าง state ใหม่จากการเปลี่ยนค่าปกติ
      const newState = { ...prev, [name]: value };

      // Logic (Cascading Reset)
      if (name === "province") {
        // ถ้าเปลี่ยนจังหวัด -> ล้างอำเภอ, ตำบล, รหัส
        newState.district = "";
        newState.subDistrict = "";
        newState.zipCode = "";
      } else if (name === "district") {
        // ถ้าเปลี่ยนอำเภอ -> ล้างตำบล, รหัส
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

    const payload = {
      ...formData,
    };

    onConfirm(payload);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-[#6B4B6E] focus:ring-1 focus:ring-[#6B4B6E] transition placeholder-gray-400";

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4 py-10">
        <div className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl p-8 relative animate-fade-in-up">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-yellow-400 hover:text-yellow-500 transition"
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

          <div className="flex items-baseline gap-2 mb-8">
            <h2 className="text-h1xl text-primary">
              {initialData ? "Edit Address" : "Add New Address"}
            </h2>
            <span className="text-xs text-gray-500 font-medium">*Required</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name & Checkbox */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[#563F58] font-bold text-sm">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  name="recipientName"
                  placeholder="Name Surname"
                  className={inputClass}
                  value={formData.recipientName}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center h-full pt-6 md:pl-4">
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition w-full">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-[#563F58] checked:bg-[#563F58]"
                    />
                    <svg
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      xmlns="http://www.w3.org/2000/svg"
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
                  <label
                    htmlFor="isDefault"
                    className="text-[#563F58] font-bold text-sm cursor-pointer select-none"
                  >
                    Set as default address
                  </label>
                </div>
              </div>
            </div>

            {/* Row 2: Province & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Province Dropdown (Z-Index สูงสุด) */}
              <div className="space-y-1 relative z-30">
                <label className="text-[#563F58] font-bold text-sm">
                  Province *
                </label>
                <DropdownFilter
                  label="Select Province"
                  options={thaiLocations.map((p) => p.province)}
                  selected={formData.province}
                  onChange={(val) => handleDropdownChange("province", val)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#563F58] font-bold text-sm">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="0X-XXX-XXXX"
                  className={inputClass}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 3: District, Sub-district, Zip code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* District (Z-Index รองลงมา) */}
              <div className="space-y-1 relative z-20">
                <label className="text-[#563F58] font-bold text-sm">
                  District *
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

              {/* Sub-District (Z-Index ต่ำสุดในกลุ่ม dropdown) */}
              <div className="space-y-1 relative z-10">
                <label className="text-[#563F58] font-bold text-sm">
                  Sub-district *
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

              {/* Zip Code (Readonly เพราะ Auto Fill) */}
              <div className="space-y-1 relative">
                <label className="text-[#563F58] font-bold text-sm">
                  Zip code *
                </label>
                <div className="relative">
                  {/* ใช้ Input ธรรมดาแต่ล็อคไว้ หรือจะใช้ Dropdown ก็ได้แต่เปลือง */}
                  <input
                    type="text"
                    readOnly
                    value={formData.zipCode}
                    placeholder="Auto"
                    className={`${inputClass} bg-gray-50 text-primary text-bodyxl cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Address Details */}
            <div className="space-y-1 relative z-0">
              <label className="text-[#563F58] font-bold text-sm">
                Address adddressDetail *
              </label>
              <textarea
                name="addressDetail"
                rows={3}
                placeholder="(House number, village, road)"
                className={`${inputClass} resize-none pt-3`}
                value={formData.addressDetail}
                onChange={handleChange}
              />
            </div>

            {/* Footer Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full text-xl font-bold py-4 rounded-full transition-all duration-300
                  ${
                    isFormValid
                      ? "bg-secondary hover:bg-yellow-400 text-white shadow-lg transform active:scale-95 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  }
                `}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewAddressModal;
