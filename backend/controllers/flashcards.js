const Flashcard = require('../models/Flashcard');
const asyncWrapper = require('../utils/asyncWrapper'); // to eliminate try/catch in controllers we wrap our controller functions with this asyncWrapper
const {BadResquestError, NotFoundError, ValidationError, DuplicateKeyError} = require('../erros');


// @desc Get all flashcards with pagination
// @route  GET /api/flashcards
// @access Public 

const getAllFlashcards = asyncWrapper(async(req, res)=>{
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page -1) * limit;

    //Filttering options
    const filter= {};
    if(req.query.sort){
        const sortFields = req.query.sort.split(',');
        sortFields.forEach(field)
    } 
});