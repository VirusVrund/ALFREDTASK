const PredefinedDeck = require('../models/predefinedDeck');

// Get all predefined decks
const getAllDecks = async (req, res) => {
    try {
        const decks = await PredefinedDeck.find({}, '-cards');
        res.json(decks);
    } catch (error) {
        console.error('Error in getAllDecks:', error);
        res.status(500).json({ 
            message: 'Error fetching predefined decks',
            error: error.message 
        });
    }
};

// Get deck by ID with all cards
const getDeckById = async (req, res) => {
    try {
        const deck = await PredefinedDeck.findOne({ id: req.params.id });
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }
        res.json(deck);
    } catch (error) {
        console.error('Error in getDeckById:', error);
        res.status(500).json({ 
            message: 'Error fetching deck',
            error: error.message 
        });
    }
};

// Get decks by category
const getDecksByCategory = async (req, res) => {
    try {
        const decks = await PredefinedDeck.find({ category: req.params.category });
        res.json(decks);
    } catch (error) {
        console.error('Error in getDecksByCategory:', error);
        res.status(500).json({ 
            message: 'Error fetching decks by category',
            error: error.message 
        });
    }
};

module.exports = {
    getAllDecks,
    getDeckById,
    getDecksByCategory
};