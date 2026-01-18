import { useParams } from "react-router-dom";
import Category from "../components/Category";
import { useState } from "react";
import DropdownFilter from "../components/ui/DropdownFilter";
import OnSaleToggle from "../components/OnSaleToggle";
import PriceSlider from "../components/PriceSlider";
import { useProduct } from "../contexts/ProductContext";
import ProductGrid from "../components/ProductGrid";
const ShopPage = () => {
  // ดึงค่า category มาจาก URL
  // ถ้าเข้า /shop -> category จะเป็น undefined
  // ถ้าเข้า /shop/men -> category จะเป็น "men"
  // const [searchParams] = useSearchParams();
  // // แกะคำว่า "search" ออกมา
  // const keyword = searchParams.get("search");
  const { category } = useParams();

  const { products } = useProduct();
  // State เก็บค่า dropdown แต่ละอัน
  const [sortBy, setSortBy] = useState("Newest");
  const [size, setSize] = useState("All");
  const [gender, setGender] = useState("All");
  // state สำหรับตัวกรอง
  const [priceFilter, setPriceFilter] = useState(5000);
  // ข้อมูลตัวเลือก
  const sortOptions = [
    "Newest",
    "Oldest",
    "Price: Low-High",
    "Price: High-Low",
  ];
  const sizeOptions = ["All", "S", "M", "L", "XL", "XXL"];
  const genderOptions = ["All", "Men", "Women", "Unisex"];
  // ฟังก์ชันโหลดสินค้า (สมมติ)
  const fetchProducts = (price: number) => {
    // ยิง API หรือ Filter สินค้าตรงนี้
    console.log("กำลังโหลดสินค้าที่ราคาไม่เกิน:", price, priceFilter);
  };
  // ฟังก์ชั่น กรองสินค้า
  const filteredProducts = products.filter((product) => {
    console.log("Category", category);
    // กรอง category
    if (category && product.category !== category) return false;
    // กรอง Size
    // ถ้าไม่ได้เลือก All และ ในสินค้าชิ้นนี้ 'ไม่มี' ไซส์ที่เลือก
    if (size !== "All" && !product.available_sizes?.includes(size))
      return false;

    // กรอง Gender
    // ถ้า
    if (gender !== "All" && product.gender !== gender) return false;

    // กรอง Price ถ้าสินค้าราคาแพงกว่าไม่เอา
    if (product.price > priceFilter) return false;

    return true;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // ราคาต่ำ -> สูง
    if (sortBy === "Price: Low-High") {
      return a.price - b.price;
    }

    // ราคาสูง -> ต่ำ
    if (sortBy === "Price: High-Low") {
      return b.price - a.price;
    }

    if (sortBy === "Oldest") {
      return a.id - b.id;
    }
    // กรณี: มาใหม่ล่าสุด (Newest)
    // ID ยิ่งเยอะ ยิ่งใหม่
    return b.id - a.id;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-kanit">
      {/*---Category List */}
      <div>
        <h1 className="text-h1xl text-primary mb-12">
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "Shop"}
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

      {/*---Header Sort*/}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <p className="text-h3xl text-primary mr-2">Filter & Sort</p>
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

      {/*---Filter Toolbar*/}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
          {/* กลุ่ม 1: ตัวเลือก Dropdown + Toggle */}
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

          {/*Price Slider*/}
          <div className="w-full lg:w-auto lg:min-w-[300px] flex flex-col gap-2">
            <span className="text-sm font-bold text-[#5B486B]">
              Price Range
            </span>
            <PriceSlider
              max={10000}
              onChange={(val) => setPriceFilter(val)}
              onAfterChange={(val) => fetchProducts(val)}
            />
          </div>
        </div>
      </div>

      {/* Product Grid Area*/}
      <div className="mt-8">
        {/* ส่งรายการที่กรองแล้ว ไปให้ Grid แสดงผล */}
        <ProductGrid products={sortedProducts} />
      </div>
      {/* Pagination Dummy */}
      <div className="flex justify-center items-center gap-4 mt-12 mb-8">
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 disabled:opacity-50"
          disabled
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

        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#5B486B] text-[#5B486B] font-bold shadow-sm">
          1
        </span>
        <span className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 cursor-not-allowed">
          2
        </span>
        <span className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 cursor-not-allowed">
          3
        </span>

        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-not-allowed">
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
    </div>
  );
};

export default ShopPage;
