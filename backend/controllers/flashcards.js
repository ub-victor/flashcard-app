const Flashcard = require('../models/Flashcard');
const asyncWrapper = require('../utils/asyncWrapper'); // to eliminate try/catch in controllers we wrap our controller functions with this asyncWrapper
const {BadResquestError, NotFoundError, ValidationError, DuplicateKeyError} = require('../erros');


// @desc Get all flashcards with pagination
// @route  GET /api/flashcards
// @access Public 

const getAllFlashcards = asyncWrapper(async(req, res))