import { useState, useRef, useEffect } from "react";

interface DropdownFilterProps {
  label: string; // ชื่อปุ่ม
  options: string[]; // ตัวเลือกข้างใน
  selected: string; // ค่าที่เลือกอยู่
  defaultValue?: string; // ค่าเริ่มต้น (เช่น "Newest") เอาไว้เช็คว่าเลือกหรือยังฃ
  disabled?: boolean;
  onChange: (value: string) => void; // ฟังก์ชันส่งค่ากลับเมื่อเลือก
}

const DropdownFilter = ({
  label,
  options,
  selected,
  defaultValue = "",
  disabled = false,
  onChange,
}: DropdownFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // เช็คว่าตอนนี้มีการเลือกค่า Active อยู่ไหม? (ถ้าไม่ตรงกับ Default แปลว่าเลือกแล้ว)
  const isActive = selected !== defaultValue;
  // คลิกข้างนอกแล้วปิด Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ฟังก์ชันกดปุ่ม X (ล้างค่ากลับเป็น Default)
  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation(); // ห้ามไม่ให้ Event ทะลุไปเปิด Dropdown
    onChange(defaultValue); // ดีดค่ากลับเป็น Default
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* ปุ่ม */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 shadow-sm transition-all whitespace-nowrap
          ${
            disabled
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" // 💀 สภาพตอนพิการ (Disabled)
              : isActive
              ? "bg-secondary border-secondary text-white hover:opacity-80" // สถานะเลือกแล้ว
              : "bg-white border-gray-300 text-secondary hover:border-secondary" // สถานะปกติ
          }
        `}
      >
        {/* แสดงข้อความ: ถ้าเลือกแล้วโชว์ค่าเลย / ถ้ายัง ให้โชว์ Label */}
        <span>{isActive ? selected : label}</span>

        {/* ไอคอนด้านขวา: เปลี่ยนตามสถานะ */}
        {isActive ? (
          // ปุ่มกากบาท
          <div
            onClick={clearFilter}
            className="ml-1 p-1 rounded-full hover:bg-tertiary transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          // ปุ่มลูกศร
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-6 h-6 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        )}
      </button>

      {/* ---เมนูตัวเลือก*/}
      {isOpen && !disabled && (
        <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-xl border-2 border-gray-100 overflow-hidden z-[70]">
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <li key={option}>
                <button
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-button hover:bg-yellow-100 transition-colors
                    ${
                      selected === option
                        ? "text-secondary bg-purple-50"
                        : "text-primary"
                    }
                  `}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default DropdownFilter;
