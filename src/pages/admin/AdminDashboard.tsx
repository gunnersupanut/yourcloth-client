import { useEffect, useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  Package,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminOrderService } from "../../services/adminOrderService";
import type { AdminOrder } from "../../types/adminOrderTypes";

const AdminDashboard = () => {
  // 1. กำหนด Type ให้ State ตรงๆ ไปเลย
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0, // เพิ่ม
    averageOrderValue: 0, // เพิ่ม
    pendingCount: 0,
    totalUsers: 1240,
    recentOrders: [] as AdminOrder[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // เรียก API
        const response = await adminOrderService.getOrders({
          limit: 1000,
          page: 1,
        });

        const allOrders: AdminOrder[] = response.data.orders || response.data;
        // console.log("All orders.", allOrders);

        // Helper สำหรับเช็คสถานะจ่ายเงินแล้ว
        const paidStatuses = ["PAID", "SHIPPED", "COMPLETE", "COMPLETED"];

        //  ยอดขายรวม
        const totalSales = allOrders
          .filter((o) => paidStatuses.includes(o.status))
          .reduce((sum, order) => sum + Number(order.totalPrice), 0);
        // ยอดขายวันนี้ (Today's Sales)
        const today = new Date().toISOString().slice(0, 10);
        const todaySales = allOrders
          .filter((o) => {
            const orderDate = new Date(o.orderedAt).toISOString().slice(0, 10);
            return orderDate === today && paidStatuses.includes(o.status);
          })
          .reduce((sum, order) => sum + Number(order.totalPrice), 0);

        // ยอดเฉลี่ยต่อบิล (Avg Order Value)
        const paidOrdersCount = allOrders.filter((o) =>
          paidStatuses.includes(o.status),
        ).length;
        const averageOrderValue =
          paidOrdersCount > 0 ? totalSales / paidOrdersCount : 0;

        // Pending & Users
        const pendingCount = allOrders.filter(
          (o) => o.status === "INSPECTING",
        ).length;
        const userIds = allOrders.map((o) => o.userId);
        const uniqueCustomers = new Set(userIds).size;

        setStats({
          totalSales,
          todaySales,
          averageOrderValue,
          pendingCount,
          totalUsers: uniqueCustomers,
          recentOrders: allOrders.slice(0, 5),
        });
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatMoney(stats.totalSales),
      icon: <DollarSign />,
      color: "text-green-400",
      bg: "bg-green-400/10",
      link: null,
    },
    {
      title: "Today's Sales",
      value: formatMoney(stats.todaySales),
      icon: <TrendingUp />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      link: null,
    },
    {
      title: "Avg. Order Value",
      value: formatMoney(stats.averageOrderValue),
      icon: <ShoppingBag />,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      link: null,
    },
    {
      title: "Needs Attention",
      value: stats.pendingCount,
      icon: <Package />,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      link: "/admin/orders?status=PENDING",
    },
  ];

  return (
    <div className="min-h-screen bg-admin-bg p-6 font-kanit text-white">
      {/* ... Header ... */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">
            Command <span className="text-admin-secondary">Center</span>
          </h1>
          <p className="text-gray-400">YourCloth system overview for today.</p>
        </div>
        <div className="bg-admin-card p-3 rounded-xl border border-gray-700 flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full animate-pulse ${isLoading ? "bg-yellow-500" : "bg-green-500"}`}
          ></div>
          <span className="text-sm">
            {isLoading ? "Syncing..." : "System Online"}
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((item, index) => {
          const CardContent = (
            <>
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                  {item.icon}
                </div>
                {item.link ? (
                  <ArrowRight className="text-gray-400 w-4 h-4" />
                ) : (
                  <TrendingUp className="text-gray-500 w-4 h-4" />
                )}
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">{item.title}</p>
                <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
              </div>
            </>
          );

          return item.link ? (
            <Link
              key={index}
              to={item.link}
              className="bg-admin-card p-6 rounded-[25px] border border-gray-700 shadow-lg hover:border-admin-secondary transition-all cursor-pointer block"
            >
              {CardContent}
            </Link>
          ) : (
            <div
              key={index}
              className="bg-admin-card p-6 rounded-[25px] border border-gray-700 shadow-lg transition-all"
            >
              {CardContent}
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-admin-card rounded-[30px] border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-admin-secondary flex items-center gap-1 hover:underline text-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-sm uppercase border-b border-gray-700">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 font-bold text-admin-secondary">
                      #{order.id}
                    </td>

                    <td className="py-4 text-gray-300">
                      {order.customer?.name || "Guest"}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs 
                        ${order.status === "PENDING" ? "bg-gray-500/10 text-gray-500" : ""}
                        ${order.status === "INSPECTING" ? "bg-blue-500/10 text-blue-500" : ""}
                        ${order.status === "SHIPPING" ? "bg-yellow-500/10 text-yellow-500" : ""}
                        ${order.status === "PACKING" ? "bg-purple-500/10 text-purple-500" : ""}
                        ${order.status === "COMPLETE" ? "bg-green-500/10 text-green-500" : ""}
                        ${order.status === "CANCELLED" ? "bg-red-500/10 text-red-500" : ""}
                      `}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-4 font-bold text-right">
                      {formatMoney(order.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {stats.recentOrders.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                There are no orders yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-admin-card rounded-[30px] border border-gray-700 p-6 h-full">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/admin/product/create"
                className="w-full py-4 bg-admin-primary hover:bg-blue-800 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 text-center block"
              >
                + Add New Product
              </Link>
              <Link
                to="/admin/orders"
                className="w-full py-4 border border-gray-600 hover:bg-gray-700 rounded-2xl font-bold transition-all text-center block"
              >
                Check Orders ({stats.pendingCount})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
