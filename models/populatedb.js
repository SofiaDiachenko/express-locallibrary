#! /usr/bin/env node

console.log("This script populates some test books, authors, genres, and book instances to your database.");

// Підключення бібліотек
const mongoose = require("mongoose");
const Author = require("./author");
const Book = require("./book");
const Genre = require("./genre");
const BookInstance = require("./bookinstance");

// Отримання аргументів командного рядка
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Функція створення авторів
async function authorCreate(first_name, family_name, d_birth, d_death) {
  const author = new Author({ first_name, family_name, date_of_birth: d_birth, date_of_death: d_death });
  await author.save();
  console.log(`Added author: ${first_name} ${family_name}`);
}

// Додавання тестових авторів
async function populate() {
  await authorCreate("Patrick", "Rothfuss", "1973-06-06", null);
  await authorCreate("Ben", "Bova", "1932-11-08", "2020-11-29");
  await authorCreate("Isaac", "Asimov", "1920-01-02", "1992-04-06");

  console.log("Finished populating test data.");
  mongoose.connection.close();
}

// Запуск функції
populate();
