import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';
import { SudokuBoardComponent } from '../../components/sudoku-board/sudoku-board.component';
import { NumberPadComponent } from '../../components/number-pad/number-pad.component';
import { GameToolbarComponent } from '../../components/game-toolbar/game-toolbar.component';
import { GameStatsComponent } from '../../components/game-stats/game-stats.component';
import { GameCompleteDialogComponent } from '../../components/game-complete-dialog/game-complete-dialog.component';

@Component({
  selector: 'app-sudoku-page',
  imports: [
    CommonModule,
    SudokuBoardComponent,
    NumberPadComponent,
    GameToolbarComponent,
    GameStatsComponent,
    GameCompleteDialogComponent
  ],
  template: `
    <main class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between py-4 sm:py-8 px-3 select-none">
      <!-- Container -->
      <div class="max-w-xl mx-auto w-full">
        <!-- Brand Header & Top Actions -->
        <header class="flex items-center justify-between mb-4 px-2">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              9
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
                Sudoku
              </h1>
              <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Modern Puzzle Game
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Restart Button -->
            <button
              type="button"
              (click)="gameService.restartGame()"
              aria-label="Restart current puzzle"
              title="Restart current game"
              class="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl shadow-sm transition active:scale-95"
            >
              Restart
            </button>
            <!-- New Game Button -->
            <button
              type="button"
              (click)="gameService.startNewGame(gameService.difficulty())"
              aria-label="New Game"
              class="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              New Game
            </button>
          </div>
        </header>

        <!-- Live Status / Announcement Banner for Accessibility -->
        <div
          role="status"
          aria-live="polite"
          class="text-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 min-h-[1.25rem] truncate px-2"
        >
          {{ gameService.statusMessage() }}
        </div>

        <!-- Game Statistics & Timer Bar -->
        <app-game-stats />

        <!-- Sudoku 9x9 Board -->
        <app-sudoku-board />

        <!-- 1-9 Number Pad -->
        <app-number-pad />

        <!-- Game Action Toolbar (Undo, Erase, Notes, Hint, Check) -->
        <app-game-toolbar />
      </div>

      <!-- Footer Info -->
      <footer class="mt-8 text-center text-xs text-slate-400">
        <p>Keyboard friendly: Arrow keys or WASD to navigate • Digits 1-9 to enter • N for Notes • Backspace to erase</p>
      </footer>

      <!-- Game Victory Dialog -->
      <app-game-complete-dialog />
    </main>
  `
})
export class SudokuPageComponent implements OnInit {
  public gameService = inject(SudokuGameService);

  public ngOnInit(): void {
    this.gameService.initGame(false);
  }
}
