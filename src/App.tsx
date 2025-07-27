import { useState } from "react";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { CreateDeck } from "./components/CreateDeck";
import { DeckView } from "./components/DeckView";
import { StudyLayout } from "./components/StudyLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";

type Page =
  | "landing"
  | "dashboard"
  | "create"
  | "deck"
  | "flashcard-study";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>("landing");
  const [selectedDeckId, setSelectedDeckId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (page: Page, deckId?: string) => {
    setIsLoading(true);

    // Simulate loading time
    setTimeout(() => {
      setCurrentPage(page);
      if (deckId) {
        setSelectedDeckId(deckId);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleGetStarted = () => {
    handleNavigate("dashboard");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage
            onNavigate={handleNavigate}
            onGetStarted={handleGetStarted}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onStartStudy={(deckId) =>
              handleNavigate("flashcard-study", deckId)
            }
            onViewDeck={(deckId) =>
              handleNavigate("deck", deckId)
            }
            onCreateDeck={() => handleNavigate("create")}
            onLogoClick={() => handleNavigate("landing")}
          />
        );
      case "create":
        return (
          <CreateDeck
            onNavigate={handleNavigate}
            onDeckCreated={() => handleNavigate("dashboard")}
          />
        );
      case "deck":
        return (
          <DeckView
            onNavigate={handleNavigate}
            deckId={selectedDeckId}
            onStartStudy={() =>
              handleNavigate("flashcard-study", selectedDeckId)
            }
          />
        );
      case "flashcard-study":
        return (
          <StudyLayout
            onNavigate={handleNavigate}
            selectedDeckId={selectedDeckId}
          />
        );
      default:
        return (
          <LandingPage
            onNavigate={handleNavigate}
            onGetStarted={handleGetStarted}
          />
        );
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationProvider>
          <div className="min-h-screen w-screen bg-background">
            <div className="min-h-full w-full">
              {renderCurrentPage()}
            </div>
          </div>
        </NavigationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}