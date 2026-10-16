import { Difficulty } from '../models/sudoku.model';

export type Grid9x9 = number[][]; // 0 or null represents empty, 1-9 for filled

export interface GeneratedPuzzle {
  puzzle: number[][]; // 0 represents empty
  solution: number[][]; // 1-9
  difficulty: Difficulty;
}

export class SudokuEngine {
  /**
   * Clones a 9x9 grid
   */
  public static cloneGrid(grid: number[][]): number[][] {
    return grid.map(row => [...row]);
  }

  /**
   * Creates an empty 9x9 grid filled with 0s
   */
  public static createEmptyGrid(): number[][] {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  /**
   * Checks if placing num at grid[row][col] is valid according to Sudoku rules.
   */
  public static isValidPlacement(
    grid: number[][],
    row: number,
    col: number,
    num: number
  ): boolean {
    if (num < 1 || num > 9) return false;

    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) {
        return false;
      }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const currR = startRow + r;
        const currC = startCol + c;
        if ((currR !== row || currC !== col) && grid[currR][currC] === num) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Returns bitmask of available candidate numbers (1..9) for cell (row, col).
   * Bit k (1..9) is 1 if candidate k is valid.
   */
  public static getCandidateMask(grid: number[][], row: number, col: number): number {
    let mask = 0x3fe; // Bits 1 to 9 set (binary 1111111110)

    for (let c = 0; c < 9; c++) {
      const val = grid[row][c];
      if (val) mask &= ~(1 << val);
    }

    for (let r = 0; r < 9; r++) {
      const val = grid[r][col];
      if (val) mask &= ~(1 << val);
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const val = grid[startRow + r][startCol + c];
        if (val) mask &= ~(1 << val);
      }
    }

    return mask;
  }

