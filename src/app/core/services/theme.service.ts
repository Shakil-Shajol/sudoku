import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'dark' | 'light' | 'system';

const STORAGE_KEY_THEME = 'mindrix_theme_preference_v1';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme = signal<ThemeMode>('dark');
  public isDark = signal<boolean>(true);

  constructor() {
    this.initTheme();

    // Listen to OS prefers-color-scheme if user choice is system
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.theme() === 'system') {
          this.applyTheme(e.matches);
        }
      });
    }
  }

  private initTheme(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = (localStorage.getItem(STORAGE_KEY_THEME) || localStorage.getItem('enigma_theme_preference_v1')) as ThemeMode | null;
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        this.setTheme(saved);
        return;
      }
    } catch {
      // Ignore localStorage access failures
    }

    // Default to dark mode as per Mindrix Design Spec
    this.setTheme('dark');
  }

  public setTheme(mode: ThemeMode): void {
    this.theme.set(mode);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_THEME, mode);
      }
    } catch {
      // Ignore
    }

    let shouldBeDark = true;
    if (mode === 'light') {
      shouldBeDark = false;
    } else if (mode === 'dark') {
      shouldBeDark = true;
    } else if (mode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme(shouldBeDark);
  }

  public toggleTheme(): void {
    if (this.isDark()) {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  private applyTheme(dark: boolean): void {
    this.isDark.set(dark);
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }
}
