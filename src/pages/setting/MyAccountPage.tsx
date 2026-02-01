import { useEffect, useState } from "react";
import { Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { userService } from "../../services/userService";

// Interface
interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  tel: string;
  birthday: string | null;
  gender: "Male" | "Female" | "Non binary" | "";
}

// Interface สำหรับเก็บ Error ของแต่ละ field
interface FormErrors {
  name?: string;
  surname?: string;
  tel?: string;
  birthday?: string;
  gender?: string;
}

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    username: "",
    email: "",
    name: "",
    surname: "",
    tel: "",
    birthday: "",
    gender: "",
  });

  // State สำหรับเก็บ Error
  const [errors, setErrors] = useState<FormErrors>({});

  // --- Fetch Data ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userService.getProfile();
      const data = res.data.data;

      let formattedDate = "";
      if (data.birthday) {
        formattedDate = new Date(data.birthday).toISOString().split("T")[0];
      }

      setFormData({
        ...data,
        birthday: formattedDate,
        name: data.name || "",
        surname: data.surname || "",
        gender: data.gender || "",
        tel: data.tel || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // พิมพ์ปุ๊บ ลบ Error ทิ้งปั๊บ
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ฟังก์ชัน Validate
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.surname.trim()) {
      newErrors.surname = "Last Name is required";
      isValid = false;
    }
    if (!formData.tel.trim()) {
      newErrors.tel = "Phone Number is required";
      isValid = false;
    } else if (formData.tel.length < 9) {
      // เช็คความยาวเล่นๆ
      newErrors.tel = "Invalid phone number";
      isValid = false;
    }
    if (!formData.birthday) {
      newErrors.birthday = "Birthday is required";
      isValid = false;
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // เรียก Validate ก่อนส่ง
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return; // หยุดการทำงานถ้าไม่ผ่าน
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        surname: formData.surname,
        tel: formData.tel,
        birthday: formData.birthday,
        gender: formData.gender,
      };

      await userService.updateProfile(payload);
      toast.success("Save user data successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Save user data failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-yellow-400" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-[32px] shadow-lg border border-gray-100 font-kanit">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#594a60]">My Account</h1>
        <p className="text-[#594a60] text-lg mt-1">
          Hello{" "}
          <span className="font-bold text-black">{formData.username}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#594a60]">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="First Name"
              // เช็ค error เพื่อเปลี่ยนสีขอบ
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-700
                ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                }`}
            />
            {/* แสดงข้อความ Error */}
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#594a60]">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Last Name"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-700
                ${
                  errors.surname
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                }`}
            />
            {errors.surname && (
              <p className="text-red-500 text-xs">{errors.surname}</p>
            )}
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#594a60]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-400 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#594a60]">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              placeholder="0812345678"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-700
                ${
                  errors.tel
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                }`}
            />
            {errors.tel && <p className="text-red-500 text-xs">{errors.tel}</p>}
          </div>
        </div>

        {/* Birthday & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#594a60]">
              Birthday <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="birthday"
                value={formData.birthday || ""}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-700 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer
                  ${
                    errors.birthday
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : "border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  }`}
              />
              <Calendar
                className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${errors.birthday ? "text-red-500" : "text-yellow-500"}`}
                size={20}
              />
            </div>
            {errors.birthday && (
              <p className="text-red-500 text-xs">{errors.birthday}</p>
            )}
          </div>

          {/* Gender Radio Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#594a60] block mb-3">
              Gender <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex flex-wrap gap-6 items-center h-[50px] px-4 rounded-xl border border-transparent ${errors.gender ? "border-red-500 bg-red-50" : ""}`}
            >
              {["Male", "Female", "Non-binary"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-yellow-400 transition-all"
                    />
                    <div className="absolute w-3 h-3 bg-yellow-400 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span
                    className={`text-sm font-bold ${formData.gender === g ? "text-black" : "text-gray-500 group-hover:text-gray-700"}`}
                  >
                    {g}
                  </span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                Please select your gender
              </p>
            )}
          </div>
        </div>

        {/* Save Button (สีเหลือง) */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FFD700] text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-400 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Saving...
            </>
          ) : (
            "Save"
          )}
        </button>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => toast("รอทำหน้า Change Password.")}
            className="px-12 py-3 rounded-full border border-[#594a60] text-[#594a60] font-bold hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={() => toast.error("DELETE ACCOUNT")}
            className="px-8 py-3 rounded-full bg-[#A898B0] text-white font-bold hover:bg-[#9685A0] transition-colors w-full sm:w-auto shadow-sm"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyAccount;
