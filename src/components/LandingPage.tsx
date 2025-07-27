import { useState } from 'react';
import { ArrowRight, BookOpen, Brain, Target, Users, Star, Play, CheckCircle, Menu, X, Home, PlusCircle, User, Clock, Award, TrendingUp, Zap, Eye, Video, Monitor, Calendar, BarChart3, RefreshCw, Settings, UserCheck, GraduationCap, FileText, Microscope, Stethoscope, Youtube, FileVideo, ExternalLink } from 'lucide-react';
import { VideoExplainer } from './VideoExplainer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { LoginDialog } from './LoginDialog';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onGetStarted: () => void;
}

export function LandingPage({ onNavigate, onGetStarted }: LandingPageProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "Repetição Espaçada",
      description: "Sistema inteligente que adapta os intervalos de revisão baseado no seu desempenho."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Foco Médico",
      description: "Conteúdo específico para estudantes de medicina com categorias por especialidade."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Progresso Visual",
      description: "Acompanhe seu desempenho com gráficos detalhados e estatísticas."
    },
    {
      icon: <Video className="w-8 h-8 text-primary" />,
      title: "Aprendizado Multimídia",
      description: "Integre vídeos, imagens e textos para um aprendizado mais eficaz."
    }
  ];

  const stats = [
    { number: "50K+", label: "Estudantes Ativos" },
    { number: "1M+", label: "Flashcards Criados" },
    { number: "95%", label: "Taxa de Aprovação" },
    { number: "24/7", label: "Disponibilidade" }
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Estudante de Medicina - 4º ano",
      content: "O MedFlashcard revolucionou minha forma de estudar. A repetição espaçada me ajudou a reter muito mais informação.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Residente em Cardiologia",
      content: "Perfeito para revisar conceitos importantes durante a residência. Interface limpa e conteúdo de qualidade.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Estudante de Medicina - 2º ano",
      content: "Os vídeos integrados facilitaram muito meu aprendizado. Recomendo para todos os colegas.",
      rating: 5
    }
  ];

  const specialties = [
    { icon: <Stethoscope className="w-6 h-6" />, name: "Cardiologia", count: "245 cards" },
    { icon: <Brain className="w-6 h-6" />, name: "Neurologia", count: "189 cards" },
    { icon: <Microscope className="w-6 h-6" />, name: "Patologia", count: "312 cards" },
    { icon: <FileText className="w-6 h-6" />, name: "Anatomia", count: "467 cards" },
    { icon: <GraduationCap className="w-6 h-6" />, name: "Farmacologia", count: "198 cards" },
    { icon: <UserCheck className="w-6 h-6" />, name: "Clínica Médica", count: "356 cards" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="relative bg-[rgba(55,12,64,1)] text-white p-4 sticky top-0 z-50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-cyan-500/20 before:border-b before:border-gradient-to-r before:from-blue-400/30 before:via-purple-400/30 before:to-cyan-400/30 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-blue-400/50 after:to-transparent">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">MedFlashcard</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={onGetStarted}
                className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 text-left transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                Painel
              </Button>
              <Button 
                variant="ghost"
                onClick={() => onNavigate('create')}
                className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                Criar
              </Button>
              <Button 
                variant="ghost"
                onClick={() => onNavigate('flashcard-study')}
                className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                Estudar
              </Button>
              <Button 
                variant="ghost"
                onClick={() => user ? logout() : setLoginOpen(true)}
                className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                {user ? `Sair (${user.name})` : 'Área do aluno'}
              </Button>
              <Button 
                onClick={onGetStarted} 
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
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
                className="text-white hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-white/10 bg-black/90 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 justify-start transition-all duration-200"
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
                  className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 justify-start transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  Criar
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    onNavigate('flashcard-study');
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/20 justify-start transition-all duration-200"
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
                  className="gap-2 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 justify-start transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  {user ? `Sair (${user.name})` : 'Área do aluno'}
                </Button>
                <Button 
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }} 
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 justify-start mt-2 transition-all duration-200"
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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Plataforma de Estudo Inteligente
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Domine a Medicina com
              <br />
              Flashcards Inteligentes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sistema de repetição espaçada projetado especificamente para estudantes de medicina. 
              Aprenda mais rápido e retenha informações por mais tempo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onGetStarted} className="gap-2">
                <Play className="w-5 h-5" />
                Começar Agora
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Eye className="w-5 h-5" />
                    Ver Demonstração
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Demonstração do MedFlashcard</DialogTitle>
                    <DialogDescription>
                      Veja como nossa plataforma pode revolucionar seus estudos
                    </DialogDescription>
                  </DialogHeader>
                  <VideoExplainer />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recursos Poderosos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ferramentas avançadas desenvolvidas especificamente para acelerar seu aprendizado médico
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Especialidades Médicas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conteúdo organizado por área médica para um estudo mais direcionado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {specialty.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{specialty.name}</h3>
                    <p className="text-muted-foreground text-sm">{specialty.count}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">O que dizem nossos usuários</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Histórias reais de estudantes que transformaram seus estudos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para revolucionar seus estudos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de estudantes que já estão estudando de forma mais inteligente
          </p>
          <Button size="lg" variant="secondary" onClick={onGetStarted} className="gap-2">
            <ArrowRight className="w-5 h-5" />
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">MedFlashcard</span>
              </div>
              <p className="text-muted-foreground mb-4">
                A plataforma de flashcards mais avançada para estudantes de medicina.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MedFlashcard. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen} 
      />
    </div>
  );
}