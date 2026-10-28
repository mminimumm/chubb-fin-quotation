import React, { useRef, useState } from 'react';

interface Step1UploadProps {
  onImageSelected: (file: File) => void;
  onLoadPreset: (key: string) => void;
  isLoading: boolean;
  loadingText?: string;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  onImageSelected,
  onLoadPreset,
  isLoading,
  loadingText = 'กำลังใช้ Gemini AI อ่านข้อมูลจากรูปตารางกรมธรรม์...',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <section className="no-print space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`lg:col-span-2 bg-white border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 transition shadow-sm ${
            isDragOver ? 'border-indigo-600 bg-indigo-50/40' : 'border-indigo-300 hover:border-indigo-500'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl shadow-inner">
            📷
          </div>
          <div className="space-y-1 max-w-lg">
            <h2 className="text-lg font-extrabold text-slate-900">
              ส่งรูปตารางกรมธรรม์เดิม หรือ ใบเตือนต่ออายุ
            </h2>
            <p className="text-xs text-slate-500">
              ลากไฟล์รูปมาวางที่นี่, กดปุ่มเลือกรูป หรือกด{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono">
                Ctrl+V
              </kbd>{' '}
              /{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono">
                Cmd+V
              </kbd>{' '}
              เพื่อวางรูปที่ก๊อปมาจาก LINE ได้ทันที
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition shadow-sm">
              📂 เลือกรูปภาพจากเครื่อง / มือถือ
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </label>
          </div>

          {/* Loading Spinner during AI OCR */}
          {isLoading && (
            <div className="w-full max-w-md p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center justify-center gap-3 animate-pulse">
              <svg
                className="animate-spin h-5 w-5 text-indigo-600 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{loadingText}</span>
            </div>
          )}

          {/* Sample Presets */}
          <div className="pt-4 border-t border-slate-100 w-full space-y-2">
            <div className="text-xs text-slate-400 font-medium">
              หรือคลิกเลือกเคสตัวอย่างเพื่อดูการทำงานทันที:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onLoadPreset('isuzu_2014')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-pointer transition"
              >
                🚚 เคสจริง: Isuzu D-Max 2014 (กรุงเทพประกันภัย)
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset('vios_2019')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition"
              >
                🚗 Toyota Vios 2019 (ตาราง กธ.)
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset('ativ_2024')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition"
              >
                🚗 Yaris Ativ 2024 (ใบเตือนบริษัท)
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset('hyundai_2020')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer transition"
              >
                ⚠️ Hyundai ZS 2020 (ซ่อมห้าง 7 ปี ติดขั้นต่ำ)
              </button>
            </div>
          </div>
        </div>

        {/* Journey Guide Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">ขั้นตอนการทำงาน (User Journey)</h3>
          <ol className="space-y-3 text-xs">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <div className="font-bold text-slate-900">ส่งรูปตาราง กธ. หรือ ใบเตือน</div>
                <p className="text-slate-500">
                  AI สกัดชื่อลูกค้า, บริษัทเดิม, รหัสรถ (110/320), ทะเบียน, จังหวัด, ปีผลิต, ทุนเดิม และเบี้ยรวมอัตโนมัติ
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <div className="font-bold text-slate-900">ตรวจทานข้อมูลก่อนยืนยัน (Verify)</div>
                <p className="text-slate-500">
                  เทียบข้อมูลกับรูปจริง เช็คเกณฑ์อายุรถ/รหัสรถ/เบี้ยขั้นต่ำ 77 จังหวัด และลองสลับเทียบใบเตือน (ลด 10%) vs ตาราง กธ. (ลด 5%)
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <div className="font-bold text-slate-900">Export PDF ขนาด A4 สวยงาม</div>
                <p className="text-slate-500">
                  ออกใบเสนอราคาพร้อมใช้ กดบันทึกเป็น PDF ขนาด A4 หรือคัดลอกข้อความสรุปส่ง LINE ได้ทันที
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
