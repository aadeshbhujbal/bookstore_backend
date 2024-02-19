// controllers/bookController.js
const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookAvailability = async (req, res) => {
  try {
    const bookName = req.query.bookName;
    const book = await Book.findOne({ book_name: bookName });
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      const availabilityDate = new Date(book.lend_date);
      availabilityDate.setDate(availabilityDate.getDate() + book.days_to_return);
      res.json({ availabilityDate: availabilityDate });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/bookController.js

exports.calculateRentCharges = async (req, res) => {
    try {
      let customerBooks = req.body.books; // Array of books borrowed by the customer
  
      // If customerBooks is not already an array, convert it to an array
      if (!Array.isArray(customerBooks)) {
        customerBooks = [customerBooks];
      }
  
      let totalCharges = 0;
      let customerCharges = [];
  
      for (const book of customerBooks) {
        const daysRented = book.days_to_return;
        const charges = daysRented * 1; // Per day rental charge is Rs 1 for all books
        totalCharges += charges;
        customerCharges.push({
          book_name: book.book_name,
          charges: charges
        });
      }
  
      res.json({ customer_id: req.body.customer_id, customer_name: req.body.customer_name, charges: customerCharges, totalCharges: totalCharges });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  