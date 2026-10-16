export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

export interface Position {
  row: number; // 0-8
  col: number; // 0-8
}

export interface SudokuCellModel {
  id: string; // e.g. "0-4"
  row: number;
  col: number;
  box: number; // 0-8
  value: SudokuValue;
  solutionValue: number; // 1-9
  isGiven: boolean; // Original puzzle clue
  notes: Set<number>; // Pencil marks 1-9
  hasConflict: boolean;
}

export interface MoveRecord {
  row: number;
  col: number;
  prevValue: SudokuValue;
  newValue: SudokuValue;
  prevNotes: number[];
  newNotes: number[];
  autoClearedNotes?: { row: number; col: number; val: number }[];
}

export interface SudokuGameState {
  difficulty: Difficulty;
  isPaused: boolean;
  isCompleted: boolean;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  notesMode: boolean;
  autoClearNotes: boolean;
}

export interface BestScores {
  easy: number | null;
  medium: number | null;
  hard: number | null;
  expert: number | null;
}

export interface SudokuSessionStats {
  gamesStarted: number;
  gamesCompleted: number;
  bestTimes: BestScores;
}

export interface SavedGameData {
  version: number;
  difficulty: Difficulty;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  gridValues: (number | null)[][];
  givenMask: boolean[][];
  notes: number[][][]; // 9x9 array of number arrays
  solution: number[][];
  timestamp: number;
}
