import { Link, useLocation, useSearchParams } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  
  // ดึง Search Param ออกมา
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const pathnames = location.pathname.split("/").filter((x) => x);

  // ดัก productDetail (เหมือนเดิม)
  const isProductDetailPage = pathnames[0] === "shop" && pathnames.length === 3;

  if (pathnames.length === 0 || isProductDetailPage) {
    return null;
  }

  return (
    <nav className="text-sm font-medium text-text_secondary p-6">
      <ol className="list-none p-0 inline-flex flex-wrap items-center"> 
        
        {/* === ปุ่ม Home === */}
        <li className="flex items-center">
          <Link
            to="/"
            className="hover:text-secondary transition-colors text-h3xl"
          >
            Home
          </Link>
        </li>

        {/* === Loop สร้างปุ่มตาม URL === */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // เช็คว่าเป็นตัวสุดท้ายจริงๆ หรือไม่?
          // ถ้าเป็นตัวสุดท้ายของ Path แต่ 'มี Search ต่อท้าย' -> ถือว่ายังไม่จบ (ต้องเป็น Link)
          // ถ้าเป็นตัวสุดท้าย และ 'ไม่มี Search' -> จบจริง (เป็น Text ธรรมดา)
          const isLastPath = index === pathnames.length - 1;
          const isActive = isLastPath && !searchQuery; // ถ้ามี search, ตัวนี้จะไม่ Active

          const name = decodeURIComponent(value).replace(/-/g, " ");
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li key={to} className="flex items-center">
              <span className="mx-1 md:mx-2 text-text_secondary text-xl">
                /
              </span>

              {isActive ? (
                // หน้าปัจจุบัน (ไม่มี Search)
                <span className="text-text_primary font-bold text-h3xl truncate max-w-[150px] md:max-w-none">
                  {formattedName}
                </span>
              ) : (
                // หน้าก่อนหน้า (หรือหน้าปัจจุบันที่มี Search ต่อท้าย)
                <Link
                  to={to}
                  className="hover:text-secondary transition-colors text-text_secondary text-h3xl"
                >
                  {formattedName}
                </Link>
              )}
            </li>
          );
        })}

        {/* === ส่วนงอก Search (ถ้ามี) === */}
        {searchQuery && (
          <li className="flex items-center">
             <span className="mx-1 md:mx-2 text-text_secondary text-sm md:text-xl">
                /
             </span>
             <span className="text-text_primary font-bold text-sm md:text-h3xl truncate max-w-[200px] md:max-w-none">
                Search: "{searchQuery}"
             </span>
          </li>
        )}

      </ol>
    </nav>
  );
};

export default Breadcrumbs;