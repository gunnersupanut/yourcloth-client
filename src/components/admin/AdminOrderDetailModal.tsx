import { useEffect, useState } from "react";
import { X, Truck, AlertCircle, CheckCircle, Loader2 } from "lucide-react"; // 🔥 เพิ่ม Loader2
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
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);
  const [actionMode, setActionMode] = useState<
    "IDLE" | "REJECTING" | "SHIPPING" | "CANCEL"
  >("IDLE");
  const [inputValue, setInputValue] = useState("");
  const [carrier, setCarrier] = useState("");

  // Fetch Data
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
    setIsSubmitting(true); // 🔥 เริ่มหมุน
    try {
      if (actionMode === "REJECTING") {
        if (!inputValue.trim()) {
           setIsSubmitting(false); // หยุดหมุนถ้า Error
           return toast.error("Please enter a reason");
        }
        await adminOrderService.updateOrderStatus(
          orderId,
          "REJECTED",
          inputValue,
        );
        toast.success("Order Rejected");
      } else if (actionMode === "SHIPPING") {
        if (!carrier.trim()) {
           setIsSubmitting(false);
           return toast.error("Please enter shipping carrier!");
        }
        if (!inputValue.trim()) {
           setIsSubmitting(false);
           return toast.error("Please enter tracking number");
        }
        await adminOrderService.updateOrderStatus(
          orderId,
          "SHIPPING",
          undefined,
          inputValue,
          carrier,
        );
        toast.success("Order Shipped!");
      } else if (actionMode === "CANCEL") {
        if (!inputValue.trim()) {
           setIsSubmitting(false);
           return toast.error("Please enter cancellation reason.");
        }
        await adminOrderService.updateOrderStatus(
          orderId,
          "CANCEL",
          inputValue,
        );
        toast.success("Order Cancelled Successfully");
      }
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsSubmitting(false); //หยุดหมุน
    }
  };

  const handleApprove = async () => {
    if (!orderId) return;
    setIsSubmitting(true); // เริ่มหมุน
    try {
      await adminOrderService.updateOrderStatus(orderId, "PACKING");
      toast.success("Order Approved");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error("Approve failed");
    } finally {
      setIsSubmitting(false); // หยุดหมุน
    }
  };

  const handleForceCompleteClick = () => {
    setIsConfirmCompleteOpen(true);
  };

  const handleConfirmForceComplete = async () => {
    if (!orderId) return;
    setIsSubmitting(true); // ใช้ตัวเดียวกันได้เลย เพราะมันอยู่ใน Modal แยก
    try {
      await adminOrderService.updateOrderStatus(orderId, "COMPLETE");
      toast.success("Order marked as Completed! 🎉");
      onUpdateSuccess();
      setIsConfirmCompleteOpen(false);
      onClose();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI Helpers ---
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-gray-800 text-white";
      case "INSPECTING": return "bg-blue-600 text-white";
      case "PACKING": return "bg-purple-600 text-white";
      case "SHIPPING": return "bg-yellow-500 text-black";
      case "COMPLETE": return "bg-green-500 text-white";
      case "CANCEL": return "bg-red-500 text-white";
      case "REJECTED": return "bg-red-600 text-white";
      default: return "bg-gray-400 text-white";
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 font-kanit">
      <div className="absolute inset-0" onClick={onClose}></div>

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
                  {formatDate(order.orderedAt)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!loading && order && (
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusBadgeColor(order.status)}`}>
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
            <div className="p-6 space-y-4">
              <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="pb-6">
              {/* Product List Section */}
              <div className="bg-gray-100 mx-4 p-4 rounded-xl space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-black text-lg leading-tight truncate">{item.name}</h3>
                        <span className="font-bold text-gray-500 whitespace-nowrap">฿{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">Size: S | Color: Black</span>
                        <span className="text-sm font-bold text-purple-600">X {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Problem / Cancellation Detail */}
              {order.problemDetail && (
                <div className="mt-3">
                  <div className="bg-red-50 border border-red-100 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-red-800 border-b border-red-200 pb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="font-bold">Cancellation Request</h3>
                      <span className="text-xs text-red-500 ml-auto">{formatDate(order.problemDetail.reportedAt)}</span>
                    </div>
                    <div>
                      <span className="text-bodyxl text-red-500 font-bold uppercase tracking-wider block mb-1">Reason</span>
                      <p className="text-red-900 leading-relaxed font-medium">{order.problemDetail.description}</p>
                    </div>
                    {order.problemDetail.attachments?.length > 0 && (
                      <div>
                        <span className="text-xs text-red-500 font-bold uppercase tracking-wider block mb-2">Evidence</span>
                        <div className="flex flex-wrap gap-3">
                          {order.problemDetail.attachments.map((file: any, idx: number) => {
                            const isVideo = file.media_type?.startsWith("video") || /\.(mp4|mov|webm|avi|mkv)$/i.test(file.file_url);
                            return (
                              <div key={idx} className="relative group rounded-lg overflow-hidden border border-red-200 shadow-sm w-32 h-32 bg-white flex-shrink-0">
                                {isVideo ? (
                                  <video src={file.file_url} controls className="w-full h-full object-cover" />
                                ) : (
                                  <img src={file.file_url} alt="Evidence" className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => window.open(file.file_url, "_blank")} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="px-8 mt-6">
                <h3 className="text-admin-primary text-h2xl mb-4">Customer Info</h3>
                <div className="grid grid-cols-3 gap-y-4 text-sm">
                  <div className="col-span-1 text-admin-primary font-medium">Receiver</div>
                  <div className="col-span-2 text-black font-medium text-right">{order.receiver?.name}</div>
                  <div className="col-span-1 text-admin-primary font-medium">Phone</div>
                  <div className="col-span-2 text-black font-medium text-right">{order.receiver?.phone}</div>
                  <div className="col-span-1 text-admin-primary font-medium">Address</div>
                  <div className="col-span-2 text-black font-medium text-right leading-relaxed">{order.receiver?.address}</div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="px-10 mt-8 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-admin-primary font-medium">Subtotal ({order.itemCount} items)</span>
                  <span className="text-black font-bold">฿{(order.totalAmount - order.shippingCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-admin-primary font-medium">Shipping</span>
                  <span className="text-black font-bold">฿{order.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-admin-primary font-medium">Payment Method</span>
                  <span className="text-black font-bold uppercase">{order.paymentMethod?.replace(/_/g, " ")}</span>
                </div>
              </div>

              {/* Evidence & History */}
              <div className="px-8 mt-6 grid grid-cols-1 gap-8 items-start pb-8">
                <div className="space-y-5">
                  {order.status === "PENDING" && order.rejectionReason && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 text-sm animate-in fade-in slide-in-from-left-2">
                      <div className="flex items-center gap-2 mb-2 border-b border-red-200 pb-2">
                        <AlertCircle className="w-4 h-4" />
                        <strong className="font-bold">Last Rejection Reason</strong>
                      </div>
                      <p className="leading-relaxed font-medium">"{order.rejectionReason}"</p>
                      <p className="text-xs text-red-400 mt-2">*Waiting for user to re-upload slip.</p>
                    </div>
                  )}

                  {["INSPECTING", "PACKING", "SHIPPING", "COMPLETE", "CANCEL"].includes(order.status) && order?.slip && (
                    <div>
                      <h3 className="text-h3xl text-admin-primary font-bold mb-3 flex items-center gap-2">Attached Slip</h3>
                      <div className="border border-gray-200 rounded-xl overflow-hidden w-full max-w-[280px] shadow-sm hover:shadow-md transition-all group relative">
                        <img src={order.slip} alt="Slip" className="w-full h-auto cursor-pointer hover:opacity-95 transition-opacity" onClick={() => window.open(order.slip, "_blank")} />
                      </div>
                    </div>
                  )}

                  {order.parcelDetail?.parcel_number && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-900 text-sm">
                      <div className="flex items-center gap-2 border-b border-yellow-200 pb-2 mb-3">
                        <Truck className="w-4 h-4" />
                        <strong className="font-bold">Shipping Info</strong>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-yellow-600 font-bold uppercase tracking-wide block mb-1">Carrier</span>
                          <span className="text-base font-bold text-black">{order.parcelDetail.shipping_carrier || "-"}</span>
                        </div>
                        <div>
                          <span className="text-xs text-yellow-600 font-bold uppercase tracking-wide block mb-1">Tracking Number</span>
                          <div className="bg-white/60 p-2.5 rounded-lg border border-yellow-200/50">
                            <span className="font-mono text-lg font-bold tracking-wider text-black break-all">{order.parcelDetail.parcel_number}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Timeline */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 h-full max-h-[400px] overflow-y-auto custom-scrollbar">
                  <h3 className="sticky top-0 z-20 flex items-center gap-2 -mt-5 px-5 p-5 mb-4 bg-gray-50 backdrop-blur-sm rounded-t-xl border-b border-gray-200 text-sm text-black font-bold shadow-sm">Order History</h3>
                  <div className="relative ml-2 p-5">
                    <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-gray-200"></div>
                    {order?.orderLog?.map((log: any, index: number) => {
                      let dotColor = "bg-gray-300";
                      if (log.action_type.includes("CREATED")) dotColor = "bg-blue-400";
                      if (log.action_type.includes("PAID")) dotColor = "bg-purple-500";
                      if (log.action_type.includes("APPROVE")) dotColor = "bg-black";
                      if (log.action_type.includes("SHIPPING")) dotColor = "bg-yellow-400";
                      if (log.action_type.includes("COMPLETE")) dotColor = "bg-green-600";
                      if (log.action_type.includes("REJECT") || log.action_type.includes("CANCEL")) dotColor = "bg-red-500";

                      return (
                        <div key={index} className="relative pl-6 pb-6 last:pb-0 group">
                          <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${dotColor}`}></div>
                          <div className="flex flex-col items-start">
                            <div className="flex justify-between w-full items-center mb-0.5 gap-2">
                              <span className="text-xs font-bold text-gray-700 uppercase tracking-tight truncate">{log.action_type.replace("ORDER_", "").replace(/_/g, " ")}</span>
                              <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">{formatDate(log.created_at)}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-1">{log.description}</p>
                            <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border font-medium ${log.actor_name.toUpperCase().includes("ADMIN") ? "bg-admin-primary/10 border-admin-primary/20 text-admin-primary" : "bg-white border-gray-200 text-gray-500"}`}>{log.actor_name}</div>
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
            <div className="flex justify-between items-end">
              <span className="text-h3xl font-bold text-admin-primary">Total</span>
              <span className="text-h2xl font-extrabold text-admin-secondary">฿{order.totalAmount}</span>
            </div>

            <div>
              {actionMode !== "IDLE" ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  {actionMode === "SHIPPING" && (
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full text-black border-2 border-gray-200 rounded-full px-6 py-4 text-lg focus:outline-none focus:border-black transition-colors"
                      placeholder="Carrier Name (e.g. Kerry, Flash)"
                      autoFocus
                      disabled={isSubmitting} //Disable ตอนส่ง
                    />
                  )}

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full text-black border-2 border-gray-200 rounded-full px-6 py-4 text-lg focus:outline-none focus:border-black transition-colors"
                    placeholder={actionMode === "REJECTING" ? "Reason for rejection..." : actionMode === "CANCEL" ? "Reason for cancellation..." : "Tracking Number (e.g. TH123...)"}
                    autoFocus={actionMode === "REJECTING"}
                    disabled={isSubmitting} 
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActionMode("IDLE")}
                      className="py-4 rounded-full font-bold border-2 text-admin-primary border-admin-primary hover:bg-admin-primary transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting} 
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAction}
                      disabled={isSubmitting} 
                      className={`py-4 rounded-full font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                        ${actionMode === "CANCEL" ? "bg-red-600 hover:bg-red-700" : "bg-admin-primary hover:bg-admin-secondary"}
                        ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
                      `}
                    >
                      {/* หมุนติ้วๆ ถ้า isSubmitting */}
                      {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                      {actionMode === "CANCEL" ? "Confirm Cancel" : "Confirm"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {order.status === "INSPECTING" && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleApprove}
                        disabled={isSubmitting} 
                        className="bg-black text-white font-bold py-3.5 rounded-full hover:bg-gray-800 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setActionMode("REJECTING");
                          setInputValue("");
                        }}
                        disabled={isSubmitting} 
                        className="bg-white text-black border-2 border-black font-bold py-3.5 rounded-full hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isSubmitting}
                      className="w-full bg-admin-primary text-white font-bold py-3.5 rounded-full hover:bg-blue-900 shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Truck className="w-5 h-5" />
                      Ship Order
                    </button>
                  )}
                  {order.status === "SHIPPING" && (
                    <div className="space-y-3">
                      <button
                        onClick={handleForceCompleteClick}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-full hover:bg-green-700 shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                        Mark as Received
                      </button>
                      <p className="text-xs text-gray-400 text-center">*Click this if customer received the item but forgot to confirm.</p>
                    </div>
                  )}
                  {!["COMPLETE", "CANCEL", "REJECTED"].includes(order.status) && (
                    <div className="text-right pt-2">
                      <button
                        onClick={() => {
                          setActionMode("CANCEL");
                          setInputValue("");
                        }}
                        disabled={isSubmitting} 
                        className="text-ui text-red-500 font-bold hover:text-red-700 px-4 py-2 rounded-full transition-all flex items-end justify-end gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
        isLoading={isSubmitting} 
      />
    </div>
  );
};

export default AdminOrderDetailModal;