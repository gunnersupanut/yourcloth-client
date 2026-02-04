import { useEffect, useState } from "react";
import { supportService } from "../../services/supportService";
import {
  Loader2,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  User,
  X,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import type { ISupportTicket } from "../../types/supportTypes";
import { formatDate } from "../../utils/dateUtils";

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [resolveNote, setResolveNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Data
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await supportService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Open Modal (กดปุ่ม Resolve ในตารางแล้วมาฟังก์ชันนี้)
  const openResolveModal = (id: number) => {
    setSelectedTicketId(id);
    setResolveNote(""); // Default value
    setIsModalOpen(true);
  };

  // Confirm Resolve (Logic ยิง API ย้ายมาอยู่นี่)
  const handleConfirmResolve = async () => {
    if (!selectedTicketId) return;

    if (resolveNote.trim() === "") {
      toast.error("Please provide a solution note.");
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.resolveTicket(selectedTicketId, resolveNote);

      toast.success("Ticket Resolved.");

      // Optimistic UI Update
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicketId
            ? { ...t, status: "RESOLVED", admin_response: resolveNote }
            : t,
        ),
      );

      // Close Modal
      setIsModalOpen(false);
      setSelectedTicketId(null);
    } catch (error) {
      console.error(error);
      toast.error("Error resolving ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg text-white font-kanit relative">
      {/* Header & Stats (เหมือนเดิม) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-h1xl ">
            Support <span className="text-secondary">Center</span>
          </h1>
          <p className="text-gray-400 mt-1">
            Manage user inquiries and issues.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-admin-card border border-gray-700 rounded-xl px-4 py-2 text-center">
            <span className="text-sm text-gray-400">Pending</span>
            <p className="text-2xl font-bold text-admin-secondary">
              {tickets.filter((t) => t.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-admin-card border border-gray-700 rounded-xl px-4 py-2 text-center">
            <span className="text-sm text-gray-400">Resolved</span>
            <p className="text-2xl font-bold text-green-500">
              {tickets.filter((t) => t.status === "RESOLVED").length}
            </p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-admin-card border border-gray-700 rounded-2xl shadow-custommain overflow-hidden">
        {loading ? (
          <div className="h-64 flex flex-col justify-center items-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            Loading Data...
          </div>
        ) : tickets.length === 0 ? (
          <div className="h-64 flex flex-col justify-center items-center text-gray-500">
            <CheckCircle size={48} className="mb-4 opacity-50" />
            <p>No support tickets found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-admin-primary/20 text-gray-300 uppercase text-xs tracking-wider border-b border-gray-700">
                  <th className="p-4 w-[120px]">Date</th>
                  <th className="p-4 w-[250px]">User Info</th>
                  <th className="p-4">Issue Detail</th>
                  <th className="p-4 w-[150px] text-center">Status</th>
                  <th className="p-4 w-[150px] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* ... Date, User Info, Issue, Status Columns เหมือนเดิม ... */}

                    {/* Date */}
                    <td className="p-4 text-sm text-gray-400 align-top">
                      {new Date(ticket.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                      <div className="text-xs opacity-50">
                        {new Date(ticket.created_at).toLocaleTimeString(
                          "en-GB",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </div>
                    </td>

                    {/* User Info */}
                    <td className="p-4 align-top">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2 font-bold text-white text-lg">
                          <User size={16} className="text-admin-secondary" />
                          {ticket.username}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Mail size={12} /> {ticket.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-admin-secondary/80">
                          <Phone size={12} /> {ticket.tel || "No Phone"}
                        </div>
                      </div>
                    </td>

                    {/* Issue */}
                    <td className="p-4 align-top">
                      <span className="inline-block bg-white/10 text-white text-xs px-2 py-1 rounded mb-2 border border-gray-600">
                        {ticket.topic}
                      </span>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {ticket.message}
                      </p>
                      {ticket.status === "RESOLVED" &&
                        ticket.admin_response && (
                          <div className="mt-3 p-3 bg-green-900/10 border border-green-500/30 rounded-lg relative overflow-hidden group">
                            {/* Background Pattern (ตกแต่งให้ดูมีมิติ) */}
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                              <CheckCircle size={60} />
                            </div>

                            {/* Header: Admin Note + ชื่อคนแก้ */}
                            <div className="flex justify-between items-center mb-2 border-b border-green-500/20 pb-2">
                              <div className="text-xs text-green-400 font-bold flex items-center gap-1">
                                <CheckCircle size={14} />
                                ADMIN NOTE
                              </div>

                              {/* โชว์ชื่อคนแก้ตรงนี้ (ถ้าไม่มีให้ขึ้น System) */}
                              <div className="text-[10px] text-green-300/60 font-mono flex items-center gap-1 tracking-wider">
                                RESOLVED BY
                                <span className="text-green-300 font-bold">
                                  {ticket.resolver_name || "Admin Team"}{" "}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <p className="text-xs text-gray-300 italic leading-relaxed pl-1">
                              "{ticket.admin_response}"
                            </p>

                            {/* Timestamp (แถมให้! ดู Pro ขึ้น) */}
                            <div className="text-[10px] text-right text-gray-500 mt-2">
                              at{" "}
                              {formatDate(ticket.updated_at)}
                            </div>
                          </div>
                        )}
                    </td>

                    {/* Status */}
                    <td className="p-4 align-top text-center">
                      {ticket.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <Clock size={12} /> PENDING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          <CheckCircle size={12} /> RESOLVED
                        </span>
                      )}
                    </td>

                    {/* Action Button: เปลี่ยนมาเรียก openResolveModal */}
                    <td className="p-4 align-top text-center">
                      {ticket.status === "PENDING" ? (
                        <button
                          onClick={() => openResolveModal(ticket.id)}
                          className="bg-admin-secondary text-admin-primary px-4 py-2 rounded-lg text-sm font-bold shadow-custombutton hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto w-full"
                        >
                          <CheckCircle size={16} />
                          Resolve
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          - Closed -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔥 THE COOL MODAL 🔥 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-admin-card w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all scale-100">
            {/* Modal Header */}
            <div className="bg-admin-primary/30 p-4 flex justify-between items-center border-b border-gray-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-admin-secondary" />
                Resolve Ticket
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-sm">
                Please provide an internal note regarding the solution. This
                will be saved for future reference.
              </p>

              <div className="space-y-2">
                <label className="text-sm font-bold text-admin-secondary uppercase tracking-wider">
                  Admin Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  rows={3}
                  className="w-full bg-admin-bg border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:border-admin-secondary focus:ring-1 focus:ring-admin-secondary transition resize-none placeholder-gray-600"
                  placeholder="e.g., Refunded transaction #123..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-black/20 flex gap-3 justify-end border-t border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg text-gray-300 font-bold hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                disabled={isSubmitting}
                className="px-6 py-2 bg-admin-secondary text-admin-primary rounded-lg font-bold shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle size={18} />
                )}
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage;
