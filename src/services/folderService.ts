import { StudyFolder, Flashcard, CreateDeckFormData } from '../types';
import { mockFolders } from '../data/mockFolders';
import { generateId } from '../utils';
import { STORAGE_KEYS } from '../constants';

class FolderService {
  private storageKey = STORAGE_KEYS.USER + '_folders';

  /**
   * Get all folders
   */
  async getFolders(): Promise<StudyFolder[]> {
    try {
      // In a real app, this would be an API call
      const savedFolders = localStorage.getItem(this.storageKey);
      if (savedFolders) {
        return JSON.parse(savedFolders);
      }
      
      // Return mock data if no saved folders
      this.saveFolders(mockFolders);
      return mockFolders;
    } catch (error) {
      console.error('Error loading folders:', error);
      return mockFolders;
    }
  }

  /**
   * Get folder by ID
   */
  async getFolderById(id: string): Promise<StudyFolder | null> {
    const folders = await this.getFolders();
    return folders.find(folder => folder.id === id) || null;
  }

  /**
   * Create new folder
   */
  async createFolder(data: CreateDeckFormData): Promise<StudyFolder> {
    const folders = await this.getFolders();
    
    const newFolder: StudyFolder = {
      id: generateId(),
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      cardCount: 0,
      masteredCount: 0,
      cards: [],
      tags: data.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedFolders = [...folders, newFolder];
    this.saveFolders(updatedFolders);
    
    return newFolder;
  }

  /**
   * Update folder
   */
  async updateFolder(id: string, updates: Partial<StudyFolder>): Promise<StudyFolder | null> {
    const folders = await this.getFolders();
    const folderIndex = folders.findIndex(folder => folder.id === id);
    
    if (folderIndex === -1) return null;

    const updatedFolder = {
      ...folders[folderIndex],
      ...updates,
      updatedAt: new Date(),
    };

    folders[folderIndex] = updatedFolder;
    this.saveFolders(folders);
    
    return updatedFolder;
  }

  /**
   * Delete folder
   */
  async deleteFolder(id: string): Promise<boolean> {
    const folders = await this.getFolders();
    const filteredFolders = folders.filter(folder => folder.id !== id);
    
    if (filteredFolders.length === folders.length) return false;
    
    this.saveFolders(filteredFolders);
    return true;
  }

  /**
   * Add card to folder
   */
  async addCardToFolder(folderId: string, card: Flashcard): Promise<StudyFolder | null> {
    const folders = await this.getFolders();
    const folderIndex = folders.findIndex(folder => folder.id === folderId);
    
    if (folderIndex === -1) return null;

    const updatedFolder = {
      ...folders[folderIndex],
      cards: [...folders[folderIndex].cards, card],
      cardCount: folders[folderIndex].cardCount + 1,
      updatedAt: new Date(),
    };

    folders[folderIndex] = updatedFolder;
    this.saveFolders(folders);
    
    return updatedFolder;
  }

  /**
   * Update card in folder
   */
  async updateCard(folderId: string, cardId: string, updates: Partial<Flashcard>): Promise<StudyFolder | null> {
    const folders = await this.getFolders();
    const folderIndex = folders.findIndex(folder => folder.id === folderId);
    
    if (folderIndex === -1) return null;

    const folder = folders[folderIndex];
    const cardIndex = folder.cards.findIndex(card => card.id === cardId);
    
    if (cardIndex === -1) return null;

    const updatedCard = {
      ...folder.cards[cardIndex],
      ...updates,
      updatedAt: new Date(),
    };

    folder.cards[cardIndex] = updatedCard;
    
    // Update mastery count
    const masteredCount = folder.cards.filter(card => card.mastered).length;
    
    const updatedFolder = {
      ...folder,
      masteredCount,
      updatedAt: new Date(),
    };

    folders[folderIndex] = updatedFolder;
    this.saveFolders(folders);
    
    return updatedFolder;
  }

  /**
   * Remove card from folder
   */
  async removeCardFromFolder(folderId: string, cardId: string): Promise<StudyFolder | null> {
    const folders = await this.getFolders();
    const folderIndex = folders.findIndex(folder => folder.id === folderId);
    
    if (folderIndex === -1) return null;

    const folder = folders[folderIndex];
    const updatedCards = folder.cards.filter(card => card.id !== cardId);
    
    if (updatedCards.length === folder.cards.length) return null;

    const updatedFolder = {
      ...folder,
      cards: updatedCards,
      cardCount: updatedCards.length,
      masteredCount: updatedCards.filter(card => card.mastered).length,
      updatedAt: new Date(),
    };

    folders[folderIndex] = updatedFolder;
    this.saveFolders(folders);
    
    return updatedFolder;
  }

  /**
   * Get folder statistics
   */
  async getFolderStats(folderId: string) {
    const folder = await this.getFolderById(folderId);
    if (!folder) return null;

    const totalCards = folder.cards.length;
    const masteredCards = folder.cards.filter(card => card.mastered).length;
    const cardsByDifficulty = {
      facil: folder.cards.filter(card => card.difficulty === 'facil').length,
      medio: folder.cards.filter(card => card.difficulty === 'medio').length,
      dificil: folder.cards.filter(card => card.difficulty === 'dificil').length,
    };

    const averageReviewCount = totalCards > 0 
      ? folder.cards.reduce((sum, card) => sum + card.reviewCount, 0) / totalCards 
      : 0;

    const masteryPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;

    return {
      totalCards,
      masteredCards,
      cardsByDifficulty,
      averageReviewCount,
      masteryPercentage,
    };
  }

  /**
   * Save folders to storage
   */
  private saveFolders(folders: StudyFolder[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving folders:', error);
    }
  }
}

export const folderService = new FolderService();