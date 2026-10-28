import React from 'react';

interface HeaderProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepChange,
}) => {
  return (
    <header className="no-print bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-sm">
          CF
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-600 text-white">
              CHUBB × FIN BROKER
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Ver.01072026 • ระบบออกใบเสนอราคาย้ายค่ายอัตโนมัติ
            </span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold text-slate-900 mt-0.5">
            ระบบสแกนตารางกรมธรรม์ & ออกใบเสนอราคา PDF พร้อมใช้
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Stepper */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => onStepChange(1)}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              currentStep === 1 ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              1
            </span>
            <span>ส่งรูป กธ./ใบเตือน</span>
          </button>
          <span className="text-slate-400">→</span>
          <button
            type="button"
            onClick={() => onStepChange(2)}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              currentStep === 2 ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              2
            </span>
            <span>ตรวจข้อมูล</span>
          </button>
          <span className="text-slate-400">→</span>
          <button
            type="button"
            onClick={() => onStepChange(3)}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              currentStep === 3 ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              3
            </span>
            <span>ใบเสนอราคา PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
