const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a question'],
    trim: true,
    maxlength: [1000, 'Question cannot be more than 1000 characters']
  },
  answer: {
    type: String,
    required: [true, 'Please provide an answer'],
    trim: true,
    maxlength: [2000, 'Answer cannot be more than 2000 characters']
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: [2000, 'Explanation cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'General', 'Science', 'History', 'Math', 'Language',
      'Programming', 'Medical', 'Law', 'Business'
    ],
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  mastered: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    match: [
      /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/,
      'Please provide a valid image URL'
    ]
  },
  imageAlt: {
    type: String,
    maxlength: [200, 'Alt text cannot be more than 200 characters']
  },
  imageCaption: {
    type: String,
    maxlength: [200, 'Caption cannot be more than 200 characters']
  },
  cardNumber: {
    type: Number,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-increment cardNumber
flashcardSchema.pre('save', async function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
    return next();
  }
  
  try {
    const lastCard = await this.constructor.findOne({}, {}, { sort: { 'cardNumber': -1 } });
    this.cardNumber = lastCard ? lastCard.cardNumber + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

// Indexes for better query performance
flashcardSchema.index({ category: 1, difficulty: 1 });
flashcardSchema.index({ mastered: 1 });
flashcardSchema.index({ cardNumber: 1 });
flashcardSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);