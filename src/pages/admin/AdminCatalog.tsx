import { useState } from "react";
import { Package, Image as ImageIcon, TicketPercent, Plus } from "lucide-react";
// import AdminProductList from "../features/admin/AdminProductList"; // สมมติว่าแยก Component ไว้
// import AdminBannerList from "../features/admin/AdminBannerList";
// import AdminDiscountList from "../features/admin/AdminDiscountList";

const AdminCatalog = () => {
  // 1. State สำหรับเก็บ Tab ที่เลือกอยู่ (Default เป็น 'products')
  const [activeTab, setActiveTab] = useState<'products' | 'banners' | 'discounts'>('products');

  // 2. ข้อมูล Tab เมนู
  const tabs = [
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'banners', label: 'Banners', icon: <ImageIcon size={18} /> },
    { id: 'discounts', label: 'Discounts', icon: <TicketPercent size={18} /> }, // ทำทีหลังได้
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Catalog Management</h1>
          <p className="text-gray-400 mt-1">Manage your products, banners, and promotions here.</p>
        </div>
        
        {/* ปุ่ม Add จะเปลี่ยน Action ไปตาม Tab ที่เลือก */}
        <button 
            className="flex items-center gap-2 bg-admin-primary text-admin-secondary px-5 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
            onClick={() => console.log(`Create new ${activeTab}`)}
        >
          <Plus size={20} />
          Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </button>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="flex p-1 space-x-1 bg-admin-card border border-gray-700 rounded-xl w-full sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-admin-bg text-white shadow-sm ring-1 ring-gray-700'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Content Area --- */}
      <div className="bg-admin-card border border-gray-700 rounded-2xl p-6 shadow-xl min-h-[500px]">
        
        {/* Products Content */}
        {activeTab === 'products' && (
           "" //  <AdminProductList /> // ใส่ Component ตารางสินค้าตรงนี้
        )}

        {/* Banners Content */}
        {activeTab === 'banners' && (
             <div className="text-center py-20 text-gray-500">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white">Banner Management</h3>
                <p>Coming Soon...</p>
             </div>
        )}

        {/* Discounts Content */}
        {activeTab === 'discounts' && (
             <div className="text-center py-20 text-gray-500">
                <TicketPercent size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white">Discount Coupons</h3>
                <p>Coming Soon </p>
             </div>
        )}

      </div>
    </div>
  );
};

export default AdminCatalog;