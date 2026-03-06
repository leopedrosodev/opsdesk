import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'opsdesk_theme_mode';
  private readonly document = inject(DOCUMENT);
  private currentMode: ThemeMode = 'light';

  constructor() {
    const initialMode = this.resolveInitialMode();
    this.applyTheme(initialMode);
  }

  isDarkMode(): boolean {
    return this.currentMode === 'dark';
  }

  toggleTheme(): void {
    this.applyTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  private applyTheme(mode: ThemeMode): void {
    this.currentMode = mode;
    this.document.documentElement.setAttribute('data-theme', mode);
    this.document.documentElement.style.setProperty('color-scheme', mode);
    localStorage.setItem(this.storageKey, mode);
  }

  private resolveInitialMode(): ThemeMode {
    const stored = localStorage.getItem(this.storageKey);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
