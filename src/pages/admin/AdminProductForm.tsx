import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  Upload,
  X,
  Check,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../../services/product.service";
import { uploadService } from "../../services/uploadService";
import { masterService } from "../../services/masterService";

// --- Interface ---
interface MasterData {
  id: number;
  name: string;
  code?: string;
}

interface VariantData {
  variant_id?: number; //  มีเฉพาะตอน Edit
  color_id: number;
  size_id: number;
  price: number;
  stock_quantity: number;
}

//  Component ย่อย ปุ่มเลือกสี
const ColorSelector = ({
  colors,
  selectedId,
  onChange,
}: {
  colors: MasterData[];
  selectedId: number;
  onChange: (id: number) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {colors.map((c) => {
        const isSelected = selectedId === c.id;
        const isLightColor =
          c.code?.toUpperCase() === "#FFFFFF" ||
          c.code?.toUpperCase() === "#FFFF00";

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            title={c.name}
            className={`w-8 h-8 rounded-full border transition-all relative group
              ${
                isSelected
                  ? "ring-2 ring-admin-primary scale-110 border-transparent"
                  : "border-gray-500 hover:scale-105 opacity-70 hover:opacity-100"
              }
            `}
            style={{ backgroundColor: c.code }}
          >
            {isSelected && (
              <span
                className={`absolute inset-0 flex items-center justify-center ${
                  isLightColor ? "text-black" : "text-white"
                }`}
              >
                <Check size={14} strokeWidth={4} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ดึง ID จาก URL
  const isEditMode = Boolean(id); // เช็คโหมด: ถ้ามี ID = Edit, ไม่มี = Create

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // --- Master Data States ---
  const [categories, setCategories] = useState<MasterData[]>([]);
  const [genders, setGenders] = useState<MasterData[]>([]);
  const [colors, setColors] = useState<MasterData[]>([]);
  const [sizes, setSizes] = useState<MasterData[]>([]);

  // --- Form States ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    image_url: "",
    file_path: "", // เพิ่ม file_path
    category_id: 0,
    gender_id: 0,
    is_active: true,
  });

  const [variants, setVariants] = useState<VariantData[]>([
    { color_id: 0, size_id: 0, price: 0, stock_quantity: 0 },
  ]);

  // --- Fetch Data (Master + Product if Edit) ---
  useEffect(() => {
    const initData = async () => {
      try {
        setIsDataLoading(true);

        // โหลด Master Data ก่อน
        const masterData = await masterService.getMetadata();
        const cats = masterData.categories || [];
        const gens = masterData.genders || [];
        const cols = masterData.colors || [];
        const szs = masterData.sizes || [];

        setCategories(cats);
        setGenders(gens);
        setColors(cols);
        setSizes(szs);

        // เช็คว่า Edit หรือ Create
        if (isEditMode && id) {
          // 🔥 EDIT MODE: ดึงข้อมูลสินค้าเดิม
          const product = await productService.getAdminById(Number(id));

          // Map เข้า Form
          setFormData({
            product_name: product.product_name,
            description: product.description || "",
            image_url: product.image_url,
            file_path: product.file_path || "", // รับมาด้วย
            category_id:
              product.category_id || (cats.length > 0 ? cats[0].id : 0),
            gender_id: product.gender_id || (gens.length > 0 ? gens[0].id : 0),
            is_active: product.is_active ?? true,
          });

          // Map Variants
          if (product.variants && product.variants.length > 0) {
            setVariants(
              product.variants.map((v: any) => ({
                variant_id: v.variant_id || v.id, // สำคัญ ต้องเก็บ ID ไว้เช็คว่าเป็นของเก่า
                color_id: v.color_id,
                size_id: v.size_id,
                price: Number(v.price),
                stock_quantity: Number(v.stock_quantity),
              })),
            );
          }
        } else {
          // CREATE MODE: Set Default Values
          setFormData((prev) => ({
            ...prev,
            category_id: cats.length > 0 ? cats[0].id : 0,
            gender_id: gens.length > 0 ? gens[0].id : 0,
          }));

          if (cols.length > 0 && szs.length > 0) {
            setVariants([
              {
                color_id: cols[0].id,
                size_id: szs[0].id,
                price: 0,
                stock_quantity: 0,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data.");
        navigate("/admin/catalog"); // เด้งออกถ้าพัง
      } finally {
        setIsDataLoading(false);
      }
    };

    initData();
  }, [id, isEditMode, navigate]);

  // --- Clean up memory ---
  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, selectedFile]);

  // --- Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "image_url") {
      setSelectedFile(null);
      setPreviewUrl("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File is too large! (Max 5MB)");

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setFormData((prev) => ({ ...prev, image_url: "" }));
    e.target.value = "";
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: Number(value) };
    setVariants(newVariants);
  };

  const addVariant = () => {
    if (colors.length === 0 || sizes.length === 0) return;
    setVariants([
      ...variants,
      {
        color_id: colors[0].id,
        size_id: sizes[0].id,
        price: 0,
        stock_quantity: 0,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1)
      return toast.error("Must have at least one variant!");
    setVariants(variants.filter((_, i) => i !== index));
  };

  // --- Submit Logic (Create + Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_name) return toast.error("Product name is required!");
    // Edit mode: ยอมให้ image_url เดิมค้างอยู่ได้
    if (!selectedFile && !formData.image_url)
      return toast.error("Product image is required!");
    if (variants.some((v) => v.price <= 0))
      return toast.error("Price must be greater than 0!");

    setIsLoading(true);
    try {
      let finalImageUrl = formData.image_url;
      let finalFilePath = formData.file_path; // เก็บ path เดิมไว้ก่อน

      // 1. Upload Image (ถ้ามีการเลือกใหม่)
      if (selectedFile) {
        try {
          const uploadRes =
            await uploadService.uploadProductImage(selectedFile);
          finalImageUrl = uploadRes.url;
          finalFilePath = uploadRes.publicId;
        } catch (uploadError) {
          console.error(uploadError);
          toast.error("Image upload failed");
          setIsLoading(false);
          return;
        }
      }

      // 2Prepare Payload
      const payload = {
        ...formData,
        image_url: finalImageUrl,
        file_path: finalFilePath,
        category_id: Number(formData.category_id),
        gender_id: Number(formData.gender_id),
        variants: variants, // ส่ง variants ที่มี variant_id (ของเก่า) และไม่มี (ของใหม่) ไปให้ backend จัดการ
      };

      // Call API
      if (isEditMode && id) {
        // UPDATE
        await productService.update(Number(id), payload);
        toast.success("Product Updated Successfully.");
      } else {
        // CREATE
        await productService.create(payload);
        toast.success("Product Created Successfully.");
      }

      navigate("/admin/catalog");
    } catch (error) {
      console.error(error);
      toast.error(
        isEditMode ? "Failed to update product" : "Failed to create product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Loading UI ---
  if (isDataLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Loading{" "}
        {isEditMode ? "Product" : "System"} Data...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pb-20 animate-in slide-in-from-right duration-300 font-kanit"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/catalog")}
            className="p-2 bg-admin-card border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-gray-400 text-sm">
              {isEditMode
                ? "Modify existing item details."
                : "Add a new item to your store."}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-admin-primary text-admin-secondary px-6 py-3 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {isLoading
            ? "Saving..."
            : isEditMode
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-admin-card border border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <h2 className="text-lg font-bold text-white">
                General Information
              </h2>

              {/* Switch Toggle */}
              {isEditMode && (
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold ${formData.is_active ? "text-green-400" : "text-gray-500"}`}
                  >
                    {formData.is_active
                      ? "Active (Selling)"
                      : "Inactive (Hidden)"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${formData.is_active ? "bg-green-500" : "bg-gray-600"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-md ${formData.is_active ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Product Name *
              </label>
              <input
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full bg-admin-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-admin-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-admin-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-admin-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full bg-admin-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Gender
                </label>
                <select
                  name="gender_id"
                  value={formData.gender_id}
                  onChange={handleInputChange}
                  className="w-full bg-admin-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white outline-none"
                >
                  {genders.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-admin-card border border-gray-700 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <h2 className="text-lg font-bold text-white">Product Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-sm bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-start bg-admin-bg p-4 rounded-xl border border-gray-700 animate-in fade-in"
                >
                  {/* Color Selector */}
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-xs text-gray-500 mb-1">
                      Color:{" "}
                      <span className="text-white font-bold">
                        {colors.find((c) => c.id === variant.color_id)?.name}
                      </span>
                    </label>
                    <ColorSelector
                      colors={colors}
                      selectedId={variant.color_id}
                      onChange={(id) =>
                        handleVariantChange(index, "color_id", id)
                      }
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Size
                    </label>
                    <select
                      value={variant.size_id}
                      onChange={(e) =>
                        handleVariantChange(index, "size_id", e.target.value)
                      }
                      className="w-full bg-admin-card border border-gray-600 rounded-lg px-2 py-2 text-white text-sm"
                    >
                      {sizes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(index, "price", e.target.value)
                      }
                      className="w-full bg-admin-card border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      min="0"
                    />
                  </div>

                  <div className="col-span-3 md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variant.stock_quantity}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stock_quantity",
                          e.target.value,
                        )
                      }
                      className="w-full bg-admin-card border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      min="0"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center pt-6">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-6">
          <div className="bg-admin-card border border-gray-700 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
              Media
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-full bg-admin-bg border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-admin-primary transition-all"
              >
                {selectedFile ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X
                        className="text-white bg-red-500 rounded-full p-1"
                        size={24}
                        onClick={handleRemoveImage}
                      />
                    </div>
                  </>
                ) : formData.image_url ? (
                  <>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X
                        className="text-white bg-red-500 rounded-full p-1"
                        size={24}
                        onClick={handleRemoveImage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 group-hover:text-admin-primary">
                    <Upload className="mx-auto mb-2" size={32} />
                    <p className="text-sm font-bold">Click to Select</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {isEditMode
                        ? "Change image"
                        : "Image will upload on Save"}
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <span className="text-xs text-gray-500 mb-1 block">
                  Or paste URL directly
                </span>
                <input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full bg-admin-bg border border-gray-600 rounded-lg px-4 py-2 text-white text-xs outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminProductForm;
