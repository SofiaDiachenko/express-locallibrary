const express = require('express');
const router = express.Router();

const Author = require("../models/author");
const Book = require("../models/book");

/* GET queries start page */
router.get('/', function (req, res, next) {
  res.send('Queries');
});

/* GET author */
router.get('/author', async function (req, res, next) {
  const firstName = req.query["first_name"];
  const familyName = req.query["family_name"];

  let query = {};
  if (firstName) query.first_name = new RegExp(firstName, "i");
  if (familyName) query.family_name = new RegExp(familyName, "i");

  try {
    const authors = await Author.find(query);

    let result = "";
    if (authors.length > 0) {
      result = `<ul>${authors.map((author) => `<li>${author.name}</li>`).join("")}</ul>`;
    } else {
      result = "<h1>Not found</h1>";
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

/* GET books by title */
router.get('/books', async function (req, res, next) {
  const title = req.query["title"];

  let query = {};
  if (title) query.title = new RegExp(title, "i");

  try {
    const books = await Book.find(query).populate('author');

    let result = "";
    if (books.length > 0) {
      result = `<ul>${books.map((book) => `
        <li>
          ${book.title} by ${book.author?.first_name || 'Unknown'} ${book.author?.family_name || ''}
        </li>`).join("")}
      </ul>`;
    } else {
      result = "<h1>Not found</h1>";
    }

    res.send(result);
  } catch (err) {
    next(err);
  }
});

/* GET all books (optional for debug) */
router.get('/all-books', async function (req, res, next) {
  try {
    const books = await Book.find().populate('author');
    res.send(books);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
