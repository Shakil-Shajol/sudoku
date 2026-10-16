import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-rules-page',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-800 dark:text-[#dae2fd] antialiased selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <!-- Fixed Global Navigation Header -->
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
                class="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] hover:text-slate-900 dark:hover:text-[#dae2fd] transition-all"
              >
                Games
              </a>
              <a
                routerLink="/sudoku"
                class="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#222a3d] hover:text-slate-900 dark:hover:text-[#dae2fd] transition-all"
              >
                Sudoku
              </a>
              <span class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm">
                Rules &amp; Guide
              </span>
            </nav>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
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

            <!-- Play Sudoku CTA -->
            <a
              routerLink="/sudoku"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <span>Play Sudoku</span>
              <span class="material-symbols-outlined text-[16px]">play_arrow</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Main Page Content -->
      <main class="w-full pt-16 flex-1">
        <div class="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <!-- Ambient Background Glows -->
          <div class="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div class="absolute top-48 right-10 w-80 h-80 bg-sky-500/10 dark:bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <!-- Breadcrumb & Back Navigation -->
          <div class="flex items-center gap-3 mb-8">
            <a
              routerLink="/sudoku"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131b2e] hover:bg-slate-100 dark:hover:bg-[#171f33] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-[#c7c4d8] text-xs font-mono font-medium transition-all shadow-sm"
            >
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Game</span>
            </a>
            <span class="text-slate-400 text-xs font-mono">/</span>
            <span class="text-xs font-mono text-slate-500 dark:text-[#c7c4d8]">Sudoku Rulebook &amp; Tactical Guide</span>
          </div>

          <!-- Hero Header -->
          <div class="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-[#171f33] text-indigo-600 dark:text-[#c3c0ff] text-xs font-mono font-medium">
              <span class="material-symbols-outlined text-[16px]">menu_book</span>
              <span class="uppercase tracking-wider">The Standard Codex &amp; Solving Guide</span>
            </div>
            <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Sudoku Rules &amp; Master Guidelines
            </h1>
            <p class="text-base sm:text-lg text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
              Official rules, core objectives, how to play instructions, and critical logic principles for solving 9×9 Sudoku puzzles.
            </p>
          </div>

          <!-- Quick Navigation Tabs -->
          <div class="flex flex-wrap items-center justify-center gap-2 mb-10">
            @for (tab of tabs; track tab.id) {
              <button
                type="button"
                (click)="activeTab.set(tab.id)"
                class="px-4 py-2 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                [ngClass]="{
                  'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': activeTab() === tab.id,
                  'bg-white dark:bg-[#131b2e] text-slate-600 dark:text-[#c7c4d8] hover:bg-slate-100 dark:hover:bg-[#171f33] border border-slate-200 dark:border-slate-800': activeTab() !== tab.id
                }"
              >
                <span class="material-symbols-outlined text-[16px]">{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
              </button>
            }
          </div>

          <!-- SECTION 1: OBJECTIVE -->
          @if (activeTab() === 'all' || activeTab() === 'rules') {
            <section class="mb-10">
              <div class="bg-gradient-to-br from-indigo-500/10 via-white to-white dark:from-indigo-900/30 dark:via-[#131b2e] dark:to-[#131b2e] border-2 border-indigo-200 dark:border-indigo-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <span class="material-symbols-outlined text-[26px]">flag</span>
                    </div>
                    <div>
                      <span class="font-mono text-xs text-indigo-600 dark:text-[#c3c0ff] uppercase tracking-wider font-bold">Goal of the Game</span>
                      <h2 class="text-2xl font-black text-slate-900 dark:text-white">Objective</h2>
                    </div>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-indigo-600/15 text-indigo-700 dark:text-[#c3c0ff] font-mono text-xs font-bold">
                    Single Solution
                  </span>
                </div>
                <p class="text-base sm:text-lg font-semibold text-slate-800 dark:text-[#dae2fd] leading-relaxed">
                  Fill the 9×9 grid so that every row, every column, and every 3×3 box contains the numbers 1 to 9 exactly once.
                </p>
              </div>
            </section>
          }

          <!-- SECTION 2: BASIC RULES -->
          @if (activeTab() === 'all' || activeTab() === 'rules') {
            <section class="space-y-6 mb-12">
              <div class="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <span class="material-symbols-outlined text-[22px]">gavel</span>
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Basic Rules
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-[#c7c4d8]">The fundamental rules that apply to every Sudoku puzzle</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- Rule 1: Grid structure -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-[#171f33] text-indigo-600 dark:text-[#c3c0ff] font-mono font-bold flex items-center justify-center text-sm">1</span>
                    <span class="material-symbols-outlined text-slate-400 text-[20px]">grid_4x4</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">9×9 Grid Layout</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    The puzzle is played on a <strong>9×9 grid</strong>, divided into <strong>nine 3×3 boxes</strong>.
                  </p>
                </div>

                <!-- Rule 2: Clues -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-[#171f33] text-indigo-600 dark:text-[#c3c0ff] font-mono font-bold flex items-center justify-center text-sm">2</span>
                    <span class="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">Initial Clues are Fixed</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    Some numbers are already filled in (these are called <strong>clues</strong>). These numbers <strong>cannot be changed</strong>.
                  </p>
                </div>

                <!-- Rule 3: 1 to 9 digits -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-[#171f33] text-indigo-600 dark:text-[#c3c0ff] font-mono font-bold flex items-center justify-center text-sm">3</span>
                    <span class="material-symbols-outlined text-slate-400 text-[20px]">pin</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">Fill with Numbers 1 to 9</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    You must fill in the empty cells with <strong>numbers from 1 to 9</strong>.
                  </p>
                </div>

                <!-- Rule 4: Rows -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg bg-sky-50 dark:bg-[#171f33] text-sky-600 dark:text-[#7bd0ff] font-mono font-bold flex items-center justify-center text-sm">4</span>
                    <span class="material-symbols-outlined text-sky-500 text-[20px]">view_stream</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">Row Constraint</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    Each row must contain the numbers <strong>1–9 with no repeats</strong>.
                  </p>
                </div>

                <!-- Rule 5: Columns -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg bg-sky-50 dark:bg-[#171f33] text-sky-600 dark:text-[#7bd0ff] font-mono font-bold flex items-center justify-center text-sm">5</span>
                    <span class="material-symbols-outlined text-sky-500 text-[20px]">view_column</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">Column Constraint</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    Each column must contain the numbers <strong>1–9 with no repeats</strong>.
                  </p>
                </div>

                <!-- Rule 6: 3x3 Boxes -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#171f33] text-emerald-600 dark:text-[#4edea3] font-mono font-bold flex items-center justify-center text-sm">6</span>
                    <span class="material-symbols-outlined text-emerald-500 text-[20px]">grid_view</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">3×3 Box Constraint</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    Each 3×3 box must contain the numbers <strong>1–9 with no repeats</strong>.
                  </p>
                </div>
              </div>

              <!-- Rule 7: Single correct solution banner -->
              <div class="bg-emerald-50/60 dark:bg-[#171f33] border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 flex items-start gap-4">
                <span class="material-symbols-outlined text-emerald-600 dark:text-[#4edea3] text-[26px] mt-0.5">verified</span>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base">One Unique Solution</h4>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] mt-0.5">
                    A completed Sudoku puzzle has <strong>only one correct solution</strong>.
                  </p>
                </div>
              </div>
            </section>
          }

          <!-- SECTION 3: HOW TO PLAY -->
          @if (activeTab() === 'all' || activeTab() === 'how-to-play') {
            <section class="space-y-6 mb-12">
              <div class="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/25">
                  <span class="material-symbols-outlined text-[22px]">sports_esports</span>
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    How to Play
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-[#c7c4d8]">Step-by-step gameplay instructions</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <!-- Step 1 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span class="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">1</span>
                    <h3 class="font-bold text-slate-900 dark:text-white text-sm">Select a Cell</h3>
                    <p class="text-xs text-slate-600 dark:text-[#c7c4d8] mt-1 leading-relaxed">
                      Select an empty cell on the 9×9 board using click, tap, or arrow keys.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-indigo-600 dark:text-[#c3c0ff]">
                    <span class="material-symbols-outlined text-[20px]">ads_click</span>
                  </div>
                </div>

                <!-- Step 2 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span class="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">2</span>
                    <h3 class="font-bold text-slate-900 dark:text-white text-sm">Enter a Number</h3>
                    <p class="text-xs text-slate-600 dark:text-[#c7c4d8] mt-1 leading-relaxed">
                      Enter a number from <strong>1 to 9</strong> via your keyboard or the on-screen keypad.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-indigo-600 dark:text-[#c3c0ff]">
                    <span class="material-symbols-outlined text-[20px]">pin</span>
                  </div>
                </div>

                <!-- Step 3 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span class="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">3</span>
                    <h3 class="font-bold text-slate-900 dark:text-white text-sm">Use Notes</h3>
                    <p class="text-xs text-slate-600 dark:text-[#c7c4d8] mt-1 leading-relaxed">
                      Use <strong>Notes (Pencil Marks)</strong> if you want to mark possible candidates in a cell.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-sky-500">
                    <span class="material-symbols-outlined text-[20px]">edit_note</span>
                  </div>
                </div>

                <!-- Step 4 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span class="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">4</span>
                    <h3 class="font-bold text-slate-900 dark:text-white text-sm">Erase or Clear</h3>
                    <p class="text-xs text-slate-600 dark:text-[#c7c4d8] mt-1 leading-relaxed">
                      You can <strong>erase a number or clear notes at any time</strong> using the Erase button or Del key.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-rose-500">
                    <span class="material-symbols-outlined text-[20px]">backspace</span>
                  </div>
                </div>

                <!-- Step 5 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span class="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">5</span>
                    <h3 class="font-bold text-slate-900 dark:text-white text-sm">Win the Game</h3>
                    <p class="text-xs text-slate-600 dark:text-[#c7c4d8] mt-1 leading-relaxed">
                      The game is won when the <strong>entire grid is correctly filled</strong> according to all rules.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-emerald-500">
                    <span class="material-symbols-outlined text-[20px]">emoji_events</span>
                  </div>
                </div>
              </div>
            </section>
          }

          <!-- SECTION 4: IMPORTANT NOTES -->
          @if (activeTab() === 'all' || activeTab() === 'notes') {
            <section class="space-y-6 mb-12">
              <div class="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                  <span class="material-symbols-outlined text-[22px]">lightbulb</span>
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Important Notes
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-[#c7c4d8]">Key guidelines to remember during play</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Note 1 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <span class="material-symbols-outlined text-[22px]">block</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">No Duplicate Rule</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    You <strong>cannot place a number that already exists</strong> in the same row, column, or 3×3 box.
                  </p>
                </div>

                <!-- Note 2 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#c3c0ff] flex items-center justify-center">
                    <span class="material-symbols-outlined text-[22px]">fingerprint</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">Unique Solution</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    There is <strong>only one valid solution</strong> for each puzzle. Every step can be deduced with certainty.
                  </p>
                </div>

                <!-- Note 3 -->
                <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#4edea3] flex items-center justify-center">
                    <span class="material-symbols-outlined text-[22px]">psychology</span>
                  </div>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">Pure Logic (No Guessing)</h3>
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] leading-relaxed">
                    Solving the puzzle requires <strong>pure logic</strong> — <strong>no guessing is necessary</strong> if the puzzle is properly designed.
                  </p>
                </div>
              </div>
            </section>
          }

          <!-- SECTION 5: CONTROLS & SHORTCUTS -->
          @if (activeTab() === 'all' || activeTab() === 'controls') {
            <section class="space-y-6 mb-12">
              <div class="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <span class="material-symbols-outlined text-[22px]">keyboard_command_key</span>
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Mindrix Quick Controls &amp; Shortcuts
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-[#c7c4d8]">Speed-solver shortcuts and session mechanics</p>
                </div>
              </div>

              <div class="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#171f33] border border-slate-100 dark:border-slate-800/60">
                    <span class="text-slate-600 dark:text-[#c7c4d8]">Enter Number</span>
                    <kbd class="px-2 py-1 rounded bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-[#c3c0ff] font-bold shadow-xs">1–9</kbd>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#171f33] border border-slate-100 dark:border-slate-800/60">
                    <span class="text-slate-600 dark:text-[#c7c4d8]">Toggle Notes Mode</span>
                    <kbd class="px-2 py-1 rounded bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-[#c3c0ff] font-bold shadow-xs">N</kbd>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#171f33] border border-slate-100 dark:border-slate-800/60">
                    <span class="text-slate-600 dark:text-[#c7c4d8]">Erase Active Cell</span>
                    <kbd class="px-2 py-1 rounded bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-[#c3c0ff] font-bold shadow-xs">Del / Backspace</kbd>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#171f33] border border-slate-100 dark:border-slate-800/60">
                    <span class="text-slate-600 dark:text-[#c7c4d8]">Undo Move</span>
                    <kbd class="px-2 py-1 rounded bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-[#c3c0ff] font-bold shadow-xs">Ctrl + Z</kbd>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#171f33] border border-slate-100 dark:border-slate-800/60">
                    <span class="text-slate-600 dark:text-[#c7c4d8]">Navigate Board</span>
                    <kbd class="px-2 py-1 rounded bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-[#c3c0ff] font-bold shadow-xs">Arrows / WASD</kbd>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#171f33] border border-slate-100 dark:border-slate-800/60">
                    <span class="text-slate-600 dark:text-[#c7c4d8]">Request Hint (3 max)</span>
                    <kbd class="px-2 py-1 rounded bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-[#c3c0ff] font-bold shadow-xs">H</kbd>
                  </div>
                </div>
              </div>
            </section>
          }

          <!-- Bottom CTA Banner -->
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center sm:text-left">
              <span class="font-mono text-xs text-indigo-200 uppercase tracking-widest font-semibold">Ready to Test Your Mind?</span>
              <h3 class="text-2xl sm:text-3xl font-black">Put These Rules Into Practice</h3>
              <p class="text-xs sm:text-sm text-indigo-100 max-w-xl">
                Open Mindrix Sudoku now. Enjoy a clean, ad-free canvas designed for pure logical deduction.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <a
                routerLink="/sudoku"
                class="px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Play Sudoku</span>
                <span class="material-symbols-outlined text-[18px]">play_arrow</span>
              </a>
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
            <a routerLink="/sudoku/rules" class="hover:text-indigo-600 dark:hover:text-white transition-colors">Rules &amp; Guide</a>
            <a routerLink="/sudoku" class="hover:text-indigo-600 dark:hover:text-white transition-colors">Sudoku</a>
            <a routerLink="/" class="hover:text-indigo-600 dark:hover:text-white transition-colors">Games Hub</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class SudokuRulesPageComponent {
  public themeService = inject(ThemeService);

  public activeTab = signal<'all' | 'rules' | 'how-to-play' | 'notes' | 'controls'>('all');

  public tabs = [
    { id: 'all' as const, label: 'All', icon: 'auto_stories' },
    { id: 'rules' as const, label: 'Basic Rules', icon: 'gavel' },
    { id: 'how-to-play' as const, label: 'How to Play', icon: 'sports_esports' },
    { id: 'notes' as const, label: 'Important Notes', icon: 'lightbulb' },
    { id: 'controls' as const, label: 'Controls & Keys', icon: 'keyboard' }
  ];
}
