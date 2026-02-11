const mongoose = require('mongoose');
const { type } = require('os');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
    }
})