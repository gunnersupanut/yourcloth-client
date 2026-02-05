import React, { useEffect, useState } from "react";
import { bannerService } from "../../services/bannerService";
import { uploadService } from "../../services/uploadService";
import type { IBanner, IBannerPayload } from "../../types/bannerTypes";
import {
  Plus,
  Trash2,
  Edit,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
// import { formatDate } from "../../utils/dateUtils";

// --- Components ย่อย (Modal) ---
interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IBannerPayload, file: File | null) => Promise<void>;
  initialData?: IBanner | null;
  isSubmitting: boolean;
}

const BannerModal: React.FC<BannerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<Partial<IBannerPayload>>({
    title: "",
    is_active: true,
    sort_order: 0,
    start_date: "",
    end_date: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        is_active: initialData.is_active,
        sort_order: initialData.sort_order,
        start_date: initialData.start_date
          ? new Date(initialData.start_date).toISOString().split("T")[0]
          : "",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().split("T")[0]
          : "",
      });
      setPreviewUrl(initialData.image_url);
    } else {
      // Reset form
      setFormData({
        title: "",
        is_active: true,
        sort_order: 0,
        start_date: "",
        end_date: "",
      });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && !selectedFile) {
      alert("Please select an image.");
      return;
    }
    onSubmit(formData as IBannerPayload, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-admin-card border border-gray-700 rounded-2xl w-full max-w-lg shadow-custommain overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-admin-primary/20">
          <h2 className="text-h2xl font-kanit text-white">
            {initialData ? "Edit Banner" : "Add New Banner"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-kanit">
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-cardtitlesecondary text-gray-300">
              Banner Image *
            </label>
            <div className="relative group w-full h-48 bg-admin-bg border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-admin-secondary transition overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-ui">Click to upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Title & Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-ui text-gray-400">Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-admin-bg border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-admin-secondary"
                placeholder="Promotion name..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-ui text-gray-400">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value),
                  })
                }
                className="w-full bg-admin-bg border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-admin-secondary"
              />
            </div>
          </div>

          {/* Dates */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-ui text-gray-400">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.start_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  onClick={(e) => e.currentTarget.showPicker()}
                  className="w-full bg-admin-bg border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-admin-secondary [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-ui text-gray-400">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.end_date || ""}
                  min={formData.start_date || undefined}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  onClick={(e) => e.currentTarget.showPicker()}
                  className="w-full bg-admin-bg border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-admin-secondary [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
                />
              </div>
            </div>
          </div> */}

          {/* Status Toggle */}
          <div className="flex items-center justify-between bg-admin-bg p-3 rounded-lg border border-gray-700">
            <span className="text-white text-sm font-medium">
              Active Status
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, is_active: !formData.is_active })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.is_active ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-admin-secondary text-admin-primary font-bold py-3 rounded-xl mt-4 hover:brightness-110 transition shadow-custombutton flex justify-center items-center gap-2"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={20} />}
            {isSubmitting ? "Saving..." : "Save Banner"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const AdminBannerPage = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSave = async (data: IBannerPayload, file: File | null) => {
    try {
      setIsSubmitting(true);
      let finalImageUrl = data.image_url;

      if (file) {
        const uploadRes = await uploadService.uploadBannerImage(file);
        finalImageUrl = uploadRes.url;
      }

      const payload: IBannerPayload = {
        ...data,
        image_url: finalImageUrl,
        start_date: data.start_date === "" ? null : data.start_date,
        end_date: data.end_date === "" ? null : data.end_date,
      };

      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, payload);
      } else {
        await bannerService.createBanner(payload);
      }

      setIsModalOpen(false);
      setEditingBanner(null);
      fetchBanners();
    } catch (error) {
      console.error("Save error", error);
      alert("Error saving banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชันนี้ผูกกับปุ่มถังขยะ (แทนอันเดิม)
  const handleDeleteClick = (id: number) => {
    setBannerToDelete(id); // จำไว้ก่อนว่าจะลบตัวไหน
    setIsDeleteModalOpen(true); // เปิด Modal
  };

  // ฟังก์ชันนี้ผูกกับปุ่ม Confirm ใน Modal (ลบจริง)
  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;

    setIsDeleting(true);
    try {
      await bannerService.deleteBanner(bannerToDelete);

      // อัปเดต UI
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete));
      toast.success("Banner deleted successfully");

      // ปิด Modal
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete error", error);
      toast.error("Failed to delete banner");
    } finally {
      setIsDeleting(false);
      setBannerToDelete(null); // เคลียร์ ID ทิ้ง
    }
  };
  const handleToggleActive = async (banner: IBanner) => {
    try {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === banner.id ? { ...b, is_active: !b.is_active } : b,
        ),
      );
      await bannerService.updateBanner(banner.id, {
        is_active: !banner.is_active,
      });
    } catch (error) {
      console.error("Toggle error", error);
      fetchBanners();
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: IBanner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-admin-bg p-6 font-kanit text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <p className="text-gray-400 mt-1">
            Manage advertising banners and promotions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-admin-secondary text-admin-primary px-6 py-3 rounded-xl font-bold shadow-custombutton hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">
          <Loader2 className="animate-spin mr-2" /> Loading Data...
        </div>
      ) : (
        /* Banner Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-admin-card rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col group ${
                banner.is_active
                  ? "border-gray-700 hover:border-admin-secondary/50"
                  : "border-red-900/50 opacity-75"
              }`}
            >
              {/* Image Area */}
              <div className="relative h-48 bg-gray-900 overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      banner.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {banner.is_active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                {/* Order Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-white">
                  Order: {banner.sort_order}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 flex-1 flex flex-col">
                <h3
                  className="text-h3xl font-bold mb-1 truncate"
                  title={banner.title}
                >
                  {banner.title || "No Title"}
                </h3>

                {/* Dates Info */}
                {/* <div className="text-xs text-gray-400 space-y-1 mt-2 mb-4 bg-admin-bg p-2 rounded-lg">
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="text-gray-300">
                      {banner.start_date ? formatDate(banner.start_date) : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="text-gray-300">
                      {banner.end_date ? formatDate(banner.end_date) : "-"}
                    </span>
                  </div>
                </div> */}

                <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                  {/* Switch Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${
                        banner.is_active ? "bg-green-500" : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                          banner.is_active ? "translate-x-4" : ""
                        }`}
                      ></div>
                    </button>
                    <span className="text-xs text-gray-400">
                      {banner.is_active ? "On" : "Off"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2 text-gray-400 hover:text-admin-secondary hover:bg-white/5 rounded-lg transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(banner.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Modal */}
      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingBanner}
        onSubmit={handleSave}
        isSubmitting={isSubmitting}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        variant="danger"
        confirmText="Yes, Delete it"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminBannerPage;
