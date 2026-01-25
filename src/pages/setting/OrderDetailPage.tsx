import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  Wallet,
  ClipboardCheck,
  X,
  Copy,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderHistoryEntry } from "../../types/orderTypes";
import toast from "react-hot-toast";
import { orderService } from "../../services/orderService";
import PageLoading from "../../components/ui/PageLoading";
import PaymentModal from "../../components/PaymentModal";

const DEFAULT_ORDER: OrderHistoryEntry = {
  orderId: 0,
  status: "LOADING",
  orderedAt: new Date(),
  totalAmount: 0,
  shippingCost: 0,
  items: [],

  receiver: {
    name: "",
    phone: "",
    address: "",
  },
};
// --- Config Progress Bar  ---
const ORDER_STEPS = [
  { status: "PENDING", label: "To Pay", icon: Wallet },
  { status: "INSPECTING", label: "Verifying", icon: ClipboardCheck },
  { status: "PACKING", label: "Processing", icon: Package },
  { status: "SHIPPING", label: "To Receive", icon: Truck },
  { status: "COMPLETE", label: "Completed", icon: CheckCircle },
];

export default function OrderDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderHistoryEntry>(DEFAULT_ORDER); // ใช้ Mock ไปก่อน
  const [loading, setLoading] = useState(true);
  const [isConfirmRecived, setIsConfirmRecived] = useState(false);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  useEffect(() => {
    fetchOrder();
  }, [orderId]);
  const fetchOrder = async () => {
    if (!orderId) {
      toast.error("Invalid data can't find OrderId");
      return;
    }
    try {
      setLoading(true);
      const res = await orderService.getOrderById(orderId);
      setOrder(res.data);
      console.log("Order Data", res.data);
    } catch (error) {
      console.error("Fetch orders failed", error);
      toast.error("Get orders data failed.");
      navigate("/setting/orders");
    } finally {
      setLoading(false);
    }
  };
  // เปิด Modal อัตโนมัติ
  useEffect(() => {
    // เช็ค 2 เงื่อนไข
    // 1. มีโพย 'openPayModal' ส่งมาไหม?
    // 2. ข้อมูล order โหลดเสร็จหรือยัง? (ต้องมี id และ totalAmount ถึงจะเปิดได้)
    if (location.state?.openPayModal && order.orderId !== 0) {
      setPayModalOpen(true);

      // ล้าง state ทิ้ง เพื่อไม่ให้มันเปิดซ้ำเวลากด refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, order]); // ใส่ dependency ให้ครบ
  // Logic คำนวณ Step ปัจจุบัน
  const currentStepIndex = ORDER_STEPS.findIndex(
    (step) => step.status === order?.status,
  );
  // --ฟังก์ชั่น ปุ่ม
  const handlePayNow = () => {
    setPayModalOpen(true);
  };
  const handleReportProblem = () => {
    toast.success("Report Problem CommingSoon.");
  };
  const handleConfirmReceived = async () => {
    setIsConfirmRecived(true);
    // ย้ายออร์เดอร์
    await orderService.confirmReceived(order.orderId);
    // รีเฟรชหน้าหลัก
    fetchOrder();
    toast.success("Confirm Received.");
    try {
    } catch (error: any) {
      console.error("Confirm payment Error:", error);

      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsConfirmRecived(false);
    }
  };
  const handleBuyAgain = () => {
    navigate("/shop");
  };
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4 font-kanit pb-20">
      {loading ? (
        <PageLoading />
      ) : (
        <>
          {/* === Header === */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/setting/orders"
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-secondary" />
            </Link>
            <h1 className="text-button text-secondary">Back</h1>
          </div>

          {/* === Status === */}
          <div className="bg-white p-6 border-b-2 border-primary shadow-sm ">
            <div className="flex justify-between items-center mb-8 ">
              <h2 className="text-sm md:text-h2xl text-primary flex flex-col md:flex-row">
                Order <span className="text-secondary">#{order.orderId}</span>
              </h2>
              <div className="flex items-center gap-2 text-sm md:text-h2xl flex-col md:flex-row">
                <span className="text-primary">Status</span>
                <span className="text-secondary">{order.status}</span>
              </div>
            </div>

            <div className="relative flex justify-between items-center w-full px-2 md:px-8 mb-8">
              {/* ---เส้นเชื่อม---*/}
              <div className="hidden min-[350px]:block absolute top-4 md:top-6 left-0 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
              {/* ---เส้นสี (Progress)--- */}
              <div
                className="hidden min-[350px]:block absolute top-4 md:top-6 left-0 h-1 bg-green-500 z-0 transition-all duration-500 rounded-full"
                style={{
                  width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%`,
                }}
              ></div>
              {/* ---Icons Loop ---*/}
              {ORDER_STEPS.map((step, idx) => {
                const Icon = step.icon;
                // เช็คก่อนว่าสถานะออร์เดอร์ตอนนี้คือ COMPLETE หรือยัง
                const isFinished = order.status === "COMPLETE";
                //  "ผ่านมาแล้ว" หรือ "เป็นตัวปัจจุบันแต่ COMPLETE"
                const isCompleted =
                  idx < currentStepIndex ||
                  (idx === currentStepIndex && isFinished);
                //  "อยู่ตรงนี้" และ "ยังไม่จบงาน"
                const isCurrent = idx === currentStepIndex && !isFinished;
                // ยังมาไม่ถึง
                const isPending = idx > currentStepIndex;

                return (
                  <div
                    key={step.status}
                    className="relative z-10 flex flex-col items-center gap-1 md:gap-2 bg-white px-0.5 md:px-2"
                  >
                    {/* วงกลม Icon */}
                    <div
                      className={`
            w-8 h-8 md:w-12 md:h-12 
            rounded-full flex items-center justify-center border-2 transition-all duration-300
            ${isCompleted ? "bg-green-500 border-green-500 text-white shadow-md" : ""}
            ${isCurrent ? "bg-white border-yellow-400 text-yellow-500 shadow-lg scale-110" : ""}
            ${isPending ? "bg-gray-100 border-gray-200 text-gray-400" : ""}
          `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
                      ) : (
                        <Icon className="w-4 h-4 md:w-6 md:h-6" />
                      )}
                    </div>

                    {/* Label Text */}
                    <span
                      className={`
            hidden lg:block 
            text-button transition-colors duration-300
            ${isCompleted ? "text-green-600" : ""}
            ${isCurrent ? "text-secondary font-bold" : ""}
            ${isPending ? "text-gray-400" : ""}
          `}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Rejection Section*/}
            {order.status === "PENDING" && order.rejectionReason && (
              <div className="flex items-center gap-4 p-4 border border-red-500 rounded-lg bg-white shadow-sm w-full">
                {/* Icon Wrapper: วงกลมแดง */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    {/* Icon X สีขาว หนาหน่อย */}
                    <X className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-red-600 leading-tight">
                    Previous Payment Was Declined
                  </h3>
                  {/* Description */}
                  <p className="text-red-400 font-medium text-sm mt-0.5">
                    {order.rejectionReason}
                  </p>
                </div>
              </div>
            )}

            {/* ข้อความแจ้งเตือนตามสถานะ */}
            <div className="my-8 text-center md:text-right  rounded-lg text-sm md:text-bodyxl text-primary">
              {order.status === "INSPECTING" &&
                "We have received your payment information. We are reviewing it within 24 hours."}
              {order.status === "PENDING" &&
                "Please complete your payment within 24 hours to proceed with your order."}
              {order.status === "PACKING" &&
                "Payment confirmed! We are currently packing your order and will ship it soon."}
              {order.status === "SHIPPING" &&
                "Your package is on the way Get ready."}
            </div>

            {/* Action ตามสถานะ */}
            {order.status === "PENDING" && (
              <div className="fixed bottom-0 hidden left-0 w-full bg-white border-t p-4 md:flex justify-end shadow-lg md:static md:shadow-none md:border-0 md:bg-transparent md:p-0 mt-8 z-50">
                <button
                  className="bg-yellow-400 text-white font-bold py-3 px-14 rounded-xl shadow-lg hover:bg-yellow-500 transition-all w-full md:w-auto"
                  onClick={() => handlePayNow()}
                >
                  Pay Now
                </button>
              </div>
            )}
            {order.status === "SHIPPING" && (
              <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-end shadow-lg md:static md:shadow-none md:border-0 md:bg-transparent md:p-0 gap-8 z-50">
                <button
                  className="bg-transparent text-primary font-bold border-2 border-primary py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-all w-full md:w-auto"
                  onClick={() => handleReportProblem()}
                >
                  Report Problem
                </button>
                <button
                  className={`
    bg-yellow-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all w-full md:w-auto flex items-center justify-center gap-2
    ${
      isConfirmRecived
        ? "opacity-70 cursor-not-allowed" // จางลง + เมาส์ห้ามกด
        : "hover:scale-105" // ขยายตอนเมาส์ชี้
    }
  `}
                  onClick={() => handleConfirmReceived()}
                  disabled={isConfirmRecived}
                >
                  {isConfirmRecived ? (
                    <div className="px-12">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : (
                    "Confirm Received"
                  )}
                </button>
              </div>
            )}
            {/* Action ตามสถานะ */}
            {order.status === "COMPLETE" && (
              <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 md:flex justify-end shadow-lg md:static md:shadow-none md:border-0 md:bg-transparent md:p-0 mt-8 z-50">
                <button
                  className="bg-yellow-400 text-white font-bold py-3 px-14 rounded-xl shadow-lg hover:bg-yellow-500 transition-all w-full md:w-auto shadow-custombutton"
                  onClick={() => handleBuyAgain()}
                >
                  BUY AGAIN
                </button>
              </div>
            )}
          </div>
          {/* === Card 2 Address === */}
          <div className="bg-white p-6 border-b-2 border-primary shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between items-center">
              <p className="text-h3xl text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-500  text-bodyxl" />{" "}
                Shipping Address
              </p>
              <div className="flex flex-col text-h3xl text-secondary items-center gap-1 mb-4 md:mb-0">
                <p className="mr-3">{order.parcelDetail?.shipping_carrier}</p>
                <div className="flex gap-2">
                  <p>{order.parcelDetail?.parcel_number}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        order.parcelDetail?.parcel_number || "",
                      );
                      toast.success("Copy Parcel number.");
                    }}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="Copy Parcel Number"
                  >
                    <Copy className="w-4 h-4 text-secondary cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pl-7">
              <p className="text-bodyxl font-bold text-primary">
                {order.receiver.name}
              </p>
              <p className="text-primary text-bodyxl mt-1">
                {order.receiver.phone}
              </p>
              <p className="text-black text-bodyxl mt-3">
                {order.receiver.address}
              </p>
            </div>
          </div>

          {/* === Products === */}
          <div className="bg-white p-6 border-b-2 border-primary  shadow-sm space-y-6">
            <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-bodyxl text-yellow-500" />{" "}
              Product Details
            </h3>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col md:flex-row md:justify-between md:items-start">
                  {/* ส่วนชื่อสินค้า */}
                  <div className="mb-1 md:mb-0 md:pr-4">
                    <h4 className="font-bold text-primary line-clamp-2 text-sm md:text-base">
                      {item.name}
                    </h4>
                    <p className="line-clamp-2 text-sm md:text-base text-black l">
                      {" "}
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between items-center md:flex-col md:items-end md:text-right mt-1 md:mt-0">
                    {/* ราคา */}
                    <p className="text-gray-800 font-semibold md:font-normal">
                      ฿{item.price.toLocaleString()}
                    </p>

                    {/* จำนวน */}
                    <p className="text-gray-500 text-xs md:text-sm md:mt-1">
                      x{item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* === Price Breakdown === */}
          <div className="bg-white p-6 shadow-sm rounded-lg">
            {/* ส่วนรายการ (Subtotal, Shipping, etc.) */}
            <div className="space-y-3 pb-4 border-b border-gray-100 mb-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">Subtotal</span>
                <span className="text-primary font-bold">
                  ฿{(order.totalAmount - order.shippingCost).toLocaleString()}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">Shipping</span>
                <span className="text-primary font-bold">
                  ฿{order.shippingCost}
                </span>
              </div>

              {/* Discount (ถ้ามีค่อยเปิด) */}
              {/* <div className="flex justify-between items-center">
       <div className="flex items-center gap-1 text-primary font-medium">
         <span>Discount</span>
         <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
       </div>
       <span className="text-primary font-bold">0฿</span>
    </div> 
    */}

              {/* Payment Method*/}
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">Payment method</span>
                <span className="text-primary font-bold">Bank transfer</span>
              </div>
            </div>

            {/* Total Net */}
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary text-lg">Total Net</span>
              <span className="font-bold text-secondary text-2xl">
                ฿{order.totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Footer Action*/}
            {order.status === "PENDING" && (
              <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-end shadow-lg md:static md:shadow-none md:border-0 md:bg-transparent md:p-0 mt-8">
                <button
                  className="bg-yellow-400 text-white font-bold py-3 px-14 rounded-xl shadow-lg hover:scale-105  transition-all w-full md:w-auto"
                  onClick={() => handlePayNow()}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </>
      )}
      <PaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setPayModalOpen(false)}
        orderId={order.orderId}
        totalAmount={order.totalAmount}
        onSuccess={fetchOrder}
      />
    </div>
  );
}
