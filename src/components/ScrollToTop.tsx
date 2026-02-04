import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // เมื่อ pathname เปลี่ยน (เปลี่ยนหน้า) ให้ดีดไปบนสุดทันที
    if (pathname === "/shop") return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // ใช้ instant ให้มันวาร์ปไปเลย ไม่ต้องเลื่อน smooth (มันจะดูช้า)
    });
  }, [pathname]);

  return null; // ไม่ต้อง Render อะไร
};

export default ScrollToTop;
