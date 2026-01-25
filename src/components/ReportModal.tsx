import React, { useState, useRef } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { ReportModalProps } from "../types/orderTypes";
import toast from "react-hot-toast";

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  // State เก็บข้อมูล
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  // Refs สำหรับ Trigger Input File
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ถ้า Modal ปิดอยู่ ไม่ต้อง Render อะไรเลย
  if (!isOpen) return null;

  // --- Logic การจัดการไฟล์ ---

  // เพิ่มรูป (Limit 3)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (photos.length < 3) {
        setPhotos([...photos, e.target.files[0]]);
      }
    }
  };

  // เพิ่มวิดีโอ (Limit 1)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  // ลบรูป
  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // ลบวิดีโอ
  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = () => {
    // Validate นิดนึงก็ได้ (เช่น ต้องมีคำบรรยาย)
    if (!description.trim()) return toast.error("Please details your problem!");

    const formData = {
      description,
      photos,
      video,
    };

    // ส่งข้อมูลกลับไปให้ Parent Component
    onSubmit(formData);
  };

  return (
    // Overlay (Background สีดำจางๆ)
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#4A3B55]">Report Problem</h2>
        </div>

        {/* --- Section 1: Description --- */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-[#4A3B55] mb-2">
            Please Let Us Know Your Problem.
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className="w-full border border-[#4A3B55]/30 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#FFC107] resize-none text-[#4A3B55]"
              placeholder="Report your problem here."
            />
            <span className="absolute bottom-3 right-3 text-xs text-gray-400">
              {description.length}/500
            </span>
          </div>
        </div>

        {/* --- Section 2: Attachments --- */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#4A3B55] mb-4">
            Please Attach Photos And Videos.
          </h3>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Photos Zone (Limit 3) */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-[#4A3B55]">Photos</span>
                <span
                  className={`text-sm font-bold ${photos.length === 3 ? "text-red-500" : "text-yellow-500"}`}
                >
                  {photos.length}/3
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* Loop รูปที่อัปโหลดแล้ว */}
                {photos.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    {/* ปุ่มลบ (จะโผล่เมื่อ Hover) */}
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="text-white w-6 h-6" />
                    </button>
                  </div>
                ))}

                {/* ปุ่ม Upload (ซ่อนเมื่อครบ 3) */}
                {photos.length < 3 && (
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="w-24 h-24 flex-shrink-0 border border-[#4A3B55]/30 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-yellow-400 flex items-center justify-center">
                      <Plus className="text-yellow-500 w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-yellow-500">
                      Upload
                    </span>
                  </button>
                )}
              </div>
              {/* Hidden Input */}
              <input
                type="file"
                ref={photoInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Video Zone (Limit 1) */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-[#4A3B55]">Video</span>
                <span
                  className={`text-sm font-bold ${video ? "text-red-500" : "text-yellow-500"}`}
                >
                  {video ? "1" : "0"}/1
                </span>
              </div>

              <div className="w-full h-24 relative">
                {video ? (
                  // Preview Video
                  <div className="w-full h-full border border-gray-200 rounded-lg bg-black flex items-center justify-center relative group">
                    <video
                      src={URL.createObjectURL(video)}
                      className="h-full w-auto max-w-full"
                    />
                    <button
                      onClick={removeVideo}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="text-white w-8 h-8" />
                    </button>
                  </div>
                ) : (
                  // Upload Button Video
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full h-full border border-[#4A3B55]/30 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-yellow-400 flex items-center justify-center">
                      <Plus className="text-yellow-500 w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-yellow-500">
                      Upload
                    </span>
                  </button>
                )}
              </div>
              {/* Hidden Input */}
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleVideoUpload}
              />
            </div>
          </div>
        </div>

        {/* --- Buttons --- */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-[#4A3B55] text-[#4A3B55] font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
    flex-1 py-3 rounded-lg font-bold shadow-md transition-all 
    flex items-center justify-center gap-2 
    ${
      isLoading
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-secondary text-white hover:scale-105 active:scale-95"
    }
  `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>{" "}
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
