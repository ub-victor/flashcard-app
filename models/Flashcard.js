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
// Run this function after saving a document.
flashcardSchema.post('save', function(error, doc, next) { // post('sava') means: document.save() -> this middleware, and doc = saved document
    if (error.name === 'ValidationError') { // Mongoose automatically create an error when required field missing or min and max length failed

        
        const errors = Object.values(error.errors).map(err => err.message);
    
        next(new mongoose.Error.ValidationError(errors.join(', ')));
    } else if (error.code === 11000) {
        next(new mongoose.Error('Duplicate key error'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);