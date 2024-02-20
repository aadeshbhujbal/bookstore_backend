
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Define routes
router.get('/', bookController.getAllBooks);
router.get('/availability', bookController.getBookAvailability);
router.post('/rent', bookController.calculateRentCharges);




module.exports = router;
