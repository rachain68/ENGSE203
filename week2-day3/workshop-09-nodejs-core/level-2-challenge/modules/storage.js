// modules/storage.js
const fs = require("fs").promises;
const path = require("path");
const logger = require("./logger");
const { config } = require("./config");

class Storage {
  constructor() {
    this.dataFile = config.dataFile;
  }

  // อ่านข้อมูล tasks จากไฟล์

  // อ่านข้อมูล tasks จากไฟล์
  // TODO: ตรวจสอบว่าไฟล์มีอยู่หรือไม่
  // ถ้าไม่มี ให้ return empty array
  // ถ้ามี ให้อ่านและ parse JSON
  // คำแนะนำ: ใช้ fs.access() เพื่อเช็คว่าไฟล์มีอยู่
  // ใช้ fs.readFile() เพื่ออ่านไฟล์
  // ใช้ JSON.parse() เพื่อแปลงเป็น object
  // YOUR CODE HERE
  async read() {
    try {
      try {
        await fs.access(this.dataFile);
      } catch {
        return []; // ไฟล์ไม่มี
      }
      const data = await fs.readFile(this.dataFile, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Failed to read data: ${error.message}`);
      return [];
    }
  }

  // บันทึกข้อมูล tasks ลงไฟล์

  // บันทึกข้อมูล tasks ลงไฟล์
  // TODO: สร้างโฟลเดอร์ data ถ้ายังไม่มี
  // TODO: แปลง data เป็น JSON string (แบบ pretty print)
  // TODO: เขียนลงไฟล์
  // คำแนะนำ: ใช้ path.dirname() เพื่อหา directory
  // ใช้ fs.mkdir() เพื่อสร้างโฟลเดอร์ (recursive: true)
  // ใช้ JSON.stringify() พร้อม indent
  // ใช้ fs.writeFile() เพื่อเขียนไฟล์
  // YOUR CODE HERE
  async write(data) {
    try {
      const dir = path.dirname(this.dataFile);
      await fs.mkdir(dir, { recursive: true });
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(this.dataFile, jsonData, "utf-8");
      logger.success("Data saved successfully");
      return true;
    } catch (error) {
      logger.error(`Failed to write data: ${error.message}`);
      throw error;
    }
  }

  // Export tasks ไปยังไฟล์อื่น
  async exportTo(filename, data) {
    try {
      // TODO: ทำคล้ายกับ write() แต่ใช้ filename ที่ระบุ
      // YOUR CODE HERE
      const dir = path.dirname(filename);
      await fs.mkdir(dir, { recursive: true });
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filename, jsonData, "utf-8");
      logger.success("Data exported successfully");
      return true;
    } catch (error) {
      logger.error(`Failed to export: ${error.message}`);
      throw error;
    }
  }

  // Import tasks จากไฟล์อื่น
  async importFrom(filename) {
    try {
      // TODO: อ่านไฟล์ที่ระบุและ return data
      // YOUR CODE HERE
      await fs.access(filename);
      const data = await fs.readFile(filename, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Failed to import: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Storage();
