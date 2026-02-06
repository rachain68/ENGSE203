
## ผู้พัฒนา
- ชื่อ: ราเชนทร์ มะโนชัย
- วันที่: 31 Jan 2026

โปรเจคนี้เป็นตัวอย่าง REST API สำหรับจัดการรายการงาน (todos) โดยใช้ Node.js, Express และ SQLite (`better-sqlite3`).

**Key files**
- [server.js](server.js#L1) — เริ่มเซิร์ฟเวอร์
- [src/app.js](src/app.js#L1) — กำหนด Express app และ middlewares
- [src/db.js](src/db.js#L1) — ตัวจัดการการเชื่อมต่อ SQLite และสคริปต์สร้าง/seed
- [src/models/Todo.js](src/models/Todo.js#L1) — โค้ดการเข้าถึง DB (CRUD)
- [src/controllers/todoController.js](src/controllers/todoController.js#L1) — โลจิกของ API
- [src/routes/todos.js](src/routes/todos.js#L1) — เส้นทาง API
- [database/schema.sql](database/schema.sql#L1) — schema ของฐานข้อมูล
- [database/seed.sql](database/seed.sql#L1) — ข้อมูลตัวอย่าง

## Prerequisites

- Node.js >=14
- npm

## ติดตั้ง

```bash
npm install
```

## การตั้งค่าสภาพแวดล้อม

คัดลอกไฟล์ `.env` (ถ้ายังไม่มี) แล้วกำหนดค่าต่อไปนี้ตามต้องการ:

```
PORT=3000
DB_PATH=./database/database.db
NODE_ENV=development
```

## สร้างฐานข้อมูล (schema & seed)

```bash
# สร้าง schema เท่านั้น
node src/db.js

# สร้าง schema และ seed (reset)
npm run db:reset
```

## รันเซิร์ฟเวอร์

```bash
# โหมด production
npm start

# โหมดพัฒนา (nodemon)
npm run dev
```

เมื่อรันแล้ว API หลักจะอยู่ที่: `http://localhost:3000/api/todos`

## Endpoints (สรุป + ตัวอย่าง)

- GET `/api/todos`
	- Query params: `done` (true/false หรือ 1/0), `search` (string)
	- ตัวอย่าง:

```bash
curl "http://localhost:3000/api/todos?done=0&search=ซื้อ"
```

- GET `/api/todos/:id`
	- ตัวอย่าง:

```bash
curl http://localhost:3000/api/todos/1
```

- POST `/api/todos`
	- Body JSON: `{ "task": "ข้อความงาน" }`
	- Validation: `task` required, <=200 chars
	- ตัวอย่าง:

```bash
curl -X POST http://localhost:3000/api/todos \
	-H "Content-Type: application/json" \
	-d '{"task":"ซื้อขนม"}'
```

- PATCH `/api/todos/:id` (อัพเดทสถานะ)
	- Body JSON: `{ "done": true }` หรือ `{ "done": 1 }`
	- ตัวอย่าง:

```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
	-H "Content-Type: application/json" \
	-d '{"done": true}'
```

- DELETE `/api/todos/:id`
	- ตัวอย่าง:

```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

- GET `/api/todos/stats`
	- คืนค่า `{ total, completed, pending }`
	- ตัวอย่าง:

```bash
curl http://localhost:3000/api/todos/stats
```

## Database

- Schema และ trigger อยู่ที่ [database/schema.sql](database/schema.sql#L1).
- ข้อมูลตัวอย่างอยู่ที่ [database/seed.sql](database/seed.sql#L1).

ตามไฟล์ `seed.sql` ค่าเริ่มต้นจะมี 5 รายการ (completed: 2, pending: 3).

## ผลการทดสอบ (manual)

- หลังรัน `npm run db:reset` และ `npm start`:
	- `GET /api/todos/stats` ควรคืน `{ total: 5, completed: 2, pending: 3 }` (ตาม seed)
	- `GET /api/todos` ควรคืนรายการ todos ที่มี
	- `POST /api/todos` สร้างรายการใหม่ และ `PATCH` จะอัพเดทสถานะ

## ข้อเสนอแนะ / To improve

- เพิ่ม pagination ใน `GET /api/todos` เมื่อข้อมูลเยอะ
- ใช้ validation library (เช่น `joi`) สำหรับการตรวจสอบ input ให้ชัดเจน
- เพิ่ม unit/integration tests และ CI (GitHub Actions)
- เพิ่ม logging ที่ดีกว่า (เช่น `pino` หรือ `winston`) สำหรับ production
- หากนำไปรันใน container ให้แน่ใจว่า `DB_PATH` เขียนได้จาก container

