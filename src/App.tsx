import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Step1Upload } from './components/Step1Upload';
import { Step2Verify } from './components/Step2Verify';
import { Step3Pdf } from './components/Step3Pdf';
import { DEFAULT_QUOTATION_DATA, PRESETS } from './data/constants';
import { calculateQuotation } from './utils/calculator';
import { applyExtractedDataToForm, extractPolicyWithGemini } from './services/gemini';
import { QuotationData } from './types';

export function App() {
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [quotationData, setQuotationData] = useState<QuotationData>(DEFAULT_QUOTATION_DATA);
  const [ocrBadgeText, setOcrBadgeText] = useState<string>('พร้อมตรวจสอบ');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('กำลังใช้ Gemini AI อ่านข้อมูลจากรูปตารางกรมธรรม์...');
  const [ocrError, setOcrError] = useState<string | null>(null);

  // Compute live calculations
  const calc = useMemo(() => calculateQuotation(quotationData), [quotationData]);

  const handleUpdateData = (updates: Partial<QuotationData>) => {
    setQuotationData((prev) => ({ ...prev, ...updates }));
  };

  const handleLoadPreset = (key: string, jumpToPdf = false) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setOcrError(null);
    setQuotationData((prev) => ({
      ...prev,
      ...preset,
      roundSum: true,
      imageUrl: undefined,
    }));
    setOcrBadgeText('พร้อมตรวจสอบ');
    setCurrentStep(jumpToPdf ? 3 : 2);
  };

  const processImageFile = async (file: File) => {
    setOcrError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      setIsLoading(true);
      setLoadingText('กำลังใช้ Gemini AI อ่านข้อมูลจากรูปตารางกรมธรรม์...');
      try {
        const extracted = await extractPolicyWithGemini(dataUrl, file.type || 'image/jpeg');
        const updates = applyExtractedDataToForm(extracted, quotationData);
        setQuotationData((prev) => ({
          ...prev,
          ...updates,
          imageUrl: dataUrl,
        }));
        setOcrBadgeText('AI สแกนสำเร็จ ✨');
        setCurrentStep(2);
      } catch (err) {
        console.error('Gemini OCR error:', err);
        const errorMessage = err instanceof Error ? err.message : 'ไม่สามารถอ่านข้อมูลจากรูปภาพได้';
        setOcrError(errorMessage);
        setQuotationData((prev) => ({ ...prev, imageUrl: dataUrl }));
        setOcrBadgeText('รอตรวจสอบข้อมูล');
        setCurrentStep(2);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Support Ctrl+V / Cmd+V paste anywhere on the page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            processImageFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [quotationData]);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <Header
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        {ocrError && currentStep !== 3 && (
          <div className="no-print bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between">
            <span>⚠️ ระบบ AI OCR แจ้งเตือน: {ocrError} (สามารถกรอกหรือแก้ไขข้อมูลด้านล่างได้โดยตรง)</span>
            <button
              type="button"
              onClick={() => setOcrError(null)}
              className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer ml-3"
            >
              ✕
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <Step1Upload
            onImageSelected={processImageFile}
            onLoadPreset={(key) => handleLoadPreset(key, false)}
            isLoading={isLoading}
            loadingText={loadingText}
          />
        )}

        {currentStep === 2 && (
          <Step2Verify
            data={quotationData}
            calc={calc}
            ocrBadgeText={ocrBadgeText}
            onChange={handleUpdateData}
            onGoToStep={setCurrentStep}
          />
        )}

        {currentStep === 3 && (
          <Step3Pdf
            data={quotationData}
            calc={calc}
            onGoToStep={setCurrentStep}
          />
        )}
      </div>
    </div>
  );
}

export default App;
