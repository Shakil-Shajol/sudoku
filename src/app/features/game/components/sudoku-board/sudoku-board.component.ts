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
    <div
      class="relative w-full max-w-[500px] aspect-square mx-auto p-2 sm:p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-4 border-slate-900 dark:border-slate-300"
      tabindex="0"
      role="grid"
      aria-label="Sudoku 9 by 9 Grid"
    >
      <!-- Paused overlay -->
      @if (gameService.isPaused()) {
        <div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl text-white">
          <div class="p-6 text-center space-y-4">
            <span class="text-4xl">⏸️</span>
            <h3 class="text-2xl font-bold">Game Paused</h3>
            <p class="text-slate-300 text-sm">Take a breather! Click resume to continue your puzzle.</p>
            <button
              type="button"
              (click)="gameService.togglePause()"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Resume Game
            </button>
          </div>
        </div>
      }

      <!-- 9x9 Board Grid -->
      <div class="grid grid-cols-9 grid-rows-9 w-full h-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
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
    // If the user is currently typing in an input or select element (like difficulty dropdown), don't intercept
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
      return;
    }

    if (this.gameService.isPaused() || this.gameService.isCompleted()) {
      return;
    }

    // Arrow navigation
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

    // Standard number row 1-9 or Numpad 1-9
    let digit: number | null = null;
    if (event.code && event.code.startsWith('Numpad')) {
      const numpadDigit = parseInt(event.code.replace('Numpad', ''), 10);
      if (!isNaN(numpadDigit) && numpadDigit >= 1 && numpadDigit <= 9) {
        digit = numpadDigit;
      }
    } else {
      const parsed = parseInt(event.key, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 9) {
        digit = parsed;
      }
    }

    if (digit !== null) {
      event.preventDefault();
      this.gameService.enterNumber(digit);
    }
  }
}
