const express = require('express');
const router = express.Router();
const {
  getAllFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcardStats,
  getRandomFlashcard,
  bulkUpdateFlashcards
} = require('../controllers/flashcardController');

const { validateFlashcard } = require('../utils/validation');

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const createFlashcardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many flashcard creations, please try again later'
});

// Routes
router.route('/')
  .get(getAllFlashcards)
  .post(createFlashcardLimiter, validateFlashcard, createFlashcard);

router.route('/stats').get(getFlashcardStats);
router.route('/random').get(getRandomFlashcard);
router.route('/bulk/update').patch(bulkUpdateFlashcards);

router.route('/:id')
  .get(getFlashcard)
  .patch(validateFlashcard, updateFlashcard)
  .delete(deleteFlashcard);

module.exports = router;