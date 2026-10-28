# ระบบสแกนตารางกรมธรรม์ & ออกใบเสนอราคาย้ายค่ายอัตโนมัติ (CHUBB x ฟิน โบรคเกอร์) - Full-Stack React Edition

เว็บแอปพลิเคชันพัฒนาด้วย **React 19 + TypeScript + Express (`server.ts`) + Vite + Tailwind CSS** สำหรับสแกนรูปภาพ **ตารางกรมธรรม์ประกันภัยรถยนต์ (`ตาราง กธ.`)** หรือ **ใบเตือนต่ออายุ (`ใบเตือนบริษัท` / `ใบเตือนโบรคเกอร์`)** ด้วย Google Gemini Vision AI (`gemini-3.8-flash`) ผ่านฝั่ง Server-Side พร้อมระบบตรวจสอบข้อมูลก่อนยืนยัน (Human-in-the-Loop Verification) และออกใบเสนอราคาขนาด **A4 PDF** พร้อมพิมพ์และส่งแชท LINE

---

## สถาปัตยกรรมระบบ (Project Architecture)

- **Frontend**: React 19 + TypeScript + Tailwind CSS (พร้อม Print Stylesheet ขนาด A4 Portrait)
- **Backend**: Express (`server.ts`) เชื่อมต่อ `@google/genai` SDK ผ่าน `process.env.GEMINI_API_KEY`
- **OCR Engine**: Endpoint `POST /api/ocr` ใช้โมเดล `gemini-3.8-flash` พร้อม `responseSchema` (Structured JSON Output)

### โครงสร้างโค้ด (Source Structure)

```
/
├── server.ts                  # Express Backend Server & /api/ocr Gemini endpoint
├── src/
│   ├── components/
│   │   ├── Header.tsx         # ส่วนหัว แบรนดิ้ง และ Stepper นำทาง 3 ขั้นตอน
│   │   ├── Step1Upload.tsx    # Drag-and-drop, วางภาพ (Ctrl+V) และพรีเซ็ตตัวอย่าง
│   │   ├── Step2Verify.tsx    # หน้าตรวจทานข้อมูล ตรวจสอบเงื่อนไขอัตโนมัติ และฟอร์มแก้ไข
│   │   └── Step3Pdf.tsx       # ใบเสนอราคาขนาด A4 Portrait พร้อมพิมพ์และคัดลอกข้อความ LINE
│   ├── data/
│   │   └── constants.ts       # ข้อมูล 21 บริษัทประกัน, 77 จังหวัด, 4 โครงการ และเคสตัวอย่าง
│   ├── services/
│   │   └── gemini.ts          # Client service เรียกใช้งาน /api/ocr และจับคู่ข้อมูลเข้าฟอร์ม
│   ├── utils/
│   │   └── calculator.ts      # ฟังก์ชันคำนวณเบี้ย ส่วนลด ทุนประกัน และเกณฑ์ขั้นต่ำ
│   ├── types.ts               # Data models & TypeScript interfaces
│   ├── App.tsx                # สถานะหลักของแอปพลิเคชันและการเชื่อมต่อ
│   ├── main.tsx               # จุดเริ่มต้นเมานต์ React
│   └── index.css              # สไตล์หลักและ Tailwind imports
├── index.html                 # Entry point พร้อมฟอนต์ Sarabun และ CSS พิมพ์ A4
├── package.json               # คำสั่ง dev, build, start, lint
└── vite.config.ts             # กำหนดค่า Vite
```

---

## ขั้นตอนการทำงาน (3-Step User Journey)

1. **ส่งรูปตาราง กธ. หรือ ใบเตือนต่ออายุ (Upload / Paste Image)**
   - รองรับการอัปโหลดไฟล์รูปภาพ หรือกด `Ctrl+V` / `Cmd+V` เพื่อวางภาพที่แคปมาจากแชท LINE
   - ประมวลผลด้วย Gemini Vision ผ่านเซิร์ฟเวอร์หลังบ้านอัตโนมัติโดยที่ผู้ใช้งานไม่ต้องตั้งค่า API Key เอง
2. **ตรวจทานข้อมูลก่อนยืนยัน (Human-in-the-Loop Verification & Rule Check)**
   - ตรวจสอบเงื่อนไขโครงการอัตโนมัติ: อายุรถ (ไม่เกิน 5, 7, หรือ 15 ปี), รหัสรถ (`110`/`320`), และเรทเบี้ยขั้นต่ำตามภูมิภาคครบ 77 จังหวัด
   - เปรียบเทียบความคุ้มค่าระหว่าง **ทางเลือก A (ใช้ตาราง กธ. ลด 5% | ทุนใหม่ 90%)** กับ **ทางเลือก B (ใช้ใบเตือนบริษัท ลด 10% | ทุนใหม่ 100%)**
   - แก้ไขข้อมูลได้ทุกช่องพร้อมคำนวณเบี้ยสุทธิและทุนใหม่แบบเรียลไทม์
3. **ออกใบเสนอราคา A4 PDF พร้อมใช้ (Print / Export PDF)**
   - จัดหน้าใบเสนอราคาตามมาตรฐานทางการขนาด A4 Portrait พร้อมโลโก้ CHUBB x FIN BROKER
   - กดปุ่ม **Export PDF / พิมพ์ใบเสนอราคา (A4)** บันทึกเป็น PDF หรือกด **คัดลอกข้อความส่ง LINE** ส่งให้ลูกค้าได้ทันที
