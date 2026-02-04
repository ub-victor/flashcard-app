const { body } = require('express-validator');

const validateFlashcard = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ max: 1000 })
    .withMessage('Question cannot exceed 1000 characters'),
  
  body('answer')
    .trim()
    .notEmpty()
    .withMessage('Answer is required')
    .isLength({ max: 2000 })
    .withMessage('Answer cannot exceed 2000 characters'),
  
  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Explanation cannot exceed 2000 characters'),
  
  body('category')
    .optional()
    .isIn([
      'General', 'Science', 'History', 'Math', 'Language',
      'Programming', 'Medical', 'Law', 'Business'
    ])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty level'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL')
    .matches(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
    .withMessage('Please provide a valid image URL'),
  
  body('imageAlt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alt text cannot exceed 200 characters'),
  
  body('imageCaption')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Caption cannot exceed 200 characters')
];

const validationResult = (req) => {
  // Simplified validation - in production, use express-validator
  const errors = [];
  
  if (!req.body.question || req.body.question.trim() === '') {
    errors.push({ field: 'question', message: 'Question is required' });
  }
  
  if (!req.body.answer || req.body.answer.trim() === '') {
    errors.push({ field: 'answer', message: 'Answer is required' });
  }
  
  return { isEmpty: () => errors.length === 0, array: () => errors };
};

module.exports = {
  validateFlashcard,
  validationResult
};