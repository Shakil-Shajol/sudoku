import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameRegistryService } from '../../../../core/services/game-registry.service';
import { GameCardComponent } from '../../components/game-card/game-card.component';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, GameCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <!-- Top Navigation / Hero Header -->
      <div class="w-full">
        <header class="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                P
              </div>
              <div>
                <span class="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white block">
                  Puzzle Hub
                </span>
                <span class="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                  Classic Brain Games
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <a
                routerLink="/sudoku"
                class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition"
              >
                <span>Quick Play Sudoku</span>
                <span class="text-[10px] text-blue-600 dark:text-blue-400">→</span>
              </a>
            </div>
          </div>
        </header>

        <!-- Hero Section -->
        <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 text-center sm:text-left">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-full text-blue-700 dark:text-blue-300 text-xs font-bold mb-4">
              <span>✨</span>
              <span>Modern Brain Workout</span>
            </div>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              Sharpen your mind with thoughtful puzzles.
            </h1>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Enjoy distraction-free, beautifully crafted classic logic games. Choose a puzzle below and dive in.
            </p>
          </div>
        </section>

        <!-- Games Grid Section -->
        <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Available Games
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pick a puzzle to start playing immediately
              </p>
            </div>
            <span class="text-xs font-semibold text-slate-400">
              {{ games().length }} Games
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (game of games(); track game.id) {
              <app-game-card [game]="game" />
            }
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer class="border-t border-slate-200/80 dark:border-slate-800/80 py-8 px-4 text-center text-xs text-slate-400">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Puzzle Hub. Hand-crafted with modern Angular.</p>
          <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
            <a routerLink="/sudoku" class="hover:text-blue-600 transition">Sudoku</a>
            <span>•</span>
            <span class="text-slate-400">Responsive & Accessible</span>
          </div>
        </div>
      </footer>
    </main>
  `
})
export class HomePageComponent {
  private registry = inject(GameRegistryService);
  public games = this.registry.games;
}
