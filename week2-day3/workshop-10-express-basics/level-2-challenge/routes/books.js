// routes/books.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateBook } = require('../middleware/validate');

/**
 * GET /api/books - Get all books
 * Query: ?genre=Fantasy&page=1&limit=10
 */
router.get('/', (req, res) => {
  let books = dataStore.getAllBooks();

  const { genre, page = 1, limit = 10 } = req.query;

  if (genre) {
    books = books.filter((b) => b.genre === genre);
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  const total = books.length;
  const paged = books.slice(start, end).map((b) => ({
    ...b,
    author: dataStore.getAuthorById(b.authorId) || null,
  }));

  res.json({ success: true, count: paged.length, page: pageNum, limit: limitNum, total, data: paged });
});

/**
 * GET /api/books/search - Search books
 * Query: ?q=harry
 */
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ success: true, count: 0, data: [] });
  }

  const term = q.toLowerCase();
  const results = dataStore.getAllBooks().filter((b) => b.title.toLowerCase().includes(term))
    .map((b) => ({ ...b, author: dataStore.getAuthorById(b.authorId) || null }));

  res.json({ success: true, count: results.length, data: results });
});

/**
 * GET /api/books/:id - Get book by ID
 */
router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid book id');
    err.statusCode = 400;
    return next(err);
  }

  const book = dataStore.getBookById(id);
  if (!book) {
    const err = new Error('Book not found');
    err.statusCode = 404;
    return next(err);
  }

  const author = dataStore.getAuthorById(book.authorId) || null;
  res.json({ success: true, data: { ...book, author } });
});

/**
 * POST /api/books - Create new book
 */
router.post('/', validateBook, (req, res, next) => {
  const { title, authorId, year, genre, isbn } = req.body;

  const author = dataStore.getAuthorById(authorId);
  if (!author) {
    const err = new Error('Author not found');
    err.statusCode = 400;
    return next(err);
  }

  const newBook = dataStore.addBook({ title, authorId, year, genre, isbn });
  res.status(201).json({ success: true, data: newBook });
});

/**
 * PUT /api/books/:id - Update book
 */
router.put('/:id', validateBook, (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid book id');
    err.statusCode = 400;
    return next(err);
  }

  const { title, authorId, year, genre, isbn } = req.body;

  if (authorId && !dataStore.getAuthorById(authorId)) {
    const err = new Error('Author not found');
    err.statusCode = 400;
    return next(err);
  }

  const updated = dataStore.updateBook(id, { title, authorId, year, genre, isbn });
  if (!updated) {
    const err = new Error('Book not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ success: true, data: updated });
});

/**
 * DELETE /api/books/:id - Delete book
 */
router.delete('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid book id');
    err.statusCode = 400;
    return next(err);
  }

  const deleted = dataStore.deleteBook(id);
  if (!deleted) {
    const err = new Error('Book not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ success: true, data: deleted });
});

module.exports = router;