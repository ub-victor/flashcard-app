const mongoose = require('mongoose');
const { type } = require('os');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        require: [true, 'Please provide a question'],
        trim: true,
        minlength: [3, 'Question must be at least 3 characters'],

    }
})