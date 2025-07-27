import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, FileVideo, Youtube, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface VideoExplainerProps {
  title: string;
  description: string;
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'mp4' | 'external';
  duration?: string;
  thumbnail?: string;
  category?: string;
  onPlay?: () => void;
}

export function VideoExplainer({ 
  title, 
  description, 
  videoUrl, 
  videoType, 
  duration = "5:30",
  thumbnail,
  category = "Explicativo",
  onPlay
}: VideoExplainerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const getVideoEmbedUrl = (url: string, type: string) => {
    switch (type) {
      case 'youtube':
        const youtubeId = url.includes('watch?v=') ? url.split('watch?v=')[1] : url.split('/').pop();
        return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
      case 'vimeo':
        const vimeoId = url.split('/').pop();
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      case 'mp4':
        return url;
      default:
        return url;
    }
  };

  const getVideoIcon = () => {
    switch (videoType) {
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'vimeo':
        return <FileVideo className="w-5 h-5" />;
      case 'mp4':
        return <FileVideo className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const handlePlayVideo = () => {
    setShowVideo(true);
    setIsPlaying(true);
    onPlay?.();
  };

  if (showVideo) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getVideoIcon()}
              <h3 className="font-medium">{title}</h3>
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVideo(false)}
              className="text-xs"
            >
              Fechar
            </Button>
          </div>
        </div>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {videoType === 'mp4' ? (
            <video
              controls
              autoPlay
              muted={isMuted}
              className="w-full h-full object-cover"
              src={getVideoEmbedUrl(videoUrl, videoType)}
            />
          ) : (
            <iframe
              src={getVideoEmbedUrl(videoUrl, videoType)}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-3">{description}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
      <div className="relative">
        {/* Thumbnail */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3 relative">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {getVideoIcon()}
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handlePlayVideo}
              size="lg"
              className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-primary shadow-lg"
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getVideoIcon()}
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handlePlayVideo}>
              <Play className="w-4 h-4" />
            </Button>
          </div>
          
          <h3 className="font-medium group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}