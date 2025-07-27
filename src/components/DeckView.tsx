import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Calendar, Brain, Menu, X, LayoutDashboard, GraduationCap } from 'lucide-react';
import { LoginDialog } from './LoginDialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface DeckViewProps {
  deckId: string;
  onNavigate: (page: 'landing' | 'dashboard' | 'study' | 'deck' | 'create') => void;
  onLogoClick: () => void;
}

interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  reviewCount: number;
  lastReviewed?: Date;
}

export function DeckView({ deckId, onNavigate, onLogoClick }: DeckViewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Mock data
  const deck = {
    id: deckId,
    name: 'Anatomia Cardíaca',
    description: 'Sistema cardiovascular e estruturas do coração',
    cardCount: 120,
    masteredCards: 85,
    color: 'bg-red-100',
    lastStudied: new Date('2024-01-20')
  };

  const cards: FlashCard[] = [
    {
      id: '1',
      front: 'Qual é a função principal do ventrículo esquerdo?',
      back: 'Bombear sangue oxigenado para todo o corpo através da aorta, mantendo a circulação sistêmica.',
      difficulty: 2,
      reviewCount: 3,
      lastReviewed: new Date('2024-01-19')
    },
    {
      id: '2',
      front: 'Quais são as quatro câmaras do coração?',
      back: 'Átrio direito, ventrículo direito, átrio esquerdo e ventrículo esquerdo.',
      difficulty: 1,
      reviewCount: 5,
      lastReviewed: new Date('2024-01-18')
    },
    {
      id: '3',
      front: 'O que são as valvas semilunares?',
      back: 'São as valvas aórtica e pulmonar, que impedem o refluxo de sangue dos grandes vasos para os ventrículos.',
      difficulty: 4,
      reviewCount: 1,
      lastReviewed: new Date('2024-01-17')
    }
  ];

  const progress = deck.cardCount > 0 ? (deck.masteredCards / deck.cardCount) * 100 : 0;
  
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 4:
      case 5:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return 'Fácil';
      case 3:
        return 'Médio';
      case 4:
      case 5:
        return 'Difícil';
      default:
        return 'Não avaliado';
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-white">MedFlashcard</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
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
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-white/20"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/20 bg-gradient-to-r from-primary to-secondary">
              <div className="px-6 py-4 space-y-2">
                <Button 
                  variant="ghost"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full justify-start gap-2 text-white hover:bg-white/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Painel
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => onNavigate('create')}
                  className="w-full justify-start gap-2 text-white hover:bg-white/20"
                >
                  <Plus className="w-4 h-4" />
                  Criar
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setLoginOpen(true)}
                  className="w-full justify-start gap-2 text-white hover:bg-white/20"
                >
                  <GraduationCap className="w-4 h-4" />
                  Área do aluno
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Deck Header */}
      <div className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('dashboard')}
                className="text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary"></div>
                <div>
                  <h1 className="text-foreground mb-1">{deck.name}</h1>
                  <p className="text-muted-foreground">{deck.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4" />
                Adicionar Card
              </Button>
              <Button 
                onClick={() => onNavigate('study')}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <BookOpen className="w-4 h-4" />
                Estudar Deck
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Deck Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{deck.cardCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Dominados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{deck.masteredCards}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
              <Progress value={progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Último Estudo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {deck.lastStudied ? deck.lastStudied.toLocaleDateString('pt-BR') : 'Nunca'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cards do Deck</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4" />
                Novo Card
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {cards.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum card encontrado neste deck.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 gap-2 border-primary text-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar primeiro card
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {cards.map((card, index) => (
                  <div key={card.id} className="p-4 hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">#{index + 1}</span>
                          <Badge 
                            variant="secondary" 
                            className={getDifficultyColor(card.difficulty)}
                          >
                            {getDifficultyLabel(card.difficulty)}
                          </Badge>
                          {card.reviewCount > 0 && (
                            <Badge variant="outline">
                              {card.reviewCount} revisões
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Pergunta</div>
                            <div className="font-medium text-foreground">{card.front}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Resposta</div>
                            <div className="text-muted-foreground">{card.back}</div>
                          </div>
                        </div>
                        {card.lastReviewed && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            Última revisão: {card.lastReviewed.toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Login Dialog */}
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
      />
    </div>
  );
}