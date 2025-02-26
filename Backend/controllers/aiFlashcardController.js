
const { generateDeck } = require('../services/geminiService.js');
const PredefinedDeck = require('../models/predefinedDeck');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const generateAIDeck = async (req, res) => {
    try {
        const { prompt, cardCount } = req.body;
        
        // Convert string ID to MongoDB ObjectId if needed
        const userId = mongoose.Types.ObjectId.isValid(req.user.userId || req.user._id) 
            ? new mongoose.Types.ObjectId(req.user.userId || req.user._id)
            : req.user.userId || req.user._id;
        
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated properly' });
        }

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        let generatedDeck;
        try {
            // Clean the prompt before sending to AI
            const cleanedPrompt = prompt
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                .replace(/\n+/g, ' ')
                .trim();

            generatedDeck = await generateDeck(cleanedPrompt, cardCount || 10);

            // Validate the generated deck structure
            if (!generatedDeck || !Array.isArray(generatedDeck.cards)) {
                throw new Error('Invalid deck structure received from AI');
            }
        } catch (error) {
            if (error.message.includes('parse') || error.message.includes('Invalid deck structure')) {
                // Log the error for debugging
                console.error('Generation Error:', error);
                return res.status(500).json({ 
                    message: 'Failed to generate valid flashcards. Please try again.',
                    error: error.message 
                });
            }
            throw error;
        }

        // Format for database with user association
        const deckToSave = {
            ...generatedDeck,
            id: `ai-${uuidv4()}`,
            createdBy: userId,
            createdAt: new Date(),
            category: 'ai-generated',
            updatedAt: new Date()
        };

        // Validate deck structure before saving
        if (!deckToSave.title || !deckToSave.cards) {
            return res.status(500).json({ 
                message: 'Generated deck is missing required fields' 
            });
        }

        // Save to database
        const savedDeck = await PredefinedDeck.create(deckToSave);
        const populatedDeck = await savedDeck.populate('createdBy', 'username email');
        
        res.status(201).json(populatedDeck);

    } catch (error) {
        console.error('AI Deck Generation Error:', error);
        
        if (error.type === 'INVALID_TOPIC') {
            return res.status(400).json({
                type: 'INVALID_TOPIC',
                message: error.message,
                category: error.category
            });
        }
        
        return res.status(500).json({ 
            message: 'Failed to generate deck',
            error: error.message 
        });
    }
};

// Get all AI-generated decks for current user
const getUserAIDecks = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId;
        if (!userId) {
            console.error('User ID missing from request:', req.user);
            return res.status(401).json({ message: 'User not authenticated properly' });
        }
        const decks = await PredefinedDeck.find({ 
            createdBy: userId,
        }).sort({ createdAt: -1 });

        res.json(decks);
    } catch (error) {
        console.error('Error fetching AI decks:', error);
        res.status(500).json({ message: 'Failed to fetch AI decks' });
    }
};
const deleteAIDeck = async (req, res) => {
    try {
        const { deckId } = req.params;
        const userId = req.user.userId || req.user._id;

        const deletedDeck = await PredefinedDeck.findOneAndDelete({
            _id: deckId,
            createdBy: userId,
            category: 'ai-generated'
        });

        if (!deletedDeck) {
            return res.status(404).json({ 
                message: 'Deck not found or not authorized to delete' 
            });
        }

        res.status(200).json({ 
            message: 'Deck deleted successfully',
            deckId: deletedDeck._id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to delete deck',
            error: error.message 
        });
    }
};

module.exports = { generateAIDeck, getUserAIDecks,deleteAIDeck };