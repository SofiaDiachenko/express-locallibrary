const express = require("express");
const router = express.Router();

// Імпортуємо контролери
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

/// МАРШРУТИ КНИГ ///

// Головна сторінка каталогу
router.get("/", book_controller.index);

// Створити книгу
router.get("/book/create", book_controller.book_create_get);
router.post("/book/create", book_controller.book_create_post);

// Видалити книгу
router.get("/book/:id/delete", book_controller.book_delete_get);
router.post("/book/:id/delete", book_controller.book_delete_post);

// Оновити книгу
router.get("/book/:id/update", book_controller.book_update_get);
router.post("/book/:id/update", book_controller.book_update_post);

// Деталі та список книг
router.get("/book/:id", book_controller.book_detail);
router.get("/books", book_controller.book_list);

/// МАРШРУТИ АВТОРІВ ///

// Створити автора
router.get("/author/create", author_controller.author_create_get);
router.post("/author/create", author_controller.author_create_post);

// Видалити автора
router.get("/author/:id/delete", author_controller.author_delete_get);
router.post("/author/:id/delete", author_controller.author_delete_post);

// Оновити автора
router.get("/author/:id/update", author_controller.author_update_get);
router.post("/author/:id/update", author_controller.author_update_post);

// Деталі та список авторів
router.get("/author/:id", author_controller.author_detail);
router.get("/authors", author_controller.author_list);

/// МАРШРУТИ ЖАНРІВ ///

// Створити жанр
router.get("/genre/create", genre_controller.genre_create_get);
router.post("/genre/create", genre_controller.genre_create_post);

// Видалити жанр
router.get("/genre/:id/delete", genre_controller.genre_delete_get);
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// Оновити жанр
router.get("/genre/:id/update", genre_controller.genre_update_get);
router.post("/genre/:id/update", genre_controller.genre_update_post);

// Деталі та список жанрів
router.get("/genre/:id", genre_controller.genre_detail);
router.get("/genres", genre_controller.genre_list);

/// МАРШРУТИ ЕКЗЕМПЛЯРІВ КНИГ ///

// Створити екземпляр книги
router.get("/bookinstance/create", book_instance_controller.bookinstance_create_get);
router.post("/bookinstance/create", book_instance_controller.bookinstance_create_post);

// Видалити екземпляр книги
router.get("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_get);
router.post("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_post);

// Оновити екземпляр книги
router.get("/bookinstance/:id/update", book_instance_controller.bookinstance_update_get);
router.post("/bookinstance/:id/update", book_instance_controller.bookinstance_update_post);

// Деталі та список екземплярів
router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);
router.get("/bookinstances", book_instance_controller.bookinstance_list);

// Експортуємо маршрутизатор
module.exports = router;
