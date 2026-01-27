import { useEffect, useState } from "react";
import { X, Truck, AlertCircle, CheckCircle } from "lucide-react";
import { adminOrderService } from "../../services/adminOrderService";
import toast from "react-hot-toast";
import ConfirmModal from "../ui/ConfirmModal";
import { formatDate } from "../../utils/dateUtils";

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

  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);
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
  // บังคับยืนยัน
  const handleForceCompleteClick = () => {
    setIsConfirmCompleteOpen(true);
  };
  const handleConfirmForceComplete = async () => {
    if (!orderId) return;
    setLoading(true); // หรือจะสร้าง state loading แยกสำหรับ modal ก็ได้
    try {
      await adminOrderService.updateOrderStatus(orderId, "COMPLETE");
      toast.success("Order marked as Completed! 🎉");
      onUpdateSuccess();
      setIsConfirmCompleteOpen(false); // ปิด Confirm Modal
      onClose(); // ปิด Drawer ใหญ่
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
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
            <h2 className="text-h1xl font-bold text-black tracking-tight">
              Order Detail
            </h2>
            {!loading && order && (
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-admin-secondary">
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
              {/* --- Problem / Cancellation Detail Section --- */}
              {order.problemDetail && (
                <div className=" mt-3">
                  <div className="bg-red-50 border border-red-100 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {/* Header */}
                    <div className="flex items-center gap-2 text-red-800 border-b border-red-200 pb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="font-bold">Cancellation Request</h3>
                      <span className="text-xs text-red-500 ml-auto">
                        {new Date(
                          order.problemDetail.reportedAt,
                        ).toLocaleString("en-GB")}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <span className="text-xs text-red-500 font-bold uppercase tracking-wider block mb-1">
                        Reason
                      </span>
                      <p className="text-red-900 leading-relaxed font-medium">
                        {order.problemDetail.description}
                      </p>
                    </div>

                    {/* Attachments (Image & Video) */}
                    {order.problemDetail.attachments &&
                      order.problemDetail.attachments.length > 0 && (
                        <div>
                          <span className="text-xs text-red-500 font-bold uppercase tracking-wider block mb-2">
                            Evidence
                          </span>
                          <div className="flex flex-wrap gap-3">
                            {order.problemDetail.attachments.map(
                              (file: any, idx: number) => {
                                // เช็คประเภทไฟล์เพื่อแสดงผลให้ถูก
                                const isVideo =
                                  file.media_type?.startsWith("video") ||
                                  /\.(mp4|mov|webm|avi|mkv)$/i.test(
                                    file.file_url,
                                  );

                                return (
                                  <div
                                    key={idx}
                                    className="relative group rounded-lg overflow-hidden border border-red-200 shadow-sm w-32 h-32 bg-white flex-shrink-0"
                                  >
                                    {isVideo ? (
                                      // Video Player
                                      <video
                                        src={file.file_url}
                                        controls
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      // Image Preview
                                      <img
                                        src={file.file_url}
                                        alt="Evidence"
                                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                                        onClick={() =>
                                          window.open(file.file_url, "_blank")
                                        }
                                      />
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
              {/* Customer Info (White Background) */}
              <div className="px-8 mt-6">
                <h3 className="text-admin-primary text-h2xl mb-4">
                  Customer Info
                </h3>
                <div className="grid grid-cols-3 gap-y-4 text-sm">
                  <div className="col-span-1 text-admin-primary font-medium">
                    Receiver
                  </div>
                  <div className="col-span-2 text-black font-medium text-right">
                    {order.receiver?.name}
                  </div>

                  <div className="col-span-1 text-admin-primary font-medium">
                    Phone
                  </div>
                  <div className="col-span-2 text-black font-medium text-right">
                    {order.receiver?.phone}
                  </div>

                  <div className="col-span-1 text-admin-primary font-medium">
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
                  <span className="text-admin-primary font-medium">
                    Subtotal ({order.itemCount} items)
                  </span>
                  <span className="text-black font-bold">
                    ฿{(order.totalAmount - order.shippingCost).toLocaleString()}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-admin-primary font-medium">
                    Shipping
                  </span>
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
                  <span className="text-admin-primary font-medium">
                    Payment Method
                  </span>
                  <span className="text-black font-bold uppercase">
                    {order.paymentMethod?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Evidence & History (Grid Layout) --- */}
              <div className="px-8 mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-8">
                {/* LEFT COLUMN Reason / Slip / Tracking */}
                <div className="space-y-5">
                  {/* Rejection Reason (โชว์เฉพาะตอน PENDING ที่โดนดีดกลับมา) */}
                  {order.status === "PENDING" && order.rejectionReason && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 text-sm animate-in fade-in slide-in-from-left-2">
                      <div className="flex items-center gap-2 mb-2 border-b border-red-200 pb-2">
                        <AlertCircle className="w-4 h-4" />
                        <strong className="font-bold">
                          Last Rejection Reason
                        </strong>
                      </div>
                      <p className="leading-relaxed font-medium">
                        "{order.rejectionReason}"
                      </p>
                      <p className="text-xs text-red-400 mt-2">
                        *Waiting for user to re-upload slip.
                      </p>
                    </div>
                  )}

                  {/* Slip Section (โชว์เมื่อ Inspecting ขึ้นไป) */}
                  {[
                    "INSPECTING",
                    "PACKING",
                    "SHIPPING",
                    "COMPLETE",
                    "CANCEL",
                  ].includes(order.status) &&
                    order?.slip && (
                      <div>
                        <h3 className="text-h3xl text-admin-primary font-bold mb-3 flex items-center gap-2">
                          Attached Slip
                        </h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden w-full max-w-[280px] shadow-sm hover:shadow-md transition-all group relative">
                          <img
                            src={order.slip}
                            alt="Slip"
                            className="w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => window.open(order.slip, "_blank")}
                          />
                        </div>
                      </div>
                    )}

                  {/* Tracking Number (โชว์เมื่อ Shipping/Complete) */}
                  {order.parcelDetail?.parcel_number && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-900 text-sm">
                      {/* Header */}
                      <div className="flex items-center gap-2 border-b border-yellow-200 pb-2 mb-3">
                        <Truck className="w-4 h-4" />
                        <strong className="font-bold">Shipping Info</strong>
                      </div>

                      <div className="space-y-3">
                        {/* Carrier Section */}
                        <div>
                          <span className="text-xs text-yellow-600 font-bold uppercase tracking-wide block mb-1">
                            Carrier
                          </span>
                          <span className="text-base font-bold text-black">
                            {order.parcelDetail.shipping_carrier || "-"}
                          </span>
                        </div>

                        {/* Tracking Section */}
                        <div>
                          <span className="text-xs text-yellow-600 font-bold uppercase tracking-wide block mb-1">
                            Tracking Number
                          </span>
                          <div className="bg-white/60 p-2.5 rounded-lg border border-yellow-200/50">
                            <span className="font-mono text-lg font-bold tracking-wider text-black break-all">
                              {order.parcelDetail.parcel_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/*RIGHT COLUMN: Order Timeline (Logs) */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 h-full max-h-[400px] overflow-y-auto custom-scrollbar md:mt-10">
                  <h3
                    className="sticky top-0 z-20 flex items-center gap-2 
      -mt-5  px-5 p-5 mb-4 
      bg-gray-50 backdrop-blur-sm rounded-t-xl
      border-b border-gray-200 text-sm text-black font-bold shadow-sm"
                  >
                    Order History
                  </h3>

                  <div className="relative ml-2 p-5">
                    {/* เส้น Timeline */}
                    <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-gray-200"></div>

                    {order?.orderLog &&
                      order?.orderLog.map((log: any, index: number) => {
                        // แยกสีจุดตาม Action
                        let dotColor = "bg-gray-300";
                        if (log.action_type.includes("CREATED"))
                          dotColor = "bg-blue-400";
                        if (log.action_type.includes("PAID"))
                          dotColor = "bg-purple-500"; // จ่ายเงิน = ม่วง (Slip เข้า)
                        if (log.action_type.includes("APPROVE"))
                          dotColor = "bg-black"; // Admin Approve
                        if (log.action_type.includes("SHIPPING"))
                          dotColor = "bg-yellow-400";
                        if (log.action_type.includes("COMPLETE"))
                          dotColor = "bg-green-600";
                        if (
                          log.action_type.includes("REJECT") ||
                          log.action_type.includes("CANCEL")
                        )
                          dotColor = "bg-red-500";

                        return (
                          <div
                            key={index}
                            className="relative pl-6 pb-6 last:pb-0 group"
                          >
                            {/* Dot */}
                            <div
                              className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${dotColor}`}
                            ></div>

                            {/* Content */}
                            <div className="flex flex-col items-start">
                              <div className="flex justify-between w-full items-center mb-0.5 gap-2">
                                <span className="text-xs font-bold text-gray-700 uppercase tracking-tight truncate">
                                  {log.action_type
                                    .replace("ORDER_", "")
                                    .replace(/_/g, " ")}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">
                                  {formatDate(log.created_at)}
                                </span>
                              </div>

                              <p className="text-xs text-gray-500 leading-relaxed mb-1">
                                {log.description}
                              </p>

                              {/* Actor Badge */}
                              <div
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border font-medium
                                        ${
                                          log.actor_name
                                            .toUpperCase()
                                            .includes("ADMIN")
                                            ? "bg-admin-primary/10 border-admin-primary/20 text-admin-primary"
                                            : "bg-white border-gray-200 text-gray-500"
                                        }`}
                              >
                                {log.actor_name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Footer (Fixed Bottom) --- */}
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
                  {/* ถ้าเป็น Shipping ให้โชว์ช่องกรอกชื่อขนส่งเพิ่ม */}
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
                  {order.status === "SHIPPING" && (
                    <div className="space-y-3">
                      <button
                        onClick={handleForceCompleteClick}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-full hover:bg-green-700 shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-lg"
                      >
                        <CheckCircle className="w-6 h-6" /> Mark as Received
                      </button>

                      <p className="text-xs text-gray-400 text-center">
                        *Click this if customer received the item but forgot to
                        confirm.
                      </p>
                    </div>
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
      <ConfirmModal
        isOpen={isConfirmCompleteOpen}
        onClose={() => setIsConfirmCompleteOpen(false)}
        onConfirm={handleConfirmForceComplete}
        title="Confirm Completion"
        message="Are you sure you want to force complete this order? This means the customer has received the item."
        variant="success"
        confirmText="Yes, Complete Order"
        isLoading={loading}
      />
    </div>
  );
};

export default AdminOrderDetailModal;
