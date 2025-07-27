import { useState, useCallback, useEffect, useMemo } from 'react';
import { Flashcard, Difficulty, UseStudySessionReturn, StudySession } from '../types';
import { STUDY_CONSTANTS } from '../constants';
import { calculateNextReview, updateCardDifficulty } from '../utils/spacedRepetition';
import { toast } from 'sonner';

interface UseStudySessionProps {
  cards: Flashcard[];
  onSessionEnd?: (session: StudySession) => void;
}

export function useStudySession({ cards, onSessionEnd }: UseStudySessionProps): UseStudySessionReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>(cards);
  const [startTime] = useState(new Date());
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Memoized values
  const currentCard = useMemo(() => 
    sessionCards[currentIndex] || null, 
    [sessionCards, currentIndex]
  );

  const totalCards = sessionCards.length;
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  // Reset when cards change
  useEffect(() => {
    setSessionCards(cards);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCorrectAnswers(0);
  }, [cards]);

  const nextCard = useCallback(() => {
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      endSession();
    }
  }, [currentIndex, sessionCards.length]);

  const previousCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  }, [currentIndex]);

  const toggleAnswer = useCallback(() => {
    setShowAnswer(prev => !prev);
  }, []);

  const rateCard = useCallback((difficulty: Difficulty) => {
    if (!currentCard) return;

    // Update card with new difficulty and next review date
    const updatedCard = updateCardDifficulty(currentCard, difficulty);
    
    // Update session cards
    setSessionCards(prev => 
      prev.map(card => 
        card.id === currentCard.id ? updatedCard : card
      )
    );

    // Track correct answers (assuming 'facil' means correct)
    if (difficulty === 'facil') {
      setCorrectAnswers(prev => prev + 1);
    }

    // Move to next card
    nextCard();

    // Show feedback
    const feedbackMessages = {
      facil: 'Ótimo! Card dominado! 🎉',
      medio: 'Bom trabalho! Você verá este card novamente em breve.',
      dificil: 'Não desista! Prática leva à perfeição.',
    };

    toast.success(feedbackMessages[difficulty]);
  }, [currentCard, nextCard]);

  const endSession = useCallback(() => {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const averageTime = totalCards > 0 ? duration / totalCards : 0;
    const accuracy = totalCards > 0 ? (correctAnswers / totalCards) * 100 : 0;

    const session: StudySession = {
      id: `session-${Date.now()}`,
      folderId: '', // This would come from props in a real app
      startedAt: startTime,
      endedAt: endTime,
      cardsStudied: currentIndex + 1,
      correctAnswers,
      averageTime,
      performance: {
        accuracy,
        speed: averageTime,
        retention: accuracy, // Simplified calculation
        improvement: 0, // Would calculate based on previous sessions
      },
    };

    onSessionEnd?.(session);

    toast.success(`Sessão concluída! ${correctAnswers}/${totalCards} cards corretos.`);
  }, [startTime, totalCards, correctAnswers, currentIndex, onSessionEnd]);

  return {
    currentCard,
    currentIndex,
    totalCards,
    showAnswer,
    progress,
    nextCard,
    previousCard,
    toggleAnswer,
    rateCard,
    endSession,
  };
}