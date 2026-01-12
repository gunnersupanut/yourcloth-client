import { useState } from "react";
import toast from "react-hot-toast";

const OnSaleToggle = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
    if (!isOn) {
      // ถ้ากำลังจะเปิด
      toast("Coming Soon! Feature under construction", {
        icon: "🚧",
      });
    }
  };

  return (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isOn}
        onChange={handleToggle}
      />

      <div
        className={`
        w-14 h-8 bg-[#A890A8] peer-checked:bg-[#967D96]
        rounded-full p-1 transition-colors duration-300 ease-in-out
      `}
      >
        <div
          className={`
          bg-[#6B4F6B] w-6 h-6 rounded-full shadow-md
          transform transition-transform duration-300 ease-in-out
          peer-checked:translate-x-6
        `}
        ></div>
      </div>
      <span className="ml-3 text-button font-kanit text-secondary">
        On Sale
      </span>
    </label>
  );
};

export default OnSaleToggle;
