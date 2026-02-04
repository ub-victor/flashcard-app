import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard/Flashcard';
import ProgressTracker from './components/ProgressTracker/ProgressTracker';
import FlashcardForm from './components/FlashcardForm/FlashcardForm';
import Navigation from './components/Navigation/Navigation';
import styles from './App.module.css';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`${API_URL}/flashcards`);
      const data = await response.json();
      setFlashcards(data.flashcards || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setFlashcards([]);
      setLoading(false);
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (flashcards.length === 0) return;
    setCurrentCardIndex((prevIndex) => 
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    if (flashcards.length === 0) return;
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const handleAddCard = async (newCard) => {
    try {
      const response = await fetch(`${API_URL}/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });
      const data = await response.json();
      setFlashcards([...flashcards, data.flashcard]);
    } catch (error) {
      console.error('Error adding card:', error);
      // Add locally if API fails
      const localCard = {
        _id: Date.now().toString(),
        ...newCard,
        cardNumber: flashcards.length + 1,
        mastered: false
      };
      setFlashcards([...flashcards, localCard]);
    }
  };

  const handleUpdateCard = async (updatedCard) => {
    try {
      const response = await fetch(`${API_URL}/flashcards/${updatedCard._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCard),
      });
      const data = await response.json();
      const updatedFlashcards = flashcards.map(card =>
        card._id === updatedCard._id ? data.flashcard : card
      );
      setFlashcards(updatedFlashcards);
      setIsEditing(false);
      setEditingCard(null);
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await fetch(`${API_URL}/flashcards/${cardId}`, {
        method: 'DELETE',
      });
      const updatedFlashcards = flashcards.filter(card => card._id !== cardId);
      setFlashcards(updatedFlashcards);
      if (currentCardIndex >= updatedFlashcards.length && updatedFlashcards.length > 0) {
        setCurrentCardIndex(updatedFlashcards.length - 1);
      } else if (updatedFlashcards.length === 0) {
        setCurrentCardIndex(0);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      // Delete locally if API fails
      const updatedFlashcards = flashcards.filter(card => card._id !== cardId);
      setFlashcards(updatedFlashcards);
    }
  };

  const handleMarkAsMastered = async (cardId) => {
    try {
      const card = flashcards.find(c => c._id === cardId);
      const response = await fetch(`${API_URL}/flashcards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mastered: !card.mastered }),
      });
      const data = await response.json();
      const updatedFlashcards = flashcards.map(c =>
        c._id === cardId ? data.flashcard : c
      );
      setFlashcards(updatedFlashcards);
    } catch (error) {
      console.error('Error marking as mastered:', error);
      // Update locally if API fails
      const updatedFlashcards = flashcards.map(c =>
        c._id === cardId ? { ...c, mastered: !c.mastered } : c
      );
      setFlashcards(updatedFlashcards);
    }
  };

  const handleEditCard = (card) => {
    setIsEditing(true);
    setEditingCard(card);
  };

  const handleSubmitCard = (cardData) => {
    if (isEditing) {
      handleUpdateCard({ ...editingCard, ...cardData });
    } else {
      handleAddCard(cardData);
    }
  };

  const currentCard = flashcards[currentCardIndex];

  if (loading) {
    return <div className="loading">Loading flashcards...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Flashcard Master</h1>
        <p className="subtitle">Developed by Ushindi Victoire - Software Engineer</p>
      </header>

      <main className="main">
        <div className="flashcard-section">
          {flashcards.length > 0 ? (
            <>
              <div className={`flashcard ${currentCard.mastered ? 'mastered' : ''}`}>
                <div className="card-header">
                  <span className="card-number">Card #{currentCard.cardNumber}</span>
                  <div className="card-actions">
                    <button
                      className={`mastered-btn ${currentCard.mastered ? 'mastered-active' : ''}`}
                      onClick={() => handleMarkAsMastered(currentCard._id)}
                      title={currentCard.mastered ? "Mark as unlearned" : "Mark as mastered"}
                    >
                      {currentCard.mastered ? '✅ Mastered' : '📖 Learn'}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditCard(currentCard)}
                      title="Edit card"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCard(currentCard._id)}
                      title="Delete card"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="question">{currentCard.question}</h3>
                  
                  {showAnswer ? (
                    <div className="answer-section">
                      <h4 className="answer-title">Answer:</h4>
                      <p className="answer">{currentCard.answer}</p>
                      <button
                        className="hide-answer-btn"
                        onClick={() => setShowAnswer(false)}
                      >
                        Hide Answer
                      </button>
                    </div>
                  ) : (
                    <button
                      className="show-answer-btn"
                      onClick={() => setShowAnswer(true)}
                    >
                      Show Answer
                    </button>
                  )}
                </div>

                <div className="card-footer">
                  <span className="category">Category: {currentCard.category}</span>
                  <span className="difficulty">Difficulty: {currentCard.difficulty}</span>
                </div>
              </div>

              <div className="navigation">
                <button
                  className="nav-btn"
                  onClick={handlePrevious}
                  disabled={flashcards.length === 0}
                >
                  ← Previous
                </button>
                
                <div className="progress-indicator">
                  <span className="progress-text">
                    Card {flashcards.length > 0 ? currentCardIndex + 1 : 0} of {flashcards.length}
                  </span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: flashcards.length > 0 
                          ? `${((currentCardIndex + 1) / flashcards.length) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
                
                <button
                  className="nav-btn"
                  onClick={handleNext}
                  disabled={flashcards.length === 0}
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>No Flashcards Yet</h2>
              <p>Add your first flashcard to get started!</p>
            </div>
          )}
        </div>

        <div className="sidebar">
          <FlashcardForm
            onSubmit={handleSubmitCard}
            isEditing={isEditing}
            editingCard={editingCard}
            setIsEditing={setIsEditing}
            setEditingCard={setEditingCard}
          />
          <ProgressTracker flashcards={flashcards} />
        </div>
      </main>
    </div>
  );
}

function FlashcardForm({ onSubmit, isEditing, editingCard, setIsEditing, setEditingCard }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    difficulty: 'Medium'
  });

  useEffect(() => {
    if (isEditing && editingCard) {
      setFormData(editingCard);
    }
  }, [isEditing, editingCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        difficulty: 'Medium'
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCard(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      difficulty: 'Medium'
    });
  };

  return (
    <div className="form-container">
      <h3>{isEditing ? 'Edit Flashcard' : 'Add New Flashcard'}</h3>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Question *</label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Enter your question..."
          />
        </div>

        <div className="form-group">
          <label>Answer *</label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Enter the answer..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="General">General</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Math">Math</option>
              <option value="Programming">Programming</option>
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update Card' : 'Add Card'}
          </button>
          {isEditing && (
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ProgressTracker({ flashcards }) {
  const masteredCards = flashcards.filter(card => card.mastered).length;
  const totalCards = flashcards.length;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  return (
    <div className="progress-container">
      <h3>📊 Progress Tracker</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalCards}</div>
          <div className="stat-label">Total Cards</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{masteredCards}</div>
          <div className="stat-label">Mastered</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{masteryPercentage}%</div>
          <div className="stat-label">Mastery</div>
        </div>
      </div>

      <div className="progress-circle">
        <div className="circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              fill="none" 
              stroke="#f0f0f0" 
              strokeWidth="12"
            />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${masteryPercentage * 3.39} 339`}
              transform="rotate(-90 60 60)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6a11cb" />
                <stop offset="100%" stopColor="#2575fc" />
              </linearGradient>
            </defs>
          </svg>
          <div className="circle-text">
            <span className="circle-percentage">{masteryPercentage}%</span>
            <span className="circle-label">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;