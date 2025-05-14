const Book = require("../models/book");
const BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Відображення списку всіх екземплярів книг.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find()
    .populate("book")
    .exec();

  res.render("bookinstance_list", {
    title: "Список екземплярів книг",
    bookinstance_list: allBookInstances,
  });
});


// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
});

// Відображення форми створення екземпляра книги (GET)
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

  res.render("bookinstance_form", {
    title: "Створити екземпляр книги",
    book_list: allBooks,
  });
});


// Обробка створення екземпляра книги (POST)
exports.bookinstance_create_post = [
  // Валідація і санітизація полів
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Обробка запиту
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("bookinstance_form", {
        title: "Створити екземпляр книги",
        book_list: allBooks,
        selected_book: req.body.book,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    }

    await bookInstance.save();
    res.redirect(bookInstance.url);
  }),
];


// GET
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  const bookinstance = await BookInstance.findById(req.params.id).populate('book').exec();
  if (!bookinstance) return res.redirect('/catalog/bookinstances');
  res.render('bookinstance_delete', { title: 'Видалити екземпляр книги', bookinstance });
});

// POST
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  await BookInstance.findByIdAndDelete(req.body.bookinstanceid);
  res.redirect('/catalog/bookinstances');
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  // Отримати поточний екземпляр книги та список усіх книг для вибору
  const [bookinstance, books] = await Promise.all([
    BookInstance.findById(req.params.id).populate("book").exec(),
    Book.find({}, "title").exec(),
  ]);

  if (bookinstance == null) {
    const err = new Error("Екземпляр книги не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_form", {
    title: "Оновити екземпляр книги",
    book_list: books,
    selected_book: bookinstance.book._id,
    bookinstance: bookinstance,
  });
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  // Перевірка та санітізація
  body("book", "Книга обов'язкова").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Видавництво обов'язкове").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("due_back", "Невірна дата").optional({ values: "falsy" }).isISO8601().toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const updatedBookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const books = await Book.find({}, "title").exec();

      res.render("bookinstance_form", {
        title: "Оновити екземпляр книги",
        book_list: books,
        selected_book: updatedBookInstance.book,
        bookinstance: updatedBookInstance,
        errors: errors.array(),
      });
      return;
    } else {
      // Зберігаємо
      await BookInstance.findByIdAndUpdate(req.params.id, updatedBookInstance);
      res.redirect(updatedBookInstance.url);
    }
  }),
];


