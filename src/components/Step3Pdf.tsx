import React, { useState } from 'react';
import { CalculationResult, QuotationData } from '../types';
import { CAMPAIGN_CONFIG } from '../data/constants';
import { formatNumber } from '../utils/calculator';

interface Step3PdfProps {
  data: QuotationData;
  calc: CalculationResult;
  onGoToStep: (step: number) => void;
}

export const Step3Pdf: React.FC<Step3PdfProps> = ({ data, calc, onGoToStep }) => {
  const [showCompare, setShowCompare] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);
  const cfg = CAMPAIGN_CONFIG[data.campaign] || CAMPAIGN_CONFIG.chubb_std;
  const dec = calc.hasDecimals ? 2 : 0;

  const handleCopyLine = async () => {
    const text = [
      `📋 ใบเสนอราคาโครงการย้ายค่าย "${cfg.title.replace('โครงการ ย้ายค่าย ', '').replace(' x ฟิน โบรคเกอร์', '')}" x ฟิน โบรคเกอร์`,
      `เรียนคุณ: ${data.customer || 'ลูกค้าผู้มีอุปการคุณ'}`,
      `รถยนต์: ${data.brand} ${data.model} (ทะเบียน ${data.plate || '-'})`,
      `--------------------------`,
      `• โอนย้ายโดยใช้: ${data.doctype}`,
      `• เบี้ยประกันเดิม: ${formatNumber(data.oldPremium, dec)} บาท`,
      `• เบี้ยโอนย้ายสุทธิ: ${formatNumber(calc.finalPremium, dec)} บาท (ประหยัด ${formatNumber(calc.savedAmount, dec)} บาท)`,
      `• ทุนประกันภัยใหม่: ${formatNumber(calc.finalSum)} บาท`,
      `--------------------------`,
      `*หมายเหตุ: ถ่ายรูปรถ 4 ด้าน / เอกสารเดิมไม่หมดอายุเกิน 30 วัน`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <section className="space-y-4">
      {/* Action Toolbar */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-extrabold text-slate-700">ตั้งค่าใบเสนอราคา PDF:</span>
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showCompare}
              onChange={(e) => setShowCompare(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span>แสดงตารางเปรียบเทียบสิทธิ์ A (ตาราง กธ.) vs B (ใบเตือนบริษัท)</span>
          </label>
          {copiedToast && (
            <span className="font-bold text-emerald-600 transition">
              ✅ คัดลอกข้อความสรุปสำหรับส่ง LINE แล้ว!
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50 cursor-pointer transition"
          >
            ← แก้ไขข้อมูล
          </button>
          <button
            type="button"
            onClick={handleCopyLine}
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 cursor-pointer transition"
          >
            💬 คัดลอกข้อความส่ง LINE
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 shadow-sm cursor-pointer transition"
          >
            📄 Export PDF / พิมพ์ใบเสนอราคา (A4)
          </button>
        </div>
      </div>

      {/* OFFICIAL A4 QUOTATION SHEET */}
      <div
        id="pdf-sheet"
        className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md max-w-4xl mx-auto space-y-6 text-slate-900"
      >
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b-2 border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-700 text-white text-xs font-extrabold tracking-wide">
              <span>CHUBB สามัคคีประกันภัย</span>
              <span>×</span>
              <span>FIN BROKER (ฟิน โบรคเกอร์)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {cfg.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {cfg.subtitle}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shrink-0 min-w-[240px]">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">วันที่เสนอราคา:</span>
              <strong>{data.quotedate || '2026-10-28'}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">วันหมดอายุใบเสนอราคา:</span>
              <strong>{calc.quoteExp}</strong>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-200">
              <span className="text-slate-500">เจ้าหน้าที่ออกเอกสาร:</span>
              <strong>{data.admin || 'ADMIN-FIN'}</strong>
            </div>
          </div>
        </div>

        {/* Customer & Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-extrabold text-sm text-slate-900">👤 ข้อมูลผู้เอาประกันภัย</span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">ลูกค้าโอนย้าย</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <span className="text-slate-500 w-24 shrink-0">เรียนคุณ:</span>
                <strong className="text-sm text-slate-900">{data.customer || '-'}</strong>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-500 w-24 shrink-0">ที่อยู่:</span>
                <span className="font-medium text-slate-800">{data.address || '-'}</span>
              </div>
              <div className="flex gap-2 pt-1.5 border-t border-slate-200">
                <span className="text-slate-500 w-24 shrink-0">บริษัทประกันเดิม:</span>
                <strong className="text-slate-900">{data.insurer || '-'}</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-extrabold text-sm text-slate-900">🚘 ข้อมูลรถยนต์ที่เอาประกันภัย</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                รหัส {data.vehcode} • {calc.ageStatusText}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              <div>
                <span className="text-slate-500">ยี่ห้อ / รุ่น:</span>
                <div className="font-extrabold text-sm text-slate-900">
                  {data.brand} {data.model}
                </div>
              </div>
              <div>
                <span className="text-slate-500">ทะเบียนรถ:</span>
                <div className="font-extrabold text-sm text-slate-900">{data.plate || '-'}</div>
              </div>
              <div>
                <span className="text-slate-500">จังหวัด / โซนพื้นที่:</span>
                <div className="font-bold text-slate-800">
                  {calc.provinceName} ({calc.regionName})
                </div>
              </div>
              <div>
                <span className="text-slate-500">ปีรถผลิต / อายุรถ:</span>
                <div className="font-bold text-slate-800">
                  ค.ศ. {data.year} (อายุ {calc.age} ปี)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Offer Box */}
        <div className="border-2 border-indigo-700 rounded-2xl overflow-hidden">
          <div className="bg-indigo-700 text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold">สรุปข้อเสนอเบี้ยประกันภัยและทุนประกันภัย (โครงการโอนย้าย)</h3>
              <p className="text-xs text-indigo-100">
                เอกสารที่ใช้โอนย้าย: <strong>{data.doctype}</strong> (ไม่หมดอายุเกิน 30 วัน)
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white text-indigo-950 text-xs font-extrabold self-start sm:self-auto">
              {calc.isFloorHit ? `⚠️ ${calc.passText}` : '✅ ผ่านเกณฑ์โครงการ'}
            </span>
          </div>

          <div className="p-5 bg-white space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-500">1. ข้อมูลตามกรมธรรม์เดิม</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-600">เบี้ยประกันเดิม:</span>
                  <span className="text-base font-bold line-through text-slate-400">
                    {formatNumber(data.oldPremium, dec)} บาท
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-600">ทุนประกันเดิม:</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatNumber(data.oldSum)} บาท
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-500">2. ส่วนลดโอนย้ายที่ได้รับ</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-600">อัตราส่วนลด:</span>
                  <span className="text-base font-extrabold text-indigo-700">
                    {calc.discountPct}% ({data.doctype})
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-600">ประหยัดค่าเบี้ยได้:</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {formatNumber(calc.savedAmount, dec)} บาท
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-600 space-y-2">
                <div className="text-xs font-extrabold text-indigo-950">3. ข้อเสนอใหม่จาก CHUBB</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-indigo-950">เบี้ยโอนย้ายสุทธิ:</span>
                  <span className="text-xl font-extrabold text-indigo-700">
                    {formatNumber(calc.finalPremium, dec)} บาท
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-indigo-200">
                  <span className="text-xs font-bold text-indigo-950">ทุนประกันภัยใหม่:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatNumber(calc.finalSum)} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* Option A vs Option B Comparison Table */}
            {showCompare && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    📌 ตารางเปรียบเทียบสิทธิ์ตามประเภทเอกสารที่ใช้โอนย้าย (A vs B)
                  </span>
                  <span className="text-xs text-slate-500">(ใบเตือน/หน้าตารางต้องไม่หมดอายุเกิน 30 วัน)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse border border-slate-300 bg-white">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2 border border-slate-300 text-left">ประเภทเอกสารที่ใช้แจ้งงาน</th>
                        <th className="p-2 border border-slate-300 text-center">ส่วนลดค่าเบี้ย</th>
                        <th className="p-2 border border-slate-300 text-right">เบี้ยโอนย้ายสุทธิ (บาท)</th>
                        <th className="p-2 border border-slate-300 text-right">ประหยัดได้ (บาท)</th>
                        <th className="p-2 border border-slate-300 text-right">ทุนประกันภัยใหม่ที่ได้ (บาท)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className={`border-b border-slate-300 ${
                          data.doctype !== 'ใบเตือนบริษัท' ? 'bg-indigo-50 font-bold text-indigo-950' : ''
                        }`}
                      >
                        <td className="p-2 border border-slate-300 font-semibold">
                          ทางเลือก A: ใช้ใบเตือนโบรคเกอร์ / ตาราง กธ. เดิม
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-semibold">ลด 5% (0.05)</td>
                        <td className="p-2 border border-slate-300 text-right font-bold">
                          {formatNumber(calc.premA, dec)}
                        </td>
                        <td className="p-2 border border-slate-300 text-right">
                          {formatNumber(calc.saveA, dec)}
                        </td>
                        <td className="p-2 border border-slate-300 text-right font-bold">
                          {formatNumber(calc.sumA)} (90%)
                        </td>
                      </tr>
                      <tr
                        className={
                          data.doctype === 'ใบเตือนบริษัท' ? 'bg-indigo-50 font-bold text-indigo-950' : ''
                        }
                      >
                        <td className="p-2 border border-slate-300 font-semibold">
                          ทางเลือก B: ใช้ใบเตือนต่ออายุจากบริษัทประกันเดิมโดยตรง
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-semibold">ลด 10% (0.10)</td>
                        <td className="p-2 border border-slate-300 text-right font-bold">
                          {formatNumber(calc.premB, dec)}
                        </td>
                        <td className="p-2 border border-slate-300 text-right">
                          {formatNumber(calc.saveB, dec)}
                        </td>
                        <td className="p-2 border border-slate-300 text-right font-bold">
                          {formatNumber(calc.sumB)} (100%)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conditions & Signature */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-extrabold text-sm text-slate-900">
              📸 เงื่อนไขการตรวจสภาพรถยนต์และประเภทรถที่รับประกัน
            </div>
            <div className="font-semibold text-slate-800">{cfg.cond1}</div>
            <div className="font-semibold text-slate-800">{cfg.cond2}</div>
            <div className="text-slate-500 pt-1">
              • เอกสารใบเตือนต่ออายุ หรือ หน้าตารางกรมธรรม์เดิม ต้องไม่หมดอายุเกิน 30 วัน ณ วันแจ้งงาน
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-extrabold text-slate-900">ผู้เสนอราคา / ติดต่อสอบถาม</div>
              <div className="text-slate-500 mt-0.5">ฟิน โบรคเกอร์ (Fin Insurance Broker)</div>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
              <span className="text-slate-500">ผู้ออกใบเสนอราคา:</span>
              <strong className="text-slate-900">{data.admin || 'ADMIN-FIN'}</strong>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
          <span>**เงื่อนไขการรับประกันภัย เป็นไปตามที่บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน) กำหนด</span>
          <span className="font-mono font-bold">{cfg.version}</span>
        </div>
      </div>
    </section>
  );
};
