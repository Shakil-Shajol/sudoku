import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { Difficulty } from '../../../../core/models/sudoku.model';
import { SudokuBoardComponent } from '../../components/sudoku-board/sudoku-board.component';
import { NumberPadComponent } from '../../components/number-pad/number-pad.component';
import { GameToolbarComponent } from '../../components/game-toolbar/game-toolbar.component';
import { GameStatsComponent } from '../../components/game-stats/game-stats.component';
import { GameCompleteDialogComponent } from '../../components/game-complete-dialog/game-complete-dialog.component';

@Component({
  selector: 'app-sudoku-page',
  imports: [
    CommonModule,
    RouterLink,
    SudokuBoardComponent,
    NumberPadComponent,
    GameToolbarComponent,
    GameStatsComponent,
    GameCompleteDialogComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-800 dark:text-[#dae2fd] antialiased selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <!-- Fixed Global Navigation Header -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0b1326]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div class="h-16 max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div class="flex items-center gap-6">
            <a routerLink="/" class="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
              <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105">
                M
              </div>
              <div class="flex flex-col">
                <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-[#dae2fd] leading-none">
                  Mindrix
                </span>
                <span class="font-mono text-[10px] text-slate-500 dark:text-[#c7c4d8] tracking-wider uppercase mt-1">
                  Cognitive Sanctuary
                </span>
              </div>
            </a>

            <nav class="hidden md:flex items-center gap-1">
              <a
                routerLink="/"
                class="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] hover:text-slate-900 dark:hover:text-[#dae2fd] transition-all"
              >
                Games
              </a>
              <span class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm">
                Sudoku (Playing)
              </span>
              <a
                routerLink="/sudoku/rules"
                class="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] hover:text-slate-900 dark:hover:text-[#dae2fd] transition-all"
              >
                Rules &amp; Guide
              </a>
            </nav>
          </div>

          <div class="flex items-center gap-3">
            <!-- Theme Toggle Button -->
            <button
              type="button"
              (click)="themeService.toggleTheme()"
              aria-label="Toggle dark and light mode"
              class="h-9 px-3 rounded-full bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-700 dark:text-[#c7c4d8] transition-all flex items-center gap-2 text-xs font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              @if (themeService.isDark()) {
                <span class="material-symbols-outlined text-[18px] text-sky-400">dark_mode</span>
                <span class="select-none font-semibold">Dark</span>
              } @else {
                <span class="material-symbols-outlined text-[18px] text-amber-500">light_mode</span>
                <span class="select-none font-semibold">Zen</span>
              }
            </button>

            <!-- Back to Hub Link -->
            <a
              routerLink="/"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-700 dark:text-[#c7c4d8] text-xs font-bold transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              <span class="hidden sm:inline">All Games</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Main Game Canvas Container matching Reference -->
      <main class="w-full pt-16 flex-1">
        <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
          <!-- Top Sub-Navigation & Header Level -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
            <!-- Left: Back Action & Puzzle Identity -->
            <div class="flex flex-wrap items-center gap-4">
              <a
                routerLink="/"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-600 dark:text-[#c7c4d8] hover:text-slate-900 dark:hover:text-white transition-all text-xs font-mono"
              >
                <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>All Games</span>
              </a>

              <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <span class="material-symbols-outlined text-[20px]">grid_4x4</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h1 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">Sudoku</h1>
                    <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#222a3d] text-slate-500 dark:text-[#c7c4d8] font-mono text-[11px]">
                      Cartesian Lattice
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-[#c7c4d8]">Standard 9×9 Deductive Grid</p>
                </div>
              </div>
            </div>

            <!-- Difficulty Selector Pills Matching Reference -->
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#060e20] p-1 rounded-xl self-start md:self-auto overflow-x-auto max-w-full border border-slate-200 dark:border-slate-800">
              @for (diff of difficulties; track diff) {
                <button
                  type="button"
                  (click)="onSelectDifficulty(diff)"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer"
                  [ngClass]="{
                    'bg-indigo-600 text-white font-bold shadow-sm flex items-center gap-1.5': gameService.difficulty() === diff,
                    'text-slate-600 dark:text-[#c7c4d8] hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#171f33]': gameService.difficulty() !== diff
                  }"
                >
                  @if (gameService.difficulty() === diff) {
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  }
                  {{ diff }}
                </button>
              }
            </div>

            <!-- Hidden native select for test compatibility -->
            <select
              id="difficulty-select"
              [value]="gameService.difficulty()"
              (change)="onNativeDifficultyChange($event)"
              class="sr-only"
              aria-label="Sudoku Difficulty"
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
              <option value="expert">expert</option>
            </select>

            <!-- Right: Zen Focus Toggles & Rules Link -->
            <div class="flex items-center gap-2 self-end md:self-auto">
              <a
                routerLink="/sudoku/rules"
                title="View Sudoku Guidelines & Rules"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-700 dark:text-[#c7c4d8] hover:text-indigo-600 dark:hover:text-white transition-all text-xs font-mono font-medium"
              >
                <span class="material-symbols-outlined text-[16px] text-indigo-500">menu_book</span>
                <span>Rules</span>
              </a>

              <div class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#171f33] text-sky-600 dark:text-[#7bd0ff] font-mono text-xs">
                <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span class="hidden sm:inline">Cognitive Flow</span>
              </div>
              <button
                type="button"
                (click)="showShortcuts.update(v => !v)"
                title="Toggle Keyboard Shortcuts"
                class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-600 dark:text-[#c7c4d8] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-[18px]">keyboard</span>
              </button>
            </div>
          </div>

          <!-- Live Accessible Status Message -->
          <div
            role="status"
            aria-live="polite"
            class="text-center font-mono text-xs font-medium text-slate-500 dark:text-[#c7c4d8] min-h-[1.25rem] truncate"
          >
            {{ gameService.statusMessage() }}
          </div>

          <!-- Live Telemetry Status Bar (Elapsed, Mistakes, Hints, Progress) -->
          <app-game-stats />

          <!-- Main Central Arena: Asymmetric Grid Layout from Reference -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
            <!-- Left / Center: Sudoku Matrix Canvas & Mobile Controls (7 cols on lg) -->
            <div class="lg:col-span-7 flex flex-col items-center gap-3 w-full">
              <app-sudoku-board />

              <!-- Immediate mobile placement of numbers directly under grid (matching reference sudoku.jpeg) -->
              <div class="w-full max-w-[560px] block lg:hidden">
                <app-number-pad />
              </div>
            </div>

            <!-- Right Side: Desktop Control, Interactive Pad & Action Center (5 cols on lg) -->
            <div class="lg:col-span-5 flex flex-col gap-4 w-full">
              <!-- Tactile Toolkit Ribbon (Undo, Erase, Notes, Hint, Verify, Clean) -->
              <app-game-toolbar />

              <!-- Desktop Tactile Numpad Matrix (Hidden on mobile where it is placed directly under grid) -->
              <div class="hidden lg:block">
                <app-number-pad />
              </div>

              <!-- Session Secondary Actions: Restart, New Game, Shortcuts -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="gameService.restartGame()"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-[#131b2e] hover:bg-slate-50 dark:hover:bg-[#171f33] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span class="material-symbols-outlined text-[18px]">restart_alt</span>
                  <span>Restart</span>
                </button>
                <button
                  type="button"
                  (click)="gameService.startNewGame(gameService.difficulty())"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95"
                >
                  <span class="material-symbols-outlined text-[18px]">shuffle</span>
                  <span>New Game</span>
                </button>
                <button
                  type="button"
                  (click)="showShortcuts.update(v => !v)"
                  title="Show Keyboard Cheatsheet"
                  class="p-2.5 rounded-xl bg-white dark:bg-[#131b2e] hover:bg-slate-50 dark:hover:bg-[#171f33] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-[#c7c4d8] hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[20px]">keyboard</span>
                </button>
              </div>

              <!-- Victory Forecast / Analytic Card from Reference -->
              <div class="bg-gradient-to-br from-white via-slate-50 to-white dark:from-[#131b2e] dark:via-[#171f33] dark:to-[#131b2e] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 text-emerald-600 dark:text-[#4edea3]">
                    <span class="material-symbols-outlined text-[20px]">emoji_events</span>
                    <span class="font-mono text-xs uppercase tracking-wider font-semibold">Victory Forecast</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#4edea3] font-mono text-[10px] font-bold">
                    Pace: Optimal
                  </span>
                </div>
                <div class="flex items-center justify-between py-2 bg-slate-100 dark:bg-[#060e20]/60 px-3 rounded-xl font-mono text-xs">
                  <div class="text-left">
                    <span class="text-[10px] text-slate-500 dark:text-[#c7c4d8] block">Difficulty</span>
                    <span class="font-bold text-slate-900 dark:text-white capitalize">{{ gameService.difficulty() }}</span>
                  </div>
                  <div class="text-center">
                    <span class="text-[10px] text-slate-500 dark:text-[#c7c4d8] block">Mistakes</span>
                    <span class="font-bold text-slate-900 dark:text-white" [ngClass]="{ 'text-red-500 dark:text-red-400': gameService.mistakes() > 0 }">{{ gameService.mistakes() }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-slate-500 dark:text-[#c7c4d8] block">Focus State</span>
                    <span class="font-bold text-sky-500 dark:text-[#7bd0ff]">Active</span>
                  </div>
                </div>

                <!-- Quick link to full rules & guideline -->
                <div class="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 font-mono text-xs">
                  <span class="text-slate-500 dark:text-[#c7c4d8] text-[11px]">Unsure of a move?</span>
                  <a
                    routerLink="/sudoku/rules"
                    class="text-indigo-600 dark:text-[#7bd0ff] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Read Guidelines &amp; Tactics</span>
                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Collapsible Keyboard Shortcuts Drawer -->
          @if (showShortcuts()) {
            <div class="w-full bg-white dark:bg-[#060e20] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm transition-all animate-in fade-in">
              <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px] text-indigo-500">keyboard_command_key</span>
                  <h3 class="font-bold text-sm text-slate-900 dark:text-white">Keyboard Master Shortcuts</h3>
                </div>
                <button
                  type="button"
                  (click)="showShortcuts.set(false)"
                  class="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-xs">
                <div class="p-2 rounded-xl bg-slate-50 dark:bg-[#171f33] flex flex-col gap-0.5">
                  <span class="text-indigo-600 dark:text-[#c3c0ff] font-bold">1–9</span>
                  <span class="text-slate-500 dark:text-[#c7c4d8] text-[11px]">Place Number</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 dark:bg-[#171f33] flex flex-col gap-0.5">
                  <span class="text-indigo-600 dark:text-[#c3c0ff] font-bold">N</span>
                  <span class="text-slate-500 dark:text-[#c7c4d8] text-[11px]">Toggle Notes</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 dark:bg-[#171f33] flex flex-col gap-0.5">
                  <span class="text-indigo-600 dark:text-[#c3c0ff] font-bold">Backspace / Del</span>
                  <span class="text-slate-500 dark:text-[#c7c4d8] text-[11px]">Erase Cell</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 dark:bg-[#171f33] flex flex-col gap-0.5">
                  <span class="text-indigo-600 dark:text-[#c3c0ff] font-bold">Arrows / WASD</span>
                  <span class="text-slate-500 dark:text-[#c7c4d8] text-[11px]">Navigate Grid</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 dark:bg-[#171f33] flex flex-col gap-0.5">
                  <span class="text-indigo-600 dark:text-[#c3c0ff] font-bold">Space</span>
                  <span class="text-slate-500 dark:text-[#c7c4d8] text-[11px]">Pause Session</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 dark:bg-[#171f33] flex flex-col gap-0.5">
                  <span class="text-indigo-600 dark:text-[#c3c0ff] font-bold">H</span>
                  <span class="text-slate-500 dark:text-[#c7c4d8] text-[11px]">Use Hint</span>
                </div>
              </div>
            </div>
          }
        </div>
      </main>

      <!-- Global Footer -->
      <footer class="w-full bg-white/80 dark:bg-[#060e20]/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-[#c7c4d8] text-xs">
          <div class="flex items-center gap-4">
            <span>© 2026 Mindrix Puzzles. Cognitive Sanctuary.</span>
            <div class="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-[#171f33] px-2.5 py-1 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#4edea3] animate-pulse"></span>
              <span class="font-mono text-[11px] text-slate-700 dark:text-white">Zen Grid Synced</span>
            </div>
          </div>
          <div class="flex items-center gap-4 sm:gap-6 font-mono text-[11px]">
            <a
              routerLink="/sudoku/rules"
              class="hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1 font-semibold"
            >
              <span class="material-symbols-outlined text-[14px]">menu_book</span>
              <span>Rules</span>
            </a>
            <div class="flex items-center gap-1.5">
              <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-[#222a3d] rounded text-slate-800 dark:text-white font-bold">?</span>
              <span>Shortcuts</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-[#222a3d] rounded text-slate-800 dark:text-white font-bold">Esc / Space</span>
              <span>Pause</span>
            </div>
            <div class="flex items-center gap-1 text-emerald-600 dark:text-[#4edea3]">
              <span class="material-symbols-outlined text-[14px]">verified</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </div>
      </footer>

      <!-- Game Victory Dialog -->
      <app-game-complete-dialog />
    </div>
  `
})
export class SudokuPageComponent implements OnInit {
  public gameService = inject(SudokuGameService);
  public themeService = inject(ThemeService);

  public showShortcuts = signal<boolean>(false);
  public difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  public ngOnInit(): void {
    this.gameService.initGame(false);
  }

  public onSelectDifficulty(diff: Difficulty): void {
    if (diff !== this.gameService.difficulty()) {
      this.gameService.startNewGame(diff);
    }
  }

  public onNativeDifficultyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const diff = target.value as Difficulty;
    if (diff !== this.gameService.difficulty()) {
      this.gameService.startNewGame(diff);
    }
  }
}
