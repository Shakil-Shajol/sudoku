import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

@Component({
  selector: 'app-game-complete-dialog',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (gameService.showCompletionDialog()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="victory-title"
      >
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-6">
          <!-- Trophy Icon & Title -->
          <div class="space-y-2">
            <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-500 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>
            <h3 id="victory-title" class="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Puzzle Completed!
            </h3>
            <p class="text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">
              {{ gameService.difficulty() }} Difficulty
            </p>
          </div>

          <!-- New Record Badge -->
          @if (gameService.isNewRecord()) {
            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-full">
              ✨ New Best Time!
            </div>
          }

          <!-- Stats Grid -->
          <div class="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl text-center">
            <div class="space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400">Time</span>
              <p class="font-mono text-base font-bold text-slate-800 dark:text-slate-100">
                {{ formattedTime() }}
              </p>
            </div>
            <div class="space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400">Mistakes</span>
              <p class="font-mono text-base font-bold text-slate-800 dark:text-slate-100">
                {{ gameService.mistakes() }}
              </p>
            </div>
            <div class="space-y-0.5">
              <span class="text-[11px] text-slate-500 dark:text-slate-400">Hints</span>
              <p class="font-mono text-base font-bold text-slate-800 dark:text-slate-100">
                {{ gameService.hintsUsed() }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-2">
            <button
              type="button"
              (click)="playAgain()"
              class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition active:scale-95"
            >
              Play Again
            </button>
            <button
              type="button"
              (click)="gameService.closeCompletionDialog()"
              class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl transition"
            >
              Review Board
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class GameCompleteDialogComponent {
  public gameService = inject(SudokuGameService);

  public formattedTime = computed(() => {
    return this.gameService.formatTime(this.gameService.elapsedSeconds());
  });

  public playAgain(): void {
    this.gameService.closeCompletionDialog();
    this.gameService.startNewGame(this.gameService.difficulty());
  }
}
