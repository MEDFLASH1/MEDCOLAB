import { useState, useCallback } from 'react';
import { NavigationPage, NavigationState, BreadcrumbItem } from '../types';
import { ROUTES } from '../constants';

interface UseNavigationReturn {
  currentPage: NavigationPage;
  selectedDeckId?: string;
  breadcrumbs: BreadcrumbItem[];
  navigateToPage: (page: NavigationPage, params?: Record<string, string>) => void;
  goToLanding: () => void;
  goBack: () => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

export function useNavigation(): UseNavigationReturn {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPage: 'landing' as NavigationPage,
    breadcrumbs: [],
  });

  const navigateToPage = useCallback((page: NavigationPage, params?: Record<string, string>) => {
    setNavigationState(prev => ({
      ...prev,
      currentPage: page,
      selectedDeckId: params?.deckId,
    }));
  }, []);

  const goToLanding = useCallback(() => {
    setNavigationState({
      currentPage: 'landing' as NavigationPage,
      breadcrumbs: [],
    });
  }, []);

  const goBack = useCallback(() => {
    setNavigationState(prev => {
      const newBreadcrumbs = [...prev.breadcrumbs];
      const previousPage = newBreadcrumbs.pop();
      
      return {
        ...prev,
        currentPage: previousPage?.path || 'landing' as NavigationPage,
        breadcrumbs: newBreadcrumbs,
      };
    });
  }, []);

  const setBreadcrumbs = useCallback((breadcrumbs: BreadcrumbItem[]) => {
    setNavigationState(prev => ({
      ...prev,
      breadcrumbs,
    }));
  }, []);

  return {
    currentPage: navigationState.currentPage,
    selectedDeckId: navigationState.selectedDeckId,
    breadcrumbs: navigationState.breadcrumbs,
    navigateToPage,
    goToLanding,
    goBack,
    setBreadcrumbs,
  };
}