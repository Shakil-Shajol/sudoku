import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  inject,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';
import { SudokuCellComponent } from '../sudoku-cell/sudoku-cell.component';
import { Position } from '../../../../core/models/sudoku.model';

@Component({
  selector: 'app-sudoku-board',
  imports: [CommonModule, SudokuCellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-[560px] mx-auto bg-white dark:bg-[#060e20] p-2.5 sm:p-3.5 rounded-2xl shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800/80">
      <!-- Overhead Directional Light Effect Overlay from reference -->
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent rounded-t-2xl pointer-events-none"></div>

      <!-- Paused overlay -->
      @if (gameService.isPaused()) {
        <div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900/85 backdrop-blur-md rounded-2xl text-white p-6">
          <div class="text-center space-y-4 max-w-xs">
            <span class="material-symbols-outlined text-5xl text-indigo-400">pause_circle</span>
            <h3 class="text-2xl font-bold tracking-tight">Session Paused</h3>
            <p class="text-slate-300 text-xs leading-relaxed font-mono">
              Take a contemplative breather. Board concealed to maintain challenge integrity.
            </p>
            <button
              type="button"
              (click)="gameService.togglePause()"
              class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-transform active:scale-95"
            >
              Resume Puzzle
            </button>
          </div>
        </div>
      }

      <!-- 9x9 Board Grid Frame -->
      <div
        class="w-full aspect-square grid grid-cols-9 grid-rows-9 gap-0.5 bg-slate-300 dark:bg-[#2d3449] rounded-xl overflow-hidden p-0.5 select-none"
        tabindex="0"
        role="grid"
        aria-label="Sudoku 9 by 9 Grid"
      >
        @for (row of gameService.board(); track $index) {
          @for (cell of row; track cell.id) {
            <app-sudoku-cell
              [cell]="cell"
              [selectedPosition]="gameService.selectedCell()"
              [activeValue]="activeCellValue()"
              (cellClick)="onCellClick($event)"
            />
          }
        }
      </div>

      <!-- Board Base Legend Footer matching Reference -->
      <div class="mt-2.5 px-2 flex items-center justify-between text-slate-500 dark:text-[#c7c4d8] font-mono text-[11px]">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-sm bg-white dark:bg-[#171f33] border border-slate-300 dark:border-slate-700"></span> Clue
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span> Selected
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-sm bg-indigo-200 dark:bg-[#c3c0ff]/30"></span> Matching
          </span>
        </div>
        <span class="text-emerald-600 dark:text-[#4edea3] flex items-center gap-1 font-semibold">
          <span class="material-symbols-outlined text-[13px]">lock_clock</span> Auto-saved
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class SudokuBoardComponent {
  public gameService = inject(SudokuGameService);

  public activeCellValue = computed(() => {
    return this.gameService.activeCell()?.value ?? null;
  });

  public onCellClick(pos: Position): void {
    this.gameService.selectCell(pos.row, pos.col);
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
      return;
    }

    if (this.gameService.isPaused() || this.gameService.isCompleted()) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        this.gameService.moveSelection(-1, 0);
        return;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        this.gameService.moveSelection(1, 0);
        return;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        this.gameService.moveSelection(0, -1);
        return;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        this.gameService.moveSelection(0, 1);
        return;
      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        this.gameService.eraseCell();
        return;
      case 'n':
      case 'N':
        event.preventDefault();
        this.gameService.toggleNotesMode();
        return;
      case 'h':
      case 'H':
        event.preventDefault();
        this.gameService.giveHint();
        return;
      case ' ':
        event.preventDefault();
        this.gameService.togglePause();
        return;
      case 'u':
      case 'U':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.gameService.undo();
        }
        return;
      case 'z':
      case 'Z':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.gameService.undo();
        }
        return;
    }

    let digit: number | null = null;
    if (event.key >= '1' && event.key <= '9') {
      digit = parseInt(event.key, 10);
    } else if (event.code && event.code.startsWith('Numpad')) {
      const numpadDigit = parseInt(event.code.replace('Numpad', ''), 10);
      if (!isNaN(numpadDigit) && numpadDigit >= 1 && numpadDigit <= 9) {
        digit = numpadDigit;
      }
    }

    if (digit !== null) {
      event.preventDefault();
      this.gameService.enterNumber(digit);
    }
  }
}
