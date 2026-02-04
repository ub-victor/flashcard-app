const Flashcard = require('../models/Flashcard');
const asyncWrapper = require('../middleware/asyncWrapper');
const { BadRequestError, NotFoundError } = require('../errors');
const { validationResult } = require('../utils/validation');

// @desc    Get all flashcards with pagination
// @route   GET /api/flashcards
// @access  Public
const getAllFlashcards = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filter = {};
  
  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Filter by difficulty
  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty;
  }
  
  // Filter by mastered status
  if (req.query.mastered !== undefined) {
    filter.mastered = req.query.mastered === 'true';
  }
  
  const flashcards = await Flashcard.find(filter)
    .sort({ cardNumber: 1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Flashcard.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  
  res.status(200).json({
    success: true,
    count: flashcards.length,
    total,
    totalPages,
    currentPage: page,
    flashcards
  });
});

// @desc    Get single flashcard
// @route   GET /api/flashcards/:id
// @access  Public
const getFlashcard = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  const flashcard = await Flashcard.findById(id);
  
  if (!flashcard) {
    throw new NotFoundError(`Flashcard not found with id: ${id}`);
  }
  
  res.status(200).json({
    success: true,
    flashcard
  });
});

// @desc    Create flashcard
// @route   POST /api/flashcards
// @access  Public
const createFlashcard = asyncWrapper(async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError('Validation Error', errors.array());
  }
  
  const flashcard = await Flashcard.create(req.body);
  
  res.status(201).json({
    success: true,
    flashcard
  });
});

// @desc    Update flashcard
// @route   PATCH /api/flashcards/:id
// @access  Public
const updateFlashcard = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError('Validation Error', errors.array());
  }
  
  const flashcard = await Flashcard.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!flashcard) {
    throw new NotFoundError(`Flashcard not found with id: ${id}`);
  }
  
  res.status(200).json({
    success: true,
    flashcard
  });
});

// @desc    Delete flashcard
// @route   DELETE /api/flashcards/:id
// @access  Public
const deleteFlashcard = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  const flashcard = await Flashcard.findByIdAndDelete(id);
  
  if (!flashcard) {
    throw new NotFoundError(`Flashcard not found with id: ${id}`);
  }
  
  res.status(200).json({
    success: true,
    message: 'Flashcard deleted successfully'
  });
});

// @desc    Get flashcard statistics
// @route   GET /api/flashcards/stats
// @access  Public
const getFlashcardStats = asyncWrapper(async (req, res) => {
  const stats = await Flashcard.aggregate([
    {
      $group: {
        _id: null,
        totalCards: { $sum: 1 },
        masteredCards: {
          $sum: { $cond: [{ $eq: ['$mastered', true] }, 1, 0] }
        },
        categories: { $addToSet: '$category' },
        difficulties: { $addToSet: '$difficulty' }
      }
    },
    {
      $project: {
        _id: 0,
        totalCards: 1,
        masteredCards: 1,
        masteryPercentage: {
          $multiply: [
            { $divide: ['$masteredCards', '$totalCards'] },
            100
          ]
        },
        categories: 1,
        difficulties: 1
      }
    }
  ]);
  
  // Get category distribution
  const categoryStats = await Flashcard.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  // Get difficulty distribution
  const difficultyStats = await Flashcard.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  res.status(200).json({
    success: true,
    stats: stats[0] || {
      totalCards: 0,
      masteredCards: 0,
      masteryPercentage: 0,
      categories: [],
      difficulties: []
    },
    categoryStats,
    difficultyStats
  });
});

// @desc    Get random flashcard
// @route   GET /api/flashcards/random
// @access  Public
const getRandomFlashcard = asyncWrapper(async (req, res) => {
  const count = await Flashcard.countDocuments();
  
  if (count === 0) {
    throw new NotFoundError('No flashcards found');
  }
  
  const random = Math.floor(Math.random() * count);
  const flashcard = await Flashcard.findOne().skip(random);
  
  res.status(200).json({
    success: true,
    flashcard
  });
});

// @desc    Bulk update flashcards (mark multiple as mastered)
// @route   PATCH /api/flashcards/bulk/update
// @access  Public
const bulkUpdateFlashcards = asyncWrapper(async (req, res) => {
  const { ids, mastered } = req.body;
  
  if (!Array.isArray(ids) || typeof mastered !== 'boolean') {
    throw new BadRequestError('Please provide valid ids array and mastered boolean');
  }
  
  const result = await Flashcard.updateMany(
    { _id: { $in: ids } },
    { mastered }
  );
  
  res.status(200).json({
    success: true,
    message: `Successfully updated ${result.modifiedCount} flashcards`,
    modifiedCount: result.modifiedCount
  });
});

module.exports = {
  getAllFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcardStats,
  getRandomFlashcard,
  bulkUpdateFlashcards
};