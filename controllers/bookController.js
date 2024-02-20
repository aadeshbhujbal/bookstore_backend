const Book = require("../models/Book");
const mongoose = require("mongoose");
// Define an asynchronous function to handle the GET request for all books
exports.getAllBooks = async (req, res) => {
  try {
    // Retrieve all books from the database
    const books = await Book.find();
    // Send the retrieved books as a JSON response
    res.json(books);
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ message: err.message });
  }
};

// Define an asynchronous function to handle the GET request for book availability
exports.getBookAvailability = async (req, res) => {
  try {
    // Extract the book name from the query parameters
    const bookName = req.query.bookName;

    // Find the book in the database based on the extracted book name
    const book = await Book.findOne({ book_name: bookName });

    // If the book is not found, respond with a 404 status and a message
    if (!book) {
      res.status(404).json({ message: "Book not found" });
    } else {
      // Calculate the availability date based on the lend date and days to return
      const availabilityDate = new Date(book.lend_date);
      availabilityDate.setDate(
        availabilityDate.getDate() + book.days_to_return
      );

      // Respond with the availability date
      res.json({ availabilityDate: availabilityDate });
    }
  } catch (err) {
    // If an error occurs, respond with a 500 status and the error message
    res.status(500).json({ message: err.message });
  }
};

// Story1
// exports.calculateRentCharges = async (req, res) => {
//     try {
//       let customerBooks = req.body.books;
//       if (!Array.isArray(customerBooks)) {
//         customerBooks = [customerBooks];
//       }

//       let totalCharges = 0;
//       let customerCharges = [];

//       for (const book of customerBooks) {
//         const daysRented = book.days_to_return;
//         const charges = daysRented * 1; // Per day rental charge is Rs 1 for all books
//         totalCharges += charges;
//         customerCharges.push({
//           book_name: book.book_name,
//           charges: charges
//         });
//       }

//       res.json({ customer_id: req.body.customer_id, customer_name: req.body.customer_name, charges: customerCharges, totalCharges: totalCharges });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

// Story 2
// exports.calculateRentCharges = async (req, res) => {
//   try {
//     const customers = req.body;
//     console.log("customers:", customers);
//     let totalCharges = 0;

//     const customerCharges = {};

//     for (const customer of customers) {
//       const booksToReturn = customer.books;
//       let customerTotalCharges = 0;

//       for (const book of booksToReturn) {
//         if (!book.book_type) {
//           try {
//             const bookFromDB = await Book.findOne({ book_id: book.book_id });
//             if (bookFromDB) {
//               book.book_type = bookFromDB.book_type;
//             }
//           } catch (error) {
//             console.error("Error while fetching book from database:", error);
//           }
//         }

//         let chargePerDay = 0;
//         switch (book.book_type) {
//           case "Regular":
//             chargePerDay = 1.5;
//             break;
//           case "Fiction":
//             chargePerDay = 3;
//             break;
//           case "Novel":
//             chargePerDay = 1.5;
//             break;
//           default:
//             chargePerDay = 1.5;
//         }

//         const daysRented = Math.ceil(
//           (new Date() - new Date(book.lend_date)) / (1000 * 60 * 60 * 24)
//         );
//         const charges = daysRented * chargePerDay;

//         customerTotalCharges += charges;
//         totalCharges += charges;

//         if (!customerCharges[customer.customer_id]) {
//           customerCharges[customer.customer_id] = {
//             customer_name: customer.customer_name,
//             books: [],
//           };
//         }

//         customerCharges[customer.customer_id].books.push({
//           book_name: book.book_name,
//           days_to_return: book.days_to_return,
//           charges: charges,
//           book_type: book.book_type,
//         });
//       }

//       customerCharges[customer.customer_id].totalCharges = customerTotalCharges;
//     }

//     res.json({ customerCharges, totalCharges });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// story3

// Define an asynchronous function to calculate rent charges based on input data
exports.calculateRentCharges = async (req, res) => {
  try {
    // Retrieve the array of customers with their book data from the request body
    const customers = req.body;

    // Initialize the total charges to 0
    let totalCharges = 0;

    // Create an object to store charges for each customer
    const customerCharges = {};

    // Iterate through each customer
    for (const customer of customers) {
      // Get the books to return for the current customer
      const booksToReturn = customer.books;

      // Initialize the total charges for the current customer to 0
      let customerTotalCharges = 0;

      // Iterate through each book to calculate charges
      for (const book of booksToReturn) {
        // If the book_type is not present in the input data, retrieve it from the database
        if (!book.book_type) {
          try {
            // Find the book in the database
            const bookFromDB = await Book.findOne({ book_id: book.book_id });
            // Assign the book_type from the database to the book if found
            if (bookFromDB) {
              book.book_type = bookFromDB.book_type;
            }
          } catch (error) {
            // Log an error if book retrieval fails
            console.error("Error while fetching book from database:", error);
          }
        }

        // Set the charge per day based on the book_type
        let chargePerDay = 0;
        switch (book.book_type) {
          case "Regular":
            if (book.days_to_return < 2) {
              chargePerDay = 2; // Minimum charge of Rs 2 for less than 2 days
            } else if (book.days_to_return === 2) {
              chargePerDay = 1; // Rs 1 per day for the first 2 days
            } else {
              chargePerDay = 1.5; // Rs 1.5 per day after the first 2 days
            }
            break;
          case "Fiction":
            chargePerDay = 3; // Rs 3 per day for fiction books
            break;
          case "Novel":
            if (book.days_to_return < 3) {
              chargePerDay = 4.5; // Minimum charge of Rs 4.5 for less than 3 days
            } else {
              chargePerDay = 1.5; // Rs 1.5 per day for novels
            }
            break;
          default:
            chargePerDay = 1.5; // Default charge of Rs 1.5 per day
        }

        // Calculate the charges for the current book based on the charge per day
        const charges = book.days_to_return * chargePerDay;

        // Add charges for the current book to the customer's total charges and the overall total charges
        customerTotalCharges += charges;
        totalCharges += charges;

        // Store the book details for the current customer
        if (!customerCharges[customer.customer_id]) {
          customerCharges[customer.customer_id] = {
            customer_name: customer.customer_name,
            books: [],
          };
        }

        // Push book details into the customer's books array
        customerCharges[customer.customer_id].books.push({
          book_name: book.book_name,
          days_to_return: book.days_to_return,
          charges: charges,
          book_type: book.book_type,
        });
      }

      // Store the total charges for the current customer
      customerCharges[customer.customer_id].totalCharges = customerTotalCharges;
    }

    // Send the response with the calculated customer charges and total charges
    res.json({ customerCharges, totalCharges });
  } catch (err) {
    // Handle any errors and send an error response
    res.status(500).json({ message: err.message });
  }
};
