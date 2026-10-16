import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';
import { Difficulty } from '../../../../core/models/sudoku.model';

@Component({
  selector: 'app-game-stats',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Live Telemetry Status Bar Matching Reference -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <!-- 1. Timer Metric -->
      <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#171f33] flex items-center justify-center text-indigo-600 dark:text-[#c3c0ff]">
            <span class="material-symbols-outlined text-[20px]">timer</span>
          </div>
          <div>
            <span class="font-mono text-[10px] text-slate-500 dark:text-[#c7c4d8] uppercase tracking-wider block">
              Elapsed
            </span>
            <div class="flex items-center gap-1.5">
              @if (!gameService.isPaused()) {
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              }
              <span id="game-timer" class="font-mono text-base font-bold text-slate-900 dark:text-white tracking-wide">
                {{ formattedTimer() }}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          (click)="gameService.togglePause()"
          class="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#222a3d] text-slate-500 dark:text-[#c7c4d8] hover:text-slate-900 dark:hover:text-white transition-colors"
          [title]="gameService.isPaused() ? 'Resume session (Space)' : 'Pause session (Space)'"
        >
          <span class="material-symbols-outlined text-[20px]">
            {{ gameService.isPaused() ? 'play_arrow' : 'pause' }}
          </span>
        </button>
      </div>

      <!-- 2. Error / Mistakes Budget -->
      <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-xl bg-red-100/60 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">warning</span>
        </div>
        <div class="flex-1">
          <span class="font-mono text-[10px] text-slate-500 dark:text-[#c7c4d8] uppercase tracking-wider block">
            Mistakes
          </span>
          <div class="flex items-center justify-between">
            <span class="font-mono text-base font-bold" [ngClass]="gameService.mistakes() > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'">
              {{ gameService.mistakes() }} <span class="text-slate-400 font-normal text-xs">/ 3</span>
            </span>
            <div class="flex gap-1">
              <span class="w-2.5 h-2.5 rounded-full" [ngClass]="gameService.mistakes() >= 1 ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'"></span>
              <span class="w-2.5 h-2.5 rounded-full" [ngClass]="gameService.mistakes() >= 2 ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'"></span>
              <span class="w-2.5 h-2.5 rounded-full" [ngClass]="gameService.mistakes() >= 3 ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Hints Used & Precision Score -->
      <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#171f33] flex items-center justify-center text-emerald-600 dark:text-[#4edea3]">
          <span class="material-symbols-outlined text-[20px]">lightbulb</span>
        </div>
        <div>
          <span class="font-mono text-[10px] text-slate-500 dark:text-[#c7c4d8] uppercase tracking-wider block">
            Hints Used
          </span>
          <div class="flex items-baseline gap-1.5">
            <span class="font-mono text-base text-slate-900 dark:text-white font-bold">
              {{ gameService.hintsUsed() }}
            </span>
            <span class="font-mono text-[10px] text-emerald-600 dark:text-[#4edea3]">
              @if (bestTimeForDiff(); as best) {
                Best: {{ best }}
              } @else {
                Active
              }
            </span>
          </div>
        </div>
      </div>

      <!-- 4. Dynamic Analytical Health / Grid Solved Progress -->
      <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#171f33] flex items-center justify-center text-sky-600 dark:text-[#7bd0ff]">
          <span class="material-symbols-outlined text-[20px]">insights</span>
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span class="font-mono text-[10px] text-slate-500 dark:text-[#c7c4d8] uppercase">Grid Solved</span>
            <span class="font-mono text-xs text-slate-900 dark:text-white font-bold">{{ solvedPercent() }}%</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-[#222a3d] h-2 rounded-full overflow-hidden">
            <div class="bg-indigo-600 dark:bg-[#4f46e5] h-full rounded-full transition-all duration-500" [style.width.%]="solvedPercent()"></div>
          </div>
        </div>
      </div>
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

  public solvedPercent = computed(() => {
    const board = this.gameService.board();
    if (!board || board.length === 0) return 0;
    let filled = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c].value !== null) filled++;
      }
    }
    return Math.round((filled / 81) * 100);
  });
}
