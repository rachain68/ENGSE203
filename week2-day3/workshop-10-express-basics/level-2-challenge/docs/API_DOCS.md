# 📊 ผลการทดลอง - Workshop 10 Level 2

## ผู้ทดลอง
- ชื่อ: ราเชนทร์ มะโนชัย
- วันที่: 01 Feb 2026

## คำแนะนำการรันเซิร์ฟเวอร์

1. ติดตั้ง dependencies (ครั้งแรก):

```bash
cd level-2-challenge
npm install
```

2. รันเซิร์ฟเวอร์ (ตัวอย่างใช้พอร์ต 3001 เพื่อหลีกเลี่ยงพอร์ตที่อาจถูกใช้งาน):

```bash
PORT=3001 node server.js
```

Server จะตอบที่ http://localhost:3001

## วิธีทดสอบ (cURL examples)

หมายเหตุ: ทุกตัวอย่างส่ง `Content-Type: application/json` เมื่อมี body

---
### Authors

- ดึงผู้เขียนทั้งหมด

```bash
curl http://localhost:3001/api/authors
```

- กรองผู้เขียนตามประเทศ (ตัวอย่าง: UK)

```bash
curl 'http://localhost:3001/api/authors?country=UK'
```

- ดูผู้เขียนตาม id พร้อมรายการหนังสือของผู้เขียน

```bash
curl http://localhost:3001/api/authors/1
```

- สร้างผู้เขียนใหม่

```bash
curl -X POST http://localhost:3001/api/authors \
	-H "Content-Type: application/json" \
	-d '{"name":"J.R.R. Tolkien","country":"UK","birthYear":1892}'
```

- อัปเดตผู้เขียน (PUT)

```bash
curl -X PUT http://localhost:3001/api/authors/4 \
	-H "Content-Type: application/json" \
	-d '{"name":"J.R.R. Tolkien","country":"UK","birthYear":1892}'
```

- ลบผู้เขียน (ถ้ามีหนังสือ จะไม่อนุญาตให้ลบ)

```bash
curl -X DELETE http://localhost:3001/api/authors/4
```

---
### Books

- ดึงหนังสือทั้งหมด (author ฝังอยู่ในผลลัพธ์)

```bash
curl http://localhost:3001/api/books
```

- กรองตาม genre และทำ pagination (page, limit)

```bash
curl 'http://localhost:3001/api/books?genre=Fantasy&page=1&limit=2'
```

- ดูหนังสือตาม id (แสดงข้อมูลผู้เขียนด้วย)

```bash
curl http://localhost:3001/api/books/1
```

- ค้นหาหนังสือตามคำค้นใน title

```bash
curl 'http://localhost:3001/api/books/search?q=harry'
```

- สร้างหนังสือใหม่ (ต้องมี `authorId` ที่มีอยู่แล้ว)

```bash
curl -X POST http://localhost:3001/api/books \
	-H "Content-Type: application/json" \
	-d '{"title":"The Hobbit","authorId":4,"year":1937,"genre":"Fantasy","isbn":"978-0261102217"}'
```

- อัปเดตหนังสือ

```bash
curl -X PUT http://localhost:3001/api/books/4 \
	-H "Content-Type: application/json" \
	-d '{"title":"The Hobbit","authorId":4,"year":1937,"genre":"Fantasy","isbn":"978-0261102217"}'
```

- ลบหนังสือ

```bash
curl -X DELETE http://localhost:3001/api/books/4
```

---
### ทดสอบ Rate Limiting (ส่ง request จำนวนมาก)

ตัวอย่างส่ง 120 คำขอไปที่ `/api/authors` เพื่อตรวจสอบการตอบ `429`

```bash
for i in $(seq 1 120); do
	curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/authors
done | sort | uniq -c
```

ผลลัพธ์ที่คาดหวัง: จำนวน `200` บางส่วนและ `429` เมื่อถึง limit (ค่าตั้งต้นใน .env คือ 100 / 15 นาที)

---
## ตัวอย่างผลลัพธ์ (ย่อ)

- GET /api/authors

```json
{ "success": true, "count": 3, "data": [ ... ] }
```

- GET /api/books?genre=Fantasy&page=1&limit=2

```json
{ "success": true, "count": 1, "page":1, "limit":2, "total":1, "data": [ { "id":1, "title":"...","author":{...} } ] }
```

---

