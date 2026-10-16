import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Position, SudokuCellModel } from '../../../../core/models/sudoku.model';

@Component({
  selector: 'app-sudoku-cell',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [attr.id]="'cell-' + cell().row + '-' + cell().col"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-selected]="isSelected()"
      [attr.data-row]="cell().row"
      [attr.data-col]="cell().col"
      (click)="cellClick.emit({ row: cell().row, col: cell().col })"
      class="sudoku-cell group relative flex items-center justify-center select-none transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 w-full h-full text-center"
      [ngClass]="{
        'bg-red-500 !text-white font-bold ring-2 ring-red-500 z-10': isSelected() && isWrong(),
        'bg-blue-600 !text-white font-bold ring-2 ring-blue-600 z-10': isSelected() && !isWrong(),
        'bg-red-100 dark:bg-red-950/60 !text-red-600 dark:!text-red-400 font-bold border-red-300 ring-1 ring-red-400/50': isWrong() && !isSelected(),
        'bg-blue-50/80 dark:bg-blue-950/30': isPeer() && !isSelected() && !isSameNumber() && !isWrong(),
        'bg-blue-100/90 dark:bg-blue-900/50 font-semibold text-blue-900 dark:text-blue-200': isSameNumber() && !isSelected() && !isWrong(),
        'hover:bg-slate-100 dark:hover:bg-slate-800/60': !isSelected() && !isPeer() && !isSameNumber() && !isWrong(),
        'border-r-2 border-r-slate-800 dark:border-r-slate-200': isBoxRightEdge(),
        'border-b-2 border-b-slate-800 dark:border-b-slate-200': isBoxBottomEdge(),
        'border-r border-r-slate-200 dark:border-r-slate-800': !isBoxRightEdge() && cell().col !== 8,
        'border-b border-b-slate-200 dark:border-b-slate-800': !isBoxBottomEdge() && cell().row !== 8
      }"
    >
      @if (cell().value) {
        <span
          class="text-xl sm:text-2xl md:text-3xl tracking-tight leading-none"
          [ngClass]="{
            '!text-white font-bold': isSelected(),
            'font-bold text-slate-900 dark:text-slate-100': cell().isGiven && !isSelected() && !isWrong(),
            'font-semibold text-blue-700 dark:text-blue-400': !cell().isGiven && !isSelected() && !isWrong(),
            '!text-red-600 dark:!text-red-400 font-bold': isWrong() && !isSelected()
          }"
        >
          {{ cell().value }}
        </span>
      } @else if (notesList().length > 0) {
        <!-- 3x3 Notes Grid -->
        <div class="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none text-[8px] sm:text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400">
          @for (n of [1, 2, 3, 4, 5, 6, 7, 8, 9]; track n) {
            <span class="flex items-center justify-center leading-none">
              {{ cell().notes.has(n) ? n : '' }}
            </span>
          }
        </div>
      }
    </button>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .sudoku-cell {
      min-width: 0;
      min-height: 0;
      aspect-ratio: 1 / 1;
    }
  `]
})
export class SudokuCellComponent {
  public cell = input.required<SudokuCellModel>();
  public selectedPosition = input<Position | null>(null);
  public activeValue = input<number | null>(null);

  public cellClick = output<Position>();

  public isSelected = computed(() => {
    const sel = this.selectedPosition();
    if (!sel) return false;
    return sel.row === this.cell().row && sel.col === this.cell().col;
  });

  public isPeer = computed(() => {
    const sel = this.selectedPosition();
    if (!sel) return false;
    const c = this.cell();
    if (sel.row === c.row && sel.col === c.col) return false;
    const selBox = Math.floor(sel.row / 3) * 3 + Math.floor(sel.col / 3);
    return sel.row === c.row || sel.col === c.col || selBox === c.box;
  });

  public isSameNumber = computed(() => {
    const active = this.activeValue();
    if (!active || !this.cell().value) return false;
    return this.cell().value === active;
  });

  public isWrong = computed(() => {
    const c = this.cell();
    if (c.isGiven || c.value === null) return false;
    return c.hasConflict;
  });

  public isBoxRightEdge = computed(() => {
    const col = this.cell().col;
    return col === 2 || col === 5;
  });

  public isBoxBottomEdge = computed(() => {
    const row = this.cell().row;
    return row === 2 || row === 5;
  });

  public notesList = computed(() => {
    return Array.from(this.cell().notes);
  });

  public ariaLabel = computed(() => {
    const c = this.cell();
    const type = c.isGiven ? 'Given clue' : 'Cell';
    const val = c.value ? `${c.value}` : 'Empty';
    const notesStr = c.notes.size > 0 ? `, pencil marks ${Array.from(c.notes).join(', ')}` : '';
    const conflictStr = c.hasConflict ? ', conflict detected' : '';
    return `${type} at row ${c.row + 1}, column ${c.col + 1}: ${val}${notesStr}${conflictStr}`;
  });
}
