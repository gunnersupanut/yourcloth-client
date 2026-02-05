import { useEffect, useState } from "react";
import { adminOrderService } from "../../services/adminOrderService";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import type { AdminOrder } from "../../types/adminOrderTypes";
import AdminOrderDetailModal from "../../components/admin/AdminOrderDetailModal";

// Mapping ระหว่าง Tab หน้าบ้าน กับ Status หลังบ้าน
const TABS = [
  { label: "All", value: "ALL" },
  { label: "Unpaid", value: "PENDING" },
  { label: "To Verify", value: "INSPECTING" },
  { label: "To Ship", value: "PACKING" }, // หรือ SHIPPING แล้วแต่ Flow ร้านนาย
  { label: "To Receive", value: "SHIPPING" },
  { label: "Complete", value: "COMPLETE" },
  { label: "Cancel", value: "CANCEL" },
];

const AdminOrderList = () => {
  // --- State Management ---
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter State
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Modal State
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- Fetch Function ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminOrderService.getOrders({
        page: currentPage,
        limit: itemsPerPage,
        status: activeTab,
        search: searchQuery,
        sortBy,
        startDate,
        endDate,
      });

      if (res.success) {
        setOrders(res.data.orders);
        setTotalOrders(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch orders!");
    } finally {
      setLoading(false);
    }
  };

  // Socket.io
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL);

    socket.on("ADMIN_UPDATE", () => {
      console.log("Refreshing Table...");
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  // --- Effects ---
  // โหลดข้อมูลใหม่เมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage, activeTab, sortBy, startDate, endDate]);

  // --- Handlers ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ไปหน้า 1 เสมอเวลาค้นหา
    fetchOrders();
  };

  const handleTabChange = (statusValue: string) => {
    setActiveTab(statusValue);
    setCurrentPage(1); // Reset ไปหน้า 1
  };

  // --- Helper: Status Color Badge ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      case "INSPECTING":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "PACKING":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "SHIPPING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "COMPLETE":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "CANCEL":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-white";
    }
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };
  const openModal = (id: number) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="space-y-6 font-kanit">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-h2xl font-bold text-white">
            Order <span className="text-admin-secondary">Management</span>
          </h1>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Mock Sort Dropdown */}
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-admin-bg text-white pl-4 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-admin-secondary cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="price_desc">Price: High - Low</option>
                <option value="price_asc">Price: Low - High</option>
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-3 text-admin-secondary pointer-events-none group-hover:scale-110 transition-transform" />
            </div>

            {/* Datepicker */}
            <div className="flex items-center gap-2 bg-admin-bg px-2 py-1 rounded-lg border border-gray-700">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                  className="bg-transparent text-white text-sm focus:outline-none [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                  className="bg-transparent text-white text-sm focus:outline-none [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
                />
              </div>

              {/* ปุ่ม Clear Date (เหมือนเดิม) */}
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilter}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-1 md:flex-none">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Order ID or Customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 bg-gray-200 text-black px-4 py-2.5 pl-10 rounded-l-lg focus:outline-none placeholder-gray-500"
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              </div>
              <button
                type="submit"
                className="bg-admin-secondary text-black px-4 py-2 rounded-r-lg font-bold hover:bg-[#ffdb4d] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-admin-card rounded-t-2xl p-2 border-b border-gray-700 overflow-x-auto custom-scrollbar">
          <div className="flex space-x-2 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                ${
                  activeTab === tab.value
                    ? "bg-admin-primary text-admin-secondary shadow-lg shadow-blue-900/50 font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Table Section */}
        <div className="bg-admin-card rounded-b-2xl border border-gray-700 shadow-xl overflow-hidden -mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-700">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Customer Name</th>
                  <th className="p-4 font-medium">Total Amount</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  // Loading State
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="h-6 bg-gray-700 rounded-full w-20 mx-auto"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-8 w-8 bg-gray-700 rounded-full mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-10 h-10 opacity-20" />
                        <p>No orders found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/5 transition-colors duration-150 group"
                    >
                      <td className="p-4 font-bold text-admin-secondary">
                        #{order.id}
                      </td>
                      <td className="p-4 text-gray-300 text-sm">
                        {new Date(order.orderedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-white font-medium">
                        {order.customer?.name || "Unknown"}
                      </td>
                      <td className="p-4 text-white font-bold">
                        ฿{Number(order.totalPrice).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                        >
                          {/* แปลง PENDING เป็น Unpaid เพื่อการแสดงผล */}
                          {order.status === "PENDING"
                            ? "Unpaid"
                            : order.status === "INSPECTING"
                              ? "To Verify"
                              : order.status === "PACKING"
                                ? "To Ship"
                                : order.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          className="p-2 rounded-full bg-gray-700 hover:bg-admin-secondary hover:text-black text-gray-300 transition-all shadow-lg"
                          title="View Details"
                          onClick={() => openModal(order.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 4. Footer & Pagination */}
          <div className="p-4 border-t border-gray-700 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-admin-bg border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-admin-secondary text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page Info */}
            <div className="text-white">
              Page{" "}
              <span className="font-bold text-admin-secondary">
                {currentPage}
              </span>{" "}
              of <span className="font-bold">{totalPages || 1}</span>
              <span className="ml-2 text-gray-500">({totalOrders} items)</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded-lg bg-gray-700 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="p-2 rounded-lg bg-gray-700 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <AdminOrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrderId}
        onUpdateSuccess={fetchOrders}
      />
    </>
  );
};

export default AdminOrderList;
