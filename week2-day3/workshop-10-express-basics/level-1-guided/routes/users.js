// routes/users.js
const express = require('express');
const router = express.Router();
const { validateCreateUser, validateUpdateUser } = require('../middleware/validateUser');

// Dummy data (จะใช้ database ในภายหลัง)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

/**
 * GET /api/users - Get all users
 * Query params: ?role=admin
 */
router.get('/', (req, res) => {
  // ตรวจสอบ query parameters: role, page, limit
  const { role, page = '1', limit = '10' } = req.query;

  let filteredUsers = users;

  // กรองตาม role ถ้ามี
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const currentPage = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  const perPage = Number.isNaN(limitNum) || limitNum < 1 ? 10 : limitNum;

  const total = filteredUsers.length;
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const paged = filteredUsers.slice(start, end);

  res.json({
    success: true,
    page: currentPage,
    limit: perPage,
    total,
    count: paged.length,
    data: paged
  });
});

// GET /api/users/search?q=john
router.get('/search', (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: { message: 'Query parameter q is required' }
    });
  }

  const qLower = q.toLowerCase();

  const matched = users.filter(u =>
    (u.name && u.name.toLowerCase().includes(qLower)) ||
    (u.email && u.email.toLowerCase().includes(qLower))
  );

  res.json({
    success: true,
    count: matched.length,
    data: matched
  });
});

/**
 * GET /api/users/:id - Get user by ID
 * Route parameter: id
 */
router.get('/:id', (req, res) => {
  // แปลง id จาก string เป็น number
  const id = parseInt(req.params.id);

  // หา user
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * POST /api/users - Create new user
 * Body: { name, email, role }
 */
router.post('/', validateCreateUser, (req, res) => {
  const { name, email, role } = req.body;

  // สร้าง user ใหม่
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

/**
 * PUT /api/users/:id - Update user
 * Body: { name, email, role }
 */
router.put('/:id', validateUpdateUser, (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role })
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

// (duplicate search handler removed)


/**
 * DELETE /api/users/:id - Delete user
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // ลบ user
  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

module.exports = router;