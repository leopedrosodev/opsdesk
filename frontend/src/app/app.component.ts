import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="container topbar-content">
        <a [routerLink]="auth.isAuthenticated() ? '/dashboard' : '/'" class="brand" aria-label="OpsDesk Home">
          <img [src]="logoPath" alt="OpsDesk" class="brand-logo" />
        </a>

        <nav *ngIf="auth.isAuthenticated(); else guestNav" class="nav nav-auth">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Dashboard
          </a>
          <a routerLink="/tickets" routerLinkActive="active">Chamados</a>
          <a routerLink="/assets" routerLinkActive="active">Ativos</a>
          <a routerLink="/runbooks" routerLinkActive="active">Runbooks</a>
        </nav>

        <ng-template #guestNav>
          <nav class="nav nav-guest">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
            <a routerLink="/login" routerLinkActive="active">Entrar</a>
            <a routerLink="/register" class="cta-link">Começar</a>
          </nav>
        </ng-template>

        <div class="actions">
          <button class="theme-toggle" (click)="toggleTheme()" aria-label="Alternar tema">
            {{ theme.isDarkMode() ? 'Modo claro' : 'Modo escuro' }}
          </button>
          <button *ngIf="auth.isAuthenticated()" class="btn-secondary" (click)="logout()">Sair</button>
        </div>
      </div>
    </header>

    <main class="container page">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .topbar {
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border);
        background: var(--topbar-bg);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .topbar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.8rem 0;
        gap: 0.9rem;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
      }

      .brand-logo {
        height: 38px;
        width: auto;
        display: block;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }

      .nav a {
        text-decoration: none;
        color: var(--muted);
        font-weight: 500;
      }

      .nav a.active {
        color: var(--primary);
      }

      .nav-guest .cta-link {
        color: var(--guest-cta-text);
        border: 1px solid var(--guest-cta-border);
        background: var(--guest-cta-bg);
        padding: 0.35rem 0.62rem;
        border-radius: 999px;
      }

      .actions {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
      }

      .theme-toggle {
        border: 1px solid var(--border);
        background: var(--surface-soft);
        color: var(--text);
        border-radius: 999px;
        min-height: 36px;
        padding: 0.45rem 0.8rem;
        font-size: 0.86rem;
      }

      .theme-toggle:hover {
        background: var(--surface-hover);
      }

      .page {
        padding: 1.25rem 0 2rem;
      }

      @media (max-width: 980px) {
        .topbar-content {
          flex-wrap: wrap;
        }

        .nav {
          order: 3;
          width: 100%;
          justify-content: flex-start;
          padding-top: 0.35rem;
          border-top: 1px solid var(--border);
        }
      }

      @media (max-width: 640px) {
        .actions {
          width: 100%;
          justify-content: flex-end;
        }

        .brand-logo {
          height: 34px;
        }
      }
    `
  ]
})
export class AppComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private readonly router = inject(Router);

  get logoPath(): string {
    return this.theme.isDarkMode()
      ? 'assets/brand/opsdesk-logo-light.svg'
      : 'assets/brand/opsdesk-logo-dark.svg';
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
