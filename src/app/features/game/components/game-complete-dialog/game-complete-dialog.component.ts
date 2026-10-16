import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

@Component({
  selector: 'app-game-complete-dialog',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (gameService.showCompletionDialog()) {
      <!-- Interactive Victory Modal Matching Reference sudoku.html -->
      <div
        class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="victory-title"
      >
        <div class="bg-white dark:bg-[#171f33] max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative border border-slate-200 dark:border-white/10">
          <!-- Trophy Icon Header -->
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#4edea3] flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <span class="material-symbols-outlined text-[36px]">workspace_premium</span>
          </div>

          <span class="font-mono text-xs text-emerald-600 dark:text-[#4edea3] uppercase tracking-widest font-semibold mb-1">
            Sanctuary Cleared
          </span>
          <h2 id="victory-title" class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
            Puzzle Completed!
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] mb-6">
            You solved the {{ gameService.difficulty() }} Cartesian lattice without breaking constraints.
          </p>

          <!-- Tabular Metrics from reference -->
          <div class="w-full bg-slate-50 dark:bg-[#060e20] rounded-2xl p-4 flex flex-col gap-2 mb-6 font-mono text-xs">
            <div class="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-slate-800">
              <span class="text-slate-500 dark:text-[#c7c4d8]">Final Time</span>
              <span class="text-slate-900 dark:text-white font-bold text-sm">
                {{ formattedTime() }}
                @if (gameService.isNewRecord()) {
                  <span class="text-emerald-500 dark:text-[#4edea3] text-xs font-semibold ml-1">(New Best!)</span>
                }
              </span>
            </div>
            <div class="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-slate-800">
              <span class="text-slate-500 dark:text-[#c7c4d8]">Mistakes Made</span>
              <span class="text-slate-900 dark:text-white font-bold">
                {{ gameService.mistakes() }} / 3
              </span>
            </div>
            <div class="flex justify-between items-center py-1.5">
              <span class="text-slate-500 dark:text-[#c7c4d8]">Hints Used</span>
              <span class="text-indigo-600 dark:text-[#c3c0ff] font-bold">
                {{ gameService.hintsUsed() }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full font-mono text-xs">
            <button
              type="button"
              (click)="playAgain()"
              class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
            >
              Play Another
            </button>
            <button
              type="button"
              (click)="gameService.closeCompletionDialog()"
              class="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#222a3d] dark:hover:bg-[#2d3449] text-slate-800 dark:text-[#dae2fd] font-semibold transition active:scale-95 cursor-pointer"
            >
              Review Solution
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
