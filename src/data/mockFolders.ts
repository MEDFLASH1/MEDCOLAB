import { StudyFolder, Flashcard } from '../types';

// Definir las categorías de carpetas directamente aquí para evitar problemas de import
const FOLDER_CATEGORIES = {
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
} as const;

// Mock Flashcards for Cardiologia
const cardiologiaCards: Flashcard[] = [
  {
    id: 'card-1',
    front: 'Qual é a função principal do ventrículo esquerdo?',
    back: 'Bombear sangue oxigenado para todo o corpo através da aorta, mantendo a circulação sistêmica com pressão adequada.',
    difficulty: 'medio',
    mastered: false,
    reviewCount: 3,
    tags: ['coração', 'ventrículo', 'circulação'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lastReviewed: new Date('2024-01-18'),
  },
  {
    id: 'card-2',
    front: 'Quais são as quatro câmaras do coração?',
    back: 'Átrio direito, ventrículo direito, átrio esquerdo e ventrículo esquerdo. Os átrios recebem sangue e os ventrículos bombeiam sangue.',
    difficulty: 'facil',
    mastered: true,
    reviewCount: 5,
    tags: ['coração', 'anatomia', 'câmaras'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    lastReviewed: new Date('2024-01-25'),
  },
  {
    id: 'card-3',
    front: 'O que são as valvas semilunares e onde estão localizadas?',
    back: 'São as valvas aórtica e pulmonar, localizadas na saída dos ventrículos. Impedem o refluxo de sangue dos grandes vasos para os ventrículos.',
    difficulty: 'dificil',
    mastered: false,
    reviewCount: 1,
    tags: ['valvas', 'anatomia', 'coração'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    lastReviewed: new Date('2024-01-21'),
  },
];

// Mock Flashcards for Neurologia
const neurologiaCards: Flashcard[] = [
  {
    id: 'card-4',
    front: 'Quais são as principais divisões do sistema nervoso?',
    back: 'Sistema nervoso central (SNC): cérebro e medula espinhal. Sistema nervoso periférico (SNP): nervos cranianos e espinhais.',
    difficulty: 'facil',
    mastered: true,
    reviewCount: 4,
    tags: ['sistema nervoso', 'anatomia', 'divisões'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    lastReviewed: new Date('2024-01-17'),
  },
  {
    id: 'card-5',
    front: 'O que são os neurotransmissores e cite 3 exemplos?',
    back: 'Substâncias químicas que transmitem sinais entre neurônios. Exemplos: dopamina (movimento/prazer), serotonina (humor), acetilcolina (contração muscular).',
    difficulty: 'medio',
    mastered: false,
    reviewCount: 2,
    tags: ['neurotransmissores', 'bioquímica', 'neurônios'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-19'),
    lastReviewed: new Date('2024-01-16'),
  },
];

// Mock Flashcards for Farmacologia
const farmacologiaCards: Flashcard[] = [
  {
    id: 'card-6',
    front: 'O que é farmacocinética?',
    back: 'Estudo do que o organismo faz com o medicamento: absorção, distribuição, metabolismo e excreção (ADME).',
    difficulty: 'medio',
    mastered: true,
    reviewCount: 6,
    tags: ['farmacocinética', 'ADME', 'medicamentos'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-24'),
    lastReviewed: new Date('2024-01-23'),
  },
  {
    id: 'card-7',
    front: 'Diferença entre agonista e antagonista farmacológico?',
    back: 'Agonista: liga-se ao receptor e ativa resposta. Antagonista: liga-se ao receptor mas bloqueia a resposta, impedindo ação do agonista.',
    difficulty: 'dificil',
    mastered: false,
    reviewCount: 2,
    tags: ['agonista', 'antagonista', 'receptores'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-21'),
    lastReviewed: new Date('2024-01-19'),
  },
];

// Mock Flashcards for Anatomia
const anatomiaCards: Flashcard[] = [
  {
    id: 'card-8',
    front: 'Quantos ossos tem o corpo humano adulto?',
    back: '206 ossos no total. O esqueleto infantil tem mais ossos que se fundem durante o desenvolvimento.',
    difficulty: 'facil',
    mastered: true,
    reviewCount: 8,
    tags: ['ossos', 'esqueleto', 'anatomia'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-26'),
    lastReviewed: new Date('2024-01-26'),
  },
  {
    id: 'card-9',
    front: 'Quais são os planos anatômicos fundamentais?',
    back: 'Sagital (divide em direita/esquerda), frontal/coronal (divide em anterior/posterior), transversal/horizontal (divide em superior/inferior).',
    difficulty: 'medio',
    mastered: false,
    reviewCount: 3,
    tags: ['planos anatômicos', 'orientação', 'anatomia'],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-20'),
    lastReviewed: new Date('2024-01-18'),
  },
];

// Mock Study Folders
export const mockFolders: StudyFolder[] = [
  {
    id: FOLDER_CATEGORIES.CARDIOLOGIA.id,
    name: FOLDER_CATEGORIES.CARDIOLOGIA.name,
    description: FOLDER_CATEGORIES.CARDIOLOGIA.description,
    icon: FOLDER_CATEGORIES.CARDIOLOGIA.icon,
    color: FOLDER_CATEGORIES.CARDIOLOGIA.color,
    cardCount: cardiologiaCards.length,
    masteredCount: cardiologiaCards.filter(card => card.mastered).length,
    cards: cardiologiaCards,
    tags: ['cardiologia', 'coração', 'circulação'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-26'),
  },
  {
    id: FOLDER_CATEGORIES.NEUROLOGIA.id,
    name: FOLDER_CATEGORIES.NEUROLOGIA.name,
    description: FOLDER_CATEGORIES.NEUROLOGIA.description,
    icon: FOLDER_CATEGORIES.NEUROLOGIA.icon,
    color: FOLDER_CATEGORIES.NEUROLOGIA.color,
    cardCount: neurologiaCards.length,
    masteredCount: neurologiaCards.filter(card => card.mastered).length,
    cards: neurologiaCards,
    tags: ['neurologia', 'sistema nervoso', 'cérebro'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: FOLDER_CATEGORIES.FARMACOLOGIA.id,
    name: FOLDER_CATEGORIES.FARMACOLOGIA.name,
    description: FOLDER_CATEGORIES.FARMACOLOGIA.description,
    icon: FOLDER_CATEGORIES.FARMACOLOGIA.icon,
    color: FOLDER_CATEGORIES.FARMACOLOGIA.color,
    cardCount: farmacologiaCards.length,
    masteredCount: farmacologiaCards.filter(card => card.mastered).length,
    cards: farmacologiaCards,
    tags: ['farmacologia', 'medicamentos', 'drogas'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-24'),
  },
  {
    id: FOLDER_CATEGORIES.ANATOMIA.id,
    name: FOLDER_CATEGORIES.ANATOMIA.name,
    description: FOLDER_CATEGORIES.ANATOMIA.description,
    icon: FOLDER_CATEGORIES.ANATOMIA.icon,
    color: FOLDER_CATEGORIES.ANATOMIA.color,
    cardCount: anatomiaCards.length,
    masteredCount: anatomiaCards.filter(card => card.mastered).length,
    cards: anatomiaCards,
    tags: ['anatomia', 'estruturas', 'corpo humano'],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-26'),
  },
];