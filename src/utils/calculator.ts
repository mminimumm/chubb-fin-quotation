import { CalculationResult, QuotationData } from '../types';
import { CAMPAIGN_CONFIG, CURRENT_YEAR } from '../data/constants';

export function formatNumber(num: number | string | undefined, decimals = 0): string {
  const n = Number(num);
  if (isNaN(n)) return '0';
  return n.toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '2026-11-04';
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function calculateQuotation(data: QuotationData): CalculationResult {
  const cfg = CAMPAIGN_CONFIG[data.campaign] || CAMPAIGN_CONFIG.chubb_std;
  const quoteDate = data.quotedate || '2026-10-28';
  const quoteExp = addDays(quoteDate, 7);

  const [provinceName, regionName] = (data.province || 'จังหวัดอุตรดิตถ์|ภาคเหนือ').split('|');
  const year = Number(data.year) || 2020;
  const oldPremium = Number(data.oldPremium) || 0;
  const oldSum = Number(data.oldSum) || 0;

  // 1. Age & Eligibility
  const age = CURRENT_YEAR - year + 1;
  const ageOk = age >= 1 && age <= cfg.maxAge && year >= 2012;
  const codeOk = cfg.allowedCodes.includes(data.vehcode);
  const ageStatusText = ageOk ? 'เข้าเงื่อนไข' : 'เกินเกณฑ์อายุรถ';

  // 2. Minimum Premium Floor
  const isBkk = regionName === 'กทม และปริมณฑล';
  const minPremium = isBkk ? cfg.minPremiumBkk : cfg.minPremiumUpcountry;

  // 3. Discount & New Premium
  const discountRate = data.campaign === 'koompai' ? 0 : (data.doctype === 'ใบเตือนบริษัท' ? 0.10 : 0.05);
  const rawDiscounted = oldPremium * (1 - discountRate);
  const isFloorHit = rawDiscounted < minPremium;
  const finalPremium = isFloorHit ? minPremium : rawDiscounted;
  const savedAmount = oldPremium - finalPremium;
  const passText = isFloorHit ? `ติดเบี้ยขั้นต่ำ (${formatNumber(minPremium)} บ.)` : 'ผ่านเกณฑ์';

  // 4. Option A vs Option B
  const premA = Math.max(oldPremium * 0.95, minPremium);
  const saveA = oldPremium - premA;
  const sumA_raw = Math.round(oldSum * 0.90);
  const sumA = data.roundSum ? Math.floor(sumA_raw / 10000) * 10000 : sumA_raw;

  const premB = Math.max(oldPremium * 0.90, minPremium);
  const saveB = oldPremium - premB;
  const sumB = Math.round(oldSum * 1.00);

  const finalSum = data.doctype === 'ใบเตือนบริษัท' ? sumB : sumA;
  const hasDecimals = oldPremium % 1 !== 0 || finalPremium % 1 !== 0;

  return {
    age,
    ageOk,
    codeOk,
    ageStatusText,
    regionName: regionName || 'ภาคกลาง',
    provinceName: provinceName || 'กรุงเทพมหานคร',
    minPremium,
    isFloorHit,
    discountRate,
    discountPct: Math.round(discountRate * 100),
    finalPremium,
    savedAmount,
    finalSum,
    passText,
    premA,
    saveA,
    sumA,
    premB,
    saveB,
    sumB,
    hasDecimals,
    quoteExp,
  };
}
