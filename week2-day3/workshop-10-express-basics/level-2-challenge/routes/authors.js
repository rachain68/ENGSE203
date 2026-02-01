// routes/authors.js
const express = require("express");
const router = express.Router();
const dataStore = require("../data/dataStore");
const { validateAuthor } = require("../middleware/validate");

/**
 * GET /api/authors - Get all authors
 * Query: ?country=UK
 */
router.get("/", (req, res) => {
  let authors = dataStore.getAllAuthors();

  const { country } = req.query;
  if (country) {
    authors = authors.filter((a) => a.country === country);
  }

  res.json({
    success: true,
    count: authors.length,
    data: authors,
  });
});

/**
 * GET /api/authors/:id - Get author by ID
 */
router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid author id');
    err.statusCode = 400;
    return next(err);
  }

  const author = dataStore.getAuthorById(id);
  if (!author) {
    const err = new Error('Author not found');
    err.statusCode = 404;
    return next(err);
  }

  const books = dataStore.getBooksByAuthor(id);

  res.json({
    success: true,
    data: { ...author, books },
  });
});

/**
 * POST /api/authors - Create new author
 */
router.post("/", validateAuthor, (req, res) => {
  const { name, country, birthYear } = req.body;
  const newAuthor = dataStore.addAuthor({ name, country, birthYear });

  res.status(201).json({
    success: true,
    message: "Author created successfully",
    data: newAuthor,
  });
});

/**
 * PUT /api/authors/:id - Update author
 */
router.put("/:id", validateAuthor, (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid author id');
    err.statusCode = 400;
    return next(err);
  }

  const { name, country, birthYear } = req.body;
  const updated = dataStore.updateAuthor(id, { name, country, birthYear });
  if (!updated) {
    const err = new Error('Author not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ success: true, data: updated });
});

/**
 * DELETE /api/authors/:id - Delete author
 */
router.delete("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid author id');
    err.statusCode = 400;
    return next(err);
  }

  const books = dataStore.getBooksByAuthor(id);
  if (books.length > 0) {
    const err = new Error('Cannot delete author with existing books');
    err.statusCode = 400;
    return next(err);
  }

  const deleted = dataStore.deleteAuthor(id);
  if (!deleted) {
    const err = new Error('Author not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ success: true, data: deleted });
});

module.exports = router;
