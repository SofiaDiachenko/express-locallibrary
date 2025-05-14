const { body, validationResult } = require("express-validator");
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");

// Головна сторінка
exports.index = asyncHandler(async (req, res, next) => {
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Домашня сторінка Local Library",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

// Список усіх книг
exports.book_list = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();

  res.render("book_list", {
    title: "Список книг",
    book_list: allBooks,
  });
});

// Контролер detail
exports.book_detail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    const err = new Error("Книгу не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances,
  });
});

// Відображення форми створення книги при GET-запиті.
exports.book_create_get = asyncHandler(async (req, res, next) => {
  // Отримання всіх авторів і жанрів, які ми можемо використовувати для додавання до нашої книги.
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("book_form", {
    title: "Створити книгу",
    authors: allAuthors,
    genres: allGenres,
  });
});

// Обробка створення книги при POST-запиті.
exports.book_create_post = [
  // 🔹 Перетворення genre на масив
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // 🔹 Валідація та санітизація
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("author", "Author must be specified").trim().isLength({ min: 1 }).escape(),
  body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(), // 🔹 Санітизація кожного елементу жанру

  // 🔹 Обробник запиту після валідації
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // 🔹 Отримати жанри та авторів з БД
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
      ]);

      // 🔹 Позначити вибрані жанри
      for (const genre of allGenres) {
        if (book.genre.includes(genre._id.toString())) {
          genre.checked = "true";
        }
      }

      // 🔹 Повторний рендер форми з помилками
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
      return;
    }

    // 🔹 Якщо все добре – зберігаємо
    await book.save();
    res.redirect(book.url);
  }),
];



// Показати форму видалення книги (GET)
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

// Обробити POST-запит на видалення книги
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Показати форму оновлення книги (GET)
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

// Обробити POST-запит на оновлення книги
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
