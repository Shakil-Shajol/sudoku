import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

@Component({
  selector: 'app-game-toolbar',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Tactile Toolkit Ribbon Matching Reference -->
    <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
      <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8] uppercase tracking-wider block mb-3 font-semibold">
        Tactile Toolkit
      </span>

      <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <!-- 1. Undo -->
        <button
          type="button"
          (click)="gameService.undo()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Undo (Ctrl+Z)"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd] hover:text-indigo-600 dark:hover:text-[#c3c0ff] transition-all group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined text-[20px] group-hover:-rotate-45 transition-transform">undo</span>
          <span class="font-mono text-[11px] font-semibold">Undo</span>
          <span class="font-mono text-[9px] text-slate-400">^Z</span>
        </button>

        <!-- 2. Erase -->
        <button
          type="button"
          (click)="gameService.eraseCell()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Erase (Backspace or Del)"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd] hover:text-red-500 transition-all group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined text-[20px]">backspace</span>
          <span class="font-mono text-[11px] font-semibold">Erase</span>
          <span class="font-mono text-[9px] text-slate-400">Del</span>
        </button>

        <!-- 3. Pencil / Notes Mode -->
        <button
          type="button"
          (click)="gameService.toggleNotesMode()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Toggle Notes Mode (N)"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all cursor-pointer disabled:opacity-40"
          [ngClass]="{
            'bg-indigo-600 text-white shadow-md shadow-indigo-500/25': gameService.notesMode(),
            'bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd]': !gameService.notesMode()
          }"
        >
          <div class="flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[18px]">edit_note</span>
            @if (gameService.notesMode()) {
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            }
          </div>
          <span class="font-mono text-[11px] font-bold">Notes</span>
          <span
            class="font-mono text-[9px] uppercase tracking-wider"
            [ngClass]="gameService.notesMode() ? 'text-indigo-200' : 'text-slate-400'"
          >
            {{ gameService.notesMode() ? 'ON' : 'OFF' }}
          </span>
        </button>

        <!-- 4. Hint -->
        <button
          type="button"
          (click)="gameService.giveHint()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Provide Logical Hint (H)"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd] hover:text-sky-500 transition-all cursor-pointer disabled:opacity-40"
        >
          <span class="material-symbols-outlined text-[20px] text-sky-500">lightbulb</span>
          <span class="font-mono text-[11px] font-semibold">Hint</span>
          <span class="font-mono text-[9px] text-sky-600 dark:text-[#7bd0ff] font-bold px-1 rounded bg-sky-500/10">
            {{ 3 - gameService.hintsUsed() > 0 ? (3 - gameService.hintsUsed()) + ' left' : 'Used' }}
          </span>
        </button>

        <!-- 5. Check Errors / Verify -->
        <button
          type="button"
          (click)="gameService.checkErrors()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Scan board for discrepancies"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd] hover:text-emerald-500 transition-all cursor-pointer disabled:opacity-40"
        >
          <span class="material-symbols-outlined text-[20px] text-emerald-500">fact_check</span>
          <span class="font-mono text-[11px] font-semibold">Verify</span>
          <span class="font-mono text-[9px] text-slate-400">Scan</span>
        </button>

        <!-- 6. Clear All Notes -->
        <button
          type="button"
          (click)="gameService.clearAllNotes()"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          title="Wipe non-essential pencil marks"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer disabled:opacity-40"
        >
          <span class="material-symbols-outlined text-[20px]">layers_clear</span>
          <span class="font-mono text-[11px] font-semibold">Clean</span>
          <span class="font-mono text-[9px] text-slate-400">Notes</span>
        </button>
      </div>

      <!-- Secondary Controls & Solve Option -->
      <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-[#c7c4d8]">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            [checked]="gameService.autoClearNotes()"
            (change)="gameService.toggleAutoClearNotes()"
            class="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <span class="font-mono text-xs">Auto-clear notes</span>
        </label>

        <button
          type="button"
          (click)="confirmSolve.set(true)"
          [disabled]="gameService.isPaused() || gameService.isCompleted()"
          class="font-mono text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition cursor-pointer disabled:opacity-40"
        >
          Reveal Solution
        </button>
      </div>
    </div>

    <!-- Solve Confirmation Modal -->
    @if (confirmSolve()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div class="bg-white dark:bg-[#171f33] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto text-2xl">
            <span class="material-symbols-outlined text-[28px]">visibility</span>
          </div>
          <h4 class="text-lg font-bold text-slate-900 dark:text-white">Reveal Complete Solution?</h4>
          <p class="text-xs text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
            Are you sure you want to reveal the solved board? This will end the active game session.
          </p>
          <div class="flex gap-3 justify-center pt-2 font-mono text-xs">
            <button
              type="button"
              (click)="confirmSolve.set(false)"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#222a3d] dark:hover:bg-[#2d3449] text-slate-700 dark:text-[#dae2fd] font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="doSolve()"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow transition cursor-pointer"
            >
              Reveal Solution
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class GameToolbarComponent {
  public gameService = inject(SudokuGameService);
  public confirmSolve = signal<boolean>(false);

  public doSolve(): void {
    this.confirmSolve.set(false);
    this.gameService.solvePuzzle();
  }
}
