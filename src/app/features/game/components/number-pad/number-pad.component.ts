import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

@Component({
  selector: 'app-number-pad',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Tactile Numpad Matrix Matching Reference -->
    <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8] uppercase tracking-wider font-semibold">
          Number Input Matrix
        </span>
        <span class="font-mono text-xs text-emerald-600 dark:text-[#4edea3] flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">keyboard</span> Hotkeys: 1–9
        </span>
      </div>

      <!-- 3x3 Keypad Layout Matching Reference -->
      <div class="grid grid-cols-3 gap-2 select-none">
        @for (num of [1, 2, 3, 4, 5, 6, 7, 8, 9]; track num) {
          @let remaining = remainingCounts()[num];
          @let isExhausted = remaining <= 0;
          @let isSelectedVal = gameService.activeCell()?.value === num;

          <button
            type="button"
            [attr.aria-label]="'Enter number ' + num + (isExhausted ? ', all placed' : '')"
            [disabled]="gameService.isPaused() || gameService.isCompleted()"
            (click)="gameService.enterNumber(num)"
            class="num-key h-16 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer disabled:pointer-events-none"
            [ngClass]="{
              'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400': isSelectedVal && !isExhausted,
              'bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-900 dark:text-white': !isSelectedVal && !isExhausted,
              'bg-slate-100/60 dark:bg-[#2d3449]/40 text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed': isExhausted
            }"
          >
            <span class="text-2xl font-bold leading-none font-mono">{{ num }}</span>
            <span
              class="font-mono text-[10px] mt-1"
              [ngClass]="{
                'text-indigo-200': isSelectedVal && !isExhausted,
                'text-slate-500 dark:text-[#c7c4d8]': !isSelectedVal && !isExhausted,
                'text-emerald-500 dark:text-[#4edea3] font-bold flex items-center gap-0.5': isExhausted
              }"
            >
              @if (isExhausted) {
                <span class="material-symbols-outlined text-[11px]">done</span> Done
              } @else {
                {{ remaining }} left
              }
            </span>
          </button>
        }
      </div>
    </div>
  `
})
export class NumberPadComponent {
  public gameService = inject(SudokuGameService);

  public remainingCounts = this.gameService.remainingNumbersCount;
}
