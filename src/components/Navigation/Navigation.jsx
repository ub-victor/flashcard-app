import React from 'react';
import styles from './Navigation.module.css';

const Navigation = ({ currentIndex, totalCards, onNext, onPrevious }) => {
  return (
    <div className={styles.navigation}>
      <button
        className={styles.navBtn}
        onClick={onPrevious}
        disabled={totalCards === 0}
      >
        ← Previous
      </button>
      
      <div className={styles.progressIndicator}>
        <span className={styles.progressText}>
          Card {totalCards > 0 ? currentIndex + 1 : 0} of {totalCards}
        </span>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: totalCards > 0 ? `${((currentIndex + 1) / totalCards) * 100}%` : '0%' }}
          ></div>
        </div>
      </div>
      
      <button
        className={styles.navBtn}
        onClick={onNext}
        disabled={totalCards === 0}
      >
        Next →
      </button>
    </div>
  );
};

export default Navigation;