import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Play, BookOpen, TrendingUp, Calendar, Clock, Brain, LayoutDashboard, GraduationCap, BarChart3, Video, Eye, LogOut, User, Youtube, FileVideo, ExternalLink, Trash2 } from 'lucide-react';
import { VideoExplainer } from './VideoExplainer';
import { LoginDialog } from './LoginDialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onStartStudy: (deckId: string) => void;
  onViewDeck: (deckId: string) => void;
  onCreateDeck: () => void;
  onNavigate: (page: 'landing' | 'dashboard' | 'deck' | 'create' | 'flashcard-study', deckId?: string) => void;
  onLogoClick: () => void;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  totalCards: number;
  masteredCards: number;
  totalVideos: number;
  lastStudied: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

export function Dashboard({ onStartStudy, onViewDeck, onCreateDeck, onNavigate, onLogoClick }: DashboardProps) {
  const { user, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);

  // Mock decks para demonstração
  const mockDecks: Deck[] = [
    {
      id: 'mock-1',
      name: 'Cardiologia Básica',
      description: 'Fundamentos de anatomia e fisiologia cardiovascular',
      totalCards: 45,
      masteredCards: 32,
      totalVideos: 15,
      lastStudied: '2 horas atrás',
      difficulty: 'Médio'
    },
    {
      id: 'mock-2',
      name: 'Neurologia Clínica',
      description: 'Principais patologias do sistema nervoso',
      totalCards: 67,
      masteredCards: 23,
      totalVideos: 8,
      lastStudied: '1 dia atrás',
      difficulty: 'Difícil'
    },
    {
      id: 'mock-3',
      name: 'Farmacologia Geral',
      description: 'Princípios gerais de farmacologia médica',
      totalCards: 89,
      masteredCards: 78,
      totalVideos: 22,
      lastStudied: '3 horas atrás',
      difficulty: 'Fácil'
    }
  ];

  // Cargar decks desde localStorage
  useEffect(() => {
    const loadDecks = () => {
      try {
        const savedDecks = JSON.parse(localStorage.getItem('medflashcard-decks') || '[]');
        console.log('Decks cargados desde localStorage:', savedDecks);
        
        // Convertir decks guardados al formato esperado por el Dashboard
        const convertedDecks: Deck[] = savedDecks.map((savedDeck: any) => {
          const totalVideos = savedDeck.cards?.reduce((acc: number, card: any) => acc + (card.videos?.length || 0), 0) || 0;
          const totalCanvasElements = savedDeck.cards?.reduce((acc: number, card: any) => 
            acc + (card.frontCanvasElements?.length || 0) + (card.backCanvasElements?.length || 0), 0) || 0;
          
          return {
            id: savedDeck.id,
            name: savedDeck.name,
            description: savedDeck.description || 'Deck criado pelo usuário',
            totalCards: savedDeck.cards?.length || 0,
            masteredCards: 0, // Por defecto, ningún card está dominado
            totalVideos: totalVideos,
            lastStudied: 'Criado recentemente',
            difficulty: 'Médio' as const
          };
        });

        // Combinar decks guardados con decks mock
        const allDecks = [...convertedDecks, ...mockDecks];
        console.log('Todos los decks combinados:', allDecks);
        setDecks(allDecks);
      } catch (error) {
        console.error('Error cargando decks desde localStorage:', error);
        // En caso de error, usar solo los decks mock
        setDecks(mockDecks);
      }
    };

    loadDecks();
    
    // También escuchar cambios en localStorage para actualizar automáticamente
    const handleStorageChange = () => {
      loadDecks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event para cambios internos (cuando se guarda un nuevo deck)
    window.addEventListener('decksUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('decksUpdated', handleStorageChange);
    };
  }, []);

  const totalCards = decks.reduce((sum, deck) => sum + deck.totalCards, 0);
  const totalMastered = decks.reduce((sum, deck) => sum + deck.masteredCards, 0);
  const totalVideos = decks.reduce((sum, deck) => sum + deck.totalVideos, 0);
  const overallProgress = totalCards > 0 ? (totalMastered / totalCards) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-600 bg-green-100';
      case 'Médio': return 'text-yellow-600 bg-yellow-100';
      case 'Difícil': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Dark Bar */}
      <div className="py-2 px-4 md:px-6 lg:px-8 bg-foreground">
        <div className="max-w-full mx-auto text-sm md:text-base">
          <span className="text-gray-300">🎓 Plataforma especializada para estudantes de medicina</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary border-b sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-primary rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl lg:text-3xl text-white">MedFlashcard</span>
              </div>
            </div>
            <nav className="flex items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                className="gap-2 text-white hover:bg-white/20 text-sm md:text-base lg:text-lg lg:px-6 lg:py-3"
                size={window.innerWidth >= 1024 ? "lg" : "default"}
              >
                <LayoutDashboard className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Painel</span>
              </Button>
              <Button 
                variant="ghost"
                onClick={onCreateDeck}
                className="gap-2 text-white hover:bg-white/20 text-sm md:text-base lg:text-lg lg:px-6 lg:py-3"
                size={window.innerWidth >= 1024 ? "lg" : "default"}
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Criar</span>
              </Button>
              <Button 
                variant="ghost"
                onClick={() => onNavigate('flashcard-study')}
                className="gap-2 text-white hover:bg-white/20 text-sm md:text-base lg:text-lg lg:px-6 lg:py-3"
                size={window.innerWidth >= 1024 ? "lg" : "default"}
              >
                <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Estudar</span>
              </Button>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 bg-muted rounded-lg">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                    <span className="text-sm lg:text-base font-medium hidden sm:inline">{user.name}</span>
                  </div>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      logout();
                      onLogoClick();
                    }}
                    className="gap-2 lg:px-4 lg:py-3"
                    size={window.innerWidth >= 1024 ? "lg" : "default"}
                  >
                    <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="hidden sm:inline">Sair</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost"
                  onClick={() => setLoginOpen(true)}
                  className="gap-2 text-white hover:bg-white/20 text-sm md:text-base lg:text-lg lg:px-6 lg:py-3"
                  size={window.innerWidth >= 1024 ? "lg" : "default"}
                >
                  <GraduationCap className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">Área do aluno</span>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-12 flex-1">
          {/* Welcome Section */}
          <div className="mb-8 lg:mb-16">
            <h1 className="text-2xl lg:text-5xl font-bold text-foreground mb-2 lg:mb-4">
              Bem-vindo{user ? `, ${user.name.split(' ')[0]}` : ''} ao MedFlashcard
            </h1>
            <p className="text-base lg:text-xl text-muted-foreground">Continue seus estudos onde parou</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8 mb-8 lg:mb-16">
            <Card className="lg:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-4">
                <CardTitle className="text-sm lg:text-lg font-medium">Total de Decks</CardTitle>
                <BookOpen className="h-4 w-4 lg:h-6 lg:w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-4xl font-bold text-primary">{decks.length}</div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {totalCards} cards no total
                </p>
              </CardContent>
            </Card>
            
            <Card className="lg:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-4">
                <CardTitle className="text-sm lg:text-lg font-medium">Cards Dominados</CardTitle>
                <TrendingUp className="h-4 w-4 lg:h-6 lg:w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-4xl font-bold text-secondary">{totalMastered}</div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  de {totalCards} cards
                </p>
              </CardContent>
            </Card>
            
            <Card className="lg:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-4">
                <CardTitle className="text-sm lg:text-lg font-medium">Vídeos Disponíveis</CardTitle>
                <Video className="h-4 w-4 lg:h-6 lg:w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-4xl font-bold text-primary">{totalVideos}</div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  conteúdo multimídia
                </p>
              </CardContent>
            </Card>
            
            <Card className="lg:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-4">
                <CardTitle className="text-sm lg:text-lg font-medium">Progresso Geral</CardTitle>
                <BarChart3 className="h-4 w-4 lg:h-6 lg:w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-4xl font-bold text-primary">{Math.round(overallProgress)}%</div>
                <Progress value={overallProgress} className="mt-2 lg:mt-4 lg:h-3" />
              </CardContent>
            </Card>
            
            <Card className="lg:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-4">
                <CardTitle className="text-sm lg:text-lg font-medium">Sessões Hoje</CardTitle>
                <Calendar className="h-4 w-4 lg:h-6 lg:w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-4xl font-bold text-secondary">3</div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  +2 desde ontem
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Decks List */}
          <div className="space-y-6 lg:space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-4xl font-bold text-foreground">Seus Decks</h2>
              <div className="flex items-center gap-2 lg:gap-4">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-sm lg:text-base lg:px-4 lg:py-2">
                  {decks.length} deck{decks.length !== 1 ? 's' : ''}
                </Badge>
                {decks.some(deck => !deck.id.startsWith('mock-')) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja limpar todos os decks criados?')) {
                        localStorage.removeItem('medflashcard-decks');
                        window.dispatchEvent(new Event('decksUpdated'));
                      }
                    }}
                    className="text-xs lg:text-sm gap-1 lg:gap-2 text-red-600 border-red-300 hover:bg-red-50 lg:px-4 lg:py-2"
                  >
                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                    Limpar Meus Decks
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
              {decks.map((deck) => {
                const progress = (deck.masteredCards / deck.totalCards) * 100;
                
                return (
                  <Card key={deck.id} className="hover:shadow-lg transition-shadow lg:p-6">
                    <CardHeader className="lg:pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 lg:space-y-2">
                          <CardTitle className="text-lg lg:text-xl">{deck.name}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              className={`${getDifficultyColor(deck.difficulty)} text-xs lg:text-sm lg:px-3 lg:py-1`}
                            >
                              {deck.difficulty}
                            </Badge>
                            {!deck.id.startsWith('mock-') && (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white text-xs lg:text-sm lg:px-3 lg:py-1">
                                Meu Deck
                              </Badge>
                            )}
                            {deck.id.startsWith('mock-') && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs lg:text-sm lg:px-3 lg:py-1">
                                Exemplo
                              </Badge>
                            )}
                            {deck.totalVideos > 0 && (
                              <Badge variant="outline" className="gap-1 text-xs lg:text-sm lg:px-3 lg:py-1">
                                <Video className="w-3 h-3 lg:w-4 lg:h-4" />
                                {deck.totalVideos}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 lg:gap-2">
                          <Button
                            onClick={() => onViewDeck(deck.id)}
                            size="sm"
                            variant="outline"
                            className="gap-1 lg:gap-2 lg:px-4 lg:py-2"
                          >
                            <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                            Ver
                          </Button>
                          <Button
                            onClick={() => onStartStudy(deck.id)}
                            size="sm"
                            className="gap-1 lg:gap-2 lg:px-4 lg:py-2"
                          >
                            <Play className="w-3 h-3 lg:w-4 lg:h-4" />
                            Estudar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <p className="text-sm lg:text-base text-muted-foreground">
                        {deck.description}
                      </p>
                      
                      <div className="space-y-2 lg:space-y-3">
                        <div className="flex justify-between text-sm lg:text-base">
                          <span>Progresso</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="lg:h-3" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 lg:gap-4 text-sm lg:text-base">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                          <span>{deck.totalCards} cards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                          <span>{deck.totalVideos} vídeos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                          <span className="text-xs lg:text-sm">{deck.lastStudied}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Video Examples Section - Only on Desktop */}
          <div className="hidden lg:block mt-20 space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-foreground">Exemplos de Vídeos Integrados</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Veja alguns exemplos de como nossos vídeos explicativos funcionam integrados aos flashcards para maximizar seu aprendizado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <VideoExplainer
                title="Anatomia do Coração"
                description="Visualização completa das estruturas cardíacas com animação 3D interativa."
                videoUrl="https://www.youtube.com/watch?v=CWFyxn0qDEU"
                videoType="youtube"
                duration="6:45"
                category="Cardiologia"
                thumbnail="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop"
              />
              
              <VideoExplainer
                title="Ciclo Cardíaco Explicado"
                description="Demonstração detalhada das fases do ciclo cardíaco e sua relação com ECG."
                videoUrl="https://vimeo.com/123456789"
                videoType="vimeo"
                duration="8:20"
                category="Fisiologia"
                thumbnail="https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=225&fit=crop"
              />
              
              <VideoExplainer
                title="Farmacologia Cardiovascular"
                description="Mecanismos de ação dos principais fármacos utilizados em cardiologia."
                videoUrl="/videos/farmacos-cardio.mp4"
                videoType="mp4"
                duration="12:15"
                category="Farmacologia"
                thumbnail="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop"
              />
            </div>
          </div>

          {/* Empty State */}
          {decks.length === 0 && (
            <div className="text-center py-12 lg:py-24">
              <BookOpen className="w-16 h-16 lg:w-24 lg:h-24 text-muted-foreground mx-auto mb-4 lg:mb-8" />
              <h3 className="text-xl lg:text-3xl font-medium text-foreground mb-2 lg:mb-4">Nenhum deck encontrado</h3>
              <p className="text-muted-foreground mb-6 lg:mb-12 lg:text-lg">
                Crie seu primeiro deck de flashcards para começar a estudar
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons Fixed at Bottom */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 lg:p-8 mt-auto">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 justify-center">
              <Button 
                onClick={onCreateDeck}
                size="lg" 
                className="gap-2 lg:gap-4 flex-1 sm:flex-initial sm:min-w-[200px] lg:min-w-[300px] lg:h-16 lg:text-lg"
              >
                <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
                Criar Novo Deck
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 lg:gap-4 border-primary text-primary flex-1 sm:flex-initial sm:min-w-[200px] lg:min-w-[300px] lg:h-16 lg:text-lg"
                onClick={() => onNavigate('flashcard-study')}
              >
                <Play className="w-5 h-5 lg:w-6 lg:h-6" />
                Sessão de Revisão Rápida
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
      />
    </div>
  );
}