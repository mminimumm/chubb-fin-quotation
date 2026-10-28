import { GeminiExtractedData, QuotationData } from '../types';
import { INSURERS, PROVINCES } from '../data/constants';

export async function extractPolicyWithGemini(
  dataUrl: string,
  mimeType: string
): Promise<GeminiExtractedData> {
  const base64Data = dataUrl.split(',')[1] || dataUrl;

  const response = await fetch('/api/ocr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Data,
      mimeType: mimeType || 'image/jpeg',
    }),
  });

  if (!response.ok) {
    let errorMessage = `OCR request failed (${response.status})`;
    try {
      const errBody = await response.json();
      if (errBody?.error) {
        errorMessage = errBody.error;
      }
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as GeminiExtractedData;
}

export function applyExtractedDataToForm(
  extracted: GeminiExtractedData,
  current: QuotationData
): Partial<QuotationData> {
  const updates: Partial<QuotationData> = {
    customer: extracted.customer_name || current.customer,
    address: extracted.address || current.address,
    vehcode: extracted.vehicle_code === '320' ? '320' : '110',
    brand: extracted.brand || current.brand,
    model: extracted.model || current.model,
    plate: extracted.plate || current.plate,
    year: extracted.year || current.year || 2020,
    doctype: extracted.doc_type === 'ใบเตือนบริษัท' ? 'ใบเตือนบริษัท' : 'ใบเตือนโบรค/ตาราง กธ.',
    oldPremium: extracted.old_premium_gross || current.oldPremium || 12000,
    oldSum: extracted.old_sum_insured || current.oldSum || 300000,
  };

  // Match Insurer
  if (extracted.previous_insurer) {
    const target = extracted.previous_insurer.toLowerCase();
    const matched = INSURERS.find((i) => {
      const clean = i.replace('บริษัท ', '').replace(' จำกัด (มหาชน)', '').replace(' จำกัด', '').toLowerCase();
      return target.includes(clean) || clean.includes(target);
    });
    if (matched) {
      updates.insurer = matched;
    }
  }

  // Match Province
  if (extracted.province) {
    const targetProv = extracted.province.replace('จังหวัด', '').trim();
    const matchedProv = PROVINCES.find(([p]) => p.includes(targetProv) || targetProv.includes(p.replace('จังหวัด', '')));
    if (matchedProv) {
      updates.province = `${matchedProv[0]}|${matchedProv[1]}`;
    }
  }

  return updates;
}
