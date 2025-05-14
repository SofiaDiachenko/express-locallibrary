const express = require("express");
const router = express.Router();

// Імпорт контролера
const bookInstanceController = require("../controllers/bookinstanceController");

// GET запит для створення нового екземпляра книги
router.get("/create", bookInstanceController.bookinstance_create_get);
router.get('/:id/update', bookInstanceController.bookinstance_update_get);

// POST запит для створення нового екземпляра книги
router.post("/create", bookInstanceController.bookinstance_create_post);
router.post('/:id/update', bookInstanceController.bookinstance_update_post);

// Потрібно експортувати роутер
module.exports = router;

