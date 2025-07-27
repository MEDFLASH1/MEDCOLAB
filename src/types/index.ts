// Core Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'pt' | 'en' | 'es';
  studySettings: StudySettings;
}

export interface StudySettings {
  cardsPerSession: number;
  showAnswerDelay: number;
  enableSounds: boolean;
  autoAdvance: boolean;
}

// Flashcard Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: Difficulty;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: Date;
  nextReview?: Date;
  tags: string[];
  media?: MediaContent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaContent {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  title?: string;
  description?: string;
}

export type Difficulty = 'facil' | 'medio' | 'dificil';

export interface StudyFolder {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  cardCount: number;
  masteredCount: number;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// Study Session Types
export interface StudySession {
  id: string;
  folderId: string;
  startedAt: Date;
  endedAt?: Date;
  cardsStudied: number;
  correctAnswers: number;
  averageTime: number;
  performance: SessionPerformance;
}

export interface SessionPerformance {
  accuracy: number;
  speed: number;
  retention: number;
  improvement: number;
}

// Navigation Types
export type NavigationPage = 'landing' | 'dashboard' | 'study' | 'deck' | 'create' | 'canvas' | 'profile' | 'settings';

export interface NavigationState {
  currentPage: NavigationPage;
  selectedDeckId?: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: NavigationPage;
  params?: Record<string, string>;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  difficulty?: Difficulty[];
  dateRange?: DateRange;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationProps {
  onNavigate: (page: NavigationPage, params?: Record<string, string>) => void;
  onLogoClick?: () => void;
}

export interface StudyProps extends NavigationProps {
  deckId: string;
}

export interface DashboardProps extends NavigationProps {
  onStartStudy: (deckId: string) => void;
  onViewDeck: (deckId: string) => void;
  onCreateDeck: () => void;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateDeckFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
}

export interface CreateCardFormData {
  front: string;
  back: string;
  tags: string[];
  media: MediaContent[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export type ErrorType = 'NETWORK' | 'VALIDATION' | 'AUTH' | 'NOT_FOUND' | 'SERVER' | 'UNKNOWN';

// State Types
export interface AppState {
  user: User | null;
  navigation: NavigationState;
  studySession: StudySession | null;
  folders: StudyFolder[];
  loading: boolean;
  error: AppError | null;
}

// Action Types for Reducers
export interface Action<T = any> {
  type: string;
  payload?: T;
}

// Hook Return Types
export interface UseStudySessionReturn {
  currentCard: Flashcard | null;
  currentIndex: number;
  totalCards: number;
  showAnswer: boolean;
  progress: number;
  nextCard: () => void;
  previousCard: () => void;
  toggleAnswer: () => void;
  rateCard: (difficulty: Difficulty) => void;
  endSession: () => void;
}

export interface UseAuthReturn {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Constants Types
export interface AppConfig {
  API_URL: string;
  APP_NAME: string;
  VERSION: string;
  SUPPORTED_LANGUAGES: string[];
  DEFAULT_STUDY_SETTINGS: StudySettings;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  accent: string;
}