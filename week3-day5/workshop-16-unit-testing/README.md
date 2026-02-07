# Workshop 16 — Unit Testing (Todo App Utilities)

สรุปโปรเจกต์
- โฟลเดอร์นี้เป็นตัวอย่างการทดสอบหน่วย (unit tests) สำหรับชุดเครื่องมือที่ใช้กับ Todo app (utilities, models, และ validation)

Prerequisites
- Node.js (v16+ recommended) and npm

Quick start
1. ติดตั้ง dependencies:

```bash
npm install
```

2. รันชุดทดสอบ:

```bash
npm test
```

มีสคริปต์ที่เป็นประโยชน์:
- `npm test` — รัน Jest tests
- `npm run test:watch` — รัน Jest ในโหมด watch
- `npm run test:coverage` — รันและสร้าง coverage report
- `npm run test:verbose` — รัน Jest แบบ verbose

โครงสร้างสำคัญของโปรเจกต์
- `src/` — โค้ดต้นฉบับ (utils, models, config)
- `tests/unit/` — ชุดทดสอบหน่วย
- `coverage/` — โฟลเดอร์ผลลัพธ์ coverage เมื่อรัน `--coverage`

สถานะปัจจุบัน
- ก่อนแก้ไข มี 2 tests ที่ล้มเหลวซึ่งมาจาก `src/utils/validation.js` (ข้อความข้อผิดพลาดไม่ตรงกับที่ทดสอบคาดหวัง)
- ขณะนี้ไฟล์ `validation.js` ถูกปรับให้ตรวจสอบ `null`/`undefined` แยกจากสตริงว่าง (`''`) เพื่อให้ข้อความข้อผิดพลาดตรงกับข้อทดสอบ (เช่น `Task cannot be empty`).


