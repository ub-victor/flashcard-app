import React from 'react';
import styles from './Flashcard.module.css';

const Flashcard = ({ card, showAnswer, setShowAnswer, onMarkAsMastered, onEdit, onDelete }) => {
  if (!card) return null;

  return (
    <div className={`${styles.flashcard} ${card.mastered ? styles.mastered : ''}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardNumber}>Card #{card.cardNumber}</span>
        <div className={styles.cardActions}>
          <button
            className={`${styles.masteredBtn} ${card.mastered ? styles.masteredActive : ''}`}
            onClick={() => onMarkAsMastered(card._id)}
            title={card.mastered ? "Mark as unlearned" : "Mark as mastered"}
          >
            {card.mastered ? '✅ Mastered' : '📖 Learn'}
          </button>
          <button
            className={styles.editBtn}
            onClick={() => onEdit(card)}
            title="Edit card"
          >
            ✏️ Edit
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(card._id)}
            title="Delete card"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.question}>{card.question}</h3>
        
        {card.imageUrl && (
          <div className={styles.imageContainer}>
            <img 
              src={card.imageUrl} 
              alt={card.imageAlt || "Illustration for flashcard question"} 
              className={styles.cardImage}
            />
            {card.imageCaption && (
              <p className={styles.imageCaption}>{card.imageCaption}</p>
            )}
          </div>
        )}

        {showAnswer ? (
          <div className={styles.answerSection}>
            <h4 className={styles.answerTitle}>Answer:</h4>
            <p className={styles.answer}>{card.answer}</p>
            {card.explanation && (
              <p className={styles.explanation}>💡 {card.explanation}</p>
            )}
            <button
              className={styles.hideAnswerBtn}
              onClick={() => setShowAnswer(false)}
            >
              Hide Answer
            </button>
          </div>
        ) : (
          <button
            className={styles.showAnswerBtn}
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </button>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.category}>Category: {card.category}</span>
        <span className={styles.difficulty}>Difficulty: {card.difficulty}</span>
      </div>
    </div>
  );
};

export default Flashcard;