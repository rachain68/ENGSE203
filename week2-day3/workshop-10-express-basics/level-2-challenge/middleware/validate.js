// middleware/validate.js
const Joi = require("joi");

// Author validation schema
const authorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(50).required(),
  birthYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),
});

// Book validation schema
const bookSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  authorId: Joi.number().integer().required(),
  year: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),
  genre: Joi.string().min(2).max(50).required(),
  isbn: Joi.string()
    .pattern(/^[0-9-]+$/)
    .required(),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    next();
  };
};

module.exports = {
  validateAuthor: validate(authorSchema),
  validateBook: validate(bookSchema),
};
