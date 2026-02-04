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

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/flashcards');
      const data = await response.json();
      setFlashcards(data.flashcards || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => 
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const handleAddCard = async (newCard) => {
    try {
      const response = await fetch('http://localhost:5000/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });
      const data = await response.json();
      setFlashcards([...flashcards, data.flashcard]);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleUpdateCard = async (updatedCard) => {
    try {
      const response = await fetch(`http://localhost:5000/api/flashcards/${updatedCard._id}`, {
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
      await fetch(`http://localhost:5000/api/flashcards/${cardId}`, {
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
    }
  };

  const handleMarkAsMastered = async (cardId) => {
    try {
      const card = flashcards.find(c => c._id === cardId);
      const response = await fetch(`http://localhost:5000/api/flashcards/${cardId}`, {
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
    }
  };

  const handleEditCard = (card) => {
    setIsEditing(true);
    setEditingCard(card);
  };

  const currentCard = flashcards[currentCardIndex];

  if (loading) {
    return <div className={styles.loading}>Loading flashcards...</div>;
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>📚 Flashcard Master</h1>
        <p className={styles.subtitle}>Developed by Ushindi Victoire - Software Engineer</p>
      </header>

      <main className={styles.main}>
        <div className={styles.flashcardSection}>
          {flashcards.length > 0 ? (
            <>
              <Flashcard
                card={currentCard}
                showAnswer={showAnswer}
                setShowAnswer={setShowAnswer}
                onMarkAsMastered={handleMarkAsMastered}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
              />
              <Navigation
                currentIndex={currentCardIndex}
                totalCards={flashcards.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </>
          ) : (
            <div className={styles.emptyState}>
              <h2>No Flashcards Yet</h2>
              <p>Add your first flashcard to get started!</p>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <FlashcardForm
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
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

export default App;