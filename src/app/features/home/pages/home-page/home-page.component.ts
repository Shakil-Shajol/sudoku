import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameRegistryService } from '../../../../core/services/game-registry.service';
import { ThemeService, ThemeMode } from '../../../../core/services/theme.service';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { GameCategory } from '../../../../core/models/game-registry.model';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, GameCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-800 dark:text-[#dae2fd] antialiased selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <!-- Fixed Global Header -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0b1326]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div class="h-16 max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <!-- Logo & Brand Title -->
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

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-1">
              <a
                routerLink="/"
                class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm"
              >
                Games
              </a>
              <a
                routerLink="/sudoku"
                class="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] hover:text-slate-900 dark:hover:text-[#dae2fd] transition-all"
              >
                Sudoku (Active)
              </a>
            </nav>
          </div>

          <!-- Header Actions: Theme Toggle & Quick Controls -->
          <div class="flex items-center gap-3">
            <!-- Global Theme Mode Toggle Button -->
            <button
              type="button"
              (click)="themeService.toggleTheme()"
              aria-label="Toggle dark and light mode"
              class="h-9 px-3 rounded-full bg-slate-100 dark:bg-[#171f33] hover:bg-slate-200 dark:hover:bg-[#222a3d] text-slate-700 dark:text-[#c7c4d8] transition-all flex items-center gap-2 text-xs font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              @if (themeService.isDark()) {
                <span class="material-symbols-outlined text-[18px] text-sky-400">dark_mode</span>
                <span class="select-none font-semibold">Dark</span>
              } @else {
                <span class="material-symbols-outlined text-[18px] text-amber-500">light_mode</span>
                <span class="select-none font-semibold">Zen</span>
              }
            </button>

            <!-- Quick Start Sudoku Button -->
            <a
              routerLink="/sudoku"
              class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <span>Play Sudoku</span>
              <span class="material-symbols-outlined text-[16px]">play_arrow</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Main Page Content -->
      <main class="w-full pt-16 flex-1">
        <div class="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-16 overflow-hidden">
          <!-- Subtle Ambient Glow Orbs -->
          <div class="absolute top-12 left-1/4 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div class="absolute top-48 right-10 w-80 h-80 bg-sky-500/10 dark:bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <!-- Hero Content Header -->
          <section class="flex flex-col items-center text-center space-y-4 mb-12 max-w-3xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-[#171f33] text-emerald-600 dark:text-[#4edea3] text-xs font-mono font-medium">
              <span class="material-symbols-outlined text-[16px]">self_improvement</span>
              <span class="uppercase tracking-wider">Cognitive Sanctum • No Ads • Pure Logic</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Cultivate Focus Through Logic
            </h1>

            <p class="text-base sm:text-lg text-slate-600 dark:text-[#c7c4d8] max-w-2xl leading-relaxed">
              A calm, distraction-free sanctuary of timeless puzzle games engineered for mental clarity, spatial reasoning, and pure contemplative flow.
            </p>

            <!-- Player Status Bar & Interactive Quick-Controls Bar -->
            <div class="w-full mt-4 bg-white/90 dark:bg-[#171f33]/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <!-- Live Personal Stats -->
              <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <div class="flex items-center gap-2 bg-slate-100 dark:bg-[#222a3d] px-3.5 py-1.5 rounded-xl">
                  <span class="material-symbols-outlined text-amber-500 dark:text-[#7bd0ff] text-[18px]">local_fire_department</span>
                  <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8]">Daily Streak:</span>
                  <span class="font-mono text-xs text-slate-900 dark:text-white font-bold">14 Days</span>
                </div>

                <div class="flex items-center gap-2 bg-slate-100 dark:bg-[#222a3d] px-3.5 py-1.5 rounded-xl">
                  <span class="material-symbols-outlined text-emerald-500 dark:text-[#4edea3] text-[18px]">check_circle</span>
                  <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8]">Solved:</span>
                  <span class="font-mono text-xs text-slate-900 dark:text-white font-bold">142</span>
                </div>

                <div class="flex items-center gap-2 bg-slate-100 dark:bg-[#222a3d] px-3.5 py-1.5 rounded-xl">
                  <span class="material-symbols-outlined text-indigo-500 dark:text-[#c3c0ff] text-[18px]">psychology</span>
                  <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8]">Focus Score:</span>
                  <span class="font-mono text-xs text-indigo-600 dark:text-[#c3c0ff] font-bold">98%</span>
                </div>
              </div>

              <!-- Tone / Theme Segmented Control -->
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8] uppercase font-semibold">Tone</span>
                <div class="inline-flex p-1 bg-slate-100 dark:bg-[#060e20] rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    (click)="themeService.setTheme('dark')"
                    class="px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all"
                    [ngClass]="{
                      'bg-indigo-600 text-white shadow-sm font-semibold': themeService.isDark(),
                      'text-slate-500 dark:text-[#c7c4d8] hover:text-slate-900 dark:hover:text-white': !themeService.isDark()
                    }"
                  >
                    <span class="material-symbols-outlined text-[14px]">dark_mode</span> Dark
                  </button>
                  <button
                    type="button"
                    (click)="themeService.setTheme('light')"
                    class="px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all"
                    [ngClass]="{
                      'bg-indigo-600 text-white shadow-sm font-semibold': !themeService.isDark(),
                      'text-slate-500 dark:text-[#c7c4d8] hover:text-slate-900 dark:hover:text-white': themeService.isDark()
                    }"
                  >
                    <span class="material-symbols-outlined text-[14px]">light_mode</span> Zen
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Interactive Category Filter Pill Tabs -->
          <div class="flex items-center justify-center flex-wrap gap-2 mb-10">
            <button
              type="button"
              (click)="selectedCategory.set('all')"
              class="px-4 py-1.5 rounded-full font-mono text-xs transition-all font-semibold"
              [ngClass]="{
                'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': selectedCategory() === 'all',
                'bg-white dark:bg-[#171f33] text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] border border-slate-200 dark:border-slate-800': selectedCategory() !== 'all'
              }"
            >
              All Games ({{ games().length }})
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('grid')"
              class="px-4 py-1.5 rounded-full font-mono text-xs transition-all font-semibold"
              [ngClass]="{
                'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': selectedCategory() === 'grid',
                'bg-white dark:bg-[#171f33] text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] border border-slate-200 dark:border-slate-800': selectedCategory() !== 'grid'
              }"
            >
              Grid &amp; Logic
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('numbers')"
              class="px-4 py-1.5 rounded-full font-mono text-xs transition-all font-semibold"
              [ngClass]="{
                'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': selectedCategory() === 'numbers',
                'bg-white dark:bg-[#171f33] text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] border border-slate-200 dark:border-slate-800': selectedCategory() !== 'numbers'
              }"
            >
              Numbers
            </button>
            <button
              type="button"
              (click)="selectedCategory.set('spatial')"
              class="px-4 py-1.5 rounded-full font-mono text-xs transition-all font-semibold"
              [ngClass]="{
                'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': selectedCategory() === 'spatial',
                'bg-white dark:bg-[#171f33] text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] border border-slate-200 dark:border-slate-800': selectedCategory() !== 'spatial'
              }"
            >
              Spatial Topology
            </button>
          </div>

          <!-- Game Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            @for (game of filteredGames(); track game.id) {
              <app-game-card [game]="game" />
            }
          </div>

          <!-- Upcoming Releases Section -->
          <div class="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center justify-between mb-8">
              <div>
                <span class="font-mono text-xs text-indigo-600 dark:text-[#c3c0ff] uppercase tracking-wider font-semibold">
                  Laboratory In Progress
                </span>
                <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  Upcoming Releases
                </h2>
              </div>
              <div class="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-[#c7c4d8] font-mono text-xs">
                <span class="material-symbols-outlined text-[16px] text-emerald-500 dark:text-[#4edea3]">autorenew</span>
                <span>Rolling seasonal expansions</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (item of upcomingGames(); track item.id) {
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span
                        class="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium"
                        [ngClass]="{
                          'bg-sky-500/15 text-sky-600 dark:text-[#7bd0ff]': item.statusType === 'next',
                          'bg-indigo-500/15 text-indigo-600 dark:text-[#c3c0ff]': item.statusType === 'dev',
                          'bg-emerald-500/15 text-emerald-600 dark:text-[#4edea3]': item.statusType === 'beta'
                        }"
                      >
                        {{ item.statusBadge }}
                      </span>
                      <span class="material-symbols-outlined text-slate-400 text-[20px]">{{ item.icon }}</span>
                    </div>

                    <h3 class="text-base font-bold text-slate-900 dark:text-white">
                      {{ item.title }}
                    </h3>
                    <p class="text-xs text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                      {{ item.description }}
                    </p>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between font-mono text-xs">
                    <span class="text-slate-500 dark:text-[#c7c4d8]">{{ item.releaseDate }}</span>
                    <button
                      type="button"
                      class="text-indigo-600 dark:text-[#7bd0ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      (click)="notifyAlert(item.title)"
                    >
                      <span>Notify Me</span>
                      <span class="material-symbols-outlined text-[14px]">notifications</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Features & Design Values Banner -->
          <div class="mt-16 bg-white dark:bg-[#171f33] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div class="max-w-xl mx-auto text-center mb-8">
              <span class="font-mono text-xs text-indigo-600 dark:text-[#c3c0ff] uppercase tracking-widest font-semibold">
                Sanctuary Design Manifesto
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Engineered for Mental Rest &amp; Rigor
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Value 1 -->
              <div class="flex flex-col items-center text-center space-y-2 p-5 bg-slate-50 dark:bg-[#131b2e] rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <div class="w-12 h-12 rounded-2xl bg-white dark:bg-[#171f33] shadow-sm flex items-center justify-center text-emerald-500 dark:text-[#4edea3] mb-2">
                  <span class="material-symbols-outlined text-[24px]">visibility_off</span>
                </div>
                <h4 class="font-bold text-slate-900 dark:text-white text-base">Zero Distractions &amp; Ads</h4>
                <p class="text-xs text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                  No flashing banners, popups, or aggressive microtransactions. Your train of thought remains sacred and unbroken.
                </p>
              </div>

              <!-- Value 2 -->
              <div class="flex flex-col items-center text-center space-y-2 p-5 bg-slate-50 dark:bg-[#131b2e] rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <div class="w-12 h-12 rounded-2xl bg-white dark:bg-[#171f33] shadow-sm flex items-center justify-center text-sky-500 dark:text-[#7bd0ff] mb-2">
                  <span class="material-symbols-outlined text-[24px]">palette</span>
                </div>
                <h4 class="font-bold text-slate-900 dark:text-white text-base">Instant Dual Light/Dark Theme</h4>
                <p class="text-xs text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                  Meticulously calibrated OLED contrasts and subdued day tones engineered to minimize optical fatigue over prolonged solving sessions.
                </p>
              </div>

              <!-- Value 3 -->
              <div class="flex flex-col items-center text-center space-y-2 p-5 bg-slate-50 dark:bg-[#131b2e] rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <div class="w-12 h-12 rounded-2xl bg-white dark:bg-[#171f33] shadow-sm flex items-center justify-center text-indigo-500 dark:text-[#c3c0ff] mb-2">
                  <span class="material-symbols-outlined text-[24px]">keyboard</span>
                </div>
                <h4 class="font-bold text-slate-900 dark:text-white text-base">Intuitive Keyboard &amp; Touch</h4>
                <p class="text-xs text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                  Full key navigation (WASD, arrows, numpad) with lightning-fast tactile touch responses designed specifically for speed solvers.
                </p>
              </div>
            </div>
          </div>
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
          <div class="flex items-center gap-6 font-mono text-[11px]">
            <div class="flex items-center gap-1.5">
              <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-[#222a3d] rounded text-slate-800 dark:text-white font-bold">?</span>
              <span>Shortcuts</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-[#222a3d] rounded text-slate-800 dark:text-white font-bold">Esc</span>
              <span>Pause</span>
            </div>
            <div class="flex items-center gap-1 text-emerald-600 dark:text-[#4edea3]">
              <span class="material-symbols-outlined text-[14px]">verified</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class HomePageComponent {
  private registry = inject(GameRegistryService);
  public themeService = inject(ThemeService);

  public games = this.registry.games;
  public upcomingGames = this.registry.upcomingGames;
  public selectedCategory = signal<GameCategory>('all');

  public filteredGames = computed(() => {
    const cat = this.selectedCategory();
    const list = this.games();
    if (cat === 'all') return list;
    return list.filter(g => g.categories.includes(cat));
  });

  public notifyAlert(gameTitle: string): void {
    alert(`Notification alert set for ${gameTitle}! You will be notified when it releases.`);
  }
}
