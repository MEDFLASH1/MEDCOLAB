import { Brain } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary/80 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">MedFlashcard</h1>
        <p className="text-white/80 mb-4">Carregando sua plataforma de estudos...</p>
        <div className="w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}