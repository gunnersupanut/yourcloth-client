import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, Info, Ticket } from "lucide-react"; // ไอคอน
import type { CartItem } from "../types/cartTypes";
import { useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
const CartPage = () => {
  const navigate = useNavigate();

  const { cartItems, fetchCart } = useCart();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // ---ฟังก์ชั่น
  // ฟังก์ชันเลือกของ (Checkbox)
  const toggleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // ฟังก์ชันเลือกทั้งหมด
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.cart_item_id));
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: number,
    currentQty: number,
    delta: number,
    stockQty: number
  ) => {
    const newQty = currentQty + delta;

    // Guard 1: ห้ามต่ำกว่า 1 (ถ้าจะลบต้องกดถังขยะ)
    if (newQty < 1) return;

    // Guard 2: (Optional) เช็ค Stock เบื้องต้นในมือ (Frontend Check)
    // แต่ตัวตัดสินจริงๆ คือ Backend นะ อันนี้แค่กัน User กดเล่น
    const item = cartItems.find((i) => i.cart_item_id === cartItemId);
    if (item && newQty > item.stock_quantity) {
      toast.error(`ของเหลือแค่ ${item.stock_quantity} ชิ้นครับวัยรุ่น!`);
      return;
    }

    try {
      // await cartService.updateQuantity(cartItemId, newQty);

      // ✅ ถ้าผ่าน -> สั่ง Context โหลดตะกร้าใหม่ทันที (ตัวเลขจะเปลี่ยนเองตาม DB)
      await fetchCart();
    } catch (error: any) {
      // ถ้าหลังบ้านด่ากลับมา (เช่น ของหมดพอดี)
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "อัปเดตจำนวนไม่ได้!");

      // แนะนำ: โหลดตะกร้าใหม่ด้วย เผื่อข้อมูลหน้าเว็บมันไม่อัปเดต
      await fetchCart();
    }
  };

  const removeItem = async (id: number) => {
    try {
      // 1. ยิง API ลบ
      // await cartService.removeItem(id);
      console.log(`Delete item ${id}`);

      // 2. สั่งโหลดใหม่
      await fetchCart();

      // 3. เคลียร์ออกจาก Selected (ถ้าเลือกไว้อยู่)
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error("Remove failed", error);
    }
  };

  // คำนวณเงิน (Subtotal)
  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cart_item_id))
      .reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  };

  const subtotal = calculateTotal();
  const discount = 0; // เดี๋ยวค่อยทำ Logic ส่วนลด
  const totalNet = subtotal - discount;

  return (
    <div className="min-h-screen font-kanit">
      {/* Container หลัก */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}

        <h1 className="text-h1xl font-bold text-primary mb-8">Cart</h1>

        {/* --- Cart Item List --- */}
        <div className="space-y-6 sm:space-y-8">
          {cartItems.map((item) => (
            <div
              key={item.cart_item_id}
              className="flex flex-row items-start gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-gray-200"
            >
              {/* Checkbox + Image (โซนซ้าย) */}
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.cart_item_id)}
                  onChange={() => toggleSelect(item.cart_item_id)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 cursor-pointer"
                />

                {/*Image*/}
                <div className="w-20 h-20 sm:w-60 sm:h-60 flex-shrink-0 bg-gray-100 ">
                  <Link to={`/shop/${item.category}/${item.product_id}`}>
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-full h-full object-cover object-center hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </Link>
                </div>
              </div>

              {/* Details (โซนขวา) */}
              <div className="flex-1 flex flex-col justify-between min-h-[80px] sm:min-h-[240px]">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-h2xl text-primary font-bold line-clamp-1 sm:line-clamp-none">
                      {item.product_name}
                    </h3>
                    <p className="text-sm sm:text-h2xl text-text_secondary mt-0.5 sm:mt-1 font-medium">
                      {Number(item.price).toLocaleString()}฿
                    </p>
                  </div>

                  {/* ปุ่มลบ */}
                  <button
                    onClick={() => removeItem(item.cart_item_id)}
                    className="text-secondary hover:text-red-500 transition-colors p-1 sm:p-2 -mr-2 sm:mr-0"
                  >
                    <Trash2 size={18} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Color / Size */}
                <div className="mt-1 sm:mt-2 flex items-center gap-3">
                  <span className="sm:text-h3xl text-tertiary bg-gray-100 px-2 py-0.5 rounded text-sm">
                    {item.size}
                  </span>
                  <span className="text-xs sm:text-h3xl text-black">
                    {item.color}
                  </span>
                </div>
                <p className="hidden sm:block text-bodyxl text-text_primary mt-2 line-clamp-2">
                  {item.description}
                </p>

                {/* Quantity Selector */}
                <div className="mt-auto pt-2 flex justify-start">
                  <div className="inline-flex items-center bg-white rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.1)] px-3 py-1 sm:px-5 sm:py-2 gap-2 sm:gap-3 border border-gray-100 sm:border-none scale-90 origin-left sm:scale-100">
                    {/* ปุ่มลบ */}
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.cart_item_id,
                          item.quantity,
                          -1,
                          item.stock_quantity
                        )
                      }
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 transition-colors"
                    >
                      <Minus
                        size={12}
                        className="sm:w-[14px]"
                        strokeWidth={2}
                      />
                    </button>

                    {/* ตัวเลข */}
                    <div className="min-w-[30px] sm:min-w-[50px] h-6 sm:h-8 flex items-center justify-center rounded-full border border-black px-2">
                      <span className="text-sm sm:text-bodyxl text-primary font-medium">
                        {item.quantity}
                      </span>
                    </div>

                    {/* ปุ่มบวก */}
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.cart_item_id,
                          item.quantity,
                          1,
                          item.stock_quantity
                        )
                      }
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={12} className="sm:w-[14px]" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่มกลับไปเลือกของเพิ่ม */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/shop"
            className="w-full max-w-md text-center border-2 text-button border-primary text-primary py-6 rounded-[25px] hover:scale-105 transition-all duration-300"
          >
            Select Additional Products
          </Link>
        </div>
      </div>

      {/* --- Bottom--- */}
      <div className="fixed bottom-0 w-full z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        {/*  Discount */}
        <div className="w-full bg-primary py-3 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center gap-8">
            <button className="text-secondary flex gap-2 items-center underline text-body hover:text-white transition-colors">
              <Info size={14} /> Details
            </button>
            <button className="bg-white flex gap-2 items-center border border-transparent px-4 py-1.5 rounded text-button text-primary underline hover:bg-gray-100 transition-colors">
              <Ticket size={16} /> Add Coupon
            </button>
          </div>
        </div>

        {/*Total & Button*/}
        <div className="w-full bg-tertiary py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* ฝั่งซ้าย: Select All / Delete */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={
                    cartItems.length > 0 &&
                    selectedItems.length === cartItems.length
                  }
                  onChange={toggleSelectAll}
                  className="w-5 h-5 rounded border-gray-600 cursor-pointer"
                />
                <span className="text-primary font-medium group-hover:text-black">
                  Select all
                </span>
              </label>
              <button className="text-primary hover:text-red-600 underline text-sm font-medium">
                Delete all items
              </button>
            </div>

            {/* ฝั่งขวา: Price Summary & Button */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto justify-end">
              <div className="flex flex-col items-baseline gap-4 text-primary text-h3xl ">
                {/* ราคารวม */}
                <div className="w-full flex justify-end items-center">
                  Total Net{" "}
                  <span className="text-h2xl text-secondary ml-2">
                    ฿{totalNet.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                  <div className="flex gap-6">
                    Subtotal{" "}
                    <span className="text-text_primary">
                      ฿{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-6">
                    Discount{" "}
                    <span className=" text-white">
                      ฿{discount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/checkout", { state: { selectedItems } })
                }
                disabled={selectedItems.length === 0}
                className="bg-secondary text-text_inverse text-h3xl px-10 py-5 rounded-[25px] hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all shadow-custombutton w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Order Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
