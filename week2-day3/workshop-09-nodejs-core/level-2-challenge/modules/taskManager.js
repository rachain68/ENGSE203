
// modules/taskManager.js
const { v4: uuidv4 } = require('uuid');
const storage = require('./storage');
const logger = require('./logger');

class TaskManager {
  // แสดง tasks ที่ overdue
  async listOverdueTasks() {
    await this.loadTasks();
    const today = new Date().toISOString().slice(0, 10);
    const overdueTasks = this.tasks.filter(task =>
      !task.completed && task.dueDate && task.dueDate < today
    );
    if (overdueTasks.length === 0) {
      logger.info('No overdue tasks!');
      return;
    }
    logger.info('\nOVERDUE TASKS:\n');
    const tableData = overdueTasks.map(task => ({
      ID: task.id,
      Title: task.title,
      Priority: task.priority,
      Due: task.dueDate,
      Status: '○ Pending',
      Created: new Date(task.createdAt).toLocaleDateString()
    }));
    logger.table(tableData);
    console.log(`\nTotal: ${overdueTasks.length} overdue task(s)\n`);
  }

  // เรียงลำดับ tasks
  async sortTasks(field = 'title', order = 'asc') {
    await this.loadTasks();
    if (this.tasks.length === 0) {
      logger.warning('No tasks to sort');
      return;
    }
    const validFields = ['title', 'priority', 'createdAt', 'id'];
    if (!validFields.includes(field)) {
      logger.error(`Invalid sort field: ${field}`);
      return;
    }
    const sorted = [...this.tasks].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      if (field === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    logger.info(`\nSORTED TASKS by ${field} (${order}):\n`);
    const tableData = sorted.map(task => ({
      ID: task.id,
      Title: task.title,
      Priority: task.priority,
      Status: task.completed ? '✓ Done' : '○ Pending',
      Created: new Date(task.createdAt).toLocaleDateString()
    }));
    logger.table(tableData);
    console.log(`\nTotal: ${sorted.length} task(s)\n`);
  }


  // ค้นหา tasks จาก keyword
  async searchTasks(keyword) {
    await this.loadTasks();
    if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
      logger.error('Please provide a search keyword');
      return;
    }
    const lowerKeyword = keyword.toLowerCase();
    const matchedTasks = this.tasks.filter(task =>
      task.title.toLowerCase().includes(lowerKeyword)
    );
    if (matchedTasks.length === 0) {
      logger.warning(`No tasks found matching: "${keyword}"`);
      return;
    }
    logger.info(`\nSEARCH RESULTS for "${keyword}":\n`);
    const tableData = matchedTasks.map(task => ({
      ID: task.id,
      Title: task.title,
      Priority: task.priority,
      Status: task.completed ? '✓ Done' : '○ Pending',
      Created: new Date(task.createdAt).toLocaleDateString()
    }));
    logger.table(tableData);
    console.log(`\nTotal: ${matchedTasks.length} task(s) found\n`);
  }


  // โหลด tasks จาก storage
  async loadTasks() {
    this.tasks = await storage.read();
    if (this.tasks.length > 0) {
      this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
    }
  }

  // บันทึก tasks ไปยัง storage
  async saveTasks() {
    await storage.write(this.tasks);
  }

  // เพิ่ม task ใหม่
async addTask(title, priority = 'medium', dueDate = null, tag = null) {
  await this.loadTasks();

  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority.toLowerCase())) {
    priority = 'medium';
  }

  let due = null;
  if (dueDate) {
    // Validate date format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      due = dueDate;
    } else {
      logger.warning('Invalid due date format, should be YYYY-MM-DD');
    }
  }

  const task = {
    id: this.nextId++,
    title,
    priority: priority.toLowerCase(),
    completed: false,
    createdAt: new Date().toISOString(),
    ...(due && { dueDate: due }),
    ...(tag && { tag: tag.toLowerCase() })
  };

  this.tasks.push(task);
  await this.saveTasks();
  
  const tagInfo = tag ? ` [${tag}]` : '';
  logger.success(`Task added: "${title}"${tagInfo} (ID: ${task.id})`);
  return task;
}

  // แสดงรายการ tasks
