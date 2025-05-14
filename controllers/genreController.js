const { body, validationResult } = require("express-validator");
const Book = require("../models/book");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// Показати список усіх жанрів
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", {
    title: "Список жанрів",
    genre_list: allGenres,
  });
});

// Показати деталі конкретного жанру
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec()
  ]);

  if (genre == null) {
    const err = new Error("Жанр не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Деталі жанру",
    genre: genre,
    genre_books: booksInGenre
  });
});

// Відображення форми створення жанру на GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Створити жанр" });
};

// Обробити POST-запит створення жанру
exports.genre_create_post = [
  body("name", "Назва жанру має містити щонайменше 3 символи")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Створити жанр",
        genre: genre,
        errors: errors.array(),
      });
      return;
    }

    // Перевірити чи вже існує жанр з такою назвою (без врахування регістру)
    const existingGenre = await Genre.findOne({ name: req.body.name })
      .collation({ locale: "en", strength: 2 })
      .exec();

    if (existingGenre) {
      res.redirect(existingGenre.url);
    } else {
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];


// Показати форму видалення жанру
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Обробити POST-запит видалення жанру
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Показати форму оновлення жанру
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Обробити POST-запит оновлення жанру
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
