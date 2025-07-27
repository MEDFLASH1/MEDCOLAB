import { useState, useEffect } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import exampleImage from 'figma:asset/58e2d904a9d77b72ffeee5899d555586c2bb4f61.png';

// Mock data for flashcards
const mockFlashcards = [
  {
    id: 1,
    question: "¿Qué patología presenta este paciente?",
    answer: "Neumonía bilateral",
    image: "🫁",
    category: "Neumología",
    difficulty: 'medium'
  },
  {
    id: 2,
    question: "¿Cuál es el diagnóstico más probable?",
    answer: "Insuficiencia cardíaca congestiva",
    image: "🫀",
    category: "Cardiología",
    difficulty: 'hard'
  },
  {
    id: 3,
    question: "¿Qué estructura anatómica se observa?",
    answer: "Corteza cerebral",
    image: "🧠",
    category: "Neurología",
    difficulty: 'easy'
  },
  {
    id: 4,
    question: "¿Cuál es el tratamiento indicado?",
    answer: "Antibióticos de amplio espectro",
    image: "💊",
    category: "Farmacología",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "¿Qué sistema está comprometido?",
    answer: "Sistema respiratorio",
    image: "🔬",
    category: "Fisiología",
    difficulty: 'easy'
  }
];

interface FlashcardStudyProps {
  onNavigate: (page: string) => void;
  selectedDeckId?: string | null;
}

export function FlashcardStudy({ onNavigate, selectedDeckId }: FlashcardStudyProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [cards] = useState(mockFlashcards);

  const currentCard = cards[currentCardIndex];
  const totalCards = cards.length;
  const progress = (completedCards.length / totalCards) * 100;

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleCardComplete = (difficulty: 'easy' | 'good' | 'difficult' | 'again') => {
    if (!completedCards.includes(currentCard.id)) {
      setCompletedCards([...completedCards, currentCard.id]);
    }
    
    // Move to next card or finish session
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Session complete
      alert('¡Sesión de estudio completada!');
      onNavigate('dashboard');
    }
  };

  const getDotStatus = (index: number) => {
    if (index < currentCardIndex) return 'completed';
    if (index === currentCardIndex) return 'current';
    return 'pending';
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Main content area - Área blanca expandida */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-4xl">
          {/* Card */}
          <Card className="bg-white shadow-2xl min-h-[600px] flex flex-col border-0">
            <CardContent className="flex-1 flex flex-col p-6">
              {/* Header dentro de la tarjeta - Más compacto */}
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('dashboard')}
                  className="text-gray-600 hover:bg-gray-100 p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <h1 className="text-base font-medium text-gray-800">Sesión de Estudio</h1>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100 p-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress dots dentro de la tarjeta - Más compacto */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {cards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${getDotColor(getDotStatus(index))}`}
                  />
                ))}
              </div>
              {/* Category badge */}
              <div className="mb-6">
                <Badge 
                  variant="secondary" 
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  {currentCard.category}
                </Badge>
              </div>

              {/* Main content area - centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl text-gray-600 font-normal">
                    {currentCard.question}
                  </h2>
                </div>
                
                <div className="mb-8">
                  <div className="text-7xl lg:text-8xl mb-6">
                    {currentCard.image}
                  </div>
                </div>
                
                {!showAnswer ? (
                  <div className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-wider">
                    ? ? ?
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-2xl lg:text-3xl font-semibold text-green-600">
                      {currentCard.answer}
                    </div>
                    
                    {/* Difficulty buttons */}
                    <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto pt-6">
                      <Button
                        onClick={() => handleCardComplete('easy')}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 px-4 text-sm font-bold rounded-xl"
                      >
                        FÁCIL
                      </Button>
                      <Button
                        onClick={() => handleCardComplete('good')}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 px-4 text-sm font-bold rounded-xl"
                      >
                        BUENO
                      </Button>
                      <Button
                        onClick={() => handleCardComplete('difficult')}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 px-4 text-sm font-bold rounded-xl"
                      >
                        DIFÍCIL
                      </Button>
                      <Button
                        onClick={() => handleCardComplete('again')}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 px-4 text-sm font-bold rounded-xl"
                      >
                        DE NUEVO
                      </Button>
                    </div>
                  </div>
                )}

              {/* Action button - Dentro del área blanca */}
              {!showAnswer && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleRevealAnswer}
                    className="w-full max-w-md bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    REVELAR RESPUESTA
                  </Button>
                </div>
              )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom section - Área oscura reducida */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 px-6 py-6 space-y-4">
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto">
          <Progress 
            value={progress} 
            className="h-3 bg-gray-600 rounded-full overflow-hidden"
          />
        </div>

        {/* Study stats */}
        <div className="grid grid-cols-3 gap-6 text-white text-center max-w-md mx-auto">
          <div>
            <div className="text-3xl font-bold">{currentCardIndex + 1}</div>
            <div className="text-sm text-gray-400">de {totalCards}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{completedCards.length}</div>
            <div className="text-sm text-gray-400">Completadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-400">Progreso</div>
          </div>
        </div>
      </div>
    </div>
  );
}