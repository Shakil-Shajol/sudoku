import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

@Component({
  selector: 'app-number-pad',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-[500px] mx-auto mt-4 px-2">
      <!-- 1-9 Digits with remaining count badge -->
      <div class="grid grid-cols-9 gap-1.5 sm:gap-2">
        @for (num of [1, 2, 3, 4, 5, 6, 7, 8, 9]; track num) {
          @let remaining = remainingCounts()[num];
          @let isExhausted = remaining <= 0;

          <button
            type="button"
            [attr.aria-label]="'Enter number ' + num + (isExhausted ? ', all placed' : '')"
            [disabled]="gameService.isPaused() || gameService.isCompleted()"
            (click)="gameService.enterNumber(num)"
            class="group relative flex flex-col items-center justify-center py-2 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-sm hover:shadow-md hover:border-blue-400 active:scale-95 transition-all text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:pointer-events-none"
            [ngClass]="{
              'opacity-35 hover:opacity-75': isExhausted,
              'ring-2 ring-blue-500': gameService.activeCell()?.value === num
            }"
          >
            <span class="text-xl sm:text-2xl font-bold leading-none">{{ num }}</span>
            <span
              class="text-[9px] sm:text-[10px] mt-1 font-medium px-1 rounded-full"
              [ngClass]="{
                'text-slate-400 dark:text-slate-500': !isExhausted,
                'text-emerald-600 dark:text-emerald-400 font-bold': isExhausted
              }"
            >
              {{ isExhausted ? '✓' : remaining }}
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
