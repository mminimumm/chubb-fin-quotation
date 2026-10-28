import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  app.post('/api/ocr', async (req, res) => {
    try {
      const { base64Data, mimeType } = req.body;

      if (!base64Data) {
        res.status(400).json({ error: 'Missing image data (base64Data)' });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptText = `คุณคือระบบ AI สกัดข้อมูลจากตารางกรมธรรม์ประกันภัยรถยนต์หรือใบเตือนต่ออายุของไทย (รองรับทุกบริษัทประกันและโบรคเกอร์) กรุณาอ่านรูปภาพและสกัดข้อมูลเป็น JSON ตามโครงสร้างที่กำหนด:
- doc_type: หากในภาพเป็น "ตารางกรมธรรม์" หรือมีชื่อโบรคเกอร์/นายหน้า (เช่น ศรีกรุงโบรคเกอร์, ฟินโบรคเกอร์ ฯลฯ) ให้ระบุ "ใบเตือนโบรค/ตาราง กธ." หากเป็น "ใบเตือนต่ออายุ" ที่ออกจากบริษัทประกันภัยโดยตรงให้ระบุ "ใบเตือนบริษัท"
- customer_name: ชื่อ-นามสกุลผู้เอาประกันภัย (ตัดคำว่า ผู้เอาประกันภัย ชื่อ ออก)
- address: ที่อยู่ผู้เอาประกันภัย
- previous_insurer: ชื่อบริษัทประกันภัยเดิม (เช่น บริษัท กรุงเทพประกันภัย จำกัด (มหาชน), บริษัท วิริยะประกันภัย จำกัด)
- vehicle_code: รหัสรถยนต์ 3 หลัก ("110" สำหรับรถเก๋ง/กระบะ 4 ประตู หรือ "320" สำหรับกระบะบรรทุก/แค็บ)
- brand: ยี่ห้อรถยนต์ภาษาอังกฤษตัวพิมพ์ใหญ่ (เช่น ISUZU, TOYOTA, HONDA, MITSUBISHI, HYUNDAI)
- model: รุ่นรถยนต์ (เช่น D-MAX, VIOS, YARIS ATIV)
- plate: เลขทะเบียนรถยนต์ (เช่น บธ-8396 อต)
- province: ชื่อจังหวัดของทะเบียนรถ (ถ้าเป็นตัวย่อ เช่น อต = จังหวัดอุตรดิตถ์, กทม = กรุงเทพมหานคร, ชบ = จังหวัดชลบุรี ให้แปลงเป็นชื่อเต็ม)
- year: ปี ค.ศ. ที่ผลิตรถยนต์ 4 หลัก (เช่น 2014 หากในเอกสารเป็น พ.ศ. ให้ลบ 543)
- old_premium_gross: เบี้ยประกันภัยรวมภาษีอากรและอากรแสตมป์ (ช่อง "รวม" สุทธิที่ลูกค้าจ่ายจริง ไม่รวม พ.ร.บ.)
- old_sum_insured: ทุนประกันภัยรถยนต์เสียหาย/สูญหายไฟไหม้ (ตัวเลขจำนวนเงินเอาประกันภัย)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              doc_type: { type: Type.STRING },
              customer_name: { type: Type.STRING },
              address: { type: Type.STRING },
              previous_insurer: { type: Type.STRING },
              vehicle_code: { type: Type.STRING },
              brand: { type: Type.STRING },
              model: { type: Type.STRING },
              plate: { type: Type.STRING },
              province: { type: Type.STRING },
              year: { type: Type.INTEGER },
              old_premium_gross: { type: Type.NUMBER },
              old_sum_insured: { type: Type.NUMBER },
            },
          },
        },
      });

      const text = response.text;
      if (!text) {
        res.status(502).json({ error: 'Empty response from Gemini model' });
        return;
      }

      const parsed = JSON.parse(text.trim());
      res.json(parsed);
    } catch (error) {
      console.error('Server-side Gemini OCR error:', error);
      const message = error instanceof Error ? error.message : 'Failed to extract policy data';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
