import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Plus, Save, Trash2, Edit3, Brain, LayoutDashboard, GraduationCap, Video, Palette, Type, Image as ImageIcon, Move, Upload, FlipHorizontal, Front, Back } from 'lucide-react';
import { LoginDialog } from './LoginDialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { VideoManager, VideoContent } from './VideoManager';

interface CanvasElement {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    borderRadius?: number;
    opacity?: number;
    rotation?: number;
  };
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  videos: VideoContent[];
  frontCanvasElements: CanvasElement[];
  backCanvasElements: CanvasElement[];
}

interface CreateDeckProps {
  onNavigate: (page: 'landing' | 'dashboard' | 'study' | 'deck' | 'create', deckId?: string) => void;
  onLogoClick?: () => void;
  onDeckCreated?: () => void;
}

export function CreateDeck({ onNavigate, onLogoClick, onDeckCreated }: CreateDeckProps) {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard>({
    id: '',
    front: '',
    back: '',
    videos: [],
    frontCanvasElements: [],
    backCanvasElements: []
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Canvas state
  const [activeCanvasSide, setActiveCanvasSide] = useState<'front' | 'back'>('front');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'image'>('select');
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingTextPosition, setEditingTextPosition] = useState({ x: 0, y: 0 });
  const [editingTextValue, setEditingTextValue] = useState('');
  const frontCanvasRef = useRef<HTMLDivElement>(null);
  const backCanvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const getCurrentCanvasElements = () => {
    return activeCanvasSide === 'front' ? currentCard.frontCanvasElements : currentCard.backCanvasElements;
  };

  const updateCanvasElements = (elements: CanvasElement[]) => {
    setCurrentCard(prev => ({
      ...prev,
      [activeCanvasSide === 'front' ? 'frontCanvasElements' : 'backCanvasElements']: elements
    }));
  };

  const getCurrentCanvasRef = () => {
    return activeCanvasSide === 'front' ? frontCanvasRef : backCanvasRef;
  };

  const addCard = () => {
    if (currentCard.front && currentCard.back) {
      const newCard = {
        ...currentCard,
        id: Date.now().toString()
      };
      
      if (editingIndex !== null) {
        const updatedCards = [...cards];
        updatedCards[editingIndex] = newCard;
        setCards(updatedCards);
        setEditingIndex(null);
      } else {
        setCards([...cards, newCard]);
      }
      
      setCurrentCard({ 
        id: '', 
        front: '', 
        back: '', 
        videos: [], 
        frontCanvasElements: [], 
        backCanvasElements: [] 
      });
    }
  };

  const editCard = (index: number) => {
    setCurrentCard(cards[index]);
    setEditingIndex(index);
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const cancelEdit = () => {
    setCurrentCard({ 
      id: '', 
      front: '', 
      back: '', 
      videos: [], 
      frontCanvasElements: [], 
      backCanvasElements: [] 
    });
    setEditingIndex(null);
  };

  const saveDeck = async () => {
    console.log('Tentando salvar deck:', { 
      deckName, 
      cardsLength: cards.length, 
      hasOnDeckCreated: !!onDeckCreated 
    });
    
    if (deckName && cards.length > 0) {
      setIsSaving(true);
      
      try {
        console.log('Deck salvo com sucesso:', { 
          name: deckName, 
          description: deckDescription, 
          cards: cards.length,
          totalCanvasElements: cards.reduce((acc, card) => 
            acc + (card.frontCanvasElements?.length || 0) + (card.backCanvasElements?.length || 0), 0
          )
        });
        
        // Simular salvamento local
        const deckData = {
          id: Date.now().toString(),
          name: deckName,
          description: deckDescription,
          cards: cards,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Guardar en localStorage como backup
        const existingDecks = JSON.parse(localStorage.getItem('medflashcard-decks') || '[]');
        existingDecks.push(deckData);
        localStorage.setItem('medflashcard-decks', JSON.stringify(existingDecks));
        console.log('Deck guardado en localStorage');
        
        // Disparar evento para notificar que los decks se actualizaron
        window.dispatchEvent(new Event('decksUpdated'));
        
        // Mostrar mensaje de éxito
        setSaveSuccess(true);
        
        // Simular tiempo de guardado
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (onDeckCreated) {
          onDeckCreated();
        } else {
          onNavigate('dashboard');
        }
        
      } catch (error) {
        console.error('Error guardando deck:', error);
      } finally {
        setIsSaving(false);
        setSaveSuccess(false);
      }
    } else {
      console.warn('No se puede salvar el deck:', {
        hasName: !!deckName,
        hasCards: cards.length > 0,
        deckName,
        cardsCount: cards.length
      });
    }
  };

  const handleAddVideo = (video: VideoContent) => {
    setCurrentCard(prev => ({
      ...prev,
      videos: [...prev.videos, video]
    }));
  };

  const handleRemoveVideo = (videoId: string) => {
    setCurrentCard(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v.id !== videoId)
    }));
  };

  const handleUpdateVideo = (videoId: string, updates: Partial<VideoContent>) => {
    setCurrentCard(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === videoId ? { ...v, ...updates } : v)
    }));
  };

  const addTextElement = useCallback(() => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      content: 'Texto de exemplo',
      style: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#170b3b',
        backgroundColor: 'transparent',
        textAlign: 'left',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0
      }
    };
    
    const currentElements = getCurrentCanvasElements();
    updateCanvasElements([...currentElements, newElement]);
    setSelectedElement(newElement.id);
    setTool('select');
  }, [activeCanvasSide, currentCard]);

  const startTextEditingAtPosition = useCallback((x: number, y: number) => {
    setIsEditingText(true);
    setEditingTextPosition({ x: Math.max(0, x - 5), y: Math.max(0, y - 5) });
    setEditingTextValue('');
    
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 10);
  }, []);

  const finishTextEditing = useCallback(() => {
    if (editingTextValue.trim()) {
      const newElement: CanvasElement = {
        id: Date.now().toString(),
        type: 'text',
        x: editingTextPosition.x,
        y: editingTextPosition.y,
        width: Math.max(200, editingTextValue.length * 8),
        height: 50,
        content: editingTextValue.trim(),
        style: {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#170b3b',
          backgroundColor: 'transparent',
          textAlign: 'left',
          fontStyle: 'normal',
          textDecoration: 'none',
          opacity: 1,
          rotation: 0
        }
      };
      
      const currentElements = getCurrentCanvasElements();
      updateCanvasElements([...currentElements, newElement]);
      setSelectedElement(newElement.id);
    }
    
    setIsEditingText(false);
    setEditingTextValue('');
    setTool('select');
  }, [editingTextValue, editingTextPosition, activeCanvasSide]);

  const handleTextInputKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      finishTextEditing();
    } else if (event.key === 'Escape') {
      setIsEditingText(false);
      setEditingTextValue('');
      setTool('select');
    }
  }, [finishTextEditing]);

  const addImageElement = useCallback((imageUrl: string) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'image',
      x: 150,
      y: 100,
      width: 200,
      height: 150,
      content: imageUrl,
      style: {
        borderRadius: 8,
        opacity: 1,
        rotation: 0
      }
    };
    
    const currentElements = getCurrentCanvasElements();
    updateCanvasElements([...currentElements, newElement]);
    setSelectedElement(newElement.id);
    setTool('select');
  }, [activeCanvasSide]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        addImageElement(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-canvas-element]')) {
      return;
    }

    if (isEditingText) {
      finishTextEditing();
      return;
    }
    
    if (tool === 'text') {
      const canvasRect = getCurrentCanvasRef().current?.getBoundingClientRect();
      if (canvasRect) {
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        startTextEditingAtPosition(x, y);
      }
    } else if (tool === 'image') {
      fileInputRef.current?.click();
    }
  };

  const handleElementMouseDown = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElement(elementId);
    setDraggedElement(elementId);
    
    const currentElements = getCurrentCanvasElements();
    const element = currentElements.find(el => el.id === elementId);
    if (element) {
      setDragOffset({
        x: event.clientX - element.x,
        y: event.clientY - element.y
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggedElement) {
      const canvasRect = getCurrentCanvasRef().current?.getBoundingClientRect();
      if (canvasRect) {
        const newX = event.clientX - canvasRect.left - dragOffset.x;
        const newY = event.clientY - canvasRect.top - dragOffset.y;
        
        const currentElements = getCurrentCanvasElements();
        const updatedElements = currentElements.map(el => 
          el.id === draggedElement 
            ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
            : el
        );
        updateCanvasElements(updatedElements);
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const deleteElement = (elementId: string) => {
    const currentElements = getCurrentCanvasElements();
    const updatedElements = currentElements.filter(el => el.id !== elementId);
    updateCanvasElements(updatedElements);
    setSelectedElement(null);
  };

  const handleCanvasSideChange = (side: 'front' | 'back') => {
    setActiveCanvasSide(side);
    setSelectedElement(null);
    setTool('select');
    setIsEditingText(false);
    setEditingTextValue('');
  };

  const currentElements = getCurrentCanvasElements();
  const selectedEl = currentElements.find(el => el.id === selectedElement);

  const totalCanvasElements = currentCard.frontCanvasElements.length + currentCard.backCanvasElements.length;

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
                className="gap-2 text-white hover:bg-white/20"
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Deck Info Top Row */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Informações do Deck</CardTitle>
              <div className="flex items-center gap-2">
                {deckName && cards.length > 0 ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    ✓ Pronto para salvar
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Em progresso
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="deck-name">Nome do Deck</Label>
              <Input
                id="deck-name"
                placeholder="Ex: Cardiologia Básica"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deck-description">Descrição</Label>
              <Textarea
                id="deck-description"
                placeholder="Descreva o conteúdo deste deck..."
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total de cards:</span>
                  <Badge variant="secondary">{cards.length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Cards com vídeo:</span>
                  <Badge variant="secondary">
                    {cards.filter(card => card.videos.length > 0).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Cards com lienzo:</span>
                  <Badge variant="secondary">
                    {cards.filter(card => (card.frontCanvasElements?.length || 0) + (card.backCanvasElements?.length || 0) > 0).length}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {(!deckName || cards.length === 0) && (
                <div className="text-xs text-muted-foreground space-y-1">
                  {!deckName && <div>• Adicione um nome para o deck</div>}
                  {cards.length === 0 && <div>• Crie pelo menos um flashcard</div>}
                </div>
              )}
              <Button
                onClick={saveDeck}
                disabled={!deckName || cards.length === 0 || isSaving}
                className="w-full gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {saveSuccess ? 'Salvo!' : 'Salvando...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Deck
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>
                {editingIndex !== null ? 'Editar Flashcard' : 'Criar Novo Flashcard'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-front">Frente do Card (Pergunta)</Label>
                  <Textarea
                    id="card-front"
                    placeholder="Ex: Qual é a estrutura anatômica responsável pela contração do coração?"
                    value={currentCard.front}
                    onChange={(e) => setCurrentCard({ ...currentCard, front: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="card-back">Verso do Card (Resposta)</Label>
                  <Textarea
                    id="card-back"
                    placeholder="Ex: O miocárdio é o tecido muscular cardíaco responsável pela contração..."
                    value={currentCard.back}
                    onChange={(e) => setCurrentCard({ ...currentCard, back: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              {/* Videos Section */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="w-4 h-4" />
                  <Label>Vídeos ({currentCard.videos.length})</Label>
                </div>
                <VideoManager
                  videos={currentCard.videos}
                  onAddVideo={handleAddVideo}
                  onRemoveVideo={handleRemoveVideo}
                  onUpdateVideo={handleUpdateVideo}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t">
                {(!currentCard.front || !currentCard.back) && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {!currentCard.front && <div>• Adicione texto na frente do card</div>}
                    {!currentCard.back && <div>• Adicione texto no verso do card</div>}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  {editingIndex !== null && (
                    <Button variant="outline" onClick={cancelEdit}>
                      Cancelar
                    </Button>
                  )}
                  <Button
                    onClick={addCard}
                    disabled={!currentCard.front || !currentCard.back}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {editingIndex !== null ? 'Salvar Alterações' : 'Adicionar Card'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Dual Canvas */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  <CardTitle>Lienzo Visual ({totalCanvasElements} elementos)</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Frente: {currentCard.frontCanvasElements.length}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Verso: {currentCard.backCanvasElements.length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Canvas Side Selector */}
              <Tabs value={activeCanvasSide} onValueChange={handleCanvasSideChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="front" className="gap-2">
                    <div className="w-4 h-4 border-2 border-current rounded-sm bg-current/20" />
                    Frente ({currentCard.frontCanvasElements.length})
                  </TabsTrigger>
                  <TabsTrigger value="back" className="gap-2">
                    <FlipHorizontal className="w-4 h-4" />
                    Verso ({currentCard.backCanvasElements.length})
                  </TabsTrigger>
                </TabsList>

                {/* Canvas Tools */}
                <div className="flex gap-2 p-4 bg-muted/50 rounded-lg mt-4">
                  <Button
                    variant={tool === 'select' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('select')}
                    className="gap-1"
                  >
                    <Move className="w-4 h-4" />
                    Mover
                  </Button>
                  <Button
                    variant={tool === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('text')}
                    className="gap-1"
                  >
                    <Type className="w-4 h-4" />
                    Texto
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTextElement}
                    className="gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    + Texto
                  </Button>
                  <Button
                    variant={tool === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('image')}
                    className="gap-1"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Imagen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1"
                  >
                    <Upload className="w-4 h-4" />
                    Subir
                  </Button>
                </div>

                <TabsContent value="front" className="mt-4">
                  <div className="relative">
                    <div 
                      ref={frontCanvasRef}
                      className={`w-full h-96 bg-white border border-border rounded-lg relative overflow-hidden ${
                        tool === 'text' ? 'cursor-text' : 
                        tool === 'image' ? 'cursor-copy' : 
                        'cursor-default'
                      } ${tool === 'text' ? 'border-blue-300' : ''}`}
                      style={{
                        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                      onClick={handleCanvasClick}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {/* Canvas Content */}
                      {tool === 'text' && !isEditingText && (
                        <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs pointer-events-none">
                          💬 Haz clic para escribir texto
                        </div>
                      )}
                      
                      {/* Canvas Label */}
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs pointer-events-none">
                        Frente
                      </div>

                      {isEditingText && activeCanvasSide === 'front' && (
                        <textarea
                          ref={textInputRef}
                          value={editingTextValue}
                          onChange={(e) => setEditingTextValue(e.target.value)}
                          onKeyDown={handleTextInputKeyDown}
                          onBlur={finishTextEditing}
                          className="absolute z-10 bg-white border-2 border-primary rounded px-2 py-1 resize-none outline-none"
                          style={{
                            left: editingTextPosition.x,
                            top: editingTextPosition.y,
                            minWidth: '200px',
                            minHeight: '40px',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            color: '#170b3b'
                          }}
                          placeholder="Escribe tu texto..."
                        />
                      )}

                      {currentCard.frontCanvasElements.map((element) => (
                        <div
                          key={element.id}
                          data-canvas-element="true"
                          className={`absolute cursor-move border-2 transition-all ${
                            selectedElement === element.id 
                              ? 'border-primary border-dashed' 
                              : 'border-transparent hover:border-primary/50'
                          }`}
                          style={{
                            left: element.x,
                            top: element.y,
                            width: element.width,
                            height: element.height,
                            transform: `rotate(${element.style.rotation || 0}deg)`,
                            opacity: element.style.opacity || 1
                          }}
                          onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                        >
                          {element.type === 'text' ? (
                            <div
                              className="w-full h-full p-2 break-words"
                              style={{
                                fontSize: element.style.fontSize || 16,
                                fontWeight: element.style.fontWeight || 'normal',
                                color: element.style.color || '#170b3b',
                                backgroundColor: element.style.backgroundColor || 'transparent',
                                textAlign: element.style.textAlign || 'left',
                                fontStyle: element.style.fontStyle || 'normal',
                                textDecoration: element.style.textDecoration || 'none',
                                borderRadius: element.style.borderRadius || 0
                              }}
                            >
                              {element.content}
                            </div>
                          ) : (
                            <img
                              src={element.content}
                              alt="Canvas element"
                              className="w-full h-full object-cover"
                              style={{
                                borderRadius: element.style.borderRadius || 0
                              }}
                              draggable={false}
                            />
                          )}
                          
                          {selectedElement === element.id && (
                            <div className="absolute -top-2 -right-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-6 h-6 p-0 bg-background border-primary"
                                onClick={() => deleteElement(element.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {currentCard.frontCanvasElements.length === 0 && !isEditingText && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                              <Palette className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground mb-2">Frente del Card</h3>
                              <p className="text-muted-foreground text-sm">
                                Selecciona "Texto" y haz clic para escribir
                              </p>
                              <p className="text-muted-foreground text-xs mt-1">
                                O usa las herramientas para agregar imágenes
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="back" className="mt-4">
                  <div className="relative">
                    <div 
                      ref={backCanvasRef}
                      className={`w-full h-96 bg-white border border-border rounded-lg relative overflow-hidden ${
                        tool === 'text' ? 'cursor-text' : 
                        tool === 'image' ? 'cursor-copy' : 
                        'cursor-default'
                      } ${tool === 'text' ? 'border-blue-300' : ''}`}
                      style={{
                        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                      onClick={handleCanvasClick}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {/* Canvas Content */}
                      {tool === 'text' && !isEditingText && (
                        <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs pointer-events-none">
                          💬 Haz clic para escribir texto
                        </div>
                      )}
                      
                      {/* Canvas Label */}
                      <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs pointer-events-none">
                        Verso
                      </div>

                      {isEditingText && activeCanvasSide === 'back' && (
                        <textarea
                          ref={textInputRef}
                          value={editingTextValue}
                          onChange={(e) => setEditingTextValue(e.target.value)}
                          onKeyDown={handleTextInputKeyDown}
                          onBlur={finishTextEditing}
                          className="absolute z-10 bg-white border-2 border-primary rounded px-2 py-1 resize-none outline-none"
                          style={{
                            left: editingTextPosition.x,
                            top: editingTextPosition.y,
                            minWidth: '200px',
                            minHeight: '40px',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            color: '#170b3b'
                          }}
                          placeholder="Escribe tu texto..."
                        />
                      )}

                      {currentCard.backCanvasElements.map((element) => (
                        <div
                          key={element.id}
                          data-canvas-element="true"
                          className={`absolute cursor-move border-2 transition-all ${
                            selectedElement === element.id 
                              ? 'border-primary border-dashed' 
                              : 'border-transparent hover:border-primary/50'
                          }`}
                          style={{
                            left: element.x,
                            top: element.y,
                            width: element.width,
                            height: element.height,
                            transform: `rotate(${element.style.rotation || 0}deg)`,
                            opacity: element.style.opacity || 1
                          }}
                          onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                        >
                          {element.type === 'text' ? (
                            <div
                              className="w-full h-full p-2 break-words"
                              style={{
                                fontSize: element.style.fontSize || 16,
                                fontWeight: element.style.fontWeight || 'normal',
                                color: element.style.color || '#170b3b',
                                backgroundColor: element.style.backgroundColor || 'transparent',
                                textAlign: element.style.textAlign || 'left',
                                fontStyle: element.style.fontStyle || 'normal',
                                textDecoration: element.style.textDecoration || 'none',
                                borderRadius: element.style.borderRadius || 0
                              }}
                            >
                              {element.content}
                            </div>
                          ) : (
                            <img
                              src={element.content}
                              alt="Canvas element"
                              className="w-full h-full object-cover"
                              style={{
                                borderRadius: element.style.borderRadius || 0
                              }}
                              draggable={false}
                            />
                          )}
                          
                          {selectedElement === element.id && (
                            <div className="absolute -top-2 -right-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-6 h-6 p-0 bg-background border-primary"
                                onClick={() => deleteElement(element.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {currentCard.backCanvasElements.length === 0 && !isEditingText && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
                              <Palette className="w-8 h-8 text-secondary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground mb-2">Verso del Card</h3>
                              <p className="text-muted-foreground text-sm">
                                Selecciona "Texto" y haz clic para escribir
                              </p>
                              <p className="text-muted-foreground text-xs mt-1">
                                O usa las herramientas para agregar imágenes
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Existing Cards List */}
        {cards.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Cards Criados ({cards.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="font-medium text-sm text-muted-foreground">Card #{index + 1}</div>
                      <div className="text-sm">
                        <strong>Frente:</strong> {card.front.substring(0, 60)}
                        {card.front.length > 60 && '...'}
                      </div>
                      <div className="text-sm">
                        <strong>Verso:</strong> {card.back.substring(0, 60)}
                        {card.back.length > 60 && '...'}
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {card.videos.length} vídeos
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            F: {card.frontCanvasElements?.length || 0}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            V: {card.backCanvasElements?.length || 0}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editCard(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCard(index)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}