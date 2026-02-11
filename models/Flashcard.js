const mongoose = require('mongoose');
const { type } = require('os');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        require: [true, 'Please provide a question'],
        trim: true,
        minlength: 

    }
})