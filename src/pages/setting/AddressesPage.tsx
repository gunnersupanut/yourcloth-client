import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { addressService } from "../../services/addressService"; // Service ที่นายให้มา
import AddNewAddressModal from "../../components/AddNewAddressModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import type { Address } from "../../types/addressTypes";

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null); // เก็บข้อมูลที่จะ Edit

  // Delete States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await addressService.getMyAddresses();
      // res น่าจะเป็น array address ตรงๆ ตามโค้ดนาย
      console.log("res data:", res);
      setAddresses(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefault(id);
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to set default address");
    }
  };

  const handleDelete = async () => {
    if (!addressToDelete) return;
    setIsDeleting(true);
    try {
      await addressService.deleteAddress(addressToDelete);
      toast.success("Address deleted successfully");
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete address");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    }
  };

  // เปิด Modal เพิ่มใหม่
  const openAddModal = () => {
    setEditingAddress(null); // ล้างค่าเก่า
    setIsModalOpen(true);
  };

  //  เปิด Modal แก้ไข (ต้องแปลงข้อมูลให้ตรงกับ Form State ของนาย)
  const openEditModal = (addr: Address) => {
    const formData: Address = {
      id: addr.id,
      recipient_name: addr.recipient_name,
      phone_number: addr.phone_number,
      address_detail: addr.address_detail,
      province: addr.province,
      district: addr.district,
      sub_district: addr.sub_district,
      zip_code: addr.zip_code,
      is_default: addr.is_default,
    };
    setEditingAddress(formData);
    setIsModalOpen(true);
  };

  //  Handle Confirm จาก Modal (รับข้อมูลจาก Form -> แปลง -> ส่ง API)
  const handleModalConfirm = async (formData: any) => {
    try {
      const payload = {
        recipientName: formData.recipientName,
        phoneNumber: formData.phoneNumber,
        province: formData.province,
        district: formData.district,
        subDistrict: formData.subDistrict,
        zipCode: formData.zipCode,
        addressDetail: formData.addressDetail,
        isDefault: formData.isDefault,
      };

      if (editingAddress) {
        // Update
        await addressService.updateAddress(editingAddress.id, payload);
        toast.success("Address updated successfully!");
      } else {
        // Create
        await addressService.createAddress(payload);
        toast.success("New address added successfully!");
      }

      fetchAddresses(); // Refresh หน้าจอ
    } catch (error) {
      console.error(error);
      toast.error("Failed to save address.");
    }
  };

  // จัดเรียง: เอา Default ไว้บนสุดเสมอ
  const sortedAddresses = [...addresses].sort((a, b) =>
    a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1,
  );

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" size={40} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-[32px] shadow-lg border border-gray-100 font-kanit min-h-[600px] relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#594a60]">Addresses</h1>
      </div>

      <div className="space-y-4 bg-[#A898B0] p-6 rounded-[32px]">
        {/* Render Cards Loop เดียวไปเลย (Sort แล้ว) */}
        {sortedAddresses.map((addr) => {
          const isDefault = addr.is_default;

          return (
            <div key={addr.id}>
              {/* Header "Default" */}
              {isDefault && (
                <h3 className="text-white mb-2 text-xl font-bold ml-2">
                  Default
                </h3>
              )}

              <div className="flex items-stretch rounded-2xl overflow-hidden shadow-md group min-h-[120px]">
                {/* 🔥 Left Side: Dot + Name/Phone (สีทึบ) */}
                <div
                  onClick={() => !isDefault && handleSetDefault(addr.id)}
                  className={`w-[40%] p-5 flex flex-col justify-center gap-2 transition-colors cursor-pointer relative
            ${isDefault ? "bg-[#6D5D6E] text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}
          `}
                >
                  {/* Container สำหรับ Dot + Name */}
                  <div className="flex items-center gap-3">
                    {/* Dot Indicator */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shrink-0
                ${isDefault ? "bg-[#FFD700]" : "bg-white"}
              `}
                    />

                    {/* Name */}
                    <p className="font-bold text-lg leading-tight truncate">
                      {addr.recipient_name}
                    </p>
                  </div>

                  {/* Phone (ขยับให้ตรงกับชื่อ) */}
                  <p className="text-sm opacity-90 pl-7">{addr.phone_number}</p>
                </div>

                {/* Right Side: Address & Actions (สีขาว) */}
                <div className="w-[60%] p-5 bg-white flex items-center justify-between relative">
                  {/* Address Text */}
                  <div className="text-sm text-gray-600 leading-relaxed pr-8 line-clamp-3">
                    {addr.address_detail} <br />
                    {addr.sub_district}, {addr.district} <br />
                    {addr.province} {addr.zip_code}
                  </div>

                  {/* Actions (Absolute Bottom-Right) */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="p-1.5 text-secondary hover:scale-105 hover:bg-yellow-50 rounded-full transition-all"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    {!isDefault && (
                      <button
                        onClick={() => {
                          setAddressToDelete(addr.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {!isLoading && addresses.length === 0 && (
          <div className="text-center py-12 text-white/80 border-2 border-dashed border-white/30 rounded-2xl">
            <MapPin size={48} className="mx-auto mb-2" />
            <p>No addresses found. Add one now</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={openAddModal}
          className="bg-white border-2 border-[#594a60] text-[#594a60] font-bold px-6 py-3 rounded-full shadow-lg hover:bg-[#594a60] hover:text-white transition-all flex items-center gap-2"
        >
          <Plus size={24} /> Add New Address
        </button>
      </div>

      <AddNewAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        initialData={editingAddress}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Address?"
        message="Are you sure you want to delete this address?"
        variant="danger"
        confirmText="Yes, Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AddressesPage;
