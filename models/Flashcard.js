const { create } = require('domain');
const mongoose = require('mongoose');
const { type } = require('os');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question'],
        trim: true,
        minlength: [3, 'Question must be at least 3 characters'],
        maxlength: [500, 'Question cannot exceed 500 chararacters']
    },
    answer: {
        type: String,
        required: [true, 'please provide an answer'],
        trim: true,
        minlength: [3, 'Answer must be at lest 3 characters'],
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
        default: Data.now
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    createBy: {
        type: String,
        default: 'User'
    }
},{

});