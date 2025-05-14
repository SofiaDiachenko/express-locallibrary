const mongoose = require("mongoose");
const Book = require("./models/book");

// Підключення до локальної бази MongoDB
mongoose.connect("mongodb://localhost/local_library", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", async () => {
  try {
    const books = await Book.find().populate("author").populate("genre").exec();
    if (books.length === 0) {
      console.log("📚 У базі даних немає книг.");
    } else {
      books.forEach((book) => {
        console.log(`📖 Назва: ${book.title}`);
        console.log(`👤 Автор: ${book.author?.name || "немає"}`);
        console.log(`🏷️ Жанри: ${book.genre.map((g) => g.name).join(", ") || "немає"}`);
        console.log("------");
      });
    }
  } catch (err) {
    console.error("❌ Помилка при запиті книг:", err);
  } finally {
    mongoose.connection.close();
  }
});
