import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Difficulty,
  MoveRecord,
  Position,
  SudokuCellModel,
  SudokuSessionStats,
  SudokuValue
} from '../models/sudoku.model';
import { SudokuEngine } from './sudoku-engine';
import { SudokuStorageService } from './sudoku-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SudokuGameService {
  private storage = inject(SudokuStorageService);

  // Signals for state
  public readonly difficulty = signal<Difficulty>('medium');
  public readonly isPaused = signal<boolean>(false);
  public readonly isCompleted = signal<boolean>(false);
  public readonly elapsedSeconds = signal<number>(0);
  public readonly mistakes = signal<number>(0);
  public readonly hintsUsed = signal<number>(0);
  public readonly notesMode = signal<boolean>(false);
  public readonly autoClearNotes = signal<boolean>(true);

  // Selected cell position
  public readonly selectedCell = signal<Position | null>(null);

  // 9x9 Board signals (flat 81 cells or grid)
  public readonly board = signal<SudokuCellModel[][]>([]);

  // Original immutable solution & puzzle
  private solution: number[][] = [];
  private initialGivenMask: boolean[][] = [];

  // Undo history stack
  private undoStack: MoveRecord[] = [];

  // Timer interval reference
  private timerInterval: any = null;

  // Session stats signal
  public readonly sessionStats = signal<SudokuSessionStats>(this.storage.getSessionStats());

  // Message / status announcement for accessibility and toasts
  public readonly statusMessage = signal<string>('Welcome to Sudoku! Select a cell to start playing.');

  // Dialog completion visibility
  public readonly showCompletionDialog = signal<boolean>(false);
  public readonly isNewRecord = signal<boolean>(false);

  // Computed: Selected cell model
  public readonly activeCell = computed(() => {
    const sel = this.selectedCell();
    if (!sel) return null;
    return this.board()[sel.row]?.[sel.col] ?? null;
  });

  // Computed: Number of remaining empty cells
  public readonly remainingNumbersCount = computed(() => {
    const counts: Record<number, number> = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 };
    const b = this.board();
    if (!b || b.length === 0) return counts;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = b[r][c].value;
        if (val && counts[val] !== undefined) {
          counts[val]--;
        }
      }
    }
    return counts;
  });

  constructor() {
    const savedDiff = this.storage.getSavedDifficulty();
    this.difficulty.set(savedDiff);
  }

  /**
   * Initializes a new game or restores saved game
   */
  public initGame(forceNew = false): void {
    this.stopTimer();

    const savedGame = !forceNew ? this.storage.getSavedGame() : null;
    if (savedGame && savedGame.difficulty === this.difficulty() && !forceNew) {
      this.restoreGame(savedGame);
    } else {
      this.startNewGame(this.difficulty());
    }
  }

  /**
   * Starts a completely new game with a freshly generated puzzle
   */
  public startNewGame(difficulty: Difficulty): void {
    this.stopTimer();
    this.difficulty.set(difficulty);
    this.storage.saveDifficulty(difficulty);

    const generated = SudokuEngine.generatePuzzle(difficulty);
    this.solution = generated.solution;
    this.initialGivenMask = generated.puzzle.map(row => row.map(cell => cell !== 0));

    // Construct 9x9 cells
    const newBoard: SudokuCellModel[][] = [];
    for (let r = 0; r < 9; r++) {
      const rowCells: SudokuCellModel[] = [];
      for (let c = 0; c < 9; c++) {
        const isGiven = this.initialGivenMask[r][c];
        const val = isGiven ? (generated.puzzle[r][c] as SudokuValue) : null;
        rowCells.push({
          id: `${r}-${c}`,
          row: r,
          col: c,
          box: Math.floor(r / 3) * 3 + Math.floor(c / 3),
          value: val,
          solutionValue: generated.solution[r][c],
          isGiven,
          notes: new Set<number>(),
          hasConflict: false
        });
      }
      newBoard.push(rowCells);
    }

    this.board.set(newBoard);
    this.selectedCell.set(null);
    this.elapsedSeconds.set(0);
    this.mistakes.set(0);
    this.hintsUsed.set(0);
    this.isPaused.set(false);
    this.isCompleted.set(false);
    this.showCompletionDialog.set(false);
    this.isNewRecord.set(false);
    this.undoStack = [];

    this.storage.recordGameStarted();
    this.sessionStats.set(this.storage.getSessionStats());
    this.saveCurrentGame();
    this.startTimer();

    this.announce(`New ${difficulty} game started. Good luck!`);
  }

  /**
   * Restarts the current puzzle back to original clues
   */
  public restartGame(): void {
    this.stopTimer();
    const currentBoard = this.board();
    if (!currentBoard || currentBoard.length === 0) return;

    const resetBoard: SudokuCellModel[][] = [];
    for (let r = 0; r < 9; r++) {
      const rowCells: SudokuCellModel[] = [];
      for (let c = 0; c < 9; c++) {
        const prev = currentBoard[r][c];
        rowCells.push({
          ...prev,
          value: prev.isGiven ? prev.value : null,
          notes: new Set<number>(),
          hasConflict: false
        });
      }
      resetBoard.push(rowCells);
    }

    this.board.set(resetBoard);
    this.selectedCell.set(null);
    this.elapsedSeconds.set(0);
    this.mistakes.set(0);
    this.hintsUsed.set(0);
    this.isPaused.set(false);
    this.isCompleted.set(false);
    this.showCompletionDialog.set(false);
    this.isNewRecord.set(false);
    this.undoStack = [];

    this.saveCurrentGame();
    this.startTimer();
    this.announce('Game restarted.');
  }

  /**
   * Restores a previously saved game from local storage
   */
  private restoreGame(data: any): void {
    this.difficulty.set(data.difficulty);
    this.elapsedSeconds.set(data.elapsedSeconds || 0);
    this.mistakes.set(data.mistakes || 0);
    this.hintsUsed.set(data.hintsUsed || 0);
    this.solution = data.solution;
    this.initialGivenMask = data.givenMask;

    const restoredBoard: SudokuCellModel[][] = [];
    for (let r = 0; r < 9; r++) {
      const rowCells: SudokuCellModel[] = [];
      for (let c = 0; c < 9; c++) {
        const isGiven = data.givenMask[r][c];
        const notesArray = data.notes?.[r]?.[c] || [];
        rowCells.push({
          id: `${r}-${c}`,
          row: r,
          col: c,
          box: Math.floor(r / 3) * 3 + Math.floor(c / 3),
          value: data.gridValues[r][c] as SudokuValue,
          solutionValue: data.solution[r][c],
          isGiven,
          notes: new Set<number>(notesArray),
          hasConflict: false
        });
      }
      restoredBoard.push(rowCells);
    }

    this.board.set(restoredBoard);
    this.recomputeConflicts();
    this.startTimer();
    this.announce('Saved game restored.');
  }

  /**
   * Persists active game to localStorage
   */
  private saveCurrentGame(): void {
    if (this.isCompleted()) {
      this.storage.clearSavedGame();
      return;
    }

    const currentBoard = this.board();
    if (!currentBoard || currentBoard.length === 0) return;

    const gridValues = currentBoard.map(row => row.map(c => c.value));
    const notes = currentBoard.map(row => row.map(c => Array.from(c.notes)));

    this.storage.saveGame({
      version: 1,
      difficulty: this.difficulty(),
      elapsedSeconds: this.elapsedSeconds(),
      mistakes: this.mistakes(),
      hintsUsed: this.hintsUsed(),
      gridValues,
      givenMask: this.initialGivenMask,
      notes,
      solution: this.solution,
      timestamp: Date.now()
    });
  }

  /**
   * Selection handling
   */
  public selectCell(row: number, col: number): void {
    if (this.isPaused() || this.isCompleted()) return;
    if (row < 0 || row > 8 || col < 0 || col > 8) return;

    this.selectedCell.set({ row, col });
    const cell = this.board()[row][col];
    const valText = cell.value ? `value ${cell.value}` : 'empty';
    this.announce(`Selected row ${row + 1}, column ${col + 1}, ${cell.isGiven ? 'clue' : valText}`);
  }

  public moveSelection(dRow: number, dCol: number): void {
    if (this.isPaused() || this.isCompleted()) return;
    const current = this.selectedCell() ?? { row: 0, col: 0 };
    const nextRow = Math.max(0, Math.min(8, current.row + dRow));
    const nextCol = Math.max(0, Math.min(8, current.col + dCol));
    this.selectCell(nextRow, nextCol);
  }

  /**
   * Toggles notes / pencil mark mode
   */
  public toggleNotesMode(): void {
    this.notesMode.update(m => !m);
    this.announce(`Notes mode ${this.notesMode() ? 'enabled' : 'disabled'}.`);
  }

  /**
   * Toggles auto-clear notes setting
   */
  public toggleAutoClearNotes(): void {
    this.autoClearNotes.update(v => !v);
  }

  /**
   * Primary input action: Enters a digit (1-9) or toggles pencil mark
   */
  public enterNumber(num: number): void {
    if (this.isPaused() || this.isCompleted()) return;
    if (num < 1 || num > 9) return;

    const sel = this.selectedCell();
    if (!sel) {
      this.announce('Select a cell first.');
      return;
    }

    const { row, col } = sel;
    const currentBoard = this.board();
    const cell = currentBoard[row][col];

    if (cell.isGiven) {
      this.announce('Original clues cannot be modified.');
      return;
    }

    if (this.notesMode()) {
      // Toggle note candidate
      const prevNotes = Array.from(cell.notes);
      const newNotesSet = new Set(cell.notes);
      if (newNotesSet.has(num)) {
        newNotesSet.delete(num);
      } else {
        newNotesSet.add(num);
      }

      this.undoStack.push({
        row,
        col,
        prevValue: cell.value,
        newValue: cell.value,
        prevNotes,
        newNotes: Array.from(newNotesSet)
      });

      this.updateCell(row, col, { notes: newNotesSet });
      this.announce(`Toggled note ${num} at row ${row + 1}, column ${col + 1}.`);
      return;
    }

    // Number entry mode
    if (cell.value === num) {
      // Already has this value - erase it
      this.eraseCell();
      return;
    }

    const prevValue = cell.value;
    const prevNotes = Array.from(cell.notes);

    // Check if placing `num` at (row, col) causes a visible conflict in row, column, or 3x3 box
    const causesConflict = this.causesConflict(currentBoard, row, col, num);

    if (causesConflict) {
      this.mistakes.update(m => m + 1);
      this.announce(`Conflict with existing number ${num} in the same row, column, or 3x3 box. Mistakes: ${this.mistakes()}.`);
    } else {
      this.announce(`Placed ${num} at row ${row + 1}, column ${col + 1}.`);
    }

    // Auto-clear notes from peer cells if enabled
    const autoClearedNotes: { row: number; col: number; val: number }[] = [];
    if (this.autoClearNotes()) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if ((r === row || c === col || Math.floor(r / 3) * 3 + Math.floor(c / 3) === cell.box) && !(r === row && c === col)) {
            const peer = currentBoard[r][c];
            if (peer.notes.has(num)) {
              autoClearedNotes.push({ row: r, col: c, val: num });
              peer.notes.delete(num);
            }
          }
        }
      }
    }

    this.undoStack.push({
      row,
      col,
      prevValue,
      newValue: num as SudokuValue,
      prevNotes,
      newNotes: [],
      autoClearedNotes
    });

    this.updateCell(row, col, {
      value: num as SudokuValue,
      notes: new Set<number>()
    });

    this.recomputeConflicts();
    this.saveCurrentGame();
    this.checkGameCompletion();
  }

  /**
   * Erases value / notes in the currently selected cell
   */
  public eraseCell(): void {
    if (this.isPaused() || this.isCompleted()) return;
    const sel = this.selectedCell();
    if (!sel) return;

    const { row, col } = sel;
    const cell = this.board()[row][col];
    if (cell.isGiven) return;

    if (cell.value === null && cell.notes.size === 0) return;

    this.undoStack.push({
      row,
      col,
      prevValue: cell.value,
      newValue: null,
      prevNotes: Array.from(cell.notes),
      newNotes: []
    });

    this.updateCell(row, col, {
      value: null,
      notes: new Set<number>()
    });

    this.recomputeConflicts();
    this.saveCurrentGame();
    this.announce(`Cleared cell at row ${row + 1}, column ${col + 1}.`);
  }

  /**
   * Undoes the last move
   */
  public undo(): void {
    if (this.isPaused() || this.isCompleted()) return;
    const lastMove = this.undoStack.pop();
    if (!lastMove) {
      this.announce('Nothing to undo.');
      return;
    }

    const { row, col, prevValue, prevNotes, autoClearedNotes } = lastMove;

    this.updateCell(row, col, {
      value: prevValue,
      notes: new Set<number>(prevNotes)
    });

    // Restore any auto-cleared notes in peer cells
    if (autoClearedNotes && autoClearedNotes.length > 0) {
      const currentBoard = this.board();
      for (const item of autoClearedNotes) {
        currentBoard[item.row][item.col].notes.add(item.val);
      }
    }

    this.selectedCell.set({ row, col });
    this.recomputeConflicts();
    this.saveCurrentGame();
    this.announce(`Undo move at row ${row + 1}, column ${col + 1}.`);
  }

  /**
   * Clears notes across all cells
   */
  public clearAllNotes(): void {
    if (this.isPaused() || this.isCompleted()) return;
    const currentBoard = this.board();
    let clearedCount = 0;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c].notes.size > 0) {
          clearedCount++;
          currentBoard[r][c].notes.clear();
        }
      }
    }

    if (clearedCount > 0) {
      this.board.set([...currentBoard]);
      this.saveCurrentGame();
      this.announce('All pencil marks cleared.');
    } else {
      this.announce('No notes to clear.');
    }
  }

  /**
   * Checks current board for any errors/conflicts and reports feedback
   */
  public checkErrors(): void {
    if (this.isPaused() || this.isCompleted()) return;
    this.recomputeConflicts();
    const currentBoard = this.board();
    let conflictCount = 0;
    let incorrectCount = 0;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = currentBoard[r][c];
        if (cell.hasConflict) conflictCount++;
        if (cell.value && cell.value !== cell.solutionValue) incorrectCount++;
      }
    }

    if (conflictCount === 0 && incorrectCount === 0) {
      this.announce('Great! All entered numbers are correct with no conflicts.');
    } else {
      this.announce(`Found ${conflictCount} rule conflict(s) and ${incorrectCount} incorrect entry(ies).`);
    }
  }

  /**
   * Provides a hint by revealing the solution digit for a cell
   */
  public giveHint(): void {
    if (this.isPaused() || this.isCompleted()) return;

    let target: Position | null = this.selectedCell();

    // If selected cell is given or already correct, find first empty or incorrect cell
    if (target) {
      const cell = this.board()[target.row][target.col];
      if (cell.isGiven || cell.value === cell.solutionValue) {
        target = null;
      }
    }

    if (!target) {
      // Find eligible empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const cell = this.board()[r][c];
          if (!cell.isGiven && cell.value !== cell.solutionValue) {
            target = { row: r, col: c };
            break;
          }
        }
        if (target) break;
      }
    }

    if (!target) {
      this.announce('Puzzle is already solved!');
      return;
    }

    const { row, col } = target;
    const targetCell = this.board()[row][col];
    const correctVal = targetCell.solutionValue;

    this.hintsUsed.update(h => h + 1);
    this.selectedCell.set(target);

    this.undoStack.push({
      row,
      col,
      prevValue: targetCell.value,
      newValue: correctVal as SudokuValue,
      prevNotes: Array.from(targetCell.notes),
      newNotes: []
    });

    this.updateCell(row, col, {
      value: correctVal as SudokuValue,
      notes: new Set<number>()
    });

    this.recomputeConflicts();
    this.saveCurrentGame();
    this.announce(`Hint: Row ${row + 1}, column ${col + 1} is ${correctVal}.`);
    this.checkGameCompletion();
  }

  /**
   * Reveals complete solution with user confirmation
   */
  public solvePuzzle(): void {
    if (this.isPaused() || this.isCompleted()) return;

    const currentBoard = this.board();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        currentBoard[r][c].value = currentBoard[r][c].solutionValue as SudokuValue;
        currentBoard[r][c].notes.clear();
        currentBoard[r][c].hasConflict = false;
      }
    }

    this.board.set([...currentBoard]);
    this.stopTimer();
    this.isCompleted.set(true);
    this.storage.clearSavedGame();
    this.announce('Solution revealed.');
  }

  /**
   * Pauses / resumes game and timer
   */
  public togglePause(): void {
    if (this.isCompleted()) return;
    const nextState = !this.isPaused();
    this.isPaused.set(nextState);

    if (nextState) {
      this.stopTimer();
      this.announce('Game paused.');
    } else {
      this.startTimer();
      this.announce('Game resumed.');
    }
  }

  /**
   * Validates if game is finished and handles win condition
   */
  private checkGameCompletion(): void {
    if (this.isCompleted()) return;

    const currentBoard = this.board();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = currentBoard[r][c];
        if (!cell.value || cell.value !== cell.solutionValue) {
          return; // Not complete
        }
      }
    }

    // Won the game!
    this.stopTimer();
    this.isCompleted.set(true);

    const recordResult = this.storage.recordGameWon(this.difficulty(), this.elapsedSeconds());
    this.isNewRecord.set(recordResult.isNewRecord);
    this.sessionStats.set(this.storage.getSessionStats());
    this.storage.clearSavedGame();
    this.showCompletionDialog.set(true);

    this.announce(`Congratulations! You solved the puzzle in ${this.formatTime(this.elapsedSeconds())}!`);
  }

  public closeCompletionDialog(): void {
    this.showCompletionDialog.set(false);
  }

  /**
   * Timer management
   */
  private startTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPaused() && !this.isCompleted()) {
        this.elapsedSeconds.update(s => s + 1);
        if (this.elapsedSeconds() % 10 === 0) {
          this.saveCurrentGame();
        }
      }
    }, 1000);
  }

  public stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateCell(row: number, col: number, partial: Partial<SudokuCellModel>): void {
    const current = this.board();
    const updated = current.map((rArr, rIdx) => {
      if (rIdx !== row) return rArr;
      return rArr.map((cCell, cIdx) => {
        if (cIdx !== col) return cCell;
        return { ...cCell, ...partial };
      });
    });
    this.board.set(updated);
  }

  private recomputeConflicts(): void {
    const grid = this.board().map(row => row.map(cell => cell.value));
    const conflicts = SudokuEngine.detectConflicts(grid);

    const current = this.board();
    const updated = current.map((rArr, r) =>
      rArr.map((cell, c) => ({
        ...cell,
        hasConflict: conflicts[r][c]
      }))
    );
    this.board.set(updated);
  }

  private causesConflict(board: SudokuCellModel[][], row: number, col: number, num: number): boolean {
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 9; i++) {
      // Row check
      if (i !== col && board[row][i].value === num) {
        return true;
      }
      // Col check
      if (i !== row && board[i][col].value === num) {
        return true;
      }
    }

    // 3x3 box check
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const curR = boxStartRow + r;
        const curC = boxStartCol + c;
        if ((curR !== row || curC !== col) && board[curR][curC].value === num) {
          return true;
        }
      }
    }

    return false;
  }

  private announce(msg: string): void {
    this.statusMessage.set(msg);
  }

  public formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}
