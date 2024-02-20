const mongoose = require('mongoose');
const Book = require('../models/Book');

const MONGODB_URI = 'mongodb+srv://bsome1823:bsome1823@cluster0.nfohlxy.mongodb.net/?retryWrites=true&w=majority'; 

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Find all books authored by 'Randy Macejkovic'
      const booksToUpdate = await Book.find({ author_name: 'Randy Macejkovic' });

      // Log the books found
      console.log('Books to update:', booksToUpdate);

      // Update or add book_type for each book found
      const updatePromises = booksToUpdate.map(async (book) => {
        if (!book.book_type) {
          // If book_type doesn't exist, add it
          return Book.updateOne({ _id: book._id }, { $set: { book_type: 'Novel' } });
        } else {
          // If book_type exists, update it
          return Book.updateOne({ _id: book._id }, { $set: { book_type: 'Novel' } });
        }
      });

      // Execute all update promises
      const updateResults = await Promise.all(updatePromises);

      // Log the number of documents modified
      const nModified = updateResults.reduce((total, result) => total + result.nModified, 0);
      console.log(`${nModified} book types updated successfully`);
    } catch (err) {
      console.error('Error updating book types:', err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));
