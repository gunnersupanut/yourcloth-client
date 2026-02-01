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
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../../services/product.service";
import { uploadService } from "../../services/uploadService";
import { masterService } from "../../services/masterService";

// --- Interface (Type Safety หน่อย จะได้ไม่แดง) ---
interface MasterData {
  id: number;
  name: string;
  code?: string; // เฉพาะ Color
}

// 🔥 Component ย่อย: ปุ่มเลือกสี (Color Swatch)
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
        // เช็คว่าเป็นสีขาว/เหลืองไหม (เพื่อเปลี่ยนสี icon ให้มองเห็น)
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
            {/* ติ๊กถูกเมื่อเลือก */}
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

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true); // เช็คว่าโหลด Master Data เสร็จยัง

  // --- 🔥 Master Data States (ดึงจาก DB) ---
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
    category_id: 0, // รอโหลดเสร็จค่อย set default
    gender_id: 0,
  });

  const [variants, setVariants] = useState([
    { color_id: 0, size_id: 0, price: 0, stock_quantity: 0 },
  ]);

  // --- Fetch Master Data ---
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const data = await masterService.getMetadata();

        const cats = data.categories || [];
        const gens = data.genders || [];
        const cols = data.colors || [];
        const szs = data.sizes || [];
        // --- Default Value ---
        setCategories(cats);
        setGenders(gens);
        setColors(cols);
        setSizes(szs);
        setFormData((prev) => ({
          ...prev,
          category_id: cats.length > 0 ? cats[0].id : prev.category_id,
          gender_id: gens.length > 0 ? gens[0].id : prev.gender_id,
        }));
        // Set Default ให้ Variant แรกด้วย
        if (cols.length > 0 && szs.length > 0) {
            setVariants(prev => [{
                ...prev[0], 
                color_id: cols[0].id,
                size_id: szs[0].id
            }]);
        }
      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("Failed to load options from server.");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchMasterData();
  }, []);

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

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_name) return toast.error("Product name is required!");
    if (!selectedFile && !formData.image_url)
      return toast.error("Product image is required!");
    if (variants.some((v) => v.price <= 0))
      return toast.error("Price must be greater than 0!");

    setIsLoading(true);
    try {
      let finalImageUrl;

      // 1. Upload Image (ถ้ามี)
      if (selectedFile) {
        try {
          finalImageUrl = await uploadService.uploadProductImage(selectedFile);
        } catch (uploadError) {
          console.error(uploadError);
          toast.error("Image upload failed");
          setIsLoading(false);
          return;
        }
      }

      // 2. Create Product
      const payload = {
        ...formData,
        image_url: finalImageUrl?.url,
        file_path: finalImageUrl?.publicId,
        category_id: Number(formData.category_id),
        gender_id: Number(formData.gender_id),
        variants: variants,
      };

      await productService.create(payload);

      toast.success("Product Created Successfully.");
      navigate("/admin/catalog");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Loading State ---
  if (isDataLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Loading System Data...
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
              Create New Product
            </h1>
            <p className="text-gray-400 text-sm">
              Add a new item to your store.
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
          {isLoading ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-admin-card border border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
              General Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Product Name *
              </label>
              <input
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full bg-admin-bg border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-admin-primary outline-none"
                placeholder="e.g. Streetwear T-Shirt"
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
                placeholder="Product details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Dynamic Category */}
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
              {/* Dynamic Gender */}
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
                  className="grid grid-cols-12 gap-4 items-start bg-admin-bg p-4 rounded-xl border border-gray-700"
                >
                  {/* 🔥 Color Selector (New UI) */}
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

                  {/* Dynamic Size */}
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

                  {/* Price */}
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
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Stock */}
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
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Delete */}
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
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </>
                ) : formData.image_url ? (
                  <>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/300?text=Invalid+URL")
                      }
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 group-hover:text-admin-primary">
                    <Upload className="mx-auto mb-2" size={32} />
                    <p className="text-sm font-bold">Click to Select</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Image will upload on Save
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

export default AdminCreateProduct;
