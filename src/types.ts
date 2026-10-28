export type CampaignKey = 'chubb_std' | 'chubb_dealer7' | 'chubb_dealer5' | 'koompai';

export type DocumentType = 'ใบเตือนโบรค/ตาราง กธ.' | 'ใบเตือนบริษัท';

export interface CampaignConfig {
  key: CampaignKey;
  title: string;
  subtitle: string;
  maxAge: number;
  allowedCodes: string[];
  minPremiumBkk: number;
  minPremiumUpcountry: number;
  cond1: string;
  cond2: string;
  version: string;
}

export interface QuotationData {
  campaign: CampaignKey;
  customer: string;
  address: string;
  admin: string;
  insurer: string;
  quotedate: string;
  vehcode: '110' | '320';
  brand: string;
  model: string;
  plate: string;
  province: string; // e.g. "จังหวัดอุตรดิตถ์|ภาคเหนือ"
  year: number;
  doctype: DocumentType;
  oldPremium: number;
  oldSum: number;
  roundSum: boolean;
  policyNo?: string;
  imageUrl?: string;
}

export interface CalculationResult {
  age: number;
  ageOk: boolean;
  codeOk: boolean;
  ageStatusText: string;
  regionName: string;
  provinceName: string;
  minPremium: number;
  isFloorHit: boolean;
  discountRate: number;
  discountPct: number;
  finalPremium: number;
  savedAmount: number;
  finalSum: number;
  passText: string;
  premA: number;
  saveA: number;
  sumA: number;
  premB: number;
  saveB: number;
  sumB: number;
  hasDecimals: boolean;
  quoteExp: string;
}

export interface PresetCase extends Omit<QuotationData, 'roundSum' | 'admin'> {
  policyNo: string;
}

export interface GeminiExtractedData {
  doc_type?: string;
  customer_name?: string;
  address?: string;
  previous_insurer?: string;
  vehicle_code?: string;
  brand?: string;
  model?: string;
  plate?: string;
  province?: string;
  year?: number;
  old_premium_gross?: number;
  old_sum_insured?: number;
}
