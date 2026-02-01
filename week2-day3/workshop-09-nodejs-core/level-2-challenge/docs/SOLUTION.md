# 📊 บันทึกการพัฒนา Task Manager CLI

## ผู้พัฒนา
- ชื่อ: ราเชนทร์ มะโนชัย
- วันที่: 31 Jan 2026

## แนวทางการพัฒนา

### 1. storage.js
**ปัญหาที่พบ:**
- การอ่าน/เขียนไฟล์ tasks.json อาจเกิดข้อผิดพลาดเมื่อไฟล์ไม่มีอยู่ หรือข้อมูลในไฟล์ไม่ถูกต้องตามรูปแบบ JSON

**วิธีแก้:**
- ใช้ try-catch เพื่อจัดการข้อผิดพลาดขณะอ่านไฟล์ และตรวจสอบว่ามีไฟล์ tasks.json หรือไม่ ถ้าไม่มีให้สร้างไฟล์ใหม่พร้อมข้อมูลเริ่มต้น

**สิ่งที่ได้เรียนรู้:**
- ได้เรียนรู้การจัดการข้อผิดพลาดของ Node.js file system และการตรวจสอบ/สร้างไฟล์อัตโนมัติ
- เข้าใจการใช้ async/await กับ fs.promises API

### 2. taskManager.js
**ปัญหาที่พบ:**
- การจัดการกับ task ที่มี id ซ้ำ หรือการค้นหา task ที่ไม่มีอยู่จริง
- การ import tasks จากไฟล์อื่นอาจมี id ซ้ำกับ tasks ที่มีอยู่แล้ว

**วิธีแก้:**
- เพิ่มการตรวจสอบ id ซ้ำก่อนเพิ่ม task ใหม่ และแจ้งเตือนเมื่อค้นหา/แก้ไข/ลบ task ที่ไม่มีอยู่จริง
- ใช้ `Array.find()` และ `Array.findIndex()` ในการค้นหา task
- เมื่อ import tasks ให้ตรวจสอบ id ซ้ำและกำหนด id ใหม่อัตโนมัติ

**ฟังก์ชันที่ implement:**
| ฟังก์ชัน | รายละเอียด |
|----------|-------------|
| `addTask(title, priority, dueDate, tag)` | เพิ่ม task ใหม่พร้อม priority, due date และ tag |
| `listTasks(filter, sortField, sortOrder, tag)` | แสดง tasks พร้อม filter และ sorting |
| `completeTask(id)` | ทำเครื่องหมาย task เสร็จ |
| `deleteTask(id)` | ลบ task |
| `updateTask(id, newTitle)` | แก้ไข title ของ task |
| `showStats()` | แสดงสถิติ tasks |
| `exportTasks(filename)` | Export tasks เป็น JSON |
| `importTasks(filename)` | Import tasks จากไฟล์ JSON |
| `searchTasks(keyword)` | ค้นหา tasks ตาม keyword |
| `sortTasks(field, order)` | เรียงลำดับ tasks |
| `listOverdueTasks()` | แสดง tasks ที่เลยกำหนด |

## ผลการทดสอบ

### Test Case 1: CRUD Operations
| Operation | ผลลัพธ์ | หมายเหตุ |
|-----------|---------|----------|
| เพิ่ม task | ✅ ผ่าน | รองรับ priority, due date และ tag |
| แสดง tasks | ✅ ผ่าน | รองรับ filter, sort และ tag |
| แก้ไข task | ✅ ผ่าน | อัพเดต title และบันทึก updatedAt |
| ลบ task | ✅ ผ่าน | ตรวจสอบ id ก่อนลบ |

### Test Case 2: Advanced Features
| Feature | ผลลัพธ์ | หมายเหตุ |
|---------|---------|----------|
| กรอง tasks | ✅ ผ่าน | filter ตาม all/pending/completed และ tag |
| Complete task | ✅ ผ่าน | บันทึก completedAt timestamp |
| Statistics | ✅ ผ่าน | แสดงจำนวน total/completed/pending และแยกตาม priority |
| Export/Import | ✅ ผ่าน | รองรับการ merge และจัดการ id ซ้ำ |

## Features เพิ่มเติม
- ✅ ค้นหา task ตาม keyword (`search` command)
- ✅ เรียงลำดับ tasks ตาม field (`sort` command)
- ✅ แสดง overdue tasks (`list --overdue`)
- ✅ กำหนด due date ให้ task (`--due YYYY-MM-DD`)
- ✅ กำหนด tag ให้ task (`--tag <tag>`)
- ✅ Filter tasks ตาม tag (`--tag <tag>`)

## Commands ที่รองรับ
```
node index.js add <title> [priority] [--due <date>] [--tag <tag>]
node index.js list [filter] [--sort <field> [asc|desc]] [--tag <tag>]
node index.js list --overdue
node index.js complete <id>
node index.js delete <id>
node index.js update <id> <title>
node index.js stats
node index.js export <filename>
node index.js import <filename>
node index.js search <keyword>
node index.js help
```

## สรุป
ได้ฝึกการใช้งาน Node.js ในการจัดการไฟล์และโครงสร้างโปรเจกต์แบบแยก module ได้อย่างเป็นระบบ เข้าใจการจัดการข้อผิดพลาด การออกแบบ CLI และการทดสอบฟีเจอร์ต่าง ๆ ของแอปพลิเคชันจริง

**สิ่งที่ได้เรียนรู้เพิ่มเติม:**
- การใช้ `fs.promises` API สำหรับ async file operations
- การออกแบบ CLI ด้วย `process.argv`
- การจัดการ configuration ด้วย environment variables
- การใช้ uuid สำหรับสร้าง unique identifiers
- การจัดการ error handling และ logging อย่างเป็นระบบ

## Screenshots
### ตัวอย่างการทำงานของ Task Manager CLI
**Test Case 1: CRUD Operations และ Test Case 2: Advanced Features**
![Screenshot 2026-01-31 143028](../screenshots/Screenshot%202026-01-31%20143028.png)
![Screenshot 2026-01-31 143111](../screenshots/Screenshot%202026-01-31%20143111.png)
![Screenshot 2026-01-31 143146](../screenshots/Screenshot%202026-01-31%20143146.png)
**Features เพิ่มเติม**
![Screenshot 2026-01-31 154213](../screenshots/Screenshot%202026-01-31%20154213.png)
![Screenshot 2026-01-31 154303](../screenshots/Screenshot%202026-01-31%20154303.png)
![Screenshot 2026-01-31 154408](../screenshots/Screenshot%202026-01-31%20154408.png)
![Screenshot 2026-01-31 154427](../screenshots/Screenshot%202026-01-31%20154427.png)