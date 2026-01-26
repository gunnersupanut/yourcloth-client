import { ShoppingBag, Users, DollarSign, Package, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // --- Mock Data สำหรับโชว์ Vibe ---
  const stats = [
    { title: "Total Sales", value: "฿45,200", icon: <DollarSign />, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "New Orders", value: "12", icon: <ShoppingBag />, color: "text-admin-secondary", bg: "bg-admin-secondary/10" },
    { title: "Total Users", value: "1,240", icon: <Users />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Pending Task", value: "5", icon: <Package />, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="min-h-screen bg-admin-bg p-6 font-kanit text-white">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-h1xl font-bold">Command <span className="text-admin-secondary">Center</span></h1>
          <p className="text-gray-400 text-bodyxl">ภาพรวมระบบ YourCloth ประจำวันนี้</p>
        </div>
        <div className="bg-admin-card p-3 rounded-xl border border-gray-700 flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-ui">System Online</span>
        </div>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div key={index} className="bg-admin-card p-6 rounded-[25px] border border-gray-700 shadow-admin hover:border-admin-secondary transition-all">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <TrendingUp className="text-gray-500 w-4 h-4" />
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">{item.title}</p>
              <h3 className="text-h2xl font-bold mt-1">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table (Mock) */}
        <div className="lg:col-span-2 bg-admin-card rounded-[30px] border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h3xl font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-admin-secondary flex items-center gap-1 hover:underline text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto text-left">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-ui uppercase border-b border-gray-700">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[101, 102, 103].map((id) => (
                  <tr key={id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 font-bold text-admin-secondary">#ORD-{id}</td>
                    <td className="py-4 text-gray-300">Gunnr</td>
                    <td className="py-4">
                      <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs">Pending</span>
                    </td>
                    <td className="py-4 font-bold">฿1,250</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          <div className="bg-admin-card rounded-[30px] border border-gray-700 p-6 h-full">
            <h2 className="text-h3xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
                <button className="w-full py-4 bg-admin-primary hover:bg-blue-800 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20">
                    Add New Product
                </button>
                <button className="w-full py-4 border border-gray-600 hover:bg-gray-700 rounded-2xl font-bold transition-all">
                    System Settings
                </button>
                <div className="mt-8 p-4 bg-admin-secondary/5 border border-admin-secondary/20 rounded-2xl">
                    <p className="text-admin-secondary font-bold text-sm">Hi Hi:</p>
                    <p className="text-gray-400 text-xs mt-1 italic">"Ayo! 🔥"</p>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;