const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const MONGODB_URI = 'mongodb+srv://bsome1823:bsome1823@cluster0.nfohlxy.mongodb.net/?retryWrites=true&w=majority'; 

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      const stream = fs.createReadStream('./customer_data.csv')
        .pipe(csvParser());

      stream.on('data', async (row) => {
        try {
          const { customer_id, customer_name, books } = row;
          const parsedBooks = JSON.parse(books.replace(/""/g, '"'));

          for (const bookObj of parsedBooks) {
            const { book_id, author_name, book_name, lend_date, days_to_return } = bookObj;

            if (!book_id || !author_name || !book_name || !lend_date || isNaN(new Date(lend_date).getTime()) || isNaN(parseInt(days_to_return))) {
              throw new Error('Invalid data in CSV');
            }

            const book = new Book({
              book_id,
              author_name,
              book_name,
              lend_date: new Date(lend_date),
              days_to_return: parseInt(days_to_return),
              book_type: 'Regular'
            });
            console.log(book)
            await book.save();
          }
        } catch (err) {
          console.error('Error processing row:', err.message);
        }
      });

      stream.on('end', () => {
        console.log('CSV data successfully loaded into the database');
        // console.log(data)
        // mongoose.disconnect(); 
    });
    
    } catch (err) {
      console.error('Error reading CSV file:', err.message);
     
    }
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));