  /**
   * Checks if a completed or partial board contains any conflicts.
   * Returns a 9x9 boolean matrix indicating conflict status of each cell.
   */
  public static detectConflicts(grid: (number | null)[][]): boolean[][] {
    const conflicts = Array.from({ length: 9 }, () => Array(9).fill(false));

    // Check rows
    for (let r = 0; r < 9; r++) {
      const seen = new Map<number, number[]>();
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c];
        if (val && val >= 1 && val <= 9) {
          if (!seen.has(val)) seen.set(val, []);
          seen.get(val)!.push(c);
        }
      }
      for (const cols of seen.values()) {
        if (cols.length > 1) {
          for (const c of cols) conflicts[r][c] = true;
        }
      }
    }

    // Check columns
    for (let c = 0; c < 9; c++) {
      const seen = new Map<number, number[]>();
      for (let r = 0; r < 9; r++) {
        const val = grid[r][c];
        if (val && val >= 1 && val <= 9) {
          if (!seen.has(val)) seen.set(val, []);
          seen.get(val)!.push(r);
        }
      }
      for (const rows of seen.values()) {
        if (rows.length > 1) {
          for (const r of rows) conflicts[r][c] = true;
        }
      }
    }

    // Check 3x3 boxes
    for (let b = 0; b < 9; b++) {
      const startR = Math.floor(b / 3) * 3;
      const startC = (b % 3) * 3;
      const seen = new Map<number, { r: number; c: number }[]>();

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const currR = startR + r;
          const currC = startC + c;
          const val = grid[currR][currC];
          if (val && val >= 1 && val <= 9) {
            if (!seen.has(val)) seen.set(val, []);
            seen.get(val)!.push({ r: currR, c: currC });
          }
        }
      }

      for (const positions of seen.values()) {
        if (positions.length > 1) {
          for (const pos of positions) conflicts[pos.r][pos.c] = true;
        }
      }
    }

    return conflicts;
  }

  /**
   * Finds empty cell with Minimum Remaining Values (MRV).
   * Returns null if no empty cells remain.
   */
  private static findBestEmptyCell(grid: number[][]): { row: number; col: number; candidates: number[] } | null {
    let minCandidateCount = 10;
    let bestCell: { row: number; col: number; candidates: number[] } | null = null;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const mask = this.getCandidateMask(grid, r, c);
          const candidates: number[] = [];
          for (let num = 1; num <= 9; num++) {
            if ((mask & (1 << num)) !== 0) {
              candidates.push(num);
            }
          }

          // If a cell has 0 candidates, unsolvable in current branch
          if (candidates.length === 0) {
            return { row: r, col: c, candidates: [] };
          }

          if (candidates.length < minCandidateCount) {
            minCandidateCount = candidates.length;
            bestCell = { row: r, col: c, candidates };
            if (minCandidateCount === 1) {
              return bestCell; // Can't get fewer candidates than 1
            }
          }
        }
      }
    }

    return bestCell;
  }

  /**
   * Checks if any given cells conflict with each other
   */
  public static hasAnyInitialConflict(grid: (number | null)[][]): boolean {
    const conflicts = this.detectConflicts(grid);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (conflicts[r][c]) return true;
      }
    }
    return false;
  }

  /**
   * Solves a Sudoku puzzle using backtracking with MRV heuristic.
   * Modifies the input grid in place and returns true if solvable, false otherwise.
   */
  public static solve(grid: number[][]): boolean {
    if (this.hasAnyInitialConflict(grid)) {
      return false;
    }
    return this.solveRecursive(grid);
  }

  private static solveRecursive(grid: number[][]): boolean {
    const best = this.findBestEmptyCell(grid);
    if (!best) {
      return true; // No empty cells -> Solved!
    }
    if (best.candidates.length === 0) {
      return false; // Dead end
    }

    const { row, col, candidates } = best;
    for (const num of candidates) {
      grid[row][col] = num;
      if (this.solveRecursive(grid)) {
        return true;
      }
      grid[row][col] = 0;
    }

    return false;
  }

  /**
   * Counts solutions up to maxCount (default 2) using MRV.
   * Stops early once maxCount is reached to prevent unnecessary backtracking.
   */
  public static countSolutions(grid: number[][], maxCount = 2): number {
    if (this.hasAnyInitialConflict(grid)) {
      return 0;
    }
    let count = 0;

    const backtrack = (g: number[][]): void => {
      if (count >= maxCount) return;

      const best = this.findBestEmptyCell(g);
      if (!best) {
        count++;
        return;
      }
      if (best.candidates.length === 0) {
        return;
      }

      const { row, col, candidates } = best;
      for (const num of candidates) {
        g[row][col] = num;
        backtrack(g);
        g[row][col] = 0;
        if (count >= maxCount) return;
      }
    };

    const copy = this.cloneGrid(grid);
    backtrack(copy);
    return count;
  }

  /**
   * Checks if the puzzle has exactly one unique solution.
   */
  public static hasUniqueSolution(grid: number[][]): boolean {
    return this.countSolutions(grid, 2) === 1;
  }

  /**
   * Generates a complete, valid, randomized 9x9 Sudoku board.
   */
  public static generateCompletedBoard(): number[][] {
    const board = this.createEmptyGrid();

    // Fill diagonal 3x3 boxes first (independent of each other)
    for (let box = 0; box < 9; box += 4) {
      const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const startR = Math.floor(box / 3) * 3;
      const startC = (box % 3) * 3;
      let idx = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          board[startR + r][startC + c] = nums[idx++];
        }
      }
    }

    // Now solve the rest with randomized candidate order
    const fill = (grid: number[][]): boolean => {
      const best = this.findBestEmptyCell(grid);
      if (!best) return true;
      if (best.candidates.length === 0) return false;

      const { row, col, candidates } = best;
      const shuffledCandidates = this.shuffle(candidates);

      for (const num of shuffledCandidates) {
        grid[row][col] = num;
        if (fill(grid)) return true;
        grid[row][col] = 0;
      }
      return false;
    };

    fill(board);
    return board;
  }

  /**
   * Generates a new puzzle with unique solution for the given difficulty.
   * Clue counts:
   * Easy: ~38-42
   * Medium: ~32-36
   * Hard: ~28-31
   * Expert: ~24-27
   */
  public static generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
    let targetClues: number;
    switch (difficulty) {
      case 'easy':
        targetClues = 40;
        break;
      case 'medium':
        targetClues = 34;
        break;
      case 'hard':
        targetClues = 29;
        break;
      case 'expert':
        targetClues = 26;
        break;
    }

    const solution = this.generateCompletedBoard();
    const puzzle = this.cloneGrid(solution);

    // List all 81 positions and shuffle
    const positions: { r: number; c: number }[] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        positions.push({ r, c });
      }
    }
    const shuffledPositions = this.shuffle(positions);

    let cluesRemaining = 81;

    for (const pos of shuffledPositions) {
      if (cluesRemaining <= targetClues) {
        break;
      }

      const temp = puzzle[pos.r][pos.c];
      puzzle[pos.r][pos.c] = 0;

      // Ensure uniqueness
      if (!this.hasUniqueSolution(puzzle)) {
        // Restore clue if uniqueness is lost
        puzzle[pos.r][pos.c] = temp;
      } else {
        cluesRemaining--;
      }
    }

    return {
      puzzle,
      solution,
      difficulty
    };
  }

  /**
   * Shuffles an array in place using Fisher-Yates
   */
  public static shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Verifies if a given board matches the completed valid rules
   */
  public static isCompleteAndValid(grid: (number | null)[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c];
        if (!val || val < 1 || val > 9) return false;
      }
    }

    const conflicts = this.detectConflicts(grid);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (conflicts[r][c]) return false;
      }
    }

    return true;
  }
}
