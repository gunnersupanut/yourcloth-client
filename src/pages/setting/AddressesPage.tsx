import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { addressService } from "../../services/addressService"; 
import AddNewAddressModal from "../../components/AddNewAddressModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import type { Address } from "../../types/addressTypes";

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

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

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

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
        await addressService.updateAddress(editingAddress.id, payload);
        toast.success("Address updated successfully!");
      } else {
        await addressService.createAddress(payload);
        toast.success("New address added successfully!");
      }

      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save address.");
    }
  };

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
    // Responsive Container: Padding ลดลงบนมือถือ
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-xl md:rounded-[32px] shadow-lg border border-gray-100 font-kanit min-h-[600px] relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#594a60]">Addresses</h1>
        
        {/* ปุ่ม Add บนมือถือ ย้ายมาไว้ข้างบนให้กดง่าย */}
        <button
          onClick={openAddModal}
          className="md:hidden w-full bg-[#594a60] text-white font-bold px-4 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={20} /> Add New Address
        </button>
      </div>

      <div className="space-y-4 bg-[#A898B0] p-4 md:p-6 rounded-2xl md:rounded-[32px]">
        {sortedAddresses.map((addr) => {
          const isDefault = addr.is_default;

          return (
            <div key={addr.id}>
              {isDefault && (
                <h3 className="text-white mb-2 text-lg md:text-xl font-bold ml-1">
                  Default
                </h3>
              )}

              {/* 🔥 Responsive Card Layout: Flex-col on mobile, Flex-row on desktop */}
              <div className="flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden shadow-md group min-h-[120px] transition-transform hover:scale-[1.01]">
                
                {/* Part 1: Contact Info (Clickable for Default) */}
                <div
                  onClick={() => !isDefault && handleSetDefault(addr.id)}
                  className={`w-full md:w-[40%] p-4 md:p-5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-2 transition-colors cursor-pointer relative
                    ${isDefault ? "bg-[#6D5D6E] text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Dot Indicator */}
                    <div
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shrink-0
                        ${isDefault ? "bg-[#FFD700] shadow-[0_0_10px_#FFD700]" : "bg-white"}
                      `}
                    />

                    <div className="flex flex-col">
                      <p className="font-bold text-base md:text-lg leading-tight truncate capitalize">
                        {addr.recipient_name}
                      </p>
                      {/* Mobile Phone show here */}
                      <p className="md:hidden text-xs opacity-80 font-mono mt-0.5">{addr.phone_number}</p>
                    </div>
                  </div>

                  {/* Desktop Phone */}
                  <p className="hidden md:block text-sm opacity-90 pl-7 font-mono">{addr.phone_number}</p>
                  
                  {/* Mobile Default Badge */}
                   {isDefault && <span className="md:hidden text-[10px] bg-[#FFD700] text-[#6D5D6E] px-2 py-0.5 rounded-full font-bold">Default</span>}
                </div>

                {/* Part 2: Address Detail & Actions */}
                <div className="w-full md:w-[60%] p-4 md:p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between relative gap-4">
                  {/* Address Text */}
                  <div className="text-sm text-gray-600 leading-relaxed pr-0 md:pr-12 break-words w-full">
                    <p className="font-medium text-gray-800 mb-1">{addr.address_detail}</p>
                    <p className="text-xs text-gray-500">
                      {addr.sub_district}, {addr.district}, <br className="hidden md:block"/> 
                      {addr.province} {addr.zip_code}
                    </p>
                  </div>

                  {/* Actions (Absolute on Desktop, Flex on Mobile) */}
                  <div className="flex md:absolute md:bottom-3 md:right-3 gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 border-gray-100">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="flex items-center gap-1 md:block px-3 py-1.5 md:p-2 text-secondary bg-yellow-50 md:bg-transparent rounded-lg md:rounded-full hover:scale-105 hover:bg-yellow-100 transition-all text-xs md:text-base font-bold md:font-normal"
                    >
                      <Pencil size={16} className="md:w-[18px] md:h-[18px]" /> <span className="md:hidden">Edit</span>
                    </button>

                    {!isDefault && (
                      <button
                        onClick={() => {
                          setAddressToDelete(addr.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="flex items-center gap-1 md:block px-3 py-1.5 md:p-2 text-red-500 bg-red-50 md:bg-transparent rounded-lg md:rounded-full hover:bg-red-100 transition-all text-xs md:text-base font-bold md:font-normal"
                      >
                        <Trash2 size={16} className="md:w-[18px] md:h-[18px]" /> <span className="md:hidden">Delete</span>
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

      {/* Floating Add Button (Desktop Only) */}
      <div className="hidden md:flex mt-8 justify-end">
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