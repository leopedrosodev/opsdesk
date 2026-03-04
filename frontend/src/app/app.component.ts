import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="container topbar-content">
        <a routerLink="/" class="brand">OpsDesk</a>
        <nav *ngIf="auth.isAuthenticated()" class="nav">
          <a routerLink="/tickets" routerLinkActive="active">Chamados</a>
          <a routerLink="/assets" routerLinkActive="active">Ativos</a>
          <a routerLink="/runbooks" routerLinkActive="active">Runbooks</a>
        </nav>
        <button *ngIf="auth.isAuthenticated()" class="btn-secondary" (click)="logout()">Sair</button>
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
        background: rgba(255, 255, 255, 0.86);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .topbar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.85rem 0;
        gap: 1rem;
      }

      .brand {
        font-weight: 700;
        text-decoration: none;
        color: var(--text);
      }

      .nav {
        display: flex;
        gap: 1rem;
      }

      .nav a {
        text-decoration: none;
        color: var(--muted);
      }

      .nav a.active {
        color: var(--primary);
        font-weight: 700;
      }

      .page {
        padding: 1.25rem 0 2rem;
      }
    `
  ]
})
export class AppComponent {
  auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
