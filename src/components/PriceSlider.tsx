import { useState } from "react";

interface PriceSliderProps {
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  onAfterChange?: (value: number) => void; //เอาไว้โหลดของจริง
}

const PriceSlider = ({
  min = 0,
  max = 10000,
  onChange,
  onAfterChange,
}: PriceSliderProps) => {
  const [value, setValue] = useState(max / 2); // ค่าเริ่มต้น (ครึ่งหลอด)

  // คำนวณ % เพื่อทำแถบสี
  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };
  // ทำงานเมื่อ "ปล่อยมือ" เท่านั้น
  const handleCommit = () => {
    if (onAfterChange) {
      onAfterChange(value);
    }
  };
  return (
    <div className="w-full pr-10 p-4">
      {/* --- ตัว Slider (Input Range) --- */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
        className="w-full h-4 rounded-full cursor-pointer appearance-none bg-[#A890A8] focus:outline-none"
        style={{
          // ไล่สีเหลืองทับลงไปตาม % ที่คำนวณได้
          backgroundImage: "linear-gradient(#FACC15, #FACC15)",
          backgroundRepeat: "no-repeat",
          ...getBackgroundSize(),
        }}
      />

      {/* --- CSS ปรับแต่งปุ่มวงกลม--- */}
      {/* ใช้ style ทำ */}
      <style>{`
        /* สำหรับ Chrome, Safari, Edge */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #5B486B; /* สีม่วงเข้ม */
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.1s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        /* สำหรับ Firefox */
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          border: none;
          background: #5B486B;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* ป้ายราคาด้านล่าง */}
      <div className="flex justify-between mt-3 font-bold text-yellow-500 text-lg">
        <span>฿ {min}</span>
        <span>฿ {value.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PriceSlider;
