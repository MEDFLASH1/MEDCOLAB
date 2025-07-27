import { useNavigation } from '../../contexts/NavigationContext';
import { LandingPage } from '../LandingPage';
import { Dashboard } from '../Dashboard';
import { StudySession } from '../StudySession';
import { DeckView } from '../DeckView';
import { CreateDeck } from '../CreateDeck';

export function AppRouter() {
  const { currentPage, selectedDeckId, navigateToPage, goToLanding } = useNavigation();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={() => navigateToPage('dashboard')} 
            onNavigate={navigateToPage} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            onStartStudy={(deckId) => navigateToPage('study', { deckId })}
            onViewDeck={(deckId) => navigateToPage('deck', { deckId })}
            onCreateDeck={() => navigateToPage('create')}
            onNavigate={navigateToPage}
            onLogoClick={goToLanding}
          />
        );
      case 'study':
        return (
          <StudySession 
            deckId={selectedDeckId || ''}
            onNavigate={navigateToPage}
            onLogoClick={goToLanding}
          />
        );
      case 'deck':
        return (
          <DeckView 
            deckId={selectedDeckId || ''}
            onNavigate={navigateToPage}
            onLogoClick={goToLanding}
          />
        );
      case 'create':
        return (
          <CreateDeck 
            onNavigate={navigateToPage} 
            onLogoClick={goToLanding} 
          />
        );
      default:
        return (
          <LandingPage 
            onGetStarted={() => navigateToPage('dashboard')} 
            onNavigate={navigateToPage} 
          />
        );
    }
  };

  return <>{renderCurrentPage()}</>;
}