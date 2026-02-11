/**
 * Flashcard Schema Definition
 * 
 * Defines the structure and validation rules for flashcard documents in MongoDB.
 * Includes automatic timestamps, virtual field support, and indexing for optimized queries.
 * 
 * @typedef {Object} Flashcard
 * @property {string} question - The question text (required, 3-500 characters)
 * @property {string} answer - The answer text (required, 3-1000 characters)
 * @property {string} [category='General'] - Category classification for organization
 * @property {string} [imageUrl=''] - URL to an associated image
 * @property {string} [imageAlt=''] - Alt text for accessibility
 * @property {boolean} [isMastered=false] - Flag indicating if flashcard is mastered
 * @property {('easy'|'medium'|'hard')} [difficulty='medium'] - Difficulty level
 * @property {Date} [lastReviewed=Date.now] - Timestamp of last review
 * @property {number} [reviewCount=0] - Total number of times reviewed
 * @property {string} [createdBy='User'] - Creator identifier
 * @property {Date} createdAt - Auto-generated creation timestamp
 * @property {Date} updatedAt - Auto-generated last update timestamp
 * 
 * @description
 * - Automatically maintains `createdAt` and `updatedAt` timestamps
 * - Includes compound index on (category, isMastered) for efficient filtering
 * - Includes index on createdAt (descending) for chronological queries
 * - Post-save middleware handles validation and duplicate key errors
 * 
 * @returns {Model} Mongoose model for Flashcard collection
 */
const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question'],
        trim: true,
        minlength: [3, 'Question must be at least 3 characters'],
        maxlength: [500, 'Question cannot exceed 500 characters']
    },
    answer: {
        type: String,
        required: [true, 'Please provide an answer'],
        trim: true,
        minlength: [3, 'Answer must be at least 3 characters'],
        maxlength: [1000, 'Answer cannot exceed 1000 characters']
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    imageUrl: {
        type: String,
        default: '',
        trim: true
    },
    imageAlt: {
        type: String,
        default: '',
        trim: true
    },
    isMastered: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    lastReviewed: {
        type: Date,
        default: Date.now
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        default: 'User'
    }
}, { // Schema Option second Arguments with purpose of Automatic date,plus include computer fields when sending data
    timestamps: true, //Mongoose automatically adds two fields to this document: createdAt, updatedAt
    toJSON: { virtuals: true }, // include virtual fields when converting to JSON.
    toObject: { virtuals: true }
});

// Index for better query performance/ it like a book without the below indexes we can read every page to find a word, but here we jump directly  to page
//MongoDB index works the same way.

flashcardSchema.index({ category: 1, isMastered: 1 }); // 1 means ascending order
flashcardSchema.index({ createdAt: -1 }); // Creates index sorted by newest first.

// Middleware to handle validation errors
flashcardSchema.post('save', function(error, doc, next) {
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        next(new mongoose.Error.ValidationError(errors.join(', ')));
    } else if (error.code === 11000) {
        next(new mongoose.Error('Duplicate key error'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);