const mongoose = require('mongoose');
const Book = require('./Book'); // Import the Book model

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: Number,
    required: true
  },
  customer_name: {
    type: String,
    required: true
  },
  books: [Book.schema] // Embed the Book schema as a subdocument
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 
