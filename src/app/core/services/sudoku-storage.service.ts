import { Injectable } from '@angular/core';
import { BestScores, Difficulty, SavedGameData, SudokuSessionStats } from '../models/sudoku.model';

const STORAGE_KEY_STATS = 'sudoku_session_stats_v1';
const STORAGE_KEY_DIFFICULTY = 'sudoku_last_difficulty_v1';
const STORAGE_KEY_SAVED_GAME = 'sudoku_saved_game_v1';

@Injectable({
  providedIn: 'root'
})
export class SudokuStorageService {
  private isStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__sudoku_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public getSavedDifficulty(): Difficulty {
    if (!this.isStorageAvailable()) return 'medium';
    try {
      const val = window.localStorage.getItem(STORAGE_KEY_DIFFICULTY);
      if (val === 'easy' || val === 'medium' || val === 'hard' || val === 'expert') {
        return val;
      }
    } catch {
      // Fallback
    }
    return 'medium';
  }

  public saveDifficulty(difficulty: Difficulty): void {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_DIFFICULTY, difficulty);
    } catch {
      // Graceful error handling
    }
  }

  public getSessionStats(): SudokuSessionStats {
    const defaultStats: SudokuSessionStats = {
      gamesStarted: 0,
      gamesCompleted: 0,
      bestTimes: {
        easy: null,
        medium: null,
        hard: null,
        expert: null
      }
    };

    if (!this.isStorageAvailable()) return defaultStats;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_STATS);
      if (!raw) return defaultStats;

      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          gamesStarted: typeof parsed.gamesStarted === 'number' ? parsed.gamesStarted : 0,
          gamesCompleted: typeof parsed.gamesCompleted === 'number' ? parsed.gamesCompleted : 0,
          bestTimes: {
            easy: typeof parsed.bestTimes?.easy === 'number' ? parsed.bestTimes.easy : null,
            medium: typeof parsed.bestTimes?.medium === 'number' ? parsed.bestTimes.medium : null,
            hard: typeof parsed.bestTimes?.hard === 'number' ? parsed.bestTimes.hard : null,
            expert: typeof parsed.bestTimes?.expert === 'number' ? parsed.bestTimes.expert : null
          }
        };
      }
    } catch {
      // Ignore corrupted stats
    }
    return defaultStats;
  }

  public recordGameStarted(): void {
    const stats = this.getSessionStats();
    stats.gamesStarted += 1;
    this.saveSessionStats(stats);
  }

  public recordGameWon(difficulty: Difficulty, elapsedSeconds: number): { isNewRecord: boolean } {
    const stats = this.getSessionStats();
    stats.gamesCompleted += 1;

    let isNewRecord = false;
    const currentBest = stats.bestTimes[difficulty];
    if (currentBest === null || elapsedSeconds < currentBest) {
      stats.bestTimes[difficulty] = elapsedSeconds;
      isNewRecord = true;
    }

    this.saveSessionStats(stats);
    return { isNewRecord };
  }

  private saveSessionStats(stats: SudokuSessionStats): void {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch {
      // Graceful error handling
    }
  }

  public getSavedGame(): SavedGameData | null {
    if (!this.isStorageAvailable()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_SAVED_GAME);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.gridValues) && Array.isArray(parsed.solution)) {
        return parsed as SavedGameData;
      }
    } catch {
      // Corrupt data fallback
    }
    return null;
  }

  public saveGame(gameData: SavedGameData): void {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(gameData));
    } catch {
      // Graceful error handling
    }
  }

  public clearSavedGame(): void {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY_SAVED_GAME);
    } catch {
      // Graceful error handling
    }
  }
}
