// fix_genres.js

const mongoose = require('mongoose');
const Author = require('./models/author');
const Genre = require('./models/genre');
const Book = require('./models/book');

mongoose.connect('mongodb://localhost/local_library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixReferences() {
  try {
    // 1. Перевірка для книжок, де поле author та genre є рядком (string).
    const booksToFix = await Book.find({
      $or: [
        { author: { $type: 'string' } },
        { genre: { $type: 'string' } },
      ],
    });

    for (const book of booksToFix) {
      // Якщо author є рядком, то знайдемо відповідного автора за ім'ям і перетворимо на ObjectId
      if (typeof book.author === 'string') {
        const author = await Author.findOne({ name: book.author });

        if (author) {
          book.author = author._id; // Заміна рядка на ObjectId автора
        } else {
          console.log(`Автор не знайдений: ${book.author}`);
        }
      }

      // Якщо genre є рядком, то знайдемо відповідний жанр і перетворимо на ObjectId
      if (typeof book.genre === 'string') {
        const genre = await Genre.findOne({ name: book.genre });

        if (genre) {
          book.genre = genre._id; // Заміна рядка на ObjectId жанру
        } else {
          console.log(`Жанр не знайдений: ${book.genre}`);
        }
      }

      // Зберігаємо оновлену книгу
      await book.save();
      console.log(`✅ Виправлено: Книга "${book.title}"`);
    }

    console.log('🎉 Всі книги оновлено.');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Помилка:', err);
    mongoose.connection.close();
  }
}

fixReferences();
