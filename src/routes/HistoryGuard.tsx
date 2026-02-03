import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"; // ใช้ Outlet แทน children
import { userService } from "../services/userService";
import { Loader2 } from "lucide-react";
import ProfileGuardModal from "../components/ProfileGuardModal";

const HistoryGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const res = await userService.getProfile();
      const user = res.data.data;

      //  เช็คความครบ (ชื่อ, นามสกุล, เบอร์, วันเกิด, เพศ)
      if (
        user.name &&
        user.surname &&
        user.tel &&
        user.birthday &&
        user.gender
      ) {
        setIsProfileComplete(true);
      } else {
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error("Check Profile Error", error);
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" size={40} />
      </div>
    );
  }

  //  ถ้าไม่ครบ -> โชว์ Modal (บังคับหน้าเดิมไว้ ไม่ให้ไปต่อ)
  if (!isProfileComplete) {
    return (
      <>
        <ProfileGuardModal isOpen={true} />
        {/* ซ่อน Content ข้างหลัง หรือจะโชว์ลางๆ ก็ได้ แต่ปกติตัดจบเลยปลอดภัยกว่า */}
      </>
    );
  }

  // ถ้าครบ -> ปล่อยผ่านไปหา CheckoutPage
  return <Outlet />;
};

export default HistoryGuard;
