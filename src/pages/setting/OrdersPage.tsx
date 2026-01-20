import { useEffect, useState } from "react";
import type { OrderHistoryEntry } from "../../types/orderTypes";
import { orderService } from "../../services/orderService";
import toast from "react-hot-toast";
import PageLoading from "../../components/ui/PageLoading";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
// Mapping จาก UI Tab -> Database Status
const TAB_STATUS_MAP: Record<string, string[]> = {
  All: [], // ไม่กรอง
  "To Pay": ["PENDING"],
  Verifying: ["INSPECTING"], // รอตรวจสอบสลิป
  Processing: ["PACKING"], // กำลังแพ็ค
  "To Receive": ["SHIPPING"], // ส่งแล้ว
  Completed: ["COMPLETE"],
  Cancelled: ["CANCEL"],
};

const TABS = Object.keys(TAB_STATUS_MAP);

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  // สำหรับ Filter
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  // fetch orderdata
  const fetchOrders = async () => {
    try {
      const res = await orderService.getAllOrder();
      setOrders(res.data);
    } catch (error) {
      console.error("Fetch orders failed", error);
      toast.error("Get orders data failed.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  // กรองข้อมูล
  const filteredOrders = orders.filter((order) => {
    // 1. กรองตาม Tab
    const targetStatuses = TAB_STATUS_MAP[activeTab];
    const isStatusMatch =
      activeTab === "All" || targetStatuses.includes(order.status);

    // กรองตาม Search (หาจาก Order ID หรือ ชื่อสินค้า)
    const lowerSearch = searchTerm.toLowerCase();
    const isSearchMatch =
      order.orderId.toString().includes(lowerSearch) || // เจอในเลข Order ไหม
      order.items.some((item) => item.name.toLowerCase().includes(lowerSearch)); // เจอในชื่อสินค้าไหม

    return isStatusMatch && isSearchMatch;
  });
  const handleViewDetail = (orderId: number) => {
    navigate(`/setting/orders/${orderId}`);
  };
  return (
    <div className="space-y-6 font-kanit">
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <h2 className="text-h2xl mb-6 text-primary">Orders</h2>

          {orders?.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
              <p className="text-gray-500 mb-4">There are no orders yet.</p>
              <Link
                to="/shop"
                className="text-yellow-600 font-bold hover:underline"
              >
                Let's Shop.
              </Link>
            </div>
          ) : (
            // มือถือ 1 แถว | แท็บเล็ต/คอม 1 แถว (หรือจะแก้เป็น grid-cols-2 ก็ได้ถ้าชอบ)
            <div className="grid grid-cols-1 gap-4">
              {/* Tabs Menu (Scrollable) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2
                ${
                  activeTab === tab
                    ? "border-yellow-400 text-yellow-600 bg-yellow-50"
                    : "border-transparent text-primary hover:text-secondary hover:bg-gray-50"
                }
              `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-tertiary">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by Product name, Order number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-tertiary focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  {/* === Header: Order ID + Total + Status === */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div className="space-y-1">
                      {/* Order ID สีเหลืองทอง */}
                      <h3 className="text-h3xl text-primary font-kanit">
                        Order{" "}
                        <span className="text-secondary">#{order.orderId}</span>
                      </h3>
                      {/* Status */}
                      <div className="flex items-center gap-2 text-h3xl">
                        <span className="text-primary">Status</span>
                        <span
                          className={`font-bold ${
                            order.status === "PENDING"
                              ? "text-yellow-500"
                              : order.status === "COMPLETE"
                                ? "text-green-600"
                                : order.status === "CANCEL"
                                  ? "text-red-500"
                                  : "text-blue-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Total Net (ย้ายมาขวาบนตามรูป) */}
                    <div className="mt-2 sm:mt-0 text-right">
                      <span className="text-gray-600 font-medium mr-2">
                        Total Net
                      </span>
                      <span className="text-xl font-bold text-yellow-500">
                        {order.totalAmount.toLocaleString()}฿
                      </span>
                    </div>
                  </div>

                  {/* เส้นคั่น */}
                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Items List */}
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 sm:gap-6">
                        {/* รูปสินค้า (ถ้าไม่มีรูป ใช้กล่องสีเทาแทน) */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">
                              No Img
                            </div>
                          )}
                        </div>

                        {/* รายละเอียดสินค้า */}
                        <div className="flex-1 flex flex-col sm:flex-row justify-between">
                          <div>
                            {/* ชื่อสินค้า */}
                            <h4 className="text-h3xl text-primary mb-1 line-clamp-2">
                              {item.name}
                            </h4>
                            {/* คำอธิบายเสริม (ถ้ามี หรือจะใส่ Size/Color) */}
                            <p className="text-body text-text_primary">
                              Product from latest collection
                            </p>
                            {/* Quantity (X1) */}
                            <p className="text-lg font-bold text-gray-800 mt-2 sm:hidden">
                              x{item.quantity}
                            </p>
                          </div>

                          {/* ราคา & จำนวน (Desktop) */}
                          <div className="text-right mt-2 sm:mt-0 space-y-1">
                            <p className="text-text_secondary text-h3xl">
                              {item.price.toLocaleString()}฿
                            </p>
                            <p className="hidden sm:block text-h3xl  text-text_primary">
                              x{item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/*---Footer Buttons*/}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                    {/* ปุ่ม Action หลัก (เปลี่ยนตามสถานะ) */}
                    {order.status === "PENDING" ? (
                      <button
                        onClick={() => toast("Upload Slip Coming Soon!")}
                        className="px-6 py-3 rounded-lg bg-yellow-400 text-white text-button hover:scale-105 transition-all duration-200 shadow-sm flex items-center gap-2"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <button
                        onClick={() => toast("Buy Again Coming Soon!")}
                        className="px-6 py-3 rounded-lg bg-yellow-400 text-white text-button hover:scale-105 transition-all duration-200 shadow-sm"
                      >
                        Buy Again
                      </button>
                    )}
                    {/*---ปุ่ม View Details */}
                    <button
                      className="px-6 py-3 rounded-lg bg-tertiary text-white text-button hover:scale-105 transition-all duration-200 shadow-sm"
                      onClick={() => handleViewDetail(order.orderId)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
