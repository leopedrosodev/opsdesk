import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero card">
      <div>
        <p class="badge">Service Desk Platform</p>
        <h1>Painel OpsDesk</h1>
        <p>
          Gerencie chamados, inventário e runbooks em uma aplicação única de suporte técnico.
        </p>
      </div>
      <div class="hero-meta">
        <div>
          <small>Usuário atual</small>
          <strong>{{ auth.getCurrentUser()?.fullName }}</strong>
        </div>
        <div>
          <small>Perfil</small>
          <strong>{{ auth.getCurrentUser()?.role }}</strong>
        </div>
      </div>
    </section>

    <section class="grid quick-actions">
      <a class="card" routerLink="/tickets">
        <h3>Chamados</h3>
        <p>Abrir e acompanhar incidentes.</p>
      </a>
      <a class="card" routerLink="/assets">
        <h3>Ativos</h3>
        <p>Inventário de dispositivos e servidores.</p>
      </a>
      <a class="card" routerLink="/runbooks">
        <h3>Runbooks</h3>
        <p>Procedimentos operacionais padronizados.</p>
      </a>
    </section>
  `,
  styles: [
    `
      .hero {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: flex-start;
      }

      .hero h1 {
        margin: 0.4rem 0;
      }

      .hero-meta {
        display: grid;
        gap: 0.7rem;
      }

      .hero-meta div {
        background: #f8fafc;
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 0.65rem 0.8rem;
      }

      .hero-meta small {
        display: block;
        color: var(--muted);
      }

      .quick-actions {
        margin-top: 1rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .quick-actions a {
        text-decoration: none;
        color: inherit;
        transition: transform 0.2s ease;
      }

      .quick-actions a:hover {
        transform: translateY(-3px);
      }

      @media (max-width: 900px) {
        .hero {
          flex-direction: column;
        }

        .quick-actions {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class HomeComponent {
  auth = inject(AuthService);
}
