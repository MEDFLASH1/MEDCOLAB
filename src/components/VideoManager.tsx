import { useState, useRef } from 'react';
import { Plus, X, Play, Link, Upload, Youtube, Video, ExternalLink, Check, FileVideo, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';

export interface VideoContent {
  id: string;
  type: 'youtube' | 'vimeo' | 'mp4' | 'embed' | 'local';
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  file?: File;
  fileSize?: number;
}

interface VideoManagerProps {
  videos: VideoContent[];
  onAddVideo: (video: VideoContent) => void;
  onRemoveVideo: (videoId: string) => void;
  onUpdateVideo: (videoId: string, updates: Partial<VideoContent>) => void;
}

export function VideoManager({ videos, onAddVideo, onRemoveVideo, onUpdateVideo }: VideoManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideo, setNewVideo] = useState<Partial<VideoContent>>({
    type: 'youtube',
    title: '',
    url: '',
    description: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateUrl = (url: string, type: VideoContent['type']) => {
    switch (type) {
      case 'youtube':
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
      case 'vimeo':
        return /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/.test(url);
      case 'mp4':
        return /^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/.test(url);
      case 'embed':
        return /^https?:\/\/.+/.test(url);
      case 'local':
        return true;
      default:
        return false;
    }
  };

  const getVideoThumbnail = (url: string, type: VideoContent['type']) => {
    switch (type) {
      case 'youtube':
        const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeId ? `https://img.youtube.com/vi/${youtubeId[1]}/maxresdefault.jpg` : '';
      case 'vimeo':
        return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop';
      case 'mp4':
        return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=225&fit=crop';
      case 'local':
        return 'https://images.unsplash.com/photo-1598662957477-64d1b4b5027d?w=400&h=225&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Verificar se é um arquivo de vídeo
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione apenas arquivos de vídeo (MP4, WebM, AVI, MOV, etc.)');
      return;
    }

    // Verificar tamanho do arquivo (limite de 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('O arquivo é muito grande. O tamanho máximo permitido é 100MB.');
      return;
    }

    // Criar URL temporário para o arquivo
    const fileUrl = URL.createObjectURL(file);
    
    setNewVideo({
      ...newVideo,
      type: 'local',
      url: fileUrl,
      title: newVideo.title || file.name.replace(/\.[^/.]+$/, ''),
      file: file,
      fileSize: file.size
    });

    setPreviewUrl(fileUrl);
    
    // Simular progresso de upload (instantâneo para arquivos locais)
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.url || !newVideo.type) return;

    if (newVideo.type !== 'local' && !validateUrl(newVideo.url, newVideo.type)) {
      alert('URL inválida para o tipo de vídeo selecionado');
      return;
    }

    const video: VideoContent = {
      id: Date.now().toString(),
      type: newVideo.type as VideoContent['type'],
      url: newVideo.url,
      title: newVideo.title,
      description: newVideo.description || '',
      thumbnail: getVideoThumbnail(newVideo.url, newVideo.type as VideoContent['type']),
      file: newVideo.file,
      fileSize: newVideo.fileSize
    };

    onAddVideo(video);
    setNewVideo({ type: 'youtube', title: '', url: '', description: '' });
    setShowAddForm(false);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const handlePreview = () => {
    if (newVideo.url && newVideo.type !== 'local' && validateUrl(newVideo.url, newVideo.type as VideoContent['type'])) {
      setPreviewUrl(newVideo.url);
    }
  };

  const renderVideoEmbed = (video: VideoContent) => {
    switch (video.type) {
      case 'youtube':
        const youtubeId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeId ? (
          <iframe
            width="100%"
            height="200"
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
            height="200"
            src={`https://player.vimeo.com/video/${vimeoId[1]}`}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
            title={video.title}
          />
        ) : null;
      case 'mp4':
      case 'local':
        return (
          <video
            width="100%"
            height="200"
            controls
            className="rounded-lg"
          >
            <source src={video.url} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        );
      case 'embed':
        return (
          <iframe
            width="100%"
            height="200"
            src={video.url}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
            title={video.title}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Vídeos do Flashcard</h3>
          <p className="text-sm text-muted-foreground">
            Adicione vídeos explicativos para complementar o aprendizado
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Vídeo
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Adicionar Novo Vídeo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={newVideo.type}
              onValueChange={(value) => {
                setNewVideo({ ...newVideo, type: value as VideoContent['type'] });
                setPreviewUrl(null);
                setUploadProgress(0);
              }}
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="local" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Local
                </TabsTrigger>
                <TabsTrigger value="youtube" className="gap-2">
                  <Youtube className="w-4 h-4" />
                  YouTube
                </TabsTrigger>
                <TabsTrigger value="vimeo" className="gap-2">
                  <Video className="w-4 h-4" />
                  Vimeo
                </TabsTrigger>
                <TabsTrigger value="mp4" className="gap-2">
                  <Link className="w-4 h-4" />
                  MP4
                </TabsTrigger>
                <TabsTrigger value="embed" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Outro
                </TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="space-y-4">
                <Alert>
                  <Upload className="w-4 h-4" />
                  <AlertDescription>
                    Faça upload de um vídeo do seu computador (MP4, WebM, AVI, MOV - máximo 100MB)
                  </AlertDescription>
                </Alert>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FileVideo className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    Arraste e solte um vídeo aqui
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    ou clique para selecionar um arquivo
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Selecionar Arquivo
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>

                {newVideo.file && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileVideo className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{newVideo.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(newVideo.file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (newVideo.url) {
                            URL.revokeObjectURL(newVideo.url);
                          }
                          setNewVideo({ ...newVideo, file: undefined, url: '', fileSize: undefined });
                          setPreviewUrl(null);
                          setUploadProgress(0);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Processando...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="youtube" className="space-y-4">
                <Alert>
                  <Youtube className="w-4 h-4" />
                  <AlertDescription>
                    Cole o URL do YouTube (ex: https://www.youtube.com/watch?v=VIDEO_ID)
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="vimeo" className="space-y-4">
                <Alert>
                  <Video className="w-4 h-4" />
                  <AlertDescription>
                    Cole o URL do Vimeo (ex: https://vimeo.com/VIDEO_ID)
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="mp4" className="space-y-4">
                <Alert>
                  <Link className="w-4 h-4" />
                  <AlertDescription>
                    Cole o URL direto do arquivo MP4, WebM ou OGG
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="embed" className="space-y-4">
                <Alert>
                  <ExternalLink className="w-4 h-4" />
                  <AlertDescription>
                    Cole o URL de embed de qualquer plataforma de vídeo
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="video-title">Título do Vídeo</Label>
                <Input
                  id="video-title"
                  placeholder="Ex: Anatomia do Coração - Parte 1"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                />
              </div>

              {newVideo.type !== 'local' && (
                <div className="space-y-2">
                  <Label htmlFor="video-url">URL do Vídeo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="video-url"
                      placeholder="https://..."
                      value={newVideo.type === 'local' ? '' : (newVideo.url || '')}
                      onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                      disabled={newVideo.type === 'local'}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreview}
                      disabled={!newVideo.url || newVideo.type === 'local'}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-description">Descrição (opcional)</Label>
              <Textarea
                id="video-description"
                placeholder="Descreva o conteúdo do vídeo..."
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                rows={3}
              />
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview do Vídeo</Label>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {renderVideoEmbed({
                    id: 'preview',
                    type: newVideo.type as VideoContent['type'],
                    url: previewUrl,
                    title: newVideo.title || 'Preview'
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (newVideo.url && newVideo.type === 'local') {
                    URL.revokeObjectURL(newVideo.url);
                  }
                  setShowAddForm(false);
                  setPreviewUrl(null);
                  setNewVideo({ type: 'youtube', title: '', url: '', description: '' });
                  setUploadProgress(0);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddVideo}
                disabled={!newVideo.title || !newVideo.url || (uploadProgress > 0 && uploadProgress < 100)}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Adicionar Vídeo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{video.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={video.type === 'local' ? 'default' : 'secondary'} 
                        className="capitalize"
                      >
                        {video.type === 'local' ? (
                          <div className="flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            Local
                          </div>
                        ) : (
                          video.type
                        )}
                      </Badge>
                      {video.fileSize && (
                        <Badge variant="outline">{formatFileSize(video.fileSize)}</Badge>
                      )}
                      {video.duration && (
                        <Badge variant="outline">{video.duration}</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (video.type === 'local' && video.url) {
                        URL.revokeObjectURL(video.url);
                      }
                      onRemoveVideo(video.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {renderVideoEmbed(video)}
                  </div>
                  
                  {video.description && (
                    <p className="text-sm text-muted-foreground">
                      {video.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {video.type === 'local' ? (
                      <div className="flex items-center gap-1">
                        <FileVideo className="w-3 h-3" />
                        <span>Arquivo local</span>
                      </div>
                    ) : (
                      <>
                        <Link className="w-3 h-3" />
                        <span className="truncate">{video.url}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {videos.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-muted-foreground">
          <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum vídeo adicionado ainda</p>
          <p className="text-sm">Clique em "Adicionar Vídeo" para começar</p>
        </div>
      )}
    </div>
  );
}