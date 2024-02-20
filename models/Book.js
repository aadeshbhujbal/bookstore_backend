const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_id: {
    type: String, 
    required: true
  },
  author_name: {
    type: String,
    required: true
  },
  book_name: {
    type: String,
    required: true
  },
  lend_date: {
    type: Date,
    required: true
  },
  days_to_return: {
    type: Number,
    required: true
  },
  book_type:{type: String}
});

const Book = mongoose.model('Book', bookSchema); 

module.exports = Book;
