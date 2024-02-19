require('dotenv').config(); // Add this line at the top of your file

const express = require('express');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const Book = require('./models/Book'); // Import the Book model

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://bsome1823:bsome1823@cluster0.nfohlxy.mongodb.net/?retryWrites=true&w=majority'; 

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Check if CSV data is loaded
    (async () => {
      try {
        const book = await Book.findOne({});
        if (book) {
          console.log('Sample book data:', book);
        } else {
          console.log('No book data found');
        }
      } catch (err) {
        console.error('Error finding book:', err);
      }
    })();
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware to parse JSON
app.use(express.json());

// Routes
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
