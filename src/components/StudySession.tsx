import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Eye, EyeOff, Brain, LayoutDashboard, Plus, GraduationCap, Video, X, CheckCircle } from 'lucide-react';
import { LoginDialog } from './LoginDialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { VideoContent } from './VideoManager';

interface StudySessionProps {
  deckId: string;
  onNavigate: (page: 'landing' | 'dashboard' | 'study' | 'deck' | 'create', deckId?: string) => void;
  onLogoClick: () => void;
}

interface FlashcardWithVideo {
  id: string;
  front: string;
  back: string;
  videos: VideoContent[];
}

export function StudySession({ deckId, onNavigate, onLogoClick }: StudySessionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  // Mock data with videos
  const [cards] = useState<FlashcardWithVideo[]>([
    {
      id: '1',
      front: 'Qual é a estrutura anatômica responsável pela contração do coração?',
      back: 'O miocárdio é o tecido muscular cardíaco responsável pela contração do coração. É composto por células musculares cardíacas especializadas que se contraem de forma coordenada para bombear sangue.',
      videos: [
        {
          id: 'v1',
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=CWFyxn0qDEU',
          title: 'Anatomia do Coração - Miocárdio',
          description: 'Vídeo explicativo sobre a estrutura e função do miocárdio'
        }
      ]
    },
    {
      id: '2',
      front: 'Quais são as principais câmaras do coração?',
      back: 'O coração possui quatro câmaras: dois átrios (direito e esquerdo) na parte superior e dois ventrículos (direito e esquerdo) na parte inferior. Os átrios recebem sangue e os ventrículos bombeiam sangue.',
      videos: [
        {
          id: 'v2',
          type: 'mp4',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          title: 'Câmaras Cardíacas - Demonstração 3D',
          description: 'Visualização tridimensional das câmaras do coração'
        }
      ]
    },
    {
      id: '3',
      front: 'O que é a circulação pulmonar?',
      back: 'A circulação pulmonar é o circuito sanguíneo que transporta sangue desoxigenado do ventrículo direito para os pulmões através da artéria pulmonar, e retorna sangue oxigenado dos pulmões para o átrio esquerdo pelas veias pulmonares.',
      videos: []
    },
    {
      id: '4',
      front: 'Qual é a função das válvulas cardíacas?',
      back: 'As válvulas cardíacas controlam o fluxo sanguíneo através do coração, impedindo o refluxo. São elas: tricúspide, pulmonar, mitral e aórtica.',
      videos: [
        {
          id: 'v3',
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
          title: 'Válvulas Cardíacas - Funcionamento',
          description: 'Como funcionam as válvulas do coração'
        }
      ]
    }
  ]);

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const markAnswer = (isCorrect: boolean) => {
    setStudyStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1
    }));
    nextCard();
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyStats({ correct: 0, incorrect: 0, total: 0 });
  };

  const renderVideoEmbed = (video: VideoContent) => {
    switch (video.type) {
      case 'youtube':
        const youtubeId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeId ? (
          <iframe
            width="100%"
            height="240"
            src={`https://www.youtube.com/embed/${youtubeId[1]}`}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
            title={video.title}
          />
        ) : null;
      case 'vimeo':
        const vimeoId = video.url.match(/vimeo\.com\/(\d+)/);
        return vimeoId ? (
          <iframe
            width="100%"
            height="240"
            src={`https://player.vimeo.com/video/${vimeoId[1]}`}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
            title={video.title}
          />
        ) : null;
      case 'mp4':
        return (
          <video
            width="100%"
            height="240"
            controls
            className="rounded-lg"
          >
            <source src={video.url} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Dark Bar */}
      <div className="py-2 px-6 bg-foreground">
        <div className="max-w-7xl mx-auto text-sm">
          <span className="text-gray-300">🎓 Plataforma especializada para estudantes de medicina</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-white">MedFlashcard</span>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('dashboard')}
                className="gap-2 text-white hover:bg-white/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                Painel
              </Button>
              <Button 
                variant="ghost"
                onClick={() => onNavigate('create')}
                className="gap-2 text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4" />
                Criar
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setLoginOpen(true)}
                className="gap-2 text-white hover:bg-white/20"
              >
                <GraduationCap className="w-4 h-4" />
                Área do aluno
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentCardIndex + 1}</div>
                <div className="text-sm text-muted-foreground">de {cards.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{studyStats.correct}</div>
                <div className="text-sm text-muted-foreground">Corretas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{studyStats.incorrect}</div>
                <div className="text-sm text-muted-foreground">Incorretas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{Math.round(progress)}%</div>
                <div className="text-sm text-muted-foreground">Progresso</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Study Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cardiologia - Deck de Estudo</CardTitle>
              <div className="flex items-center gap-2">
                {currentCard.videos.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <Video className="w-3 h-3" />
                    {currentCard.videos.length} vídeo{currentCard.videos.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSession}
                  className="gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="question" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="question">Pergunta</TabsTrigger>
                <TabsTrigger value="videos" disabled={currentCard.videos.length === 0}>
                  Vídeos ({currentCard.videos.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="question" className="space-y-6">
                <div className="text-center py-8">
                  <div className="text-lg font-medium mb-6">
                    {currentCard.front}
                  </div>
                  
                  <Button
                    onClick={() => setShowAnswer(!showAnswer)}
                    variant="outline"
                    className="gap-2"
                  >
                    {showAnswer ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Ocultar Resposta
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Mostrar Resposta
                      </>
                    )}
                  </Button>
                </div>

                {showAnswer && (
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Resposta:</div>
                    <div className="text-sm leading-relaxed">{currentCard.back}</div>
                  </div>
                )}

                {showAnswer && (
                  <div className="flex justify-center gap-4 pt-6">
                    <Button
                      onClick={() => markAnswer(false)}
                      variant="outline"
                      className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                      Difícil
                    </Button>
                    <Button
                      onClick={() => markAnswer(true)}
                      variant="outline"
                      className="gap-2 border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                    >
                      Médio
                    </Button>
                    <Button
                      onClick={() => markAnswer(true)}
                      className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Fácil
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="videos" className="space-y-4">
                {currentCard.videos.map((video) => (
                  <Card key={video.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {video.type}
                        </Badge>
                      </div>
                      {video.description && (
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video">
                        {renderVideoEmbed(video)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {currentCard.videos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum vídeo disponível para este card</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <Button
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            className="gap-2"
          >
            Próximo
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>

        {/* Completion Message */}
        {currentCardIndex === cards.length - 1 && showAnswer && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-green-800 font-medium mb-2">
                🎉 Parabéns! Você completou o deck!
              </div>
              <div className="text-green-600 text-sm mb-4">
                Acertos: {studyStats.correct} | Erros: {studyStats.incorrect} | 
                Taxa de acerto: {studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0}%
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetSession}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Estudar Novamente
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('dashboard')}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Login Dialog */}
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
      />
    </div>
  );
}