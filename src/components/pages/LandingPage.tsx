import { useState } from 'react';
import { ArrowRight, BookOpen, Brain, Target, Users, Star, Play, CheckCircle, Menu, X, Home, PlusCircle, User, Clock, Award, TrendingUp, Zap, Eye, Video, Monitor, Calendar, BarChart3, RefreshCw, Settings, UserCheck, GraduationCap, FileText, Microscope, Stethoscope, Youtube, FileVideo, ExternalLink } from 'lucide-react';
import { VideoExplainer } from '../VideoExplainer';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { LoginDialog } from '../LoginDialog';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationPage } from '../../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate: (page: NavigationPage) => void;
}

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, logout } = useAuth();

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Estudante de Medicina - USP",
      content: "O MedFlashcard revolucionou minha forma de estudar. Os vídeos explicativos me ajudam a entender conceitos complexos rapidamente.",
      rating: 5
    },
    {
      name: "Carlos Santos",
      role: "Residente em Cardiologia",
      content: "Uso diariamente para revisar conteúdos. A repetição espaçada é perfeita para fixar conhecimentos antes das provas.",
      rating: 5
    },
    {
      name: "Marina Costa",
      role: "Estudante de Enfermagem",
      content: "Interface intuitiva e conteúdo de qualidade. Consegui melhorar minhas notas significativamente.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Repetição Espaçada",
      description: "Algoritmo inteligente que otimiza o tempo de revisão baseado na curva de esquecimento."
    },
    {
      icon: Video,
      title: "Vídeos Explicativos",
      description: "Cada flashcard pode incluir vídeos do YouTube, Vimeo ou arquivos MP4 para aprendizado multimodal."
    },
    {
      icon: Target,
      title: "Foco na Medicina",
      description: "Conteúdo especializado para estudantes de medicina, enfermagem e áreas da saúde."
    },
    {
      icon: BarChart3,
      title: "Progresso Visual",
      description: "Acompanhe seu desempenho com gráficos detalhados e estatísticas de aprendizado."
    },
    {
      icon: FileText,
      title: "Organização por Decks",
      description: "Organize seus estudos por disciplinas, sistemas corporais ou temas específicos."
    },
    {
      icon: Zap,
      title: "Estudo Eficiente",
      description: "Maximize seu tempo de estudo com técnicas comprovadas cientificamente."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-white">MedFlashcard</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={onGetStarted}
                className="gap-2 text-white hover:bg-white/20 text-left"
              >
                <Home className="w-4 h-4" />
                Painel
              </Button>
              <Button 
                variant="ghost"
                onClick={() => onNavigate('create')}
                className="gap-2 text-white hover:bg-white/20"
              >
                <PlusCircle className="w-4 h-4" />
                Criar
              </Button>
              <Button 
                variant="ghost"
                onClick={() => onNavigate('study')}
                className="gap-2 text-white hover:bg-white/20"
              >
                <BookOpen className="w-4 h-4" />
                Estudar
              </Button>
              <Button 
                variant="ghost"
                onClick={() => user ? logout() : setLoginOpen(true)}
                className="gap-2 text-white hover:bg-white/20"
              >
                <User className="w-4 h-4" />
                {user ? `Sair (${user.name})` : 'Área do aluno'}
              </Button>
              <Button 
                onClick={onGetStarted} 
                className="gap-2 bg-white hover:bg-gray-100 text-primary"
              >
                <ArrowRight className="w-4 h-4" />
                Começar Agora
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
            <div className="md:hidden mt-4 py-4 border-t border-white/20">
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 text-white hover:bg-white/20 justify-start"
                >
                  <Home className="w-4 h-4" />
                  Painel
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    onNavigate('create');
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 text-white hover:bg-white/20 justify-start"
                >
                  <PlusCircle className="w-4 h-4" />
                  Criar
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    onNavigate('study');
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 text-white hover:bg-white/20 justify-start"
                >
                  <BookOpen className="w-4 h-4" />
                  Estudar
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    user ? logout() : setLoginOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 text-white hover:bg-white/20 justify-start"
                >
                  <User className="w-4 h-4" />
                  {user ? `Sair (${user.name})` : 'Área do aluno'}
                </Button>
                <Button 
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }} 
                  className="gap-2 bg-white hover:bg-gray-100 text-primary justify-start mt-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Começar Agora
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary/80 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            Aprendizado Científico
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Domine a Medicina com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
              Flashcards Inteligentes
            </span>
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Plataforma de estudo baseada em repetição espaçada, desenvolvida especificamente para estudantes de medicina e profissionais da saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4"
            >
              <Play className="w-5 h-5" />
              Começar Estudos
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="gap-2 border-white/30 text-white hover:bg-white/10 px-8 py-4"
                >
                  <Video className="w-5 h-5" />
                  Ver Demonstração
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Como Funciona o MedFlashcard</DialogTitle>
                  <DialogDescription>
                    Assista a demonstração completa de como usar a plataforma para maximizar seus estudos médicos.
                  </DialogDescription>
                </DialogHeader>
                <VideoExplainer 
                  videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  title="Demonstração Completa da Plataforma"
                  description="Veja como criar flashcards, organizar estudos e maximizar seu aprendizado"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Recursos Avançados
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa para dominar a medicina
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas cientificamente comprovadas para otimizar seu aprendizado e retenção de conhecimento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <feature.icon className="w-6 h-6 text-primary" />
                      {feature.title}
                    </DialogTitle>
                    <DialogDescription>
                      Aprenda como usar este recurso para maximizar seu aprendizado médico.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>{feature.description}</p>
                    <VideoExplainer 
                      videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      title={`Como usar: ${feature.title}`}
                      description="Tutorial detalhado sobre este recurso"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Taxa de Retenção</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15min</div>
              <div className="text-muted-foreground">Estudo Diário Médio</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2.5x</div>
              <div className="text-muted-foreground">Mais Eficiente</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Instituições</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Depoimentos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que dizem nossos estudantes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar seus estudos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de estudantes que já estão dominando a medicina com o MedFlashcard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4"
            >
              <Play className="w-5 h-5" />
              Começar Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate('study')}
              className="gap-2 border-white/30 text-white hover:bg-white/10 px-8 py-4"
            >
              <BookOpen className="w-5 h-5" />
              Explorar Área de Estudo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">MedFlashcard</span>
              </div>
              <p className="text-muted-foreground">
                Revolucionando o estudo médico através da ciência da aprendizagem.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Produto</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Flashcards</div>
                <div>Vídeos Explicativos</div>
                <div>Repetição Espaçada</div>
                <div>Analytics</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Recursos</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Guia de Estudos</div>
                <div>Blog Médico</div>
                <div>Webinars</div>
                <div>Comunidade</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Suporte</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Central de Ajuda</div>
                <div>Contato</div>
                <div>Status</div>
                <div>Feedback</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MedFlashcard. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}