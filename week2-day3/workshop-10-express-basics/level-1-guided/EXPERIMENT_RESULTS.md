# 📊 ผลการทดลอง - Workshop 10 Level 1

## ผู้ทดลอง
- ชื่อ: ราเชนทร์ มะโนชัย
- วันที่: 01 Feb 2026

## การทดสอบ Endpoints

หมายเหตุ: เซิร์ฟเวอร์รันบนพอร์ต `3000` (เริ่มด้วย `npm install` แล้ว `npm run dev`).

### 1. GET /api/users
**Request:**
```bash
curl http://localhost:3000/api/users
```

**Expected / Observed Response:**
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 3,
  "count": 3,
  "data": [
    { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user" },
    { "id": 3, "name": "Bob Johnson", "email": "bob@example.com", "role": "user" }
  ]
}
```

---

### 2. GET /api/users/search?q=john
**Request:**
```bash
curl "http://localhost:3000/api/users/search?q=john"
```

**Expected / Observed Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin" },
    { "id": 3, "name": "Bob Johnson", "email": "bob@example.com", "role": "user" }
  ]
}
```

---

### 3. GET /api/users/:id
**Request:**
```bash
curl http://localhost:3000/api/users/2
```

**Expected / Observed Response:**
```json
{
  "success": true,
  "data": { "id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user" }
}
```

---

### 4. POST /api/users (Create)
**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Example","email":"alice@example.com"}'
```

**Expected / Observed Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { "id": 4, "name": "Alice Example", "email": "alice@example.com", "role": "user" }
}
```

**Error case (invalid email):**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"X","email":"bad-email"}'
```

Response (400):
```json
{ "success": false, "error": { "message": "A valid email is required" } }
```

---

### 5. PUT /api/users/:id (Update)
**Request (example: make user 4 an admin):**
```bash
curl -X PUT http://localhost:3000/api/users/4 \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

**Expected / Observed Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { "id": 4, "name": "Alice Example", "email": "alice@example.com", "role": "admin" }
}
```

**Error case (no fields provided):**
```bash
curl -X PUT http://localhost:3000/api/users/4 -H "Content-Type: application/json" -d '{}'
```

Response (400):
```json
{ "success": false, "error": { "message": "At least one of name, email, or role must be provided" } }
```

---

### 6. DELETE /api/users/:id
**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/4
```

**Expected / Observed Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": { "id": 4, "name": "Alice Example", "email": "alice@example.com", "role": "admin" }
}
```

---

## สรุป
- ฟังก์ชันการทำงานหลักของ `users` routes ถูกทดสอบ (GET, SEARCH, GET by ID, POST, PUT, DELETE)
- Middleware `validateUser` ตรวจสอบข้อมูลสำหรับการสร้างและแก้ไข (email format, name length, allowed roles)

## คำสั่งที่ใช้ในการรันเซิร์ฟเวอร์
```bash
npm install
npm run dev
```
