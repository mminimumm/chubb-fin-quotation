import React from 'react';
import { CampaignKey, CalculationResult, DocumentType, QuotationData } from '../types';
import { CAMPAIGN_CONFIG, INSURERS, PROVINCES } from '../data/constants';
import { formatNumber } from '../utils/calculator';

interface Step2VerifyProps {
  data: QuotationData;
  calc: CalculationResult;
  ocrBadgeText: string;
  onChange: (updates: Partial<QuotationData>) => void;
  onGoToStep: (step: number) => void;
}

export const Step2Verify: React.FC<Step2VerifyProps> = ({
  data,
  calc,
  ocrBadgeText,
  onChange,
  onGoToStep,
}) => {
  const cfg = CAMPAIGN_CONFIG[data.campaign] || CAMPAIGN_CONFIG.chubb_std;
  const dec = calc.hasDecimals ? 2 : 0;

  const toggleDocType = (target: DocumentType) => {
    onChange({ doctype: target });
  };

  return (
    <section className="no-print space-y-5">
      {/* Top Banner */}
      <div className="bg-indigo-950 text-white rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <div>
            <h2 className="text-sm font-extrabold">
              ขั้นตอนที่ 2: ตรวจสอบความถูกต้องของข้อมูลก่อนยืนยันออกใบเสนอราคา
            </h2>
            <p className="text-xs text-indigo-200">
              กรุณาตรวจทานข้อมูลคู่กับรูปภาพต้นฉบับ สามารถแก้ไขตัวเลขหรือเปลี่ยนโครงการแล้วดูผลคำนวณทันที
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="px-3 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-xs font-semibold cursor-pointer transition"
          >
            ← ส่งรูปใหม่
          </button>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-sm cursor-pointer transition"
          >
            ✅ ยืนยันข้อมูลถูกต้อง → ออกใบเสนอราคา PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Original Image & Rule Checklist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                เอกสารต้นฉบับ & ผลตรวจเกณฑ์
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {ocrBadgeText}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs space-y-2">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  className="w-full rounded-lg object-contain max-h-64 mb-2 border border-slate-200 bg-white"
                  alt="Uploaded Policy"
                />
              ) : (
                <div className="w-full h-24 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                  (ไม่มีรูปภาพแนบ - โหลดจากเคสตัวอย่าง)
                </div>
              )}
              <div className="font-bold text-sm text-slate-900">
                {data.doctype}: {data.insurer}
              </div>
              <div className="text-slate-500">
                {data.policyNo ? `เลขที่ กธ.: ${data.policyNo} | ` : ''}ทะเบียน {data.plate || '-'} | ปี {data.year || '-'}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-extrabold text-slate-700">เช็คเงื่อนไขโครงการอัตโนมัติ:</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span>อายุรถ ({calc.age} ปี / ไม่เกิน {cfg.maxAge} ปี)</span>
                  <span className="font-bold">{calc.ageOk ? '✅ เข้าเงื่อนไข' : '❌ เกินเกณฑ์'}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span>รหัสรถ ({data.vehcode} / รับ {cfg.allowedCodes.join(',')})</span>
                  <span className="font-bold">{calc.codeOk ? '✅ เข้าเงื่อนไข' : '❌ ไม่ตรงรหัส'}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span>เบี้ยขั้นต่ำ ({calc.regionName}: {formatNumber(calc.minPremium)} บ.)</span>
                  <span className="font-bold">{calc.isFloorHit ? '⚠️ ติดขั้นต่ำ' : '✅ ผ่านเกณฑ์'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Upsell Comparison Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
            <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
              <span>💡</span>
              <span>เปรียบเทียบสิทธิ์ A (ตาราง กธ.) vs B (ใบเตือนบริษัท)</span>
            </div>
            <div className="text-xs text-amber-900 leading-relaxed">
              {data.doctype === 'ใบเตือนโบรค/ตาราง กธ.' && data.campaign !== 'koompai' ? (
                <>
                  ปัจจุบันใช้ <strong>ตาราง กธ.</strong> (ลด 5% เหลือ <strong>{formatNumber(calc.finalPremium, dec)}</strong> บ. | ทุน <strong>{formatNumber(calc.finalSum)}</strong> บ.)<br />
                  หากมี <strong>"ใบเตือนบริษัท"</strong> จะลด 10% เหลือ <strong>{formatNumber(calc.premB, dec)}</strong> บ. และได้<strong>ทุนเต็ม {formatNumber(calc.sumB)} บ.</strong>
                </>
              ) : (
                <>
                  ปัจจุบันใช้ <strong>ใบเตือนบริษัท</strong> ได้รับส่วนลดสูงสุด 10% และได้ทุนประกันเท่าเดิม 100% ({formatNumber(calc.sumB)} บาท)
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleDocType(data.doctype === 'ใบเตือนบริษัท' ? 'ใบเตือนโบรค/ตาราง กธ.' : 'ใบเตือนบริษัท')}
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition shadow-sm cursor-pointer"
            >
              {data.doctype === 'ใบเตือนโบรค/ตาราง กธ.' && data.campaign !== 'koompai'
                ? 'ลองสลับเป็น "ใบเตือนบริษัท" (ลด 10% + ทุน 100%)'
                : 'สลับกลับเป็น "ใบเตือนโบรค/ตาราง กธ." (ลด 5%)'}
            </button>
          </div>
        </div>

        {/* Middle Column: Editable Form */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
          <div className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2.5">
            1. ข้อมูลในใบเสนอราคา (แก้ไขได้ทุกช่อง)
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">โครงการย้ายค่าย</label>
            <select
              value={data.campaign}
              onChange={(e) => onChange({ campaign: e.target.value as CampaignKey })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
            >
              <option value="chubb_std">โครงการ ย้ายค่าย "CHUBB ใจดี" x ฟิน โบรคเกอร์ (ซ่อมอู่)</option>
              <option value="chubb_dealer7">โครงการ ย้ายค่าย "CHUBB ใจดี" (ซ่อมห้าง 7 ปี - รหัส 110)</option>
              <option value="chubb_dealer5">โครงการ ย้ายค่าย "CHUBB ใจดี" (ซ่อมห้าง 5 ปี - รหัส 320)</option>
              <option value="koompai">โครงการ ย้ายค่าย "คุ้มภัย สุดฟิน" x ฟิน โบรคเกอร์</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">เรียนคุณ (ชื่อลูกค้า)</label>
              <input
                type="text"
                value={data.customer}
                onChange={(e) => onChange({ customer: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">เจ้าหน้าที่ออกเอกสาร</label>
              <input
                type="text"
                value={data.admin}
                onChange={(e) => onChange({ admin: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ที่อยู่</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">บริษัทประกันเดิม</label>
              <select
                value={data.insurer}
                onChange={(e) => onChange({ insurer: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
              >
                {INSURERS.map((ins) => (
                  <option key={ins} value={ins}>
                    {ins}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">วันที่เสนอราคา</label>
              <input
                type="date"
                value={data.quotedate}
                onChange={(e) => onChange({ quotedate: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ทะเบียนรถ</label>
              <input
                type="text"
                value={data.plate}
                onChange={(e) => onChange({ plate: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ยี่ห้อ</label>
              <input
                type="text"
                value={data.brand}
                onChange={(e) => onChange({ brand: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">รุ่น</label>
              <input
                type="text"
                value={data.model}
                onChange={(e) => onChange({ model: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">รหัสรถ</label>
              <select
                value={data.vehcode}
                onChange={(e) => onChange({ vehcode: e.target.value as '110' | '320' })}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="110">110 (เก๋ง/4ประตู)</option>
                <option value="320">320 (กระบะแค็บ)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">จังหวัด (77 จว.)</label>
              <select
                value={data.province}
                onChange={(e) => onChange({ province: e.target.value })}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-300 bg-white"
              >
                {PROVINCES.map(([p, r]) => (
                  <option key={p} value={`${p}|${r}`}>
                    {p} ({r})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ปีรถผลิต (ค.ศ.)</label>
              <input
                type="number"
                min="2012"
                max="2026"
                value={data.year}
                onChange={(e) => onChange({ year: parseInt(e.target.value, 10) || 2020 })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl border-2 border-indigo-600 bg-indigo-50/50 space-y-2.5">
            <div className="font-extrabold text-indigo-950">⚡ จุดสำคัญที่มีผลต่อเบี้ยและทุนประกัน</div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">โอนย้าย โดย (ประเภทเอกสาร)</label>
              <select
                value={data.doctype}
                onChange={(e) => onChange({ doctype: e.target.value as DocumentType })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-indigo-300 bg-white font-bold text-indigo-950"
              >
                <option value="ใบเตือนโบรค/ตาราง กธ.">ใบเตือนโบรค/ตาราง กธ. (ส่วนลด 5% | ทุนใหม่ 90%)</option>
                <option value="ใบเตือนบริษัท">ใบเตือนบริษัท (ส่วนลด 10% | ทุนใหม่ 100%)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">เบี้ยประกันเดิม (บาท)</label>
                <input
                  type="number"
                  step="0.01"
                  value={data.oldPremium}
                  onChange={(e) => onChange({ oldPremium: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-indigo-300 bg-white font-extrabold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ทุนประกันเดิม (บาท)</label>
                <input
                  type="number"
                  step="1000"
                  value={data.oldSum}
                  onChange={(e) => onChange({ oldSum: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-indigo-300 bg-white font-extrabold"
                />
              </div>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer pt-1 text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={data.roundSum}
                onChange={(e) => onChange({ roundSum: e.target.checked })}
                className="rounded text-indigo-600"
              />
              <span>ปัดทุนประกันใหม่ลงหลักหมื่น (ตามสูตรไฟล์ต้นฉบับ)</span>
            </label>
          </div>
        </div>

        {/* Right Column: Live Calculation Summary */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-extrabold text-sm text-slate-900">2. สรุปยอดคำนวณเบี้ยโอนย้าย</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${calc.isFloorHit ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {calc.passText}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">โซนพื้นที่ / อายุรถ:</span>
                <span className="font-bold text-slate-800">
                  {calc.regionName} / {calc.age} ปี ({calc.ageStatusText})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">เบี้ยประกันเดิม:</span>
                <span className="font-bold text-slate-800">{formatNumber(data.oldPremium, dec)} บาท</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ส่วนลดที่ได้รับ:</span>
                <span className="font-bold text-indigo-700">
                  {calc.discountPct}% ({data.doctype})
                </span>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-indigo-950">เบี้ยโอนย้ายสุทธิ:</span>
                  <span className="font-extrabold text-xl text-indigo-700">
                    {formatNumber(calc.finalPremium, dec)} บาท
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-indigo-900 font-semibold">ประหยัดค่าเบี้ยได้:</span>
                  <span className="font-bold text-emerald-700">
                    {formatNumber(calc.savedAmount, dec)} บาท
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-indigo-200">
                  <span className="font-bold text-indigo-950">ทุนประกันภัยใหม่:</span>
                  <span className="font-extrabold text-base text-indigo-950">
                    {formatNumber(calc.finalSum)} บาท
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition shadow-sm cursor-pointer"
          >
            ยืนยันข้อมูล & ดูใบเสนอราคา PDF →
          </button>
        </div>
      </div>
    </section>
  );
};
