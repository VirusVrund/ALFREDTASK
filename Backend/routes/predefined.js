const express = require('express');
const predefinedDeckController = require('../controllers/predefinedDeckController'); 

const router = express.Router();

// Get all predefined decks (without cards for list view)
router.get('/', predefinedDeckController.getAllDecks);

// Get decks by category
router.get('/category/:category', predefinedDeckController.getDecksByCategory);

// Get specific deck with cards
router.get('/:id', predefinedDeckController.getDeckById);

module.exports = router;