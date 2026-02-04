import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../services/product.service";
import type { ProductDetail } from "../types/product";
import { useProduct } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

import AuthModal from "../components/AuthModal";
import arrowLeftIcon from "../assets/icons/arrow-left.png";
import arrowRightIcon from "../assets/icons/arrow-right.png";
import shareIcon from "../assets/icons/icons8-share-100 1.png";
import FeaturedSlider from "../components/FeaturedSlider";
import { cartService } from "../services/cart.service";
import { useCart } from "../contexts/CartContext";

type ProductParams = {
  category: string;
  id: string;
};

const ProductDetailPage = () => {
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const { products } = useProduct();
  const { id } = useParams<ProductParams>();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const cachedProduct = products.find((p) => p.id === Number(id));

  const [product, setProduct] = useState<ProductDetail | null>(
    cachedProduct ? ({ ...cachedProduct, variants: [] } as ProductDetail) : null,
  );

  const [loading, setLoading] = useState(!cachedProduct);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  // Logic ดึง Gallery จาก API 

  const galleryImages = useMemo(() => {
    if (!product) return [];
    
    // เริ่มต้นด้วยรูปปก 
    const images = [product.image_url];

    // ถ้ามี Gallery จาก DB ให้เอามาต่อท้าย
    if (product.gallery && product.gallery.length > 0) {
      // product.gallery เป็น array ของ object { image_url: "..." }
      const galleryUrls = product.gallery.map((g: any) => g.image_url);
      images.push(...galleryUrls);
    } 
    return images;
  }, [product]);


  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await productService.getById(id);
        setProduct(res.result);
        
        // Set รูปแรกเป็น Main Image
        if (res.result?.image_url) {
          setMainImage(res.result.image_url);
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        if (!product && !cachedProduct) {
          toast.error("Product not found.");
          navigate("/shop");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (product?.available_colors?.length) {
      const firstColorObj = product.available_colors[0];
      setSelectedColor(firstColorObj.name);
    }
  }, [product]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const currentVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color_name === selectedColor && v.size === selectedSize,
    );
  }, [product, selectedColor, selectedSize]);

  const displayPrice = currentVariant ? currentVariant.price : product?.price;

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
    if (type === "inc") setQuantity(quantity + 1);
  };

  const handleShare = () => {
    toast.success(`Share Coming Soon.`, { icon: "🔜" });
  };
  const handleSizeDetails = () => {
    toast.success(`Size Details Coming Soon.`, { icon: "🔜" });
  };

  const handleAddCart = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Please select Size and Color");
      return;
    }
    const targetVariant = product.variants.find(
      (v) => v.size === selectedSize && v.color_name === selectedColor,
    );
    if (!targetVariant) {
      toast.error("This option is unavailable");
      return;
    }
    if (targetVariant.stock <= 0) {
      toast.error("Out of Stock!");
      return;
    }
    try {
      setAddingToCart(true);
      await cartService.addToCart(targetVariant.variant_id, quantity);
      await fetchCart();
      toast.success(`Added ${quantity} item(s) to cart`);
    } catch (error: any) {
      const data = error.response?.data?.data;
      if (data) {
        toast.error(`Only ${data.availableStock} items remaining.`);
      } else {
        toast.error("Add item to cart Failed");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    const targetVariant = product.variants.find(
      (v) => v.size === selectedSize && v.color_name === selectedColor,
    );

    if (!targetVariant) {
      toast.error("This option is unavailable");
      return;
    }
    if (targetVariant.stock < quantity) {
      toast.error("Out of Stock!");
      return;
    }

    const itemsToCheckout = [
      {
        variantId: targetVariant.variant_id,
        quantity: quantity,
      },
    ];

    navigate("/checkout", {
      state: {
        selectedItems: itemsToCheckout,
      },
    });
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 pt-10 font-kanit ">
      {/*BREADCRUMB*/}
      <nav className="text-sm text-text_secondary mb-8 py-5 overflow-x-auto whitespace-nowrap">
        <ol className="list-none p-0 inline-flex items-center">
          <li className="flex items-center">
            <Link to="/" className="hover:text-secondary transition-colors text-h3xl">Home</Link>
          </li>
          <span className="mx-2 text-text_secondary">/</span>
          <li className="flex items-center">
            <Link to="/shop" className="hover:text-secondary transition-colors text-h3xl">Shop</Link>
          </li>
          <span className="mx-2 text-text_secondary">/</span>
          <li className="flex items-center">
            <Link to={`/shop/${product.category || ""}`} className="hover:text-secondary transition-colors text-h3xl capitalize">
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

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
        <div className="flex items-center">
          <p className="text-h1xl text-primary">{product.product_name}</p>
        </div>
        <div className="flex items-center">
          <p className="text-bodyxl text-text_primary">{product.description || "-"}</p>
        </div>

        {/* IMAGE GALLERY */}
        <div className="space-y-0">
          {/* รูปใหญ่ */}
          <div className="aspect-square w-[70%] mx-auto bg-gray-100 overflow-hidden shadow-custommain relative group mb-5 ">
            <img
              src={mainImage || product.image_url} // ใช้รูปที่เลือก หรือรูปปก
              alt={product.product_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* รูปเล็ก (Thumbnails) */}
          {/* ถ้ามีรูปเดียว ไม่ต้องโชว์ปุ่มเลื่อนและ Thumbnail ก็ได้ แต่ถ้าอยากโชว์ตลอดก็ลบ condition นี้ออก */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-4 relative justify-center lg:w-[90%] lg:ml-8">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <img src={arrowLeftIcon} alt="arrowLeftIcon" />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1" // เพิ่ม px-1 กันเงาขาด
              >
                {galleryImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`
                      w-20 h-20 md:w-28 md:h-28 flex-shrink-0 cursor-pointer overflow-hidden border-2 rounded-md transition-all 
                      ${mainImage === img ? "border-primary opacity-100 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"}
                    `}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`thumbnail-${index}`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <img src={arrowRightIcon} alt="arrowRightIcon" />
              </button>
            </div>
          )}

          {/* ปุ่ม Share */}
          <div className="flex justify-end text-primary ">
            <button
              className="flex items-center gap-2 px-4 py-2 shadow-custombutton border border-gray-300 rounded-full text-sm text-gray-600 hover:scale-105 transition shadow-sm mt-4"
              onClick={handleShare}
            >
              <img src={shareIcon} alt="shareIcon" className="w-[24px]" />
              Share
            </button>
          </div>
        </div>

        {/*---ด้านขวา PRODUCT DETAILS ---*/}
        <div className="flex flex-col">
          {/* ราคา */}
          <div className="text-h2xl text-text_secondary mb-12">
            {Number(displayPrice).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ฿
          </div>

          {/* Color */}
          <div className="mb-4">
            <h3 className="text-bodyxl font-medium text-gray-900 mb-6">
              Color <span className="text-primary font-bold ml-2">{selectedColor || "-"}</span>
            </h3>
            <div className="flex flex-wrap gap-5">
              {product?.available_colors?.map((color: any) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`
                      w-10 h-10 rounded-full shadow-sm border border-gray-200 transition-all duration-300 ease-in-out relative
                      ${isSelected ? "ring-2 ring-offset-2 ring-[#5B486B] scale-110" : "hover:scale-110 hover:border-gray-400"}
                    `}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  ></button>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8 mt-10">
            <div className="flex justify-center gap-12 flex-wrap">
              {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => {
                const isAvailable = product.available_sizes?.includes(size);
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      w-12 h-12 flex items-center justify-center rounded-sm text-sm font-bold border-transparent transition-all duration-300 shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)]
                      ${!isAvailable 
                        ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed decoration-slice line-through" 
                        : isSelected 
                          ? "bg-secondary text-text_inverse shadow-md" 
                          : "bg-tertiary text-primary hover:scale-110 hover:text-text_inverse"
                      }
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <div className="text-right mt-14 w-full flex justify-end">
              <button
                className="text-xs text-primary underline hover:text-text_primary"
                onClick={handleSizeDetails}
              >
                Size details
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-14 flex justify-center">
            <div className="inline-flex items-center bg-white rounded-full shadow-custombutton px-4 py-2 gap-6">
              <button
                onClick={() => handleQuantity("dec")}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 transition active:scale-95"
              >
                <span className="text-xl font-light pb-1">−</span>
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

          {/* Buttons */}
          <div className="space-y-4 w-full max-w-md mx-auto flex flex-col justify-center">
            <button
              disabled={addingToCart}
              className={`w-full font-bold py-3.5 rounded-full shadow-md transition transform active:scale-[0.98] hover:scale-105 ${
                addingToCart ? "bg-quaternary text-white" : "bg-yellow-400 text-white"
              }`}
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

      {/* Recommend */}
      <div className="mt-24 border-t pt-10">
        <h2 className="text-h2xl text-gray-700 mb-8">
          <span className="text-primary">Recommend</span>
        </h2>
        <div className="w-full">
          <FeaturedSlider currentProductId={product.id} />
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default ProductDetailPage;