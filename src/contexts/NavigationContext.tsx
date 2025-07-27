import { createContext, useContext } from 'react';
import { NavigationPage } from '../types';
import { useNavigation as useNavigationHook } from '../hooks/useNavigation';

interface NavigationContextType {
  currentPage: NavigationPage;
  selectedDeckId?: string;
  navigateToPage: (page: NavigationPage, params?: Record<string, string>) => void;
  goToLanding: () => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigationHook = useNavigationHook();

  return (
    <NavigationContext.Provider value={navigationHook}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}