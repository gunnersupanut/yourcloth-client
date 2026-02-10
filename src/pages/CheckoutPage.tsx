import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../services/product.service";
import PageLoading from "../components/ui/PageLoading";
import AddressSelectionModal from "../components/AddressSelectionModal";
import type { CheckoutItem, CheckoutUIState } from "../types/checkoutTypes";
import type { Address } from "../types/addressTypes";
import { addressService } from "../services/addressService";
import AddNewAddressModal from "../components/AddNewAddressModal";
import { useCart } from "../contexts/CartContext";
import type { CreateOrderPayload } from "../types/orderTypes";
import { orderService } from "../services/orderService";

const CheckoutPage = () => {
  const { fetchCart, selectedCartItemIds, setSelectedCartItemIds } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  // รับ ID มาจากหน้า Cart/จ่ายเงิน
  const selectedItemsRaw = location.state?.selectedItems || [];
  // State
  const [uiState, setUiState] = useState<CheckoutUIState>({
    isAddAddressModalOpen: false,
    isAddressModalOpen: false,
    shippingMethod: "standard",
    paymentMethod: "bank",
    selectedAddressId: 0,
    editingAddress: null,
  });
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [confirm, setConfirm] = useState(false);
  const [loadingAddr, setLoadingAddr] = useState(false);

  const defaultAddress =
    addresses.find((addr) => addr.id === uiState.selectedAddressId) ||
    addresses.find((i) => i.is_default) ||
    addresses[0];
  // Helper Function เอาไว้เปลี่ยนค่า
  // รับ key ที่จะแก้ และ value ใหม่
  const updateUi = (key: keyof CheckoutUIState, value: any) => {
    setUiState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (selectedItemsRaw.length === 0) {
      navigate("/cart"); // ถ้าไม่มีของ ส่งกลับไปตะกร้า
      return;
    }
    const fetchLatestPrices = async () => {
      try {
        setIsLoading(true);
        const variantIds = selectedItemsRaw.map((i: any) => i.variantId);
        // ดึงเอาข้อมูลราคาล่าสุด
        const serverData = await productService.validateCheckout(variantIds);
        const mergedItems = selectedItemsRaw
          .map((cartItem: any) => {
            // เอาของใหม่มารวมกับจำนวนที่ User เลือก
            // หาคู่ของมันจากข้อมูล Server
            const freshItem = serverData.find(
              (p: any) => p.id === cartItem.variantId,
            );

            // ถ้าไม่เจอ (Backend อาจจะลบไปแล้ว) ก็ข้ามไป
            if (!freshItem) return null;

            return {
              ...freshItem, // เอาชื่อ, ราคา, รูป, สต็อก ล่าสุด
              quantity: cartItem.quantity, // เอาจำนวนที่ User เลือกกลับมาใส่!
              // คำนวณราคารวมต่อชิ้น
              lineTotal: freshItem.price * cartItem.quantity,
            };
          })
          .filter(Boolean);

        //set ตัวที่สมบูรณ์แล้ว
        setCheckoutItems(mergedItems);
        console.log("Server", serverData);
        console.log("selectedItemRaw", selectedItemsRaw);
      } catch (error) {
        console.error(error);
        toast.error("Fail to loading products");
        navigate("/cart");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestPrices();
  }, [selectedItemsRaw, navigate]);

  useEffect(() => {
    fetchAddresses();
  }, []);
  // FetchAddresses
  const fetchAddresses = async () => {
    try {
      setLoadingAddr(true);
      const myAddresses = await addressService.getMyAddresses();
      setAddresses(myAddresses);
      // Auto Select ถ้ายังไม่ได้เลือกที่อยู่ ให้เลือกตัวแรกอัตโนมัติ (Default)
      if (!uiState.selectedAddressId && myAddresses.length > 0) {
        updateUi("selectedAddressId", myAddresses[0].id);
      }
    } catch (error) {
      console.error("Failed to load addresses");
    } finally {
      setLoadingAddr(false);
    }
  };
  const handleManageAddress = (addr?: Address) => {
    setUiState((prev) => ({
      ...prev,
      isAddAddressModalOpen: true,
      editingAddress: addr || null, //  ถ้ามีของส่งมา = Edit, ถ้าไม่มี = null (Create)
    }));
  };
  const handleAddOrEditAddress = async (formData: any) => {
    if (uiState.editingAddress) {
      try {
        // เรียก Service สร้างที่อยู่
        await addressService.updateAddress(uiState.editingAddress.id, formData);

        toast.success("Address updated successfully.");

        //  โหลดข้อมูลที่อยู่ใหม่ทันที เพื่อให้มันโผล่ขึ้นมาให้เลือก
        fetchAddresses();

        // (Optional) ถ้าอยากให้เลือกตัวใหม่ทันทีเลยก็ทำได้
        // updateUi("selectedAddressId", newAddress.id);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update address.");
      }
    } else {
      try {
        // เรียก Service สร้างที่อยู่
        await addressService.createAddress(formData);

        toast.success("Address added successfully!");

        //  โหลดข้อมูลที่อยู่ใหม่ทันที เพื่อให้มันโผล่ขึ้นมาให้เลือก
        fetchAddresses();

        // (Optional) ถ้าอยากให้เลือกตัวใหม่ทันทีเลยก็ทำได้
        // updateUi("selectedAddressId", newAddress.id);
      } catch (error) {
        console.error(error);
        toast.error("Failed to add address");
      }
    }
  };
  // คำนวณเงิน
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = 50;
  const discount = 0;
  const totalNet = subtotal + shippingCost - discount;

  // ฟังก์ชันสั่งซื้อ
  const handlePlaceOrder = async () => {
    if (!uiState.selectedAddressId) {
      toast.error("Please Select Address.");
      return;
    }
    if (checkoutItems.length === 0) {
      toast.error("You don't have checkout items.");
      return;
    }
    try {
      setConfirm(true);
      console.log("checkoutItems", checkoutItems);
      // เตรียม Payload 
      const payload: CreateOrderPayload = {
        addressId: uiState.selectedAddressId,
        items: checkoutItems.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
        })),
        cartItemIds: selectedCartItemIds, // ส่งรายการ ID เพื่อลบจากตะกร้า
        // กำหนดค่าเริ่มต้น (Default)
        paymentMethod: "BANK_TRANSFER",
        shippingMethod: "STANDARD",
        shippingCost: 50,
      };

      const res = await orderService.createOrder(payload);
      const newOrderId = res.data.orderId;
      toast.success(`Order completed.`);
      // รออัปเดตตะกร้าให้เสร็จก่อน
      await fetchCart();
      // ล้างของที่เลือกทิ้ง
      setSelectedCartItemIds([]);
      // ย้านไปหน้า order Detail พร้อมเปิด modal จ่ายเงิน
      navigate(`/setting/orders/${newOrderId}`, {
        state: { openPayModal: true },
        replace: true,
      });
    } catch (error: any) {
      console.error("Order Error:", error);

      toast.error(error.message || "Something went wrong.");
    } finally {
      setConfirm(false);
    }
  };

  // const handleChooseDiscount = () => {
  //   console.log(" User Clicked: Choose Discount");
  //   toast("Feature 'Coupons' coming soon!", { icon: "🎟️" });
  // };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl font-kanit">
      {(isLoading || loadingAddr) && <PageLoading />}
      <h1 className="text-h1xl text-primary mb-5">Place An Order</h1>

      {/* Order checkoutItems */}
      <div className="mb-8">
        <h2 className="text-h2xl text-primary mb-4">Order</h2>
        {checkoutItems.map((item, index) => (
          <div
            key={index}
            className="flex gap-6 border-b border-gray-200 pb-6 mb-6"
          >
            <div className="w-20 h-20 sm:w-64 sm:h-64 bg-gray-100 shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-h2xl  text-[#6B4B6E] mb-2">{item.name}</h3>
              <p className="text-gray-400 text-h2xl mb-4 decoration-line-through decoration-gray-300">
                {item.price}฿
              </p>
              <div className="flex checkoutItems-center gap-4 mb-2">
                <span className="text-tertiary text-h2xl">{item.size}</span>
                <span className="text-h2xl">{item.color}</span>
              </div>
              <p className="text-body mb-6 w-3/4">{item.description}</p>
              <div className="flex checkoutItems-center gap-4 text-h3xl">
                <span className="">Amount</span>
                <span className="text-primary">{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-gray-800 mb-8" />

      {/* Zone Header: Address & Options (Full Width Background) */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 bg-[#A795AD] pt-10 pb-16 mb-[-60px]">
        <div className="container mx-auto px-4 md:px-8">
          {/* 🔥 Grid แบ่ง 2 ฝั่ง: ซ้าย (Address) | ขวา (Options) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
            {/* 🏠 Left Side: Shipping Address */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-4 text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-bold text-lg">Shipping address</span>
              </div>

              {defaultAddress ? (
                // ใช้ flex-col บนมือถือ, flex-row บนจอ sm ขึ้นไป
                <div className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-lg min-h-[140px] relative group border border-gray-100 transition-all hover:shadow-xl">
                  {/* ฝั่งซ้าย: ชื่อ & เบอร์ (สีม่วงเข้ม) */}
                  {/* มือถือ: เต็มความกว้าง (w-full), จอใหญ่: กว้าง 35% */}
                  <div className="bg-[#563F58] text-white p-5 sm:p-6 w-full sm:w-[35%] flex flex-col justify-center min-w-[120px]">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-lg capitalize break-words">
                        {/* break-words: ถ้าชื่อยาวมากๆ ให้ปัดลงบรรทัดใหม่ ไม่ตัดทิ้ง */}
                        {defaultAddress.recipient_name}
                      </p>
                      <p className="text-sm opacity-90 font-medium tracking-wide">
                        {defaultAddress.phone_number}
                      </p>
                    </div>
                  </div>

                  {/* ฝั่งขวา: รายละเอียดที่อยู่ */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center text-gray-600 text-sm">
                    {/* ปลด line-clamp ออก ให้โชว์เต็มๆ */}
                    <div className="leading-relaxed font-medium pr-0 sm:pr-8 mb-6 sm:mb-0">
                      <p className="break-words">
                        {defaultAddress.address_detail}
                      </p>
                      <p className="mt-1 text-gray-500">
                        {defaultAddress.sub_district}, {defaultAddress.district}
                        <br className="hidden sm:block" />{" "}
                        {/* เว้นบรรทัดเฉพาะจอใหญ่ */} {defaultAddress.province}{" "}
                        {defaultAddress.zip_code}
                      </p>
                    </div>
                  </div>

                  {/* ปุ่ม Change Address (ลอยขวาล่าง หรือ ลอยมุมบนขวาในมือถือ) */}
                  <button
                    className="absolute bottom-4 right-5 sm:top-auto sm:bottom-4 
                    text-button text-gray-400 underline decoration-gray-400 
                    hover:text-[#6B4B6E] hover:decoration-[#6B4B6E] transition font-bold text-xs sm:text-sm"
                    onClick={() => updateUi("isAddressModalOpen", true)}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => updateUi("isAddressModalOpen", true)}
                  className="flex flex-col items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#563F58] hover:bg-[#563F58]/5 transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2 group-hover:bg-[#563F58] transition">
                    <svg
                      className="w-6 h-6 text-gray-500 group-hover:text-white transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-400 group-hover:text-[#563F58] transition">
                    Add New Address
                  </span>
                </div>
              )}
            </div>

            {/* Right Side: Shipping & Payment Options */}
            <div className="flex flex-col gap-4 mt-8">
              {/* Shipping Option */}
              <div
                onClick={() => setShippingMethod("standard")}
                className={`bg-white border-2 rounded-full px-6 py-3 flex justify-between items-center shadow-md cursor-default transition-all
                    ${
                      shippingMethod === "standard"
                        ? "border-[#6B4B6E]"
                        : "border-transparent"
                    }`}
              >
                <span className="font-bold text-gray-700">
                  Standard Delivery
                </span>
                {/* Check Icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all
                      ${
                        shippingMethod === "standard"
                          ? "bg-primary border-primary"
                          : "border-gray-300"
                      }`}
                >
                  {shippingMethod === "standard" ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Payment Option */}
              <div
                onClick={() => setPaymentMethod("bank")}
                className={`bg-white border-2 rounded-full px-6 py-3 flex justify-between items-center shadow-md transition-all
                    ${
                      paymentMethod === "bank"
                        ? "border-[#6B4B6E]"
                        : "border-transparent"
                    }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Bank Transfer</span>
                </div>
                {/* Check Icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all
                      ${
                        paymentMethod === "bank"
                          ? "bg-[#6B4B6E] border-[#6B4B6E]"
                          : "border-gray-300"
                      }`}
                >
                  {paymentMethod === "bank" ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วน Footer แบบ Full Width (ทะลุ Container) */}
      <div className="fixed bottom-0 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] w-screen left-1/2 -translate-x-1/2">
        {/* Discount Section (Dark Purple)
        <div className="bg-[#563F58] py-4">
          <div className="container mx-auto px-4 md:px-8 flex justify-end items-center gap-6">
            <span className="text-[#FFD700] flex items-center gap-2 font-medium cursor-pointer underline decoration-[#FFD700]">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Discount details
            </span>
            <button
              onClick={handleChooseDiscount}
              className="bg-white text-[#563F58] px-6 py-2 rounded  shadow-sm hover:bg-gray-100 transition"
            >
              Choose A Discount Code
            </button>
          </div>
        </div> */}

        {/* 💰 Bar 2: Summary Section (Light Purple) */}
        <div className="bg-[#A795AD] py-6">
          <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left: Breakdown (Subtotal, Shipping, Discount) */}
            <div className="flex gap-8 text-[#2D2D2D]  text-lg">
              <div className="flex gap-2">
                <span className="opacity-70">Subtotal</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <span className="opacity-70">Shipping Cost</span>
                <span>฿{shippingCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Right: Total Net & Button */}
            <div className="flex items-center gap-6 flex-col md:flex-row">
              <div className="flex items-center gap-3">
                <span className="text-[#563F58] text-h3xl ">Total Net</span>
                <span className="text-[#FFD700] text-h3xl font-extrabold">
                  ฿{totalNet.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={confirm}
                className={`bg-[#FFD700] hover:bg-[#ffc800] text-white text-xl  py-3 px-12 rounded-xl shadow-custombutton transition transform active:scale-95 flex items-center gap-2 ${
                  confirm ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {confirm ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddressSelectionModal
        isOpen={uiState.isAddressModalOpen} // ดึงจากก้อน
        addresses={addresses}
        selectedId={defaultAddress?.id}
        onClose={() => updateUi("isAddressModalOpen", false)} // สั่งปิด
        onConfirm={(newAddress) => {
          updateUi("selectedAddressId", newAddress.id);
        }}
        AddnewAddress={(addr) => handleManageAddress(addr)}
      />
      <AddNewAddressModal
        isOpen={uiState.isAddAddressModalOpen}
        onClose={() => updateUi("isAddAddressModalOpen", false)}
        onConfirm={handleAddOrEditAddress}
        initialData={uiState.editingAddress}
      />
    </div>
  );
};

export default CheckoutPage;
