import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="landing-hero">
      <div class="hero-content">
        <img [src]="heroLogoPath" alt="OpsDesk" class="hero-logo" />
        <p class="badge hero-badge">IT Service Desk Portfolio</p>
        <h1>OpsDesk centraliza operação, ativos e conhecimento em um único fluxo.</h1>
        <p class="hero-subtitle">
          MVP completo com Java + Spring Boot no backend, Angular no frontend e deploy cloud.
          Feito para demonstrar arquitetura limpa, UX objetiva e evolução real de produto.
        </p>

        <div class="hero-actions">
          <a *ngIf="auth.isAuthenticated(); else publicActions" class="btn-primary" routerLink="/dashboard">
            Entrar no painel
          </a>

          <ng-template #publicActions>
            <a class="btn-primary" routerLink="/login">Acessar plataforma</a>
            <a class="btn-secondary" routerLink="/register">Criar conta</a>
          </ng-template>
        </div>
      </div>

      <div class="hero-panel card">
        <h2>Pronto para portfólio técnico</h2>
        <p>
          Estrutura separada por camadas, segurança JWT com RBAC, migrações e front modular por
          feature.
        </p>

        <div class="metric-grid">
          <article class="metric-card" *ngFor="let metric of metrics">
            <small>{{ metric.label }}</small>
            <strong>{{ metric.value }}</strong>
          </article>
        </div>
      </div>
    </section>

    <section class="feature-section">
      <header class="section-header">
        <p class="badge">MVP Escalável</p>
        <h2>Três blocos de negócio para operação de TI no dia a dia</h2>
      </header>

      <div class="feature-grid">
        <article class="feature-card card" *ngFor="let feature of features">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <ul>
            <li *ngFor="let item of feature.points">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="architecture card">
      <header class="section-header compact">
        <p class="badge">Arquitetura</p>
        <h2>Fluxo ponta a ponta em produção</h2>
      </header>

      <div class="flow-grid">
        <article class="flow-node" *ngFor="let node of architecture">
          <strong>{{ node.title }}</strong>
          <p>{{ node.description }}</p>
        </article>
      </div>
    </section>

    <section class="principles">
      <header class="section-header compact">
        <p class="badge">Qualidade de Engenharia</p>
        <h2>Decisões focadas em clean code e manutenção</h2>
      </header>
      <div class="principle-list">
        <span *ngFor="let principle of principles">{{ principle }}</span>
      </div>
    </section>

    <section class="cta card">
      <div>
        <h2>Quer explorar o projeto ao vivo?</h2>
        <p>
          Faça login e navegue pelos módulos de chamados, inventário e runbooks com dados reais de
          exemplo.
        </p>
      </div>
      <a *ngIf="auth.isAuthenticated(); else startNow" class="btn-primary" routerLink="/dashboard">
        Ir para dashboard
      </a>
      <ng-template #startNow>
        <a class="btn-primary" routerLink="/login">Começar agora</a>
      </ng-template>
    </section>
  `,
  styles: [
    `
      :host {
        display: grid;
        gap: 1.35rem;
      }

      .landing-hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 1.1rem;
        align-items: stretch;
        animation: rise-in 0.6s ease both;
      }

      .hero-content {
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 1.35rem;
        background:
          radial-gradient(circle at 15% 10%, var(--blob-primary), transparent 42%),
          linear-gradient(140deg, var(--surface-soft) 0%, var(--surface) 62%);
        box-shadow: var(--shadow);
      }

      .hero-badge {
        margin-bottom: 0.7rem;
      }

      .hero-logo {
        width: min(300px, 78%);
        height: auto;
        display: block;
        margin-bottom: 0.85rem;
      }

      .hero-content h1 {
        font-size: clamp(1.75rem, 3.2vw, 2.7rem);
        line-height: 1.08;
        margin: 0;
      }

      .hero-subtitle {
        margin-top: 0.95rem;
        color: var(--muted);
        max-width: 62ch;
      }

      .hero-actions {
        margin-top: 1.1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .hero-actions a {
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding-inline: 1rem;
      }

      .hero-panel {
        animation: rise-in 0.6s ease 0.15s both;
      }

      .hero-panel h2 {
        margin-top: 0;
      }

      .hero-panel p {
        margin-bottom: 1rem;
        color: var(--muted);
      }

      .metric-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.7rem;
      }

      .metric-card {
        border: 1px solid var(--border);
        background: var(--surface-soft);
        border-radius: 12px;
        padding: 0.65rem 0.75rem;
      }

      .metric-card small {
        color: var(--muted);
        display: block;
      }

      .metric-card strong {
        font-size: 1.05rem;
      }

      .feature-section {
        animation: rise-in 0.6s ease 0.26s both;
      }

      .section-header h2 {
        margin: 0.7rem 0 0;
        font-size: clamp(1.25rem, 2.1vw, 1.9rem);
      }

      .section-header.compact h2 {
        margin-top: 0.55rem;
      }

      .feature-grid {
        margin-top: 0.85rem;
        display: grid;
        gap: 0.85rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .feature-card {
        transition: transform 0.22s ease, box-shadow 0.22s ease;
      }

      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow);
      }

      .feature-card h3 {
        margin-top: 0;
      }

      .feature-card p {
        color: var(--muted);
      }

      .feature-card ul {
        margin: 0.75rem 0 0;
        padding-left: 1rem;
      }

      .feature-card li {
        margin-bottom: 0.35rem;
      }

      .architecture {
        animation: rise-in 0.6s ease 0.35s both;
      }

      .flow-grid {
        margin-top: 0.95rem;
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .flow-node {
        border: 1px dashed var(--border);
        border-radius: 12px;
        padding: 0.75rem;
        background: var(--surface-soft);
      }

      .flow-node strong {
        display: block;
        margin-bottom: 0.3rem;
      }

      .flow-node p {
        margin: 0;
        color: var(--muted);
      }

      .principles {
        animation: rise-in 0.6s ease 0.44s both;
      }

      .principle-list {
        margin-top: 0.75rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
      }

      .principle-list span {
        border: 1px solid var(--border);
        background: var(--surface-soft);
        color: var(--text);
        padding: 0.45rem 0.72rem;
        border-radius: 999px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.8rem;
      }

      .cta {
        animation: rise-in 0.6s ease 0.52s both;
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
        background:
          radial-gradient(circle at 85% 15%, var(--blob-accent), transparent 35%),
          var(--surface);
      }

      .cta h2 {
        margin: 0 0 0.55rem;
      }

      .cta p {
        margin: 0;
        color: var(--muted);
      }

      .cta a {
        text-decoration: none;
        white-space: nowrap;
      }

      @keyframes rise-in {
        from {
          opacity: 0;
          transform: translateY(14px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 900px) {
        .landing-hero {
          grid-template-columns: 1fr;
        }

        .feature-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .flow-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .cta {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      @media (max-width: 640px) {
        .hero-content {
          padding: 1.05rem;
          border-radius: 20px;
        }

        .metric-grid,
        .feature-grid,
        .flow-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class HomeComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);

  get heroLogoPath(): string {
    return this.theme.isDarkMode()
      ? 'assets/brand/opsdesk-logo-light.svg'
      : 'assets/brand/opsdesk-logo-dark.svg';
  }

  readonly metrics = [
    { label: 'Módulos Core', value: '3' },
    { label: 'Perfis RBAC', value: 'ADMIN / TECH / USER' },
    { label: 'Deploy Stack', value: 'Cloudflare + Render + Neon' },
    { label: 'Arquitetura', value: 'Clean Layers' }
  ];

  readonly features = [
    {
      title: 'Tickets',
      description: 'Fluxo de abertura, atribuição, status e comentários em chamados.',
      points: ['Prioridade e status padronizados', 'Atribuição de técnico', 'Comentários por ticket']
    },
    {
      title: 'Assets',
      description: 'Inventário de ativos com dono, IP, localização e tags.',
      points: ['Cadastro e edição', 'Visão consolidada de ativos', 'Ligação com tickets']
    },
    {
      title: 'Runbooks',
      description: 'Base operacional para padronizar execução e troubleshooting.',
      points: ['Criação de procedimentos', 'Consulta por equipe', 'Reuso de conhecimento']
    }
  ];

  readonly architecture = [
    { title: 'Browser', description: 'UX Angular com rotas e estado de autenticação.' },
    { title: 'Cloudflare Pages', description: 'Entrega global da SPA e deploy contínuo.' },
    { title: 'Spring Boot API', description: 'Regras de negócio, JWT e RBAC.' },
    { title: 'Neon PostgreSQL', description: 'Persistência relacional com Flyway.' }
  ];

  readonly principles = [
    'Single Responsibility',
    'Dependency Inversion',
    'Use Cases isolados',
    'DTO + Mapper por camada',
    'Auth stateless com JWT',
    'Pronto para CI/CD'
  ];
}
