const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Flashcard API is running',
    developer: 'Ushindi Victoire - Software Engineer'
  });
});

// Simple flashcard routes for testing
const flashcards = [
  {
    _id: '1',
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces',
    category: 'Programming',
    difficulty: 'Easy',
    mastered: false,
    cardNumber: 1
  },
  {
    _id: '2',
    question: 'What is MongoDB?',
    answer: 'A NoSQL database program',
    category: 'Programming',
    difficulty: 'Medium',
    mastered: false,
    cardNumber: 2
  }
];

// Get all flashcards
app.get('/api/flashcards', (req, res) => {
  res.status(200).json({
    success: true,
    flashcards,
    count: flashcards.length
  });
});

// Create flashcard
app.post('/api/flashcards', (req, res) => {
  const newCard = {
    _id: Date.now().toString(),
    ...req.body,
    cardNumber: flashcards.length + 1,
    createdAt: new Date().toISOString()
  };
  
  flashcards.push(newCard);
  res.status(201).json({
    success: true,
    flashcard: newCard
  });
});

// Update flashcard
app.patch('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const index = flashcards.findIndex(card => card._id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Flashcard not found with id: ${id}`
    });
  }
  
  flashcards[index] = { ...flashcards[index], ...req.body };
  res.status(200).json({
    success: true,
    flashcard: flashcards[index]
  });
});

// Delete flashcard
app.delete('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const index = flashcards.findIndex(card => card._id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Flashcard not found with id: ${id}`
    });
  }
  
  flashcards.splice(index, 1);
  res.status(200).json({
    success: true,
    message: 'Flashcard deleted successfully'
  });
});

// Mark as mastered
app.patch('/api/flashcards/:id/mastered', (req, res) => {
  const { id } = req.params;
  const index = flashcards.findIndex(card => card._id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Flashcard not found with id: ${id}`
    });
  }
  
  flashcards[index].mastered = !flashcards[index].mastered;
  res.status(200).json({
    success: true,
    flashcard: flashcards[index]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

// Start server without MongoDB for now
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Flashcard App by Ushindi Victoire`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
  console.log(`🎯 Using in-memory storage (no MongoDB required)`);
});