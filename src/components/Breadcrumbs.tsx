import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // แยก URL ออกเป็นชิ้นๆ (เช่น /shop/men -> ['', 'shop', 'men'])
  // filter((x) => x) คือตัดตัวว่างทิ้ง
  const pathnames = location.pathname.split("/").filter((x) => x);
  // ดัก productDetail
  // ถ้า url ขึ้นต้นด้วย shop และมีความยาว 3 ท่อน (เช่น /shop/men/123)
  const isProductDetailPage = pathnames[0] === "shop" && pathnames.length === 3;
  // ถ้าไม่มี pathnames เลย (อยู่หน้า Home) ก็ไม่ต้องแสดงอะไร
  if (pathnames.length === 0 || isProductDetailPage) {
    return null;
  }
  return (
    <nav className="text-sm font-medium text-text_secondary p-6">
      <ol className="list-none p-0 inline-flex">
        {/* === 1. ปุ่ม Home (มีเสมอ) === */}
        <li className="flex items-center">
          <Link
            to="/"
            className="hover:text-secondary transition-colors text-h3xl"
          >
            Home
          </Link>
        </li>

        {/* === 2. Loop สร้างปุ่มตาม URL === */}
        {pathnames.map((value, index) => {
          // สร้าง Link URL สะสม (เช่น รอบแรกเป็น /shop รอบสองเป็น /shop/men)
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // เช็คว่าเป็นหน้าสุดท้ายไหม? (ถ้าใช่ ให้เป็นสีเข้ม และกดไม่ได้)
          const isLast = index === pathnames.length - 1;

          // แปลงชื่อให้สวยขึ้น (เช่น product-detail -> Product Detail)
          // 1. decodeURIComponent: แก้ภาษาไทย หรืออักขระพิเศษ
          // 2. replace: เปลี่ยนขีด - เป็นช่องว่าง
          // 3. charAt(0).toUpperCase: ตัวแรกตัวใหญ่
          const name = decodeURIComponent(value).replace(/-/g, " ");
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li key={to} className="flex items-center ">
              {/* ตัวคั่น*/}
              <span className="mx-2 text-text_secondary">/</span>

              {isLast ? (
                // หน้าปัจจุบัน (สีเข้ม, กดไม่ได้)
                <span className="text-text_primary text-h3xl">
                  {formattedName}
                </span>
              ) : (
                // หน้าก่อนหน้า (กดถอยกลับได้)
                <Link
                  to={to}
                  className="hover:text-secondary transition-colors text-h3xl"
                >
                  {formattedName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
