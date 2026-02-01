// middleware/validateUser.js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedRoles = ['admin', 'user'];

const validateCreateUser = (req, res, next) => {
  const { name, email, role } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: { message: 'Name is required and must be at least 2 characters' }
    });
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: { message: 'A valid email is required' }
    });
  }

  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      error: { message: `Role must be one of: ${allowedRoles.join(', ')}` }
    });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  if (role) req.body.role = role;

  next();
};

const validateUpdateUser = (req, res, next) => {
  const { name, email, role } = req.body || {};

  if (!name && !email && !role) {
    return res.status(400).json({
      success: false,
      error: { message: 'At least one of name, email, or role must be provided' }
    });
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name must be a string of at least 2 characters' }
      });
    }
    req.body.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'If provided, email must be valid' }
      });
    }
    req.body.email = email.trim().toLowerCase();
  }

  if (role !== undefined) {
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: `Role must be one of: ${allowedRoles.join(', ')}` }
      });
    }
    req.body.role = role;
  }

  next();
};

module.exports = { validateCreateUser, validateUpdateUser };
