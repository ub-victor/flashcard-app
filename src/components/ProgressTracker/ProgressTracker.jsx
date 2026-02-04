import React from 'react';
import styles from './ProgressTracker.module.css';

const ProgressTracker = ({ flashcards }) => {
  const masteredCards = flashcards.filter(card => card.mastered).length;
  const totalCards = flashcards.length;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
  
  const difficultyStats = flashcards.reduce((acc, card) => {
    acc[card.difficulty] = (acc[card.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  const categoryStats = flashcards.reduce((acc, card) => {
    acc[card.category] = (acc[card.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.progressContainer}>
      <h3>📊 Progress Tracker</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{totalCards}</div>
          <div className={styles.statLabel}>Total Cards</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{masteredCards}</div>
          <div className={styles.statLabel}>Mastered</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{masteryPercentage}%</div>
          <div className={styles.statLabel}>Mastery</div>
        </div>
      </div>

      <div className={styles.progressCircle}>
        <div className={styles.circle}>
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
          <div className={styles.circleText}>
            <span className={styles.circlePercentage}>{masteryPercentage}%</span>
            <span className={styles.circleLabel}>Complete</span>
          </div>
        </div>
      </div>

      {Object.keys(difficultyStats).length > 0 && (
        <div className={styles.difficultyStats}>
          <h4>Difficulty Distribution</h4>
          {Object.entries(difficultyStats).map(([difficulty, count]) => (
            <div key={difficulty} className={styles.difficultyItem}>
              <span className={styles.difficultyName}>{difficulty}</span>
              <div className={styles.difficultyBar}>
                <div 
                  className={`${styles.difficultyFill} ${styles[difficulty.toLowerCase()]}`}
                  style={{ width: `${(count / totalCards) * 100}%` }}
                ></div>
              </div>
              <span className={styles.difficultyCount}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {Object.keys(categoryStats).length > 0 && (
        <div className={styles.categoryStats}>
          <h4>Categories</h4>
          <div className={styles.categoryList}>
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className={styles.categoryItem}>
                <span className={styles.categoryName}>{category}</span>
                <span className={styles.categoryCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;