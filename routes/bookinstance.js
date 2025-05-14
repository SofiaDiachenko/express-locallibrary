const express = require("express");
const router = express.Router();

// Імпорт контролера
const bookInstanceController = require("../controllers/bookinstanceController");

// GET запит для створення нового екземпляра книги
router.get("/create", bookInstanceController.bookinstance_create_get);

// POST запит для створення нового екземпляра книги
router.post("/create", bookInstanceController.bookinstance_create_post);

// Потрібно експортувати роутер
module.exports = router;
