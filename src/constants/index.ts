import { AppConfig, StudySettings, ThemeColors } from '../types';

// App Configuration
export const APP_CONFIG: AppConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  APP_NAME: 'MedFlashcard',
  VERSION: '1.0.0',
  SUPPORTED_LANGUAGES: ['pt', 'en', 'es'],
  DEFAULT_STUDY_SETTINGS: {
    cardsPerSession: 20,
    showAnswerDelay: 0,
    enableSounds: true,
    autoAdvance: false,
  },
};

// Theme Colors
export const THEME_COLORS: ThemeColors = {
  primary: '#170b3b',
  secondary: '#341948',
  background: '#ffffff',
  foreground: '#0e050f',
  muted: '#f8f7fa',
  accent: '#f3f1f6',
};

// Navigation Routes
export const ROUTES = {
  LANDING: 'landing',
  DASHBOARD: 'dashboard',
  STUDY: 'study',
  DECK: 'deck',
  CREATE: 'create',
  CANVAS: 'canvas',
  PROFILE: 'profile',
  SETTINGS: 'settings',
} as const;

// Study Constants
export const STUDY_CONSTANTS = {
  MIN_CARDS_PER_SESSION: 5,
  MAX_CARDS_PER_SESSION: 100,
  DEFAULT_CARDS_PER_SESSION: 20,
  SPACED_REPETITION_INTERVALS: {
    facil: [1, 3, 7, 14, 30], // days
    medio: [1, 2, 5, 10, 21], // days
    dificil: [1, 1, 3, 7, 14], // days
  },
  DIFFICULTY_COLORS: {
    facil: 'bg-green-100 text-green-800 border-green-200',
    medio: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dificil: 'bg-red-100 text-red-800 border-red-200',
  },
  DIFFICULTY_LABELS: {
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil',
  },
} as const;

// Folder Categories
export const FOLDER_CATEGORIES = {
  CARDIOLOGIA: {
    id: 'cardiologia',
    name: 'Cardiologia',
    icon: '❤️',
    color: 'bg-red-100 border-red-200',
    description: 'Sistema cardiovascular e doenças cardíacas',
  },
  NEUROLOGIA: {
    id: 'neurologia',
    name: 'Neurologia',
    icon: '🧠',
    color: 'bg-purple-100 border-purple-200',
    description: 'Sistema nervoso e distúrbios neurológicos',
  },
  FARMACOLOGIA: {
    id: 'farmacologia',
    name: 'Farmacologia',
    icon: '💊',
    color: 'bg-blue-100 border-blue-200',
    description: 'Medicamentos e seus mecanismos de ação',
  },
  ANATOMIA: {
    id: 'anatomia',
    name: 'Anatomia',
    icon: '🦴',
    color: 'bg-green-100 border-green-200',
    description: 'Estruturas e sistemas do corpo humano',
  },
  FISIOLOGIA: {
    id: 'fisiologia',
    name: 'Fisiologia',
    icon: '⚡',
    color: 'bg-yellow-100 border-yellow-200',
    description: 'Funcionamento dos sistemas corporais',
  },
  PATOLOGIA: {
    id: 'patologia',
    name: 'Patologia',
    icon: '🔬',
    color: 'bg-indigo-100 border-indigo-200',
    description: 'Estudo das doenças e alterações',
  },
} as const;

// Animation Constants
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  DECK_NAME_MAX_LENGTH: 50,
  CARD_CONTENT_MAX_LENGTH: 1000,
  TAGS_MAX_COUNT: 10,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
  },
  FOLDERS: {
    LIST: '/folders',
    CREATE: '/folders',
    UPDATE: (id: string) => `/folders/${id}`,
    DELETE: (id: string) => `/folders/${id}`,
  },
  CARDS: {
    LIST: (folderId: string) => `/folders/${folderId}/cards`,
    CREATE: (folderId: string) => `/folders/${folderId}/cards`,
    UPDATE: (folderId: string, cardId: string) => `/folders/${folderId}/cards/${cardId}`,
    DELETE: (folderId: string, cardId: string) => `/folders/${folderId}/cards/${cardId}`,
  },
  STUDY: {
    START_SESSION: '/study/start',
    END_SESSION: '/study/end',
    RATE_CARD: '/study/rate',
    STATS: '/study/stats',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  VALIDATION: 'Dados inválidos. Verifique os campos.',
  AUTH: 'Erro de autenticação. Faça login novamente.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER: 'Erro interno do servidor. Tente novamente.',
  UNKNOWN: 'Erro desconhecido. Tente novamente.',
  EMAIL_INVALID: 'Email inválido.',
  PASSWORD_TOO_SHORT: `Senha deve ter pelo menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres.`,
  PASSWORDS_DONT_MATCH: 'Senhas não coincidem.',
  NAME_TOO_SHORT: `Nome deve ter pelo menos ${VALIDATION.NAME_MIN_LENGTH} caracteres.`,
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Conta criada com sucesso!',
  LOGOUT: 'Logout realizado com sucesso!',
  DECK_CREATED: 'Deck criado com sucesso!',
  DECK_UPDATED: 'Deck atualizado com sucesso!',
  DECK_DELETED: 'Deck excluído com sucesso!',
  CARD_CREATED: 'Card criado com sucesso!',
  CARD_UPDATED: 'Card atualizado com sucesso!',
  CARD_DELETED: 'Card excluído com sucesso!',
  PREFERENCES_SAVED: 'Preferências salvas com sucesso!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'medflashcard_user',
  PREFERENCES: 'medflashcard_preferences',
  STUDY_STATS: 'medflashcard_study_stats',
  THEME: 'medflashcard_theme',
  LANGUAGE: 'medflashcard_language',
} as const;

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const;

export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const SUPPORTED_VIDEO_FORMATS = ['mp4', 'webm', 'ogg'];
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'ogg'];

// Video Providers
export const VIDEO_PROVIDERS = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  LOCAL: 'local',
} as const;

// Achievement Constants
export const ACHIEVEMENTS = {
  FIRST_STUDY: {
    id: 'first_study',
    name: 'Primeiro Estudo',
    description: 'Complete sua primeira sessão de estudo',
    icon: '🎯',
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Sequência de 7 Dias',
    description: 'Estude por 7 dias consecutivos',
    icon: '🔥',
  },
  MASTER_100: {
    id: 'master_100',
    name: 'Mestre dos Cards',
    description: 'Domine 100 flashcards',
    icon: '🏆',
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Demônio da Velocidade',
    description: 'Complete uma sessão em menos de 5 minutos',
    icon: '⚡',
  },
} as const;