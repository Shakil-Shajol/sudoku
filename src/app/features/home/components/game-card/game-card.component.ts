import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameMetadata } from '../../../../core/models/game-registry.model';

@Component({
  selector: 'app-game-card',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="game-card flex flex-col justify-between bg-slate-900/60 dark:bg-[#171f33] light:bg-white bg-white hover:bg-slate-50 dark:hover:bg-[#222a3d] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
      [class.opacity-90]="!game().isAvailable"
    >
      <div class="space-y-4">
        <!-- Top header row: Badge & Tier -->
        <div class="flex items-center justify-between">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide"
            [ngClass]="{
              'bg-indigo-500/15 text-indigo-600 dark:text-[#c3c0ff]': game().id === 'sudoku',
              'bg-sky-500/15 text-sky-600 dark:text-[#7bd0ff]': game().id === 'nonogram' || game().id === 'bridges',
              'bg-emerald-500/15 text-emerald-600 dark:text-[#4edea3]': game().id === 'kakuro' || game().id === 'hitori',
              'bg-slate-500/15 text-slate-600 dark:text-[#c7c4d8]': game().id === 'slitherlink'
            }"
          >
            @if (game().id === 'sudoku') {
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            }
            {{ game().badge }}
          </span>
          <span class="font-mono text-xs text-slate-500 dark:text-[#c7c4d8]">
            {{ game().tierInfo }}
          </span>
        </div>

        <!-- Vector Preview Visual Representation -->
        <div class="w-full aspect-[16/10] bg-slate-100 dark:bg-[#060e20] rounded-xl p-3 flex items-center justify-center group-hover:bg-slate-200/60 dark:group-hover:bg-[#131b2e] transition-colors overflow-hidden">
          @switch (game().id) {
            @case ('sudoku') {
              <!-- Sudoku 3x3 Mini Grid Visual -->
              <div class="grid grid-cols-3 gap-1 bg-slate-300 dark:bg-slate-700/40 p-1.5 rounded-lg shadow-inner">
                <div class="grid grid-cols-3 gap-0.5 bg-white dark:bg-[#222a3d] p-1 rounded">
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs font-semibold text-sky-500">5</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">3</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs font-bold text-indigo-500">7</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">9</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                </div>
                <div class="grid grid-cols-3 gap-0.5 bg-white dark:bg-[#222a3d] p-1 rounded">
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">6</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">1</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">9</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">5</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs font-semibold text-emerald-500">2</span>
                </div>
                <div class="grid grid-cols-3 gap-0.5 bg-white dark:bg-[#222a3d] p-1 rounded">
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs font-semibold text-indigo-500">8</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">6</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-800 dark:text-slate-100">8</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600">•</span>
                  <span class="w-5 h-5 flex items-center justify-center font-mono text-xs font-semibold text-sky-500">4</span>
                </div>
              </div>
            }
            @case ('nonogram') {
              <!-- Nonogram Heart Matrix Visual -->
              <div class="grid grid-cols-5 gap-1.5 p-2 bg-white dark:bg-[#222a3d] rounded-lg shadow-inner">
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-sky-400"></span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
                <span class="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center text-[10px] text-slate-400">×</span>
              </div>
            }
            @case ('kakuro') {
              <!-- Kakuro Split Clues Visual -->
              <div class="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-700/30 p-2 rounded-lg">
                <div class="w-9 h-9 rounded bg-slate-100 dark:bg-[#060e20] relative overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-700">
                  <svg class="absolute inset-0 w-full h-full text-slate-400 dark:text-slate-600" viewBox="0 0 36 36">
                    <line stroke="currentColor" stroke-width="1.5" x1="0" x2="36" y1="0" y2="36"></line>
                  </svg>
                  <span class="absolute top-0.5 right-1 text-[9px] font-mono text-emerald-500 font-bold">16</span>
                  <span class="absolute bottom-0.5 left-1 text-[9px] font-mono text-sky-500 font-bold">7</span>
                </div>
                <div class="w-9 h-9 rounded bg-white dark:bg-[#222a3d] flex items-center justify-center font-mono text-sm text-slate-900 dark:text-white font-semibold shadow-sm">9</div>
                <div class="w-9 h-9 rounded bg-white dark:bg-[#222a3d] flex items-center justify-center font-mono text-sm text-slate-900 dark:text-white font-semibold shadow-sm">7</div>
                <div class="w-9 h-9 rounded bg-white dark:bg-[#222a3d] flex items-center justify-center font-mono text-sm text-slate-900 dark:text-white font-semibold shadow-sm">3</div>
                <div class="w-9 h-9 rounded bg-white dark:bg-[#222a3d] flex items-center justify-center font-mono text-sm text-emerald-500 font-bold shadow-sm">4</div>
                <div class="w-9 h-9 rounded bg-slate-100 dark:bg-[#060e20] relative overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-700">
                  <svg class="absolute inset-0 w-full h-full text-slate-400 dark:text-slate-600" viewBox="0 0 36 36">
                    <line stroke="currentColor" stroke-width="1.5" x1="0" x2="36" y1="0" y2="36"></line>
                  </svg>
                  <span class="absolute top-0.5 right-1 text-[9px] font-mono text-emerald-500 font-bold">11</span>
                </div>
              </div>
            }
            @case ('slitherlink') {
              <!-- Slitherlink Continuous Loop Visual -->
              <svg class="w-36 h-24 text-indigo-500 dark:text-[#c3c0ff]" viewBox="0 0 160 110">
                <circle class="fill-slate-400 dark:fill-slate-600" cx="20" cy="20" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="60" cy="20" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="100" cy="20" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="140" cy="20" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="20" cy="55" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="60" cy="55" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="100" cy="55" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="140" cy="55" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="20" cy="90" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="60" cy="90" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="100" cy="90" r="3"></circle>
                <circle class="fill-slate-400 dark:fill-slate-600" cx="140" cy="90" r="3"></circle>
                <text class="fill-slate-500 font-mono text-[12px]" text-anchor="middle" x="40" y="42">3</text>
                <text class="fill-slate-500 font-mono text-[12px]" text-anchor="middle" x="80" y="42">2</text>
                <text class="fill-slate-500 font-mono text-[12px]" text-anchor="middle" x="120" y="42">1</text>
                <text class="fill-slate-500 font-mono text-[12px]" text-anchor="middle" x="40" y="78">2</text>
                <text class="fill-slate-900 dark:fill-white font-bold font-mono text-[12px]" text-anchor="middle" x="80" y="78">3</text>
                <text class="fill-slate-500 font-mono text-[12px]" text-anchor="middle" x="120" y="78">0</text>
                <polyline fill="none" points="20,20 60,20 60,55 100,55 100,20 140,20 140,55 140,90 100,90 60,90 20,90 20,55 20,20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></polyline>
              </svg>
            }
            @case ('bridges') {
              <!-- Hashiwokakero Bridges Visual -->
              <svg class="w-40 h-24 text-sky-500 dark:text-[#7bd0ff]" viewBox="0 0 180 110">
                <line stroke="currentColor" stroke-width="1.5" x1="30" x2="100" y1="30" y2="30"></line>
                <line stroke="currentColor" stroke-width="1.5" x1="30" x2="100" y1="34" y2="34"></line>
                <line stroke="currentColor" stroke-width="1.5" x1="100" x2="150" y1="30" y2="30"></line>
                <line stroke="currentColor" stroke-width="1.5" x1="100" x2="100" y1="30" y2="85"></line>
                <line stroke="currentColor" stroke-width="1.5" x1="30" x2="30" y1="30" y2="85"></line>
                <line stroke="currentColor" stroke-width="1.5" x1="34" x2="34" y1="30" y2="85"></line>
                <circle class="fill-white dark:fill-[#222a3d]" cx="30" cy="30" r="14" stroke="currentColor" stroke-width="2"></circle>
                <text class="fill-slate-900 dark:fill-white font-mono text-[13px] font-bold" text-anchor="middle" x="30" y="34">4</text>
                <circle class="fill-white dark:fill-[#222a3d]" cx="100" cy="30" r="14" stroke="currentColor" stroke-width="2"></circle>
                <text class="fill-slate-900 dark:fill-white font-mono text-[13px] font-bold" text-anchor="middle" x="100" y="34">3</text>
                <circle class="fill-white dark:fill-[#222a3d]" cx="150" cy="30" r="14" stroke="currentColor" stroke-width="2"></circle>
                <text class="fill-slate-900 dark:fill-white font-mono text-[13px] font-bold" text-anchor="middle" x="150" y="34">1</text>
                <circle class="fill-white dark:fill-[#222a3d]" cx="30" cy="85" r="14" stroke="currentColor" stroke-width="2"></circle>
                <text class="fill-slate-900 dark:fill-white font-mono text-[13px] font-bold" text-anchor="middle" x="30" y="89">2</text>
                <circle class="fill-white dark:fill-[#222a3d]" cx="100" cy="85" r="14" stroke="currentColor" stroke-width="2"></circle>
                <text class="fill-slate-900 dark:fill-white font-mono text-[13px] font-bold" text-anchor="middle" x="100" y="89">1</text>
              </svg>
            }
            @case ('hitori') {
              <!-- Hitori Elimination Visual -->
              <div class="grid grid-cols-4 gap-1 p-2 bg-slate-200 dark:bg-slate-800/40 rounded-lg">
                <span class="w-6 h-6 rounded bg-white dark:bg-[#222a3d] text-slate-800 dark:text-slate-100 font-mono text-xs flex items-center justify-center">2</span>
                <span class="w-6 h-6 rounded bg-slate-300 dark:bg-[#2d3449] text-slate-400 font-mono text-xs flex items-center justify-center line-through">4</span>
                <span class="w-6 h-6 rounded bg-white dark:bg-[#222a3d] text-slate-800 dark:text-slate-100 font-mono text-xs flex items-center justify-center">3</span>
                <span class="w-6 h-6 rounded bg-white dark:bg-[#222a3d] text-slate-800 dark:text-slate-100 font-mono text-xs flex items-center justify-center">1</span>
                <span class="w-6 h-6 rounded bg-slate-300 dark:bg-[#2d3449] text-slate-400 font-mono text-xs flex items-center justify-center line-through">3</span>
                <span class="w-6 h-6 rounded bg-white dark:bg-[#222a3d] text-emerald-500 font-mono text-xs flex items-center justify-center font-bold">2</span>
                <span class="w-6 h-6 rounded bg-white dark:bg-[#222a3d] text-slate-800 dark:text-slate-100 font-mono text-xs flex items-center justify-center">4</span>
                <span class="w-6 h-6 rounded bg-slate-300 dark:bg-[#2d3449] text-slate-400 font-mono text-xs flex items-center justify-center line-through">3</span>
              </div>
            }
          }
        </div>

        <!-- Title & Description -->
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {{ game().title }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-[#c7c4d8] mt-1.5 leading-relaxed line-clamp-2">
            {{ game().description }}
          </p>
        </div>
      </div>

      <!-- Bottom Row: Stats & Action Button -->
      <div class="mt-6 pt-3 flex flex-col gap-3">
        <div class="flex items-center justify-between font-mono text-xs text-slate-500 dark:text-[#c7c4d8]">
          <span class="flex items-center gap-1.5">
            <span
              class="w-2 h-2 rounded-full"
              [ngClass]="{
                'bg-emerald-500': game().isAvailable,
                'bg-sky-500': !game().isAvailable
              }"
            ></span>
            {{ game().activePlayers }}
          </span>
          <span>{{ game().avgTime }}</span>
        </div>

        @if (game().isAvailable) {
          <a
            [routerLink]="game().route"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-200 active:scale-[0.98] group-hover:scale-[1.01]"
            [attr.aria-label]="'Play ' + game().title"
          >
            <span>Play {{ game().title }}</span>
            <span class="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
              {{ game().actionIcon || 'arrow_forward' }}
            </span>
          </a>
        } @else {
          <button
            type="button"
            disabled
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#222a3d] text-slate-700 dark:text-white font-medium text-sm transition-all cursor-not-allowed opacity-90"
          >
            <span>Coming Soon</span>
            <span class="material-symbols-outlined text-[18px]">lock</span>
          </button>
        }
      </div>
    </article>
  `
})
export class GameCardComponent {
  public game = input.required<GameMetadata>();
}
