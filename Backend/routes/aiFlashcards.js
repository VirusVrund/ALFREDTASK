const express = require('express');
const router = express.Router();
const { generateAIDeck, getUserAIDecks, deleteAIDeck } = require('../controllers/aiFlashcardController');
const pdfController = require('../controllers/pdfController');
const authenticate = require('../middleware/authMiddleware');

// Generate AI flashcards
router.post('/generate', authenticate, generateAIDeck);

// Get user's AI-generated decks
router.get('/my-decks', authenticate, getUserAIDecks);

// Delete an AI-generated deck
router.delete('/:deckId', authenticate, deleteAIDeck);

// PDF upload route
router.post('/upload-pdf', authenticate, pdfController.uploadMiddleware, pdfController.uploadPDF);

module.exports = router;