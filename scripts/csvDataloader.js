const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Customer = require('../models/Customer');

const MONGODB_URI = 'mongodb+srv://bsome1823:bsome1823@cluster0.nfohlxy.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      const stream = fs.createReadStream('./customer_data.csv')
        .pipe(csvParser());

      // Arrays to store customer and book data
      const customersData = [];
      const booksData = [];

      stream.on('data', async (row) => {
        try {
          const { customer_id, customer_name, books } = row;
          const parsedBooks = JSON.parse(books.replace(/""/g, '"')); // Remove extra quotes

          if (!customer_id || !customer_name || !parsedBooks || !Array.isArray(parsedBooks)) {
            throw new Error('Invalid data in CSV');
          }

          // Prepare customer data
          const customerData = {
            customer_id: parseInt(customer_id),
            customer_name,
            books: parsedBooks.map(bookData => {
              const { book_id, author_name, book_name, lend_date, days_to_return } = bookData;

              if (!book_id || !author_name || !book_name || !lend_date || isNaN(new Date(lend_date).getTime()) || isNaN(parseInt(days_to_return))) {
                throw new Error('Invalid data in CSV');
              }

              return {
                book_id,
                author_name,
                book_name,
                lend_date: new Date(lend_date),
                days_to_return: parseInt(days_to_return),
                book_type: 'Regular'
              };
            })
          };

          customersData.push(customerData);

          // Collect books data separately
          booksData.push(...customerData.books);

        } catch (err) {
          console.error('Error processing row:', err.message);
        }
      });

      stream.on('end', async () => {
        try {
          // Save books data
          await Book.insertMany(booksData);

          // Save customers data with book references
          await Customer.insertMany(customersData);

          console.log('CSV data successfully loaded into the database');
          console.log(customersData)
        } catch (err) {
          console.error('Error saving data to the database:', err.message);
        } finally {
          // Disconnect from MongoDB after processing
          // mongoose.disconnect();
        }
      });

    } catch (err) {
      console.error('Error reading CSV file:', err.message);
    }
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));
