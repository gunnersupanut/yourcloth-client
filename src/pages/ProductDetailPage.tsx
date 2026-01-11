import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../services/product.service";
import type { Product } from "../types/product";
import { useProduct } from "../contexts/ProductContext";
import toast from "react-hot-toast";

import arrowLeftIcon from "../assets/icons/arrow-left.png";
import arrowRightIcon from "../assets/icons/arrow-right.png";
import shareIcon from "../assets/icons/icons8-share-100 1.png";
import FeaturedSlider from "../components/FeaturedSlider";

// 🖼️ รูปภาพจำลอง (เอาไว้ทำ Gallery สวยๆ กรณีสินค้ามีรูปเดียว)
const MOCK_GALLERY = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
];

type ProductParams = {
  category: string;
  id: string;
};

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { products } = useProduct();
  const { id } = useParams<ProductParams>();

  // หาของใน Context ก่อน (Cache)
  const cachedProduct = products.find((p) => p.id === Number(id));

  // State ข้อมูลสินค้า
  const [product, setProduct] = useState<Product | null>(cachedProduct || null);
  const [loading, setLoading] = useState(!cachedProduct);
  //  Render Guard Clauses
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product)
    return <div className="p-10 text-center">Product not found</div>;

  // State สำหรับ UI
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  // useEffect Fetch Data ---
  useEffect(() => {
    // เลื่อนขึ้นบนสุดเสมอ
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await productService.getById(id);
        setProduct(res.result);
        // พอได้ของมา set รูปหลัก (ถ้ามีรูปจาก DB ให้ใช้รูป DB ก่อน)
        if (res.result?.image_url) {
          setMainImage(res.result.image_url);
        } else {
          setMainImage(MOCK_GALLERY[0]);
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);

        // Logic เดิม: ถ้าไม่มีของโชว์เลย ค่อยดีดออก
        if (!product && !cachedProduct) {
          toast.error("Product not found.");
          navigate("/shop");
        } else {
          toast.error("Could not refresh latest data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // useEffect: ให้เลือกสีแรก
  useEffect(() => {
    // เช็คว่ามีข้อมูลสีมาไหม
    if (product?.available_colors_name?.length) {
      setSelectedColor(product.available_colors_name[0]);
    }
  }, [product]);

  // ฟังก์ชั่นเลื่อนรูป

  const scrollRef = useRef<HTMLDivElement>(null);
  // ฟังก์ชันสั่งเลื่อน
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200; // ระยะที่จะเลื่อนต่อการกด 1 ครั้ง (ปรับได้)

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };
  // รวมรายการรูปภาพ (เอารูปจริง + รูป Mock มาต่อกันให้ดูเยอะๆ)
  const galleryImages = product.image_url
    ? [product.image_url, ...MOCK_GALLERY]
    : MOCK_GALLERY;

  // ฟังก์ชันปรับจำนวน
  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
    if (type === "inc") setQuantity(quantity + 1);
  };

  // ฟังก์ชั่นปุ่มต่างๆ
  const handleShare = () => {
    toast.success(`Share Coming Soon.`, {
      icon: "🔜",
    });
  };
  const handleSizeDetails = () => {
    toast.success(`Size Details Coming Soon.`, {
      icon: "🔜",
    });
  };
  const handleAddCart = () => {
    try {
      const payload = { id: product.id, quantity, selectedColor, selectedSize };
      console.log("payload:", payload);
    } catch (error) {}
    toast.success(`Added ${quantity} item(s) to cart Coming Soon.`, {
      icon: "🔜",
    });
  };
  const handleBuy = () => {
    try {
    } catch (error) {}
    toast.success(`Buy ${quantity} item(s) Coming Soon.`, {
      icon: "🔜",
    });
  };
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 pt-10 font-kanit">
      {/*BREADCRUMB*/}
      <nav className="text-sm font-medium text-text_secondary mb-8">
        <ol className="list-none p-0 inline-flex items-center">
          <li className="flex items-center">
            <Link
              to="/"
              className="hover:text-secondary transition-colors text-h3xl"
            >
              Home
            </Link>
          </li>
          <span className="mx-2 text-text_secondary">/</span>
          <li className="flex items-center">
            <Link
              to="/shop"
              className="hover:text-secondary transition-colors text-h3xl"
            >
              Shop
            </Link>
          </li>
          <span className="mx-2 text-text_secondary">/</span>
          <li className="flex items-center">
            <Link
              to={`/shop/${product.category || ""}`}
              className="hover:text-secondary transition-colors text-h3xl capitalize"
            >
              {product.category || "Category"}
            </Link>
          </li>
          <span className="mx-2 text-text_secondary">/</span>
          <li className="flex items-center">
            <span className="text-text_primary text-h3xl font-semibold truncate md:whitespace-normal">
              {product.product_name}
            </span>
          </li>
        </ol>
      </nav>
      {/* Product Name */}

      {/*  MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
        <div className="flex items-center">
          {" "}
          <p className="text-h1xl text-primary">
            {product.product_name || "Product Detail"}
          </p>
        </div>
        <div className="flex items-center">
          {" "}
          <p className="text-bodyxl text-text_primary">
            {product.description || "-"}
          </p>
        </div>

        {/* IMAGE GALLERY */}
        <div className="space-y-0">
          {/* รูปใหญ่ */}
          <div className="aspect-square w-[70%] mx-auto bg-gray-100 overflow-hidden shadow-custommain relative group mb-5">
            <img
              src={mainImage || product.image_url || MOCK_GALLERY[0]}
              alt={product.product_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* รูปเล็ก */}
          <div className="flex items-center gap-4 relative justify-center lg:w-[90%] lg:ml-8">
            {/* ปุ่มเลื่อนซ้าย */}
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <img src={arrowLeftIcon} alt="arrowLeftIcon" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar py-2"
            >
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`w-28 h-28 flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all ${
                    mainImage === img
                      ? "border-primary opacity-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </div>
              ))}
            </div>

            {/* ปุ่มเลื่อนขวา */}
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <img src={arrowRightIcon} alt="arrowRightIcon" />
            </button>
          </div>

          {/* ปุ่ม Share */}
          <div className="flex justify-end text-primary ">
            <button
              className="flex items-center gap-2 px-4 py-2 shadow-custombutton border border-gray-300 rounded-full text-sm text-gray-600 hover:scale-105 transition shadow-sm mt-4"
              onClick={handleShare}
            >
              {/* ใช้ Text แทน Icon */}
              <img src={shareIcon} alt="shareIcon" className="w-[24px]" />
              Share
            </button>
          </div>
        </div>

        {/*---ด้านขวา PRODUCT DETAILS */}
        <div className="flex flex-col">
          {/* ราคา */}
          <div className="text-h2xl text-text_secondary mb-12">
            {Number(product.price).toLocaleString()} ฿
          </div>
          {/*---สี*/}
          <div className="mb-4">
            <h3 className="text-bodyxl font-medium text-gray-900 mb-6">
              Color
              <span className="text-primary font-bold ml-2">
                {selectedColor || "-"}
              </span>
            </h3>
            <div className="flex flex-wrap gap-5">
              {/* Loop จาก "ชื่อสี" (Name) เป็นหลัก */}
              {product?.available_colors_name?.map(
                (colorName: string, index: number) => {
                  // ดึงโค้ดสีออกมาโดยใช้ index เดียวกัน
                  // ถ้า Code ไม่มี หรือ หลุด ให้ใช้สีเทา (#ccc)
                  const colorCode =
                    product.available_colors_code?.[index] || "#cccccc";

                  const isSelected = selectedColor === colorName;

                  return (
                    <button
                      key={colorName} // ใช้ชื่อสีเป็น key
                      onClick={() => setSelectedColor(colorName)}
                      className={`
                 w-10 h-10 rounded-full shadow-sm border border-gray-200 
                 transition-all duration-300 ease-in-out relative
                 
                 ${
                   isSelected
                     ? "ring-2 ring-offset-2 ring-[#5B486B] scale-110"
                     : "hover:scale-110 hover:border-gray-400"
                 }
               `}
                      style={{ backgroundColor: colorCode }}
                      title={colorName} // เอาเมาส์ชี้แล้วขึ้นชื่อสี
                    ></button>
                  );
                }
              )}
            </div>
          </div>
          {/* เลือกไซส์ */}
          <div className="mb-8 mt-10">
            <div className="flex justify-center gap-12 flex-wrap">
              {/* ใช้ available_sizes จาก API */}
              {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => {
                // เช็คว่าสินค้านี้ มีไซส์นี้ไหม?
                const isAvailable = product.available_sizes?.includes(size);

                // เช็คว่าไซส์นี้ถูกเลือกอยู่ไหม?
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`
            w-12 h-12 flex items-center justify-center rounded-sm text-sm font-bold border-transparent transition-all duration-300 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)]
            
            ${
              !isAvailable // ไม่มีของ: เทาๆ + ขีดฆ่า
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed decoration-slice line-through"
                : isSelected
                ? //เลือกอยู่
                  "bg-secondary text-text_inverse shadow-md"
                : // มีของ (ยังไม่เลือก)
                  "bg-tertiary text-primary  hover:scale-110 hover:text-text_inverse"
            }
          `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {/*---ลิงก์ตารางไซส์ */}
            <div className="text-right mt-14 w-full flex justify-end">
              <button
                className="text-xs text-primary underline hover:text-text_primary"
                onClick={handleSizeDetails}
              >
                Size details
              </button>
            </div>
          </div>
          {/* เลือกจำนวน */}
          <div className="mb-14 flex justify-center">
            <div className="inline-flex items-center bg-white rounded-full shadow-custombutton px-4 py-2 gap-6">
              <button
                onClick={() => handleQuantity("dec")}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 transition active:scale-95"
              >
                <span className="text-xl font-light pb-1">−</span>{" "}
              </button>

              <div className="px-8 py-2 flex items-center justify-center rounded-full border border-gray-800 font-medium text-lg text-gray-900 min-w-[4rem]">
                {quantity}
              </div>
              <button
                onClick={() => handleQuantity("inc")}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 transition active:scale-95"
              >
                <span className="text-xl font-light pb-1">+</span>
              </button>
            </div>
          </div>

          {/* ปุ่ม Action */}
          <div className="space-y-4 w-full max-w-md mx-auto flex flex-col justify-center">
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3.5 rounded-full shadow-md transition transform active:scale-[0.98]"
              onClick={handleAddCart}
            >
              Add to Cart
            </button>

            <button
              className="w-full bg-white border-2 border-purple-900 text-purple-900 font-bold py-3.5 rounded-full hover:bg-purple-50 transition transform active:scale-[0.98]"
              onClick={handleBuy}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* --- ส่วน Recommend  */}
      <div className="mt-24 border-t pt-10">
        <h2 className="text-h2xl text-gray-700 mb-8">
          <span className="text-primary">Recommend</span>
        </h2>
        <div className="w-full">
          <FeaturedSlider currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
