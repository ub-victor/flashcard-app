import React, { useState, useEffect } from 'react';
import styles from './FlashcardForm.module.css';

const FlashcardForm = ({ onAddCard, onUpdateCard, isEditing, editingCard, setIsEditing, setEditingCard }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    explanation: '',
    category: 'General',
    difficulty: 'Medium',
    imageUrl: '',
    imageAlt: '',
    imageCaption: ''
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
    if (isEditing) {
      onUpdateCard(formData);
    } else {
      const newCard = {
        ...formData,
        mastered: false,
        createdAt: new Date().toISOString()
      };
      onAddCard(newCard);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      explanation: '',
      category: 'General',
      difficulty: 'Medium',
      imageUrl: '',
      imageAlt: '',
      imageCaption: ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCard(null);
    resetForm();
  };

  return (
    <div className={styles.formContainer}>
      <h3>{isEditing ? 'Edit Flashcard' : 'Add New Flashcard'}</h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
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

        <div className={styles.formGroup}>
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

        <div className={styles.formGroup}>
          <label>Explanation (Optional)</label>
          <textarea
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
            rows="2"
            placeholder="Additional explanation..."
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
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
              <option value="Language">Language</option>
              <option value="Programming">Programming</option>
              <option value="Medical">Medical</option>
              <option value="Law">Law</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className={styles.formGroup}>
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

        <div className={styles.formGroup}>
          <label>Image URL (Optional)</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {formData.imageUrl && (
          <>
            <div className={styles.formGroup}>
              <label>Image Alt Text</label>
              <input
                type="text"
                name="imageAlt"
                value={formData.imageAlt}
                onChange={handleChange}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Image Caption</label>
              <input
                type="text"
                name="imageCaption"
                value={formData.imageCaption}
                onChange={handleChange}
                placeholder="Optional caption for the image"
              />
            </div>
          </>
        )}

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            {isEditing ? 'Update Card' : 'Add Card'}
          </button>
          {isEditing && (
            <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FlashcardForm;