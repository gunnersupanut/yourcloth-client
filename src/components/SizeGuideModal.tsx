import { X } from "lucide-react";
import { SIZE_DATA } from "../data/sizeChart";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: string; // รับหมวดหมู่สินค้าเข้ามา
};

const SizeGuideModal = ({ isOpen, onClose, category }: Props) => {
  if (!isOpen) return null;

  // แปลง category ให้เป็น lowercase เพื่อกันเหนียว แล้วดึงข้อมูล
  // ถ้าหาไม่เจอ ให้ใช้ default (หรือแสดงข้อความว่าไม่มี)
  const chartData = SIZE_DATA[category.toLowerCase()] || SIZE_DATA["tops"];
  const IconComponent = chartData.icon;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-primary p-4 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            📏 Size Guide
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
              {IconComponent && (
                <IconComponent size={32} className="text-primary" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">
                {chartData.title}
              </h4>
              <p className="text-sm text-gray-500">
                Unit: Inches / CM (Standard Fit)
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase">
                <tr>
                  {chartData.headers.map((head: string) => (
                    <th key={head} className="px-4 py-3 border-b">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chartData.rows.map((row: string[], i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-4 py-3 ${j === 0 ? "font-bold text-primary" : "text-gray-600"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-gray-400 text-center">
            * The size can be adjusted by a margin of error of 0.5 - 1 inch from
            the drawing.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
