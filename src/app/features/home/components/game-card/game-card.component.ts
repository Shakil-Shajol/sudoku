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
      class="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500"
      [class.opacity-75]="!game().isAvailable"
    >
      <div>
        <!-- Top row: Icon & Badge -->
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-md transition-transform duration-300 group-hover:scale-105"
            [ngClass]="{
              'bg-blue-600 text-white shadow-blue-500/25': game().isAvailable,
              'bg-slate-100 dark:bg-slate-800 text-slate-500 shadow-none': !game().isAvailable
            }"
          >
            {{ game().icon }}
          </div>

          @if (game().badge) {
            <span
              class="px-2.5 py-1 text-xs font-bold rounded-full tracking-wide"
              [ngClass]="{
                'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300': game().badge === 'Popular',
                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400': game().badge !== 'Popular'
              }"
            >
              {{ game().badge }}
            </span>
          }
        </div>

        <!-- Category & Title -->
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ game().category }}
        </span>
        <h3 class="text-xl font-black text-slate-900 dark:text-white mt-0.5 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ game().title }}
        </h3>

        <!-- Description -->
        <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {{ game().description }}
        </p>

        <!-- Difficulties / Meta badges -->
        @if (game().difficultyLevels) {
          <div class="flex flex-wrap gap-1.5 mb-6">
            @for (level of game().difficultyLevels; track level) {
              <span class="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                {{ level }}
              </span>
            }
          </div>
        }
      </div>

      <!-- Action Button -->
      <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        @if (game().isAvailable) {
          <a
            [routerLink]="game().route"
            class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            [attr.aria-label]="'Play ' + game().title"
          >
            <span>Play Now</span>
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        } @else {
          <button
            type="button"
            disabled
            class="w-full inline-flex items-center justify-center px-5 py-3 bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 font-semibold text-sm rounded-xl cursor-not-allowed"
          >
            Coming Soon
          </button>
        }
      </div>
    </article>
  `
})
export class GameCardComponent {
  public game = input.required<GameMetadata>();
}
