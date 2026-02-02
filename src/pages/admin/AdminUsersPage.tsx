import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  Power,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminUserService } from "../../services/adminUserService";
import type { AdminUser } from "../../types/adminUserTypes";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminUserService.getUsers(page, search);
      setUsers(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [page, search]);

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = !user.is_active;
    const actionText = newStatus ? "Activated" : "Banned";

    // Optimistic Update
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u))
    );

    try {
      await adminUserService.toggleStatus(user.id, newStatus);
      toast.success(`User ${actionText} successfully!`);
    } catch (error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: !newStatus } : u))
      );
      toast.error(`Failed to ${actionText.toLowerCase()} user`);
    }
  };

  return (
    // 🔥 1. แก้พื้นหลังเป็น admin-bg (Dark Theme)
    <div className="p-6 font-kanit min-h-screen bg-admin-bg text-gray-200">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          {/* 🔥 2. Header สไตล์เดียวกับ Order Page (ขาว + เหลือง) */}
          <h1 className="text-3xl font-bold text-white">
            User <span className="text-admin-secondary">Management</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1 ml-1">Total Users: {users.length}</p>
        </div>

        {/* Search Bar สไตล์ Dark */}
        <div className="relative w-full md:w-96">
          <div className="relative">
             <input
              type="text"
              placeholder="Search username, email..."
              // 🔥 3. Input พื้นหลังเข้ม (admin-card)
              className="w-full bg-admin-card border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-admin-secondary/50 focus:border-admin-secondary outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* 🔥 4. Table Container พื้นหลังเข้ม (admin-card) */}
      <div className="overflow-hidden rounded-xl border border-gray-700 bg-admin-card shadow-xl min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center h-full flex-1">
            <Loader2 className="animate-spin text-admin-secondary" size={48} />
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              {/* Table Header: พื้นหลังเข้มกว่าการ์ดนิดหน่อย */}
              <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-bold tracking-wider border-b border-gray-700">
                <tr>
                  <th className="px-6 py-5">User Info</th>
                  <th className="px-6 py-5">Contact</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Verify</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="divide-y divide-gray-700/50 text-gray-300">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-opacity-50
                          ${
                            user.is_active
                              ? "bg-gradient-to-br from-admin-primary to-blue-600 ring-blue-500"
                              : "bg-gray-700 ring-gray-600"
                          }
                        `}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-bold text-base ${user.is_active ? "text-white" : "text-gray-500"}`}>
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-200 font-medium">
                          {user.name ? (
                            `${user.name} ${user.surname || ""}`
                          ) : (
                            <span className="text-gray-600 italic">No Name</span>
                          )}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 font-mono">
                          {user.tel || "-"}
                        </p>
                      </div>
                    </td>

                    {/* Status Badge (Glassmorphism) */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize shadow-sm
                        ${
                          user.is_active
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      `}
                      >
                        {user.is_active ? "Active" : "Banned"}
                      </span>
                    </td>

                    {/* Verified Icon */}
                    <td className="px-6 py-4 text-center">
                      {user.is_verify ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                            <ShieldCheck size={18} className="text-blue-400" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/30">
                             <ShieldAlert size={18} className="text-gray-600" />
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2.5 rounded-lg transition-all duration-200
                          ${
                            user.is_active
                              ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
                              : "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/20"
                          }
                        `}
                        title={user.is_active ? "Ban User" : "Activate User"}
                      >
                        <Power size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {users.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-24 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-800/50 p-4 rounded-full mb-3">
                             <User className="h-10 w-10 opacity-30" />
                        </div>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm opacity-60">Try searching for something else</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Style: Dark */}
        <div className="bg-gray-900/30 px-6 py-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
          <span>
            Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-admin-card border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-admin-card border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;