async listTasks(filter = 'all', sortField = null, sortOrder = 'asc', tag = null) {
  await this.loadTasks();

  if (this.tasks.length === 0) {
    logger.warning('No tasks found');
    return;
  }

  let filteredTasks = this.tasks;

  if (filter === 'pending') {
    filteredTasks = this.tasks.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filteredTasks = this.tasks.filter(t => t.completed);
  }

  // Filter by tag
  if (tag) {
    filteredTasks = filteredTasks.filter(t => t.tag && t.tag.toLowerCase() === tag.toLowerCase());
  }

  if (filteredTasks.length === 0) {
    const tagInfo = tag ? ` with tag "${tag}"` : '';
    logger.warning(`No ${filter} tasks found${tagInfo}`);
    return;
  }

  // Sorting support
  if (sortField) {
    const validFields = ['title', 'priority', 'createdAt', 'id'];
    if (!validFields.includes(sortField)) {
      logger.warning(`Invalid sort field: ${sortField}`);
    } else {
      filteredTasks = [...filteredTasks].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        if (sortField === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  const tagInfo = tag ? ` [Tag: ${tag}]` : '';
  logger.info(`\n${filter.toUpperCase()} TASKS${tagInfo}:\n`);
  const tableData = filteredTasks.map(task => ({
    ID: task.id,
    Title: task.title,
    Priority: task.priority,
    Tag: task.tag || '-',
    Status: task.completed ? '✓ Done' : '○ Pending',
    Created: new Date(task.createdAt).toLocaleDateString()
  }));
  logger.table(tableData);
  console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
}

  // ทำเครื่องหมาย task เสร็จ
  async completeTask(id) {
    await this.loadTasks();

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      logger.error(`Task with ID ${id} not found`);
      return;
    }
    if (task.completed) {
      logger.warning(`Task ${id} is already completed`);
      return;
    }
    task.completed = true;
    task.completedAt = new Date().toISOString();
    await this.saveTasks();
    logger.success(`Task ${id} marked as completed`);
  }

  // ลบ task
  async deleteTask(id) {
    await this.loadTasks();

    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) {
      logger.error(`Task with ID ${id} not found`);
      return;
    }
    this.tasks.splice(idx, 1);
    await this.saveTasks();
    logger.success(`Task ${id} deleted`);
  }

  // แก้ไข task
  async updateTask(id, newTitle) {
    await this.loadTasks();

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      logger.error(`Task with ID ${id} not found`);
      return;
    }
    task.title = newTitle;
    task.updatedAt = new Date().toISOString();
    await this.saveTasks();
    logger.success(`Task ${id} updated`);
  }

  // แสดง statistics
  async showStats() {
    await this.loadTasks();

    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const byPriority = {
      high: this.tasks.filter(t => t.priority === 'high').length,
      medium: this.tasks.filter(t => t.priority === 'medium').length,
      low: this.tasks.filter(t => t.priority === 'low').length,
    };

    console.log('\n' + '='.repeat(40));
    console.log('  📊 TASK STATISTICS');
    console.log('='.repeat(40));
    console.log(`Total tasks:      ${total}`);
    console.log(`Completed:        ${completed}`);
    console.log(`Pending:          ${pending}`);
    console.log('--- By Priority ---');
    console.log(`High:             ${byPriority.high}`);
    console.log(`Medium:           ${byPriority.medium}`);
    console.log(`Low:              ${byPriority.low}`);
    console.log('='.repeat(40) + '\n');
  }

  // Export tasks
  async exportTasks(filename) {
    await this.loadTasks();
    await storage.exportTo(filename, this.tasks);
    logger.success(`Tasks exported to ${filename}`);
  }

  // Import tasks
  async importTasks(filename) {
    const importedTasks = await storage.importFrom(filename);
    await this.loadTasks();
    // Merge tasks, avoid id duplicates
    const existingIds = new Set(this.tasks.map(t => t.id));
    let maxId = this.nextId - 1;
    for (let task of importedTasks) {
      if (existingIds.has(task.id)) {
        // Assign new id
        maxId++;
        task.id = maxId;
      }
      this.tasks.push(task);
    }
    this.nextId = maxId + 1;
    await this.saveTasks();
    logger.success(`Tasks imported from ${filename}`);
  }
}

module.exports = new TaskManager();