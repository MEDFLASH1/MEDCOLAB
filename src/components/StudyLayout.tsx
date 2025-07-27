import { useState, useEffect } from 'react';
import { Search, FolderOpen, BookOpen, TrendingUp, Clock, Filter, Settings, ArrowLeft, Brain, Plus, Eye, BarChart3, Target, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { FlashcardStudy } from './FlashcardStudy';
import { mockFolders } from '../data/mockFolders';

interface StudyLayoutProps {
  onNavigate: (page: string) => void;
  selectedDeckId?: string | null;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  totalCards: number;
  masteredCards: number;
  category: string;
  icon: string;
  color: string;
  lastStudied?: string;
}

export function StudyLayout({ onNavigate, selectedDeckId }: StudyLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentStudyDeck, setCurrentStudyDeck] = useState<string | null>(selectedDeckId || null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar decks desde localStorage y combinar con mock data
  useEffect(() => {
    const loadDecks = () => {
      try {
        const savedDecks = JSON.parse(localStorage.getItem('medflashcard-decks') || '[]');
        
        // Convertir decks guardados
        const userDecks: Deck[] = savedDecks.map((savedDeck: any) => ({
          id: savedDeck.id,
          name: savedDeck.name,
          description: savedDeck.description || 'Deck criado pelo usuário',
          totalCards: savedDeck.cards?.length || 0,
          masteredCards: 0,
          category: 'Meus Decks',
          icon: '📚',
          color: 'bg-blue-100 border-blue-200',
          lastStudied: 'Criado recentemente'
        }));

        // Convertir folders mock a decks
        const mockDecks: Deck[] = mockFolders.map(folder => ({
          id: folder.id,
          name: folder.name,
          description: folder.description,
          totalCards: folder.cardCount || 0,
          masteredCards: folder.masteredCount || 0,
          category: folder.name,
          icon: folder.icon,
          color: folder.color,
          lastStudied: '2 horas atrás'
        }));

        // Agregar decks individuales mock adicionales
        const additionalMockDecks: Deck[] = [
          {
            id: 'mock-1',
            name: 'Cardiologia Básica',
            description: 'Fundamentos de anatomia e fisiologia cardiovascular',
            totalCards: 45,
            masteredCards: 32,
            category: 'Cardiologia',
            icon: '🫀',
            color: 'bg-red-100 border-red-200',
            lastStudied: '2 horas atrás'
          },
          {
            id: 'mock-2',
            name: 'Neurologia Clínica',
            description: 'Principais patologias do sistema nervoso',
            totalCards: 67,
            masteredCards: 23,
            category: 'Neurologia',
            icon: '🧠',
            color: 'bg-purple-100 border-purple-200',
            lastStudied: '1 dia atrás'
          },
          {
            id: 'mock-3',
            name: 'Farmacologia Geral',
            description: 'Princípios gerais de farmacologia médica',
            totalCards: 89,
            masteredCards: 78,
            category: 'Farmacologia',
            icon: '💊',
            color: 'bg-blue-100 border-blue-200',
            lastStudied: '3 horas atrás'
          },
          {
            id: 'mock-4',
            name: 'Anatomia Sistêmica',
            description: 'Estruturas e sistemas do corpo humano',
            totalCards: 156,
            masteredCards: 98,
            category: 'Anatomia',
            icon: '🦴',
            color: 'bg-green-100 border-green-200',
            lastStudied: '5 horas atrás'
          },
          {
            id: 'mock-5',
            name: 'Fisiologia Avançada',
            description: 'Mecanismos fisiológicos complexos',
            totalCards: 78,
            masteredCards: 45,
            category: 'Fisiologia',
            icon: '⚡',
            color: 'bg-yellow-100 border-yellow-200',
            lastStudied: '1 dia atrás'
          },
          {
            id: 'mock-6',
            name: 'Patologia Geral',
            description: 'Processos patológicos fundamentais',
            totalCards: 134,
            masteredCards: 67,
            category: 'Patologia',
            icon: '🔬',
            color: 'bg-indigo-100 border-indigo-200',
            lastStudied: '2 dias atrás'
          }
        ];

        const allDecks = [...userDecks, ...mockDecks, ...additionalMockDecks];
        setDecks(allDecks);
      } catch (error) {
        console.error('Error loading decks:', error);
      }
    };

    loadDecks();
    
    // Listen for deck updates
    const handleStorageChange = () => loadDecks();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('decksUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('decksUpdated', handleStorageChange);
    };
  }, []);

  // Si es mobile, renderizar solo FlashcardStudy en full screen
  if (isMobile) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <FlashcardStudy onNavigate={onNavigate} selectedDeckId={currentStudyDeck} />
      </div>
    );
  }

  // Filtrar decks
  const filteredDecks = decks.filter(deck => {
    const matchesSearch = deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deck.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || deck.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = ['all', ...Array.from(new Set(decks.map(deck => deck.category)))];

  // Estadísticas generales
  const totalCards = decks.reduce((sum, deck) => sum + deck.totalCards, 0);
  const totalMastered = decks.reduce((sum, deck) => sum + deck.masteredCards, 0);
  const overallProgress = totalCards > 0 ? (totalMastered / totalCards) * 100 : 0;

  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden">
      {/* Sidebar izquierdo - Más ancho para desktop */}
      <div className="w-96 bg-card border-r border-border flex flex-col shadow-lg">
        {/* Header del sidebar */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Área de Estudo</h2>
                <p className="text-sm text-muted-foreground">Selecione um deck para começar</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="hover:bg-muted rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Búsqueda */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <BookOpen className="w-4 h-4 text-primary mr-1" />
                <span className="font-bold text-primary">{decks.length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Decks</div>
            </div>
            <div className="bg-secondary/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-secondary mr-1" />
                <span className="font-bold text-secondary">{totalCards}</span>
              </div>
              <div className="text-xs text-muted-foreground">Cards</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="font-bold text-green-600">{Math.round(overallProgress)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">Progresso</div>
            </div>
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Categorías</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs h-8"
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de decks */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredDecks.map((deck) => {
              const progress = deck.totalCards > 0 ? (deck.masteredCards / deck.totalCards) * 100 : 0;
              const isActive = deck.id === currentStudyDeck;
              
              return (
                <Card 
                  key={deck.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                    isActive ? 'ring-2 ring-primary shadow-lg bg-primary/5' : ''
                  }`}
                  onClick={() => setCurrentStudyDeck(deck.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{deck.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm truncate">{deck.name}</h3>
                          {isActive && (
                            <Badge variant="default" className="bg-primary text-xs px-2 py-0">
                              Atual
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {deck.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {deck.masteredCards}/{deck.totalCards} dominados
                            </span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline" className={`text-xs ${deck.color}`}>
                            {deck.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{deck.lastStudied || 'Nunca'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredDecks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Nenhum deck encontrado</p>
                <p className="text-xs mt-1">Tente ajustar os filtros ou criar um novo deck</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Botões de ação */}
        <div className="p-4 border-t border-border bg-muted/30 space-y-3">
          <Button 
            onClick={() => onNavigate('create')}
            className="w-full gap-2 h-10"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Criar Novo Deck
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="flex-1 gap-2 h-9"
              size="sm"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="flex-1 gap-2 h-9"
              size="sm"
            >
              <Settings className="w-4 h-4" />
              Config
            </Button>
          </div>
        </div>
      </div>

      {/* Área principal de estudio - Siempre mostrar FlashcardStudy */}
      <div className="flex-1 overflow-hidden">
        <FlashcardStudy 
          onNavigate={onNavigate} 
          selectedDeckId={currentStudyDeck}
        />
      </div>
    </div>
  );
}