// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Define routes
router.get('/', bookController.getAllBooks);
router.get('/availability', bookController.getBookAvailability);
router.post('/rent', bookController.calculateRentCharges);
router.put('/update-types', bookController.updateBookTypes);

module.exports = router;
