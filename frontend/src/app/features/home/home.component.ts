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
        <p class="badge hero-badge">Service Desk em produção</p>
        <img [src]="heroLogoPath" alt="OpsDesk" class="hero-logo" />
        <h1>Operação de TI com chamados, ativos e runbooks em uma experiência única.</h1>
        <p class="hero-subtitle">
          Projeto full stack construído para demonstrar domínio de produto, arquitetura limpa,
          segurança com JWT/RBAC e deploy real em Cloudflare, Render e Neon.
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

        <div class="trust-row" aria-label="Stack principal">
          <span>Angular 17</span>
          <span>Spring Boot 3</span>
          <span>PostgreSQL</span>
          <span>CI/CD</span>
        </div>
      </div>

      <div class="hero-panel">
        <div class="panel-toolbar">
          <span></span>
          <span></span>
          <span></span>
          <strong>OpsDesk Live</strong>
        </div>

        <div class="ops-overview">
          <article class="signal-card primary">
            <small>Backlog aberto</small>
            <strong>24</strong>
            <span>8 críticos priorizados</span>
          </article>
          <article class="signal-card">
            <small>SLA saudável</small>
            <strong>91%</strong>
            <span>monitorado por status</span>
          </article>
        </div>

        <div class="workstream">
          <div class="workstream-header">
            <span>Fila operacional</span>
            <strong>Em execução</strong>
          </div>
          <article *ngFor="let item of queueItems" class="queue-item">
            <span class="queue-dot" [class]="item.tone"></span>
            <div>
              <strong>{{ item.title }}</strong>
              <small>{{ item.meta }}</small>
            </div>
            <em>{{ item.status }}</em>
          </article>
        </div>
      </div>
    </section>

    <section class="proof-strip">
      <article *ngFor="let metric of metrics">
        <small>{{ metric.label }}</small>
        <strong>{{ metric.value }}</strong>
      </article>
    </section>

    <section class="feature-section">
      <header class="section-header">
        <p class="badge">Produto completo</p>
        <h2>Módulos que mostram raciocínio de operação, não só CRUD.</h2>
      </header>

      <div class="feature-grid">
        <article class="feature-card card" *ngFor="let feature of features">
          <span class="feature-kicker">{{ feature.kicker }}</span>
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
        <h2>Fluxo real de uma aplicação publicada.</h2>
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
        gap: 1.5rem;
      }

      .landing-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
        gap: 1.15rem;
        align-items: stretch;
        animation: rise-in 0.6s ease both;
      }

      .hero-content {
        border: 1px solid var(--border);
        border-radius: 28px;
        padding: clamp(1.25rem, 2.5vw, 2.2rem);
        background: var(--hero-bg);
        box-shadow: var(--shadow);
        min-height: 510px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        position: relative;
      }

      .hero-content::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-image:
          linear-gradient(to right, color-mix(in srgb, var(--border) 28%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--border) 28%, transparent) 1px, transparent 1px);
        background-size: 42px 42px;
        mask-image: linear-gradient(115deg, black, transparent 70%);
        opacity: 0.35;
      }

      .hero-content > * {
        position: relative;
      }

      .hero-badge {
        margin-bottom: 1rem;
        width: fit-content;
      }

      .hero-logo {
        width: min(250px, 70%);
        height: auto;
        display: block;
        margin-bottom: 1.05rem;
      }

      .hero-content h1 {
        font-size: 3rem;
        line-height: 1.08;
        margin: 0;
        max-width: 15ch;
        letter-spacing: 0;
      }

      .hero-subtitle {
        margin-top: 1.1rem;
        color: var(--muted);
        max-width: 58ch;
        font-size: 1.03rem;
        line-height: 1.58;
      }

      .hero-actions {
        margin-top: 1.35rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .hero-actions a {
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding-inline: 1.05rem;
        border-radius: 12px;
        font-weight: 700;
      }

      .trust-row {
        margin-top: 1.4rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
      }

      .trust-row span {
        border: 1px solid var(--border);
        background: color-mix(in srgb, var(--surface) 68%, transparent);
        color: var(--muted);
        border-radius: 999px;
        padding: 0.35rem 0.65rem;
        font-size: 0.82rem;
        font-weight: 700;
      }

      .hero-panel {
        border: 1px solid var(--border);
        border-radius: 28px;
        padding: 1rem;
        background:
          linear-gradient(180deg, color-mix(in srgb, var(--surface-soft) 88%, transparent), var(--surface)),
          var(--surface);
        box-shadow: var(--shadow);
        animation: rise-in 0.6s ease 0.15s both;
        min-height: 510px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .panel-toolbar {
        min-height: 44px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: var(--panel-bg);
        display: flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0 0.9rem;
      }

      .panel-toolbar span {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 999px;
        background: var(--accent);
      }

      .panel-toolbar span:nth-child(2) {
        background: var(--warning);
      }

      .panel-toolbar span:nth-child(3) {
        background: var(--primary);
      }

      .panel-toolbar strong {
        margin-left: auto;
        font-size: 0.86rem;
        color: var(--muted);
      }

      .ops-overview {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.85rem;
      }

      .signal-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 1rem;
        background: var(--panel-bg);
        min-height: 150px;
        display: grid;
        align-content: space-between;
      }

      .signal-card.primary {
        background:
          linear-gradient(145deg, color-mix(in srgb, var(--primary) 20%, transparent), transparent),
          var(--panel-bg);
      }

      .signal-card small,
      .signal-card span {
        color: var(--muted);
      }

      .signal-card small {
        display: block;
        font-weight: 700;
      }

      .signal-card strong {
        font-size: 3.4rem;
        line-height: 1;
      }

      .signal-card span {
        font-size: 0.9rem;
      }

      .workstream {
        border: 1px solid var(--border);
        border-radius: 22px;
        padding: 1rem;
        background: var(--panel-bg);
        display: grid;
        gap: 0.75rem;
        flex: 1;
      }

      .workstream-header,
      .queue-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.8rem;
      }

      .workstream-header span {
        color: var(--muted);
        font-weight: 700;
      }

      .workstream-header strong {
        color: var(--accent-strong);
        font-size: 0.9rem;
      }

      .queue-item {
        border: 1px solid var(--border);
        background: color-mix(in srgb, var(--surface-soft) 78%, transparent);
        border-radius: 16px;
        padding: 0.85rem;
      }

      .queue-item div {
        min-width: 0;
        flex: 1;
      }

      .queue-item strong,
      .queue-item small {
        display: block;
      }

      .queue-item small,
      .queue-item em {
        color: var(--muted);
        font-style: normal;
        font-size: 0.86rem;
      }

      .queue-dot {
        width: 0.78rem;
        height: 0.78rem;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent);
      }

      .queue-dot.high {
        background: var(--warning);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--warning) 20%, transparent);
      }

      .queue-dot.critical {
        background: var(--danger);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--danger) 18%, transparent);
      }

      .proof-strip {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.85rem;
        animation: rise-in 0.6s ease 0.2s both;
      }

      .proof-strip article {
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 0.9rem 1rem;
        background: var(--surface-raised);
        box-shadow: var(--shadow-soft);
      }

      .proof-strip small {
        display: block;
        color: var(--muted);
        margin-bottom: 0.4rem;
      }

      .proof-strip strong {
        font-size: 1.05rem;
      }

      .feature-section {
        animation: rise-in 0.6s ease 0.26s both;
      }

      .section-header h2 {
        margin: 0.7rem 0 0;
        font-size: 2.15rem;
        max-width: 760px;
        letter-spacing: 0;
      }

      .section-header.compact h2 {
        margin-top: 0.55rem;
      }

      .feature-grid {
        margin-top: 1rem;
        display: grid;
        gap: 0.95rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .feature-card {
        padding: 1.1rem;
        min-height: 265px;
        display: flex;
        flex-direction: column;
        transition: transform 0.22s ease, box-shadow 0.22s ease;
      }

      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow);
      }

      .feature-card h3 {
        margin: 0.35rem 0 0;
        font-size: 1.35rem;
      }

      .feature-card p {
        color: var(--muted);
        line-height: 1.5;
      }

      .feature-kicker {
        width: fit-content;
        color: var(--accent-strong);
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .feature-card ul {
        margin: auto 0 0;
        padding-left: 0;
        list-style: none;
      }

      .feature-card li {
        margin-bottom: 0.35rem;
        color: var(--text);
      }

      .feature-card li::before {
        content: '';
        display: inline-block;
        width: 0.45rem;
        height: 0.45rem;
        margin-right: 0.5rem;
        border-radius: 999px;
        background: var(--accent);
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
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 0.9rem;
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
        background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent 58%), var(--surface-raised);
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

        .hero-content,
        .hero-panel {
          min-height: auto;
        }

        .hero-content h1 {
          font-size: 2.5rem;
        }

        .feature-grid,
        .proof-strip {
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

        .ops-overview,
        .proof-strip,
        .feature-grid,
        .flow-grid {
          grid-template-columns: 1fr;
        }

        .hero-content h1 {
          font-size: 2rem;
          max-width: 100%;
        }

        .section-header h2 {
          font-size: 1.6rem;
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
    { label: 'Módulos core', value: 'Tickets, ativos e runbooks' },
    { label: 'Segurança', value: 'JWT + RBAC' },
    { label: 'Deploy real', value: 'Cloudflare + Render + Neon' },
    { label: 'Arquitetura', value: 'Clean layers + Flyway' }
  ];

  readonly queueItems = [
    { title: 'API com latência alta', meta: 'Chamado critico vinculado ao asset api-prod', status: 'P1', tone: 'critical' },
    { title: 'Notebook sem acesso VPN', meta: 'Suporte N2 atribuido', status: 'TECH', tone: 'high' },
    { title: 'Runbook de backup revisado', meta: 'Conhecimento operacional atualizado', status: 'OK', tone: 'normal' }
  ];

  readonly features = [
    {
      kicker: 'Incidentes',
      title: 'Tickets',
      description: 'Fluxo de abertura, atribuição, status e comentários em chamados.',
      points: ['Prioridade e status padronizados', 'Atribuição de técnico', 'Comentários por ticket']
    },
    {
      kicker: 'Inventário',
      title: 'Assets',
      description: 'Inventário de ativos com dono, IP, localização e tags.',
      points: ['Cadastro e edição', 'Visão consolidada de ativos', 'Ligação com tickets']
    },
    {
      kicker: 'Conhecimento',
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
