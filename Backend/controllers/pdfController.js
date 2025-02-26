const multer = require('multer');
const pdfParse = require('pdf-parse');
const { generateDeck } = require('../services/geminiService');
const PredefinedDeck = require('../models/predefinedDeck');
const { v4: uuidv4 } = require('uuid');
// Configure multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
}).single('pdf');

// Export multer middleware for use in routes
exports.uploadMiddleware = upload;

// Controller function for PDF upload
exports.uploadPDF = async (req, res) => {

    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                message: 'No PDF file uploaded'
            });
        }

        // Parse PDF content
        const pdfData = await pdfParse(req.file.buffer);
        // Get card count from request or use default
        const cardCount = parseInt(req.body.cardCount) || 10;
        if (cardCount < 5 || cardCount > 25) {
            return res.status(400).json({
                message: 'Card count must be between 5 and 25'
            });
        }

        const cleanContent = pdfData.text
            .replace(/Name:.*?\n/g, '')
            .replace(/Roll No:.*?\n/g, '')
            .replace(/Class:.*?\n/g, '')
            .replace(/Introduction/i, '')
            .split('\n')
            .filter(line => line.trim()) // Remove empty lines
            .join(' ')
            .trim();
        // Generate flashcards using the existing AI service
        const title = cleanContent.split('.')[0] || req.file.originalname.replace('.pdf', '');
        // Prepare AI prompt with content summary
        const contentSummary = cleanContent.slice(0, 1000); // Use more content for better context
        const aiPrompt = ` ${title}. Focus on the key concepts from this content: ${contentSummary}...`;

        const deck = await generateDeck(aiPrompt,cardCount);


        const userId = req.user.userId || req.user._id;
        const savedDeck = await PredefinedDeck.create({
            ...deck,
            id: `ai-${uuidv4()}`,  // Add required id field
            category: 'ai-generated',
            createdBy: userId
        });


        res.status(201).json(savedDeck);
    } catch (error) {
        console.error('PDF processing error:', error);
        res.status(500).json({
            message: 'Failed to process PDF and generate flashcards'
        });
    }
};