import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';
import { Difficulty } from '../../../../core/models/sudoku.model';

@Component({
  selector: 'app-game-stats',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-[500px] mx-auto mb-3 px-2">
      <!-- Top Bar: Difficulty Selector, Timer, Mistakes -->
      <div class="flex items-center justify-between gap-2 py-2 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <!-- Difficulty Dropdown -->
        <div class="flex items-center gap-1.5">
          <label for="difficulty-select" class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Level:
          </label>
          <select
            id="difficulty-select"
            [value]="gameService.difficulty()"
            (change)="onDifficultyChange($event)"
            class="text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <!-- Mistakes Tracker -->
        <div class="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <span>Mistakes:</span>
          <span class="font-bold px-2 py-0.5 rounded-full" [ngClass]="gameService.mistakes() > 0 ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700'">
            {{ gameService.mistakes() }}
          </span>
        </div>

        <!-- Timer & Pause / Play button -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="gameService.togglePause()"
            [attr.aria-label]="gameService.isPaused() ? 'Resume timer' : 'Pause timer'"
            class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition active:scale-95 text-slate-600 dark:text-slate-300 text-sm"
          >
            {{ gameService.isPaused() ? '▶️' : '⏸️' }}
          </button>
          <span class="font-mono text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 min-w-[50px] text-right">
            {{ formattedTimer() }}
          </span>
        </div>
      </div>

      <!-- Quick Session Record Pill (Optional info) -->
      @if (bestTimeForDiff(); as best) {
        <div class="flex items-center justify-between px-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Best ({{ gameService.difficulty() }}): <strong class="font-mono text-slate-700 dark:text-slate-300">{{ best }}</strong></span>
          <span>Hints: <strong class="text-slate-700 dark:text-slate-300">{{ gameService.hintsUsed() }}</strong></span>
        </div>
      }
    </div>
  `
})
export class GameStatsComponent {
  public gameService = inject(SudokuGameService);

  public formattedTimer = computed(() => {
    return this.gameService.formatTime(this.gameService.elapsedSeconds());
  });

  public bestTimeForDiff = computed(() => {
    const stats = this.gameService.sessionStats();
    const diff = this.gameService.difficulty();
    const sec = stats.bestTimes[diff];
    return sec !== null ? this.gameService.formatTime(sec) : null;
  });

  public onDifficultyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const diff = target.value as Difficulty;
    if (diff !== this.gameService.difficulty()) {
      this.gameService.startNewGame(diff);
    }
  }
}
