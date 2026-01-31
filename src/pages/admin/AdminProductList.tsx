import { useEffect, useState, useMemo } from "react";
import { Edit, Trash2, Eye, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { productService } from "../../services/product.service";

const AdminProductList = () => {
  // --- States ---
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // เปิด/ปิดเมนู Filter
  const [statusFilter, setStatusFilter] = useState("All"); // All | Active | Out of Stock
  const [categoryFilter, setCategoryFilter] = useState("All");

  // --- Fetch Data ---
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productService.getAdmin();
      const data = (res as any).data || res;
      setProducts(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("โหลดข้อมูลไม่สำเร็จ! ลองใหม่นะวัยรุ่น 😭");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helpers ---
  const formatPrice = (min: number, max: number) => {
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const minStr = Number(min).toLocaleString("en-US", options);
    const maxStr = Number(max).toLocaleString("en-US", options);
    return min === max ? `฿${minStr}` : `฿${minStr} - ${maxStr}`;
  };

  // หา Category ทั้งหมดที่มีในรายการสินค้า (เพื่อมาทำ Dropdown)
  const availableCategories = useMemo(() => {
    const cats = products.map((p) => p.category || "N/A");
    return ["All", ...Array.from(new Set(cats))]; // Unique Category
  }, [products]);

  // Filter Logic (รวม Search + Status + Category)
  const filteredProducts = products.filter((p) => {
    // Search by Name
    const matchName = p.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by Status
    const matchStatus =
      statusFilter === "All" || p.calculated_status === statusFilter;

    // Filter by Category
    const productCat = p.category || "N/A";
    const matchCategory =
      categoryFilter === "All" || productCat === categoryFilter;

    return matchName && matchStatus && matchCategory;
  });

  // Reset Filters Helper
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setIsFilterOpen(false);
  };

  return (
    <div className="space-y-6 font-kanit pb-20">
      {/* --- Search & Filter Bar --- */}
      <div className="flex flex-col gap-4 bg-admin-card p-4 rounded-xl border border-gray-700 shadow-sm relative z-20">
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-admin-bg border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-admin-primary outline-none transition-all"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex gap-2">
            {/* ถ้ามีการ Filter อยู่ ให้โชว์ปุ่ม Clear */}
            {(statusFilter !== "All" || categoryFilter !== "All") && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-400 hover:text-red-300 underline self-center mr-2"
              >
                Clear Filters
              </button>
            )}

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all ${
                isFilterOpen ||
                statusFilter !== "All" ||
                categoryFilter !== "All"
                  ? "bg-admin-primary text-white border-admin-primary"
                  : "bg-admin-bg text-gray-300 border-gray-600 hover:text-white hover:border-gray-500"
              }`}
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Menu  */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700 animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Active", "Out of Stock"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      statusFilter === status
                        ? "bg-admin-secondary text-black font-bold"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-admin-bg border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-admin-primary outline-none"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* --- Table Area --- */}
      <div className="overflow-hidden rounded-xl border border-gray-700 bg-admin-card shadow-xl min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price Range</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {/* 🔥 CASE 1: Loading (Skeleton) */}
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {/* ... Skeleton เดิม ... */}
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 bg-gray-700 rounded-lg inline-block mr-3"></div>
                      <div className="h-4 w-32 bg-gray-700 rounded inline-block"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-10 bg-gray-700 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-700 rounded-full mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-8 bg-gray-700 rounded inline-block ml-2"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                /* 🔥 CASE 2: No Data (หลัง Filter) */
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-gray-500"
                  >
                    <PackageIcon />
                    <p className="mt-2 text-lg">No products found.</p>
                    {(statusFilter !== "All" ||
                      categoryFilter !== "All" ||
                      searchTerm) && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 text-admin-primary hover:underline"
                      >
                        Clear filters & Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                /* Real Data */
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* ... (Render Logic เดิม) ... */}
                    {/* Image & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-gray-600 flex-shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-admin-secondary transition-colors line-clamp-1">
                            {product.product_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.gender || "Unisex"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">
                        {product.category || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-admin-secondary font-medium whitespace-nowrap">
                      {formatPrice(product.min_price, product.max_price)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {parseInt(product.total_stock) === 0 ? (
                        <span className="text-red-500 font-bold text-xl">
                          -
                        </span>
                      ) : (
                        <span className="text-white font-bold">
                          {product.total_stock}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${
                          product.calculated_status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {product.calculated_status}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 hover:bg-admin-primary/20 text-admin-primary rounded-lg transition-colors"
                          title="View Details"
                          onClick={() => {
                            //  เปิด Tab ใหม่ ไปยังหน้าสินค้าจริง (หน้าบ้าน)
                            // สมมติ Route หน้าบ้านคือ /product/:id
                            window.open(
                              `/shop/${product.category}/${product.id}`,
                              "_blank",
                            );
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors"
                          title="Edit"
                          onClick={() => console.log("Edit", product.id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="bg-white/5 px-6 py-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            {/* Pagination (ปิดไว้ก่อน) */}
          </div>
        )}
      </div>
    </div>
  );
};

const PackageIcon = () => (
  <svg
    className="mx-auto h-12 w-12 text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

export default AdminProductList;
