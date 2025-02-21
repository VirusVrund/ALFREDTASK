const mongoose = require('mongoose');

const predefinedDeckSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cardCount: {
        type: Number,
        default: 0
    },
    theme: {
        type: String,
        default: 'primary',
        enum: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    },
    cards: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PredefinedDeck', predefinedDeckSchema);