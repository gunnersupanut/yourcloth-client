import { useParams, useSearchParams } from "react-router-dom";
import Category from "../components/Category";
import { useState, useEffect } from "react";
import DropdownFilter from "../components/ui/DropdownFilter";
import OnSaleToggle from "../components/OnSaleToggle";
import PriceSlider from "../components/PriceSlider";
import { useProduct } from "../contexts/ProductContext";
import ProductGrid from "../components/ProductGrid";
import { Loader2 } from "lucide-react"; // เพิ่มไอคอนโหลดนิดนึง

const ShopPage = () => {
  const { category } = useParams();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  // ดึงของจริงจาก Context (products, pagination, fetch)
  const { products, pagination, fetchProducts, loading } = useProduct();

  // --- State ---
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");
  const [size, setSize] = useState("All");
  const [gender, setGender] = useState("All");

  // แยก State ราคา: อันนึงไว้โชว์(ลื่นๆ) อันนึงไว้ยิง API(ตอนปล่อย)
  const [priceFilter, setPriceFilter] = useState(10000); // ค่าจริงไว้ยิง API
  const [sliderValue, setSliderValue] = useState(10000); // ค่าไว้โชว์ UI

  // --- Options ---
  const sortOptions = [
    "Newest",
    "Oldest",
    "Price: Low-High",
    "Price: High-Low",
  ];
  const sizeOptions = ["All", "S", "M", "L", "XL", "XXL"];
  const genderOptions = ["All", "Men", "Women", "Unisex"];

  // THE TRIGGER: สั่งโหลดของใหม่ เมื่อ Filter เปลี่ยน (Server-side Logic)
  useEffect(() => {
    // แปลง Sort ให้ตรงกับ Backend
    let sortParam = "newest";
    if (sortBy === "Oldest") sortParam = "oldest";
    if (sortBy === "Price: Low-High") sortParam = "price_asc";
    if (sortBy === "Price: High-Low") sortParam = "price_desc";

    fetchProducts({
      page: page,
      limit: 12,
      category: category,
      search: searchQuery || undefined,
      gender: gender === "All" ? undefined : gender,
      // size: size === "All" ? undefined : size,
      minPrice: 0,
      maxPrice: priceFilter, // ใช้ค่าที่ปล่อยเมาส์แล้ว
      sort: sortParam,
    });
  }, [
    category,
    searchQuery,
    page,
    sortBy,
    size,
    gender,
    priceFilter,
    fetchProducts,
  ]);

  // Reset หน้าเป็น 1 เมื่อเปลี่ยน Filter หลัก
  useEffect(() => {
    setPage(1);
  }, [category, sortBy, size, gender, priceFilter]);

  // --- Handlers Pagination ---
  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage((p) => p + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-kanit">
      {/*---Category List (UI เดิม) ---*/}
      <div>
        <h1 className="text-h1xl text-primary mb-12 flex items-center gap-2">
          {searchQuery ? (
            <span>
              Search results for{" "}
              <span className="text-secondary italic">"{searchQuery}"</span>
            </span>
          ) : category ? (
            category.charAt(0).toUpperCase() + category.slice(1)
          ) : (
            "Shop"
          )}
        </h1>
      </div>
      {!category && (
        <div className="mb-12">
          <h2 className="text-h2xl font-bold text-[#5B486B] mb-6">
            Categories
          </h2>
          <Category />
        </div>
      )}

      {/*---Header Sort (UI เดิม) ---*/}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="flex items-baseline gap-2">
          <p className="text-h3xl text-primary mr-2">Filter & Sort</p>
          {/* เพิ่ม text บอกจำนวนนิดนึง */}
          <span className="text-sm text-gray-400">
            ({pagination.total} items)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <DropdownFilter
            label="Sort By"
            options={sortOptions}
            selected={sortBy}
            defaultValue="Newest"
            onChange={setSortBy}
          />
        </div>
      </div>

      {/*---Filter Toolbar (UI เดิม) ---*/}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
          {/* กลุ่ม 1: Dropdown */}
          <div className="flex flex-wrap items-center gap-4">
            <DropdownFilter
              label="Size"
              options={sizeOptions}
              selected={size}
              defaultValue="All"
              onChange={setSize}
            />
            <DropdownFilter
              label="Gender"
              options={genderOptions}
              selected={gender}
              defaultValue="All"
              onChange={setGender}
            />
            <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-2"></div>{" "}
            <OnSaleToggle />
          </div>

          {/* Price Slider (แก้ Logic ให้ลื่น) */}
          <div className="w-full lg:w-auto lg:min-w-[300px] flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm font-bold text-[#5B486B]">
                Price Range
              </span>
              {/* ใช้ sliderValue (ตัวเลขลื่นๆ) ในการโชว์ */}
              <span className="text-sm text-primary font-bold">
                Max: {sliderValue.toLocaleString()}
              </span>
            </div>
            <PriceSlider
              max={10000}
              // ตอนลาก: เปลี่ยนแค่ตัวเลขโชว์
              onChange={(val) => setSliderValue(val)}
              // ตอนปล่อย: เปลี่ยนค่าจริงเพื่อยิง API
              onAfterChange={(val) => setPriceFilter(val)}
            />
          </div>
        </div>
      </div>

      {/* Product Grid Area (ใช้ products ของจริงจาก Server) */}
      <div className="mt-8 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-primary">
            <Loader2 className="animate-spin mr-2" /> Loading...
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20 text-gray-400">
            No products found.
          </div>
        )}
      </div>

      {/* Pagination (UI เดิม แต่ทำให้กดได้จริง) */}
      {products.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* เลขหน้า (ทำให้ Dynamic ตามหน้าจริง) */}
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#5B486B] text-[#5B486B] font-bold shadow-sm">
            {page}
          </span>

          {/* โชว์จำนวนหน้าทั้งหมดแบบเนียนๆ โดยใช้ class เดิม */}
          <span className="text-gray-400 text-sm">
            of {pagination.totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page >= pagination.totalPages}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
