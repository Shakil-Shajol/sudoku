import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SudokuGameService } from './sudoku-game.service';
import { SudokuStorageService } from './sudoku-storage.service';

describe('SudokuGameService', () => {
  let service: SudokuGameService;
  let storage: SudokuStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [SudokuGameService, SudokuStorageService]
    });
    service = TestBed.inject(SudokuGameService);
    storage = TestBed.inject(SudokuStorageService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    service.stopTimer();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('initializes game with 9x9 board and correct structure', () => {
    service.startNewGame('easy');
    const board = service.board();
    expect(board.length).toBe(9);
    expect(board[0].length).toBe(9);
    expect(service.isCompleted()).toBe(false);
    expect(service.isPaused()).toBe(false);
    expect(service.mistakes()).toBe(0);
  });

  it('selects cells and updates selection state', () => {
    service.startNewGame('easy');
    service.selectCell(2, 4);
    expect(service.selectedCell()).toEqual({ row: 2, col: 4 });
    expect(service.activeCell()?.row).toBe(2);
    expect(service.activeCell()?.col).toBe(4);
  });

  it('prevents modifying original clue cells', () => {
    service.startNewGame('easy');
    const board = service.board();

    // Find a given cell
    let givenPos = { row: 0, col: 0 };
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c].isGiven) {
          givenPos = { row: r, col: c };
          break;
        }
      }
    }

    service.selectCell(givenPos.row, givenPos.col);
    const originalValue = board[givenPos.row][givenPos.col].value;
    const testNum = originalValue === 9 ? 1 : 9;

    service.enterNumber(testNum);
    expect(service.board()[givenPos.row][givenPos.col].value).toBe(originalValue);
  });

  it('enters a digit and tracks mistakes when a visible conflict is created', () => {
    service.startNewGame('easy');
    const board = service.board();

    // Find an empty cell and a peer given cell to conflict with
    let emptyPos = { row: 0, col: 0 };
    let conflictVal = 1;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].isGiven) {
          // Look for a given clue in the same row
          const peerGiven = board[r].find(cell => cell.isGiven && cell.value !== null);
          if (peerGiven && peerGiven.value !== null) {
            emptyPos = { row: r, col: c };
            conflictVal = peerGiven.value;
            break;
          }
        }
      }
    }

    service.selectCell(emptyPos.row, emptyPos.col);
    expect(service.mistakes()).toBe(0);

    service.enterNumber(conflictVal);
    expect(service.board()[emptyPos.row][emptyPos.col].value).toBe(conflictVal);
    expect(service.board()[emptyPos.row][emptyPos.col].hasConflict).toBe(true);
    expect(service.mistakes()).toBe(1);
  });

  it('supports undoing number entries and note toggles', () => {
    service.startNewGame('easy');
    const board = service.board();

    let emptyPos = { row: 0, col: 0 };
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].isGiven) {
          emptyPos = { row: r, col: c };
          break;
        }
      }
    }

    service.selectCell(emptyPos.row, emptyPos.col);
    service.enterNumber(5);
    expect(service.board()[emptyPos.row][emptyPos.col].value).toBe(5);

    service.undo();
    expect(service.board()[emptyPos.row][emptyPos.col].value).toBe(null);
  });

  it('supports pencil marks / notes mode', () => {
    service.startNewGame('easy');
    const board = service.board();

    let emptyPos = { row: 0, col: 0 };
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!board[r][c].isGiven) {
          emptyPos = { row: r, col: c };
          break;
        }
      }
    }

    service.selectCell(emptyPos.row, emptyPos.col);
    service.toggleNotesMode();
    expect(service.notesMode()).toBe(true);

    service.enterNumber(3);
    service.enterNumber(7);
    const cell = service.board()[emptyPos.row][emptyPos.col];
    expect(cell.notes.has(3)).toBe(true);
    expect(cell.notes.has(7)).toBe(true);

    // Toggle off note 3
    service.enterNumber(3);
    const updatedCell = service.board()[emptyPos.row][emptyPos.col];
    expect(updatedCell.notes.has(3)).toBe(false);
    expect(updatedCell.notes.has(7)).toBe(true);
  });

  it('handles pause and resume timer properly', () => {
    service.startNewGame('easy');
    expect(service.isPaused()).toBe(false);
    vi.advanceTimersByTime(2000);
    expect(service.elapsedSeconds()).toBe(2);

    service.togglePause();
    expect(service.isPaused()).toBe(true);
    vi.advanceTimersByTime(3000);
    // Should NOT increase while paused
    expect(service.elapsedSeconds()).toBe(2);

    service.togglePause();
    expect(service.isPaused()).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(service.elapsedSeconds()).toBe(3);
  });

  it('provides a hint for an empty cell without corrupting given clues', () => {
    service.startNewGame('easy');
    service.giveHint();
    expect(service.hintsUsed()).toBe(1);

    const sel = service.selectedCell();
    expect(sel).not.toBeNull();
    if (sel) {
      const cell = service.board()[sel.row][sel.col];
      expect(cell.value).toBe(cell.solutionValue);
    }
  });

  it('restarts game back to original state and resets elapsed time', () => {
    service.startNewGame('easy');
    vi.advanceTimersByTime(5000);
    expect(service.elapsedSeconds()).toBe(5);

    service.restartGame();
    expect(service.elapsedSeconds()).toBe(0);
    expect(service.mistakes()).toBe(0);
    expect(service.hintsUsed()).toBe(0);
  });

  it('detects game completion and prevents duplicate win events', () => {
    service.startNewGame('easy');
    service.solvePuzzle();
    expect(service.isCompleted()).toBe(true);
    const currentCompleted = storage.getSessionStats().gamesCompleted;

    // Triggering another check or action shouldn't count duplicate
    service.enterNumber(5);
    expect(storage.getSessionStats().gamesCompleted).toBe(currentCompleted);
  });
});
