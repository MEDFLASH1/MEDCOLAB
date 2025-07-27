import { useState, useRef, useCallback } from 'react';
import { Brain, LayoutDashboard, Plus, GraduationCap, Menu, X, Type, Image as ImageIcon, Move, Edit3, Trash2, Download, Upload, Save, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, RotateCw, ZoomIn, ZoomOut, Grid, Layers } from 'lucide-react';
import { LoginDialog } from './LoginDialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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

interface CanvasPrototypeProps {
  onNavigate: (page: 'landing' | 'dashboard' | 'study' | 'deck' | 'create' | 'canvas') => void;
  onLogoClick: () => void;
}

export function CanvasPrototype({ onNavigate, onLogoClick }: CanvasPrototypeProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'image'>('select');
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTextElement = useCallback(() => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'text',
      x: 200,
      y: 200,
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
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    setTool('select');
  }, []);

  const addImageElement = useCallback((imageUrl: string) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'image',
      x: 300,
      y: 150,
      width: 200,
      height: 150,
      content: imageUrl,
      style: {
        borderRadius: 8,
        opacity: 1,
        rotation: 0
      }
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    setTool('select');
  }, []);

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
    if (tool === 'text') {
      addTextElement();
    } else if (tool === 'image') {
      fileInputRef.current?.click();
    }
  };

  const handleElementMouseDown = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElement(elementId);
    setDraggedElement(elementId);
    
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setDragOffset({
        x: event.clientX - element.x,
        y: event.clientY - element.y
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggedElement) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const newX = event.clientX - canvasRect.left - dragOffset.x;
        const newY = event.clientY - canvasRect.top - dragOffset.y;
        
        setElements(prev => prev.map(el => 
          el.id === draggedElement 
            ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
            : el
        ));
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const updateElement = (elementId: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Dark Bar */}
      <div className="py-2 px-6 bg-foreground">
        <div className="max-w-7xl mx-auto text-sm">
          <span className="text-gray-300">🎨 Canvas Protótipo - MedFlashcard</span>
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

      <div className="flex h-[calc(100vh-120px)]">
        {/* Toolbar Lateral */}
        <div className="w-80 bg-card border-r p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Ferramentas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ferramentas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
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
                    variant={tool === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('image')}
                    className="gap-1"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Imagem
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Upload className="w-4 h-4" />
                    Importar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Controles do Canvas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Canvas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Zoom: {zoom}%</Label>
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Slider
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      min={25}
                      max={200}
                      step={25}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={showGrid ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                    className="gap-1"
                  >
                    <Grid className="w-4 h-4" />
                    Grade
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Layers className="w-4 h-4" />
                    Camadas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Propriedades do Elemento Selecionado */}
            {selectedEl && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Propriedades</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteElement(selectedEl.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Conteúdo</TabsTrigger>
                      <TabsTrigger value="style">Estilo</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4 mt-4">
                      {selectedEl.type === 'text' ? (
                        <div className="space-y-2">
                          <Label>Texto</Label>
                          <Textarea
                            value={selectedEl.content}
                            onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                            placeholder="Digite o texto..."
                            className="min-h-[80px]"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>URL da Imagem</Label>
                          <Input
                            value={selectedEl.content}
                            onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label>Largura</Label>
                          <Input
                            type="number"
                            value={selectedEl.width}
                            onChange={(e) => updateElement(selectedEl.id, { width: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Altura</Label>
                          <Input
                            type="number"
                            value={selectedEl.height}
                            onChange={(e) => updateElement(selectedEl.id, { height: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="style" className="space-y-4 mt-4">
                      {selectedEl.type === 'text' && (
                        <>
                          <div className="space-y-2">
                            <Label>Tamanho da Fonte</Label>
                            <Slider
                              value={[selectedEl.style.fontSize || 16]}
                              onValueChange={(value) => updateElement(selectedEl.id, { 
                                style: { ...selectedEl.style, fontSize: value[0] }
                              })}
                              min={8}
                              max={72}
                              step={1}
                            />
                            <div className="text-sm text-muted-foreground text-center">
                              {selectedEl.style.fontSize || 16}px
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Cor do Texto</Label>
                            <Input
                              type="color"
                              value={selectedEl.style.color || '#170b3b'}
                              onChange={(e) => updateElement(selectedEl.id, { 
                                style: { ...selectedEl.style, color: e.target.value }
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Formatação</Label>
                            <div className="flex gap-1">
                              <Button
                                variant={selectedEl.style.fontWeight === 'bold' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateElement(selectedEl.id, { 
                                  style: { 
                                    ...selectedEl.style, 
                                    fontWeight: selectedEl.style.fontWeight === 'bold' ? 'normal' : 'bold'
                                  }
                                })}
                              >
                                <Bold className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={selectedEl.style.fontStyle === 'italic' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateElement(selectedEl.id, { 
                                  style: { 
                                    ...selectedEl.style, 
                                    fontStyle: selectedEl.style.fontStyle === 'italic' ? 'normal' : 'italic'
                                  }
                                })}
                              >
                                <Italic className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={selectedEl.style.textDecoration === 'underline' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateElement(selectedEl.id, { 
                                  style: { 
                                    ...selectedEl.style, 
                                    textDecoration: selectedEl.style.textDecoration === 'underline' ? 'none' : 'underline'
                                  }
                                })}
                              >
                                <Underline className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Alinhamento</Label>
                            <div className="flex gap-1">
                              <Button
                                variant={selectedEl.style.textAlign === 'left' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateElement(selectedEl.id, { 
                                  style: { ...selectedEl.style, textAlign: 'left' }
                                })}
                              >
                                <AlignLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={selectedEl.style.textAlign === 'center' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateElement(selectedEl.id, { 
                                  style: { ...selectedEl.style, textAlign: 'center' }
                                })}
                              >
                                <AlignCenter className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={selectedEl.style.textAlign === 'right' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateElement(selectedEl.id, { 
                                  style: { ...selectedEl.style, textAlign: 'right' }
                                })}
                              >
                                <AlignRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="space-y-2">
                        <Label>Opacidade</Label>
                        <Slider
                          value={[(selectedEl.style.opacity || 1) * 100]}
                          onValueChange={(value) => updateElement(selectedEl.id, { 
                            style: { ...selectedEl.style, opacity: value[0] / 100 }
                          })}
                          min={0}
                          max={100}
                          step={1}
                        />
                        <div className="text-sm text-muted-foreground text-center">
                          {Math.round((selectedEl.style.opacity || 1) * 100)}%
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Rotação</Label>
                        <Slider
                          value={[selectedEl.style.rotation || 0]}
                          onValueChange={(value) => updateElement(selectedEl.id, { 
                            style: { ...selectedEl.style, rotation: value[0] }
                          })}
                          min={-180}
                          max={180}
                          step={1}
                        />
                        <div className="text-sm text-muted-foreground text-center">
                          {selectedEl.style.rotation || 0}°
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Canvas Principal */}
        <div className="flex-1 bg-muted/30 relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Canvas Protótipo</Badge>
              <Badge variant="outline">{elements.length} elementos</Badge>
            </div>
          </div>
          
          <div 
            ref={canvasRef}
            className="w-full h-full relative cursor-crosshair"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              backgroundImage: showGrid ? 
                'radial-gradient(circle, #ccc 1px, transparent 1px)' : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'none'
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Elementos do Canvas */}
            {elements.map((element) => (
              <div
                key={element.id}
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
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Mensagem de Estado Vazio */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Palette className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Canvas Vazio</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Clique nas ferramentas à esquerda para adicionar texto ou imagens ao seu canvas.
                      Use a ferramenta de seleção para mover e editar elementos.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input oculto para upload de imagens */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Login Dialog */}
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
      />
    </div>
  );
}