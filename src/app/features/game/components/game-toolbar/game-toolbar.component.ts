import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

@Component({
  selector: 'app-game-toolbar',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-[500px] mx-auto mt-4 px-2">
      <!-- Primary Game Action Tools -->
      <div class="grid grid-cols-5 gap-2">
        <!-- Undo -->
        <button
          type="button"
          (click)="gameService.undo()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          aria-label="Undo move"
          class="flex flex-col items-center justify-center py-2.5 px-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-95 transition text-slate-700 dark:text-slate-200 disabled:opacity-40"
        >
          <span class="text-lg">↩️</span>
          <span class="text-[11px] font-semibold mt-1">Undo</span>
        </button>

        <!-- Erase -->
        <button
          type="button"
          (click)="gameService.eraseCell()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          aria-label="Erase cell"
          class="flex flex-col items-center justify-center py-2.5 px-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-95 transition text-slate-700 dark:text-slate-200 disabled:opacity-40"
        >
          <span class="text-lg">🧹</span>
          <span class="text-[11px] font-semibold mt-1">Erase</span>
        </button>

        <!-- Notes Mode -->
        <button
          type="button"
          (click)="gameService.toggleNotesMode()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          aria-label="Toggle notes mode"
          class="relative flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border shadow-sm active:scale-95 transition disabled:opacity-40"
          [ngClass]="{
            'bg-blue-600 border-blue-600 text-white shadow-blue-500/20': gameService.notesMode(),
            'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60': !gameService.notesMode()
          }"
        >
          <span class="text-lg">✏️</span>
          <div class="flex items-center gap-1 mt-1">
            <span class="text-[11px] font-semibold">Notes</span>
            <span
              class="text-[9px] px-1 rounded font-bold"
              [ngClass]="gameService.notesMode() ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'"
            >
              {{ gameService.notesMode() ? 'ON' : 'OFF' }}
            </span>
          </div>
        </button>

        <!-- Hint -->
        <button
          type="button"
          (click)="gameService.giveHint()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          aria-label="Use hint"
          class="flex flex-col items-center justify-center py-2.5 px-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-95 transition text-slate-700 dark:text-slate-200 disabled:opacity-40"
        >
          <span class="text-lg">💡</span>
          <span class="text-[11px] font-semibold mt-1">Hint</span>
        </button>

        <!-- Check Errors -->
        <button
          type="button"
          (click)="gameService.checkErrors()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          aria-label="Check errors"
          class="flex flex-col items-center justify-center py-2.5 px-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-95 transition text-slate-700 dark:text-slate-200 disabled:opacity-40"
        >
          <span class="text-lg">🔍</span>
          <span class="text-[11px] font-semibold mt-1">Check</span>
        </button>
      </div>

      <!-- Secondary Controls & Actions row -->
      <div class="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          (click)="gameService.clearAllNotes()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          class="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition disabled:opacity-40"
        >
          Clear All Notes
        </button>

        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            [checked]="gameService.autoClearNotes()"
            (change)="gameService.toggleAutoClearNotes()"
            class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
          />
          <span>Auto-clear notes</span>
        </label>

        <button
          type="button"
          (click)="confirmSolve.set(true)"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          class="hover:text-red-600 dark:hover:text-red-400 font-medium transition disabled:opacity-40"
        >
          Solve Puzzle
        </button>
      </div>

      <!-- Solve Confirmation Modal -->
      @if (confirmSolve()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <h4 class="text-lg font-bold text-slate-900 dark:text-slate-100">Reveal Complete Solution?</h4>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to reveal the solved board? This will end the current game.
            </p>
            <div class="flex gap-3 justify-center pt-2">
              <button
                type="button"
                (click)="confirmSolve.set(false)"
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="doSolve()"
                class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow transition"
              >
                Reveal Solution
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class GameToolbarComponent {
  public gameService = inject(SudokuGameService);
  public confirmSolve = signal<boolean>(false);

  public doSolve(): void {
    this.confirmSolve.set(false);
    this.gameService.solvePuzzle();
  }
}
