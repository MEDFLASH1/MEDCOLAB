import { Flashcard, Difficulty } from '../types';
import { STUDY_CONSTANTS } from '../constants';

/**
 * Calculate the next review date based on spaced repetition algorithm
 */
export function calculateNextReview(card: Flashcard, difficulty: Difficulty): Date {
  const intervals = STUDY_CONSTANTS.SPACED_REPETITION_INTERVALS[difficulty];
  const reviewCount = Math.min(card.reviewCount, intervals.length - 1);
  const intervalDays = intervals[reviewCount];
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  
  return nextReview;
}

/**
 * Update card difficulty and calculate next review
 */
export function updateCardDifficulty(card: Flashcard, difficulty: Difficulty): Flashcard {
  const nextReview = calculateNextReview(card, difficulty);
  const newReviewCount = card.reviewCount + 1;
  
  return {
    ...card,
    difficulty,
    reviewCount: newReviewCount,
    lastReviewed: new Date(),
    nextReview,
    mastered: difficulty === 'facil' && newReviewCount >= 3,
    updatedAt: new Date(),
  };
}

/**
 * Get cards due for review
 */
export function getCardsDueForReview(cards: Flashcard[]): Flashcard[] {
  const now = new Date();
  
  return cards.filter(card => {
    // If no next review date, include in review
    if (!card.nextReview) return true;
    
    // If next review date has passed, include in review
    return new Date(card.nextReview) <= now;
  });
}

/**
 * Sort cards by priority (difficulty and last reviewed)
 */
export function sortCardsByPriority(cards: Flashcard[]): Flashcard[] {
  return [...cards].sort((a, b) => {
    // Prioritize difficult cards
    const difficultyOrder = { dificil: 3, medio: 2, facil: 1 };
    const difficultyDiff = difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
    
    if (difficultyDiff !== 0) return difficultyDiff;
    
    // Then by last reviewed (oldest first)
    const aLastReviewed = a.lastReviewed ? new Date(a.lastReviewed).getTime() : 0;
    const bLastReviewed = b.lastReviewed ? new Date(b.lastReviewed).getTime() : 0;
    
    return aLastReviewed - bLastReviewed;
  });
}

/**
 * Calculate study statistics
 */
export function calculateStudyStats(cards: Flashcard[]) {
  const totalCards = cards.length;
  const masteredCards = cards.filter(card => card.mastered).length;
  const cardsByDifficulty = {
    facil: cards.filter(card => card.difficulty === 'facil').length,
    medio: cards.filter(card => card.difficulty === 'medio').length,
    dificil: cards.filter(card => card.difficulty === 'dificil').length,
  };
  
  const averageReviewCount = totalCards > 0 
    ? cards.reduce((sum, card) => sum + card.reviewCount, 0) / totalCards 
    : 0;
  
  const masteryPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;
  
  return {
    totalCards,
    masteredCards,
    cardsByDifficulty,
    averageReviewCount,
    masteryPercentage,
  };
}

/**
 * Get recommended study session size
 */
export function getRecommendedSessionSize(cards: Flashcard[]): number {
  const dueCards = getCardsDueForReview(cards);
  const { MIN_CARDS_PER_SESSION, MAX_CARDS_PER_SESSION, DEFAULT_CARDS_PER_SESSION } = STUDY_CONSTANTS;
  
  if (dueCards.length <= MIN_CARDS_PER_SESSION) {
    return Math.max(MIN_CARDS_PER_SESSION, dueCards.length);
  }
  
  if (dueCards.length >= MAX_CARDS_PER_SESSION) {
    return MAX_CARDS_PER_SESSION;
  }
  
  return Math.min(DEFAULT_CARDS_PER_SESSION, dueCards.length);
}