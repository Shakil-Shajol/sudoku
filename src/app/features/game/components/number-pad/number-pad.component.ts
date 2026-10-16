import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

@Component({
  selector: 'app-number-pad',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Number Pad & Quick Action Matrix -->
    <div class="w-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 p-3 sm:p-4 rounded-2xl shadow-sm">
      <div class="hidden lg:flex items-center justify-between mb-3">
        <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8] uppercase tracking-wider font-semibold">
          Number Input
        </span>
        <span class="font-mono text-xs text-emerald-600 dark:text-[#4edea3] flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">keyboard</span> 1–9
        </span>
      </div>

      <!-- Numbers 1 to 9 (Horizontal single line on mobile/tablets like Reference, 3x3 on desktop) -->
      <div class="grid grid-cols-9 lg:grid-cols-3 gap-1 sm:gap-1.5 lg:gap-2 select-none mb-3">
        @for (num of [1, 2, 3, 4, 5, 6, 7, 8, 9]; track num) {
          @let remaining = remainingCounts()[num];
          @let isExhausted = remaining <= 0;
          @let isSelectedVal = gameService.activeCell()?.value === num;

          <button
            type="button"
            [attr.aria-label]="'Enter number ' + num + (isExhausted ? ', all placed' : '')"
            [disabled]="gameService.isPaused() || gameService.isCompleted()"
            (click)="gameService.enterNumber(num)"
            class="num-key h-12 sm:h-14 lg:h-16 rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer disabled:pointer-events-none"
            [ngClass]="{
              'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400': isSelectedVal && !isExhausted,
              'bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-900 dark:text-white border border-slate-200/70 dark:border-slate-700/60': !isSelectedVal && !isExhausted,
              'bg-slate-100/60 dark:bg-[#2d3449]/40 text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed': isExhausted
            }"
          >
            <span class="text-lg sm:text-xl lg:text-2xl font-bold leading-none font-mono">{{ num }}</span>
            <span
              class="hidden sm:inline font-mono text-[9px] lg:text-[10px] mt-0.5"
              [ngClass]="{
                'text-indigo-200': isSelectedVal && !isExhausted,
                'text-slate-500 dark:text-[#c7c4d8]': !isSelectedVal && !isExhausted,
                'text-emerald-500 dark:text-[#4edea3] font-bold flex items-center gap-0.5': isExhausted
              }"
            >
              @if (isExhausted) {
                <span class="material-symbols-outlined text-[10px]">done</span>
              } @else {
                {{ remaining }}
              }
            </span>
          </button>
        }
      </div>

      <!-- Quick Action Trio Bar directly under numbers (Notes, Erase, Hint) like Reference -->
      <div class="flex lg:hidden items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 select-none">
        <!-- Notes Toggle -->
        <button
          type="button"
          (click)="gameService.toggleNotesMode()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Toggle Notes Mode (N)"
          class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer font-mono text-xs disabled:opacity-40"
          [ngClass]="{
            'bg-indigo-600 text-white shadow-md': gameService.notesMode(),
            'bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd] border border-slate-200 dark:border-slate-700': !gameService.notesMode()
          }"
        >
          <span class="material-symbols-outlined text-[18px]">edit_note</span>
          <span class="font-bold">Notes</span>
          @if (gameService.notesMode()) {
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          }
        </button>

        <!-- Erase Button -->
        <button
          type="button"
          (click)="gameService.eraseCell()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Erase cell"
          class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd] hover:text-red-500 border border-slate-200 dark:border-slate-700 transition-all font-mono text-xs cursor-pointer disabled:opacity-40"
        >
          <span class="material-symbols-outlined text-[18px]">backspace</span>
          <span class="font-bold">Erase</span>
        </button>

        <!-- Hint Button -->
        <button
          type="button"
          (click)="gameService.giveHint()"
          [disabled]="gameService.isPaused() || gameService.isCompleted() || gameService.hintsUsed() >= 3"
          title="Use hint"
          class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd] hover:text-sky-500 border border-slate-200 dark:border-slate-700 transition-all font-mono text-xs cursor-pointer disabled:opacity-40"
        >
          <span class="material-symbols-outlined text-[18px] text-amber-500">lightbulb</span>
          <span class="font-bold">Hint</span>
          <span class="text-[10px] text-sky-600 dark:text-[#7bd0ff] font-bold">({{ 3 - gameService.hintsUsed() }})</span>
        </button>
      </div>
    </div>
  `
})
export class NumberPadComponent {
  public gameService = inject(SudokuGameService);

  public remainingCounts = this.gameService.remainingNumbersCount;
}
