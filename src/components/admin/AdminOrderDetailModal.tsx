import { useEffect, useState } from "react";
import { X, Truck } from "lucide-react";
import { adminOrderService } from "../../services/adminOrderService";
import toast from "react-hot-toast";

interface AdminOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
  onUpdateSuccess: () => void;
}

const AdminOrderDetailModal = ({
  isOpen,
  onClose,
  orderId,
  onUpdateSuccess,
}: AdminOrderDetailModalProps) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // State ควบคุมโหมด (ปกติ / กรอกเหตุผล / กรอกเลขพัสดุ)
  const [actionMode, setActionMode] = useState<
    "IDLE" | "REJECTING" | "SHIPPING"
  >("IDLE");
  const [inputValue, setInputValue] = useState(""); // ใช้เก็บ Reason หรือ Tracking Number
  const [carrier, setCarrier] = useState(""); // เก็บชื่อขนส่ง
  // Fetch Data ---
  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail();
      setActionMode("IDLE");
      setInputValue("");
      setCarrier("");
      document.body.style.overflow = "hidden";
    } else {
      setOrder(null);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, orderId]);

  const fetchOrderDetail = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await adminOrderService.getOrderDetails(orderId);
      setOrder(res.data || res);
      console.log("OrderData:", res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // --- Action Handlers ---
  const handleSubmitAction = async () => {
    if (!orderId) return;
    try {
      if (actionMode === "REJECTING") {
        if (!inputValue.trim()) return toast.error("Please enter a reason");
        await adminOrderService.updateOrderStatus(
          orderId,
          "REJECTED",
          inputValue,
        );
        toast.success("Order Rejected");
      } else if (actionMode === "SHIPPING") {
        if (!carrier.trim())
          return toast.error("Please enter shipping carrier!");
        if (!inputValue.trim())
          return toast.error("Please enter tracking number");
        await adminOrderService.updateOrderStatus(
          orderId,
          "SHIPPING",
          undefined,
          inputValue,
          carrier,
        );
        toast.success("Order Shipped!");
      }
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleApprove = async () => {
    if (!orderId) return;
    try {
      await adminOrderService.updateOrderStatus(orderId, "PACKING");
      toast.success("Order Approved");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error("Approve failed");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    if (!orderId) return;
    try {
      await adminOrderService.updateOrderStatus(orderId, "CANCEL");
      toast.success("Order Cancelled");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error("Cancel failed");
    }
  };

  // --- UI Helpers ---
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-800 text-white";
      case "INSPECTING":
        return "bg-blue-600 text-white"; // สีน้ำเงินตามรูป
      case "PACKING":
        return "bg-purple-600 text-white";
      case "SHIPPING":
        return "bg-yellow-500 text-black";
      case "COMPLETE":
        return "bg-green-500 text-white";
      case "CANCEL":
        return "bg-red-500 text-white";
      case "REJECTED":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusText = (status: string) => {
    if (status === "PENDING") return "Unpaid";
    if (status === "INSPECTING") return "To Verify";
    if (status === "PACKING") return "To Ship";
    if (status === "SHIPPING") return "To Receive";
    return status;
  };

  if (!isOpen) return null;

  return (
    // Overlay (Backdrop)
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 font-kanit">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="relative bg-white w-full max-w-[550px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 rounded-bl-3xl overflow-hidden">
        {/* --- 1. Header --- */}
        <div className="px-6 pt-8 pb-5 flex justify-between items-start bg-white sticky top-0 z-10">
          <div className="space-y-1">
            <h2 className="text-h2xl font-bold text-black tracking-tight">
              Order Detail
            </h2>
            {!loading && order && (
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-400">
                  #{order.orderId}
                </span>
                <span className="text-sm text-gray-400 font-normal">
                  {new Date(order.orderedAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!loading && order && (
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusBadgeColor(order.status)}`}
              >
                {getStatusText(order.status)}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>

        {/* --- 2. Content (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading || !order ? (
            // Skeleton
            <div className="p-6 space-y-4">
              <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="pb-6">
              {/* Product List Section (Grey Background) */}
              <div className="bg-gray-100 mx-4 p-4 rounded-xl space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No Img
                        </div>
                      )}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-black text-lg leading-tight truncate">
                          {item.name}
                        </h3>
                        <span className="font-bold text-gray-500 whitespace-nowrap">
                          ฿{item.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        {/* Mock Size/Color if not present */}
                        <span className="text-xs text-gray-500">
                          Size: S | Color: Black
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          X {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Info (White Background) */}
              <div className="px-8 mt-6">
                <div className="grid grid-cols-3 gap-y-4 text-sm">
                  <div className="col-span-1 text-gray-400 font-medium">
                    Receiver
                  </div>
                  <div className="col-span-2 text-black font-medium text-right">
                    {order.receiver?.name}
                  </div>

                  <div className="col-span-1 text-gray-400 font-medium">
                    Phone
                  </div>
                  <div className="col-span-2 text-black font-medium text-right">
                    {order.receiver?.phone}
                  </div>

                  <div className="col-span-1 text-gray-400 font-medium">
                    Address
                  </div>
                  <div className="col-span-2 text-black font-medium text-right leading-relaxed">
                    {order.receiver?.address}
                  </div>
                </div>
              </div>
              {/* --- Financial Summary Section --- */}
              <div className="px-10 mt-8 pt-6 border-t border-gray-100 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">
                    Subtotal ({order.itemCount} items)
                  </span>
                  <span className="text-black font-bold">
                    ฿{(order.totalAmount - order.shippingCost).toLocaleString()}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Shipping</span>
                  <span className="text-black font-bold">
                    ฿{order.shippingCost.toLocaleString()}
                  </span>
                </div>

                {/* Discount (Commented Out) */}
                {/* <div className="flex justify-between items-center text-sm text-red-500">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">- ฿0</span>
                </div> 
                */}

                {/* Payment Method */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">
                    Payment Method
                  </span>
                  <span className="text-black font-bold uppercase">
                    {order.paymentMethod?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Slip / Tracking / Reject Info */}
              <div className="px-8 mt-6 space-y-4">
                {/* Slip */}
                {["INSPECTING", "PACKING", "SHIPPING", "COMPLETE"].includes(
                  order.status,
                ) && order?.slip && (
                  <div>
                    <h3 className="text-sm text-black font-bold mb-2">
                      Attached Slip
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden w-full max-w-[200px]">
                      <img
                        src={order.slip}
                        alt="Slip"
                        className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(order.slip, "_blank")}
                      />
                    </div>
                  </div>
                )}
                {/* Tracking */}
                {order.parcelDetail?.parcel_number && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
                    <strong>Tracking Number:</strong>{" "}
                    {order.parcelDetail.parcel_number}
                  </div>
                )}
                {/* Reason */}
                {order.rejectionReason && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 text-sm">
                    <strong>Reason:</strong> {order.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- 3. Footer (Fixed Bottom) --- */}
        {!loading && order && (
          <div className="p-6 bg-white border-t border-gray-100 space-y-6">
            {/* Total */}
            <div className="flex justify-between items-end">
              <span className="text-xl font-bold text-gray-400">Total</span>
              <span className="text-3xl font-extrabold text-gray-400">
                ฿{order.totalAmount}
              </span>
            </div>

            {/* Actions */}
            <div>
              {/* INPUT MODE */}
              {actionMode !== "IDLE" ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  {/* 🔥 ถ้าเป็น Shipping ให้โชว์ช่องกรอกชื่อขนส่งเพิ่ม */}
                  {actionMode === "SHIPPING" && (
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full text-black border-2 border-gray-200 rounded-full px-6 py-4 text-lg focus:outline-none focus:border-black transition-colors"
                      placeholder="Carrier Name (e.g. Kerry, Flash)"
                      autoFocus // ให้ Focus ช่องแรกก่อน
                    />
                  )}

                  {/* ช่องเดิม (ใช้เป็น Reason หรือ Tracking) */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full text-black border-2 border-gray-200 rounded-full px-6 py-4 text-lg focus:outline-none focus:border-black transition-colors"
                    placeholder={
                      actionMode === "REJECTING"
                        ? "Reason for rejection..."
                        : "Tracking Number (e.g. TH123...)"
                    }
                    // ถ้าเป็น Shipping ไม่ต้อง AutoFocus ช่องนี้ (ไป Focus Carrier แทน)
                    autoFocus={actionMode === "REJECTING"}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActionMode("IDLE")}
                      className="py-4 rounded-full font-bold border-2 text-admin-primary border-admin-primary hover:bg-admin-primary transition-all hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAction}
                      className="py-4 rounded-full font-bold bg-admin-primary text-white hover:bg-admin-secondary transition-all shadow-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                /* CASE 2: BUTTON MODE */
                <div className="space-y-4">
                  {order.status === "INSPECTING" && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleApprove}
                        className="bg-black text-white font-bold py-3.5 rounded-full hover:bg-gray-800 shadow-xl active:scale-95 transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setActionMode("REJECTING");
                          setInputValue("");
                        }}
                        className="bg-white text-black border-2 border-black font-bold py-3.5 rounded-full hover:bg-gray-50 active:scale-95 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {order.status === "PACKING" && (
                    <button
                      onClick={() => {
                        setActionMode("SHIPPING");
                        setInputValue("");
                      }}
                      className="w-full bg-admin-primary text-white font-bold py-3.5 rounded-full hover:bg-blue-900 shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Truck className="w-5 h-5" />
                      Ship Order
                    </button>
                  )}

                  {/* Cancel Text Link */}
                  {!["COMPLETE", "CANCEL", "REJECTED"].includes(
                    order.status,
                  ) && (
                    <div className="text-center">
                      <button
                        onClick={handleCancel}
                        className="text-xs text-red-500 underline font-medium hover:text-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetailModal;
