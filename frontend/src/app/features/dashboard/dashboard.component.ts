import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero card">
      <div>
        <p class="badge">Operational Snapshot</p>
        <h1>Painel OpsDesk</h1>
        <p>
          Acompanhe backlog, execução e base operacional em um resumo construído no backend e
          consumido de forma reativa no Angular.
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

    @if (state().loading) {
      <section class="metrics-grid">
        <article class="metric-card card" *ngFor="let item of skeletonCards">
          <small>{{ item }}</small>
          <strong>...</strong>
          <span>Carregando indicador</span>
        </article>
      </section>
    } @else if (state().error) {
      <section class="card status-card error-card">
        <h2>Resumo indisponível</h2>
        <p>{{ state().error }}</p>
      </section>
    } @else {
      <section class="metrics-grid">
        <article class="metric-card card" *ngFor="let metric of metrics()">
          <small>{{ metric.label }}</small>
          <strong>{{ metric.value }}</strong>
          <span>{{ metric.caption }}</span>
        </article>
      </section>

      <section class="grid insights-grid">
        <article class="card spotlight-card">
          <p class="badge">Fila de chamados</p>
          <h2>{{ state().summary!.ticketsOpen }} abertos aguardando tratativa</h2>
          <p>{{ backlogMessage() }}</p>
        </article>

        <article class="card status-card">
          <h2>Distribuição do fluxo</h2>
          <div class="status-list">
            <div *ngFor="let item of statusBreakdown()">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </article>
      </section>
    }

    <section class="grid quick-actions">
      <a class="card" routerLink="/tickets">
        <h3>Chamados</h3>
        <p>Operar backlog, atribuição e comentários.</p>
      </a>
      <a class="card" routerLink="/assets">
        <h3>Ativos</h3>
        <p>Gerenciar inventário de dispositivos e servidores.</p>
      </a>
      <a class="card" routerLink="/runbooks">
        <h3>Runbooks</h3>
        <p>Consolidar procedimentos e conhecimento técnico.</p>
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
        background: var(--surface-soft);
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

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .metric-card {
        display: grid;
        gap: 0.35rem;
        min-height: 132px;
      }

      .metric-card small,
      .metric-card span {
        color: var(--muted);
      }

      .metric-card strong {
        font-size: clamp(1.8rem, 4vw, 2.4rem);
        line-height: 1;
      }

      .insights-grid {
        margin-top: 1rem;
        grid-template-columns: 1.1fr 0.9fr;
      }

      .spotlight-card h2,
      .status-card h2 {
        margin: 0.8rem 0;
      }

      .status-list {
        display: grid;
        gap: 0.7rem;
      }

      .status-list div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.55rem;
      }

      .error-card p {
        color: var(--danger);
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

        .metrics-grid,
        .insights-grid,
        .quick-actions {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  readonly skeletonCards = ['Chamados', 'Execução', 'Ativos', 'Runbooks'];
  readonly state = toSignal(
    this.dashboardService.getSummary().pipe(
      map((summary) => ({ loading: false, summary, error: null as string | null })),
      startWith({ loading: true, summary: null, error: null as string | null }),
      catchError(() =>
        of({
          loading: false,
          summary: null,
          error: 'Não foi possível carregar os indicadores do dashboard.'
        })
      )
    ),
    {
      initialValue: { loading: true, summary: null, error: null as string | null }
    }
  );

  readonly metrics = computed(() => {
    const summary = this.state().summary;
    if (!summary) {
      return [];
    }

    return [
      { label: 'Chamados totais', value: summary.ticketsTotal, caption: `${summary.ticketsOpen} em aberto` },
      { label: 'Em execução', value: summary.ticketsInProgress, caption: `${summary.ticketsUnassigned} sem responsável` },
      { label: 'Ativos', value: summary.assetsTotal, caption: 'Base inventariada' },
      { label: 'Runbooks', value: summary.runbooksTotal, caption: 'Conhecimento operacional' }
    ];
  });

  readonly statusBreakdown = computed(() => {
    const summary = this.state().summary;
    if (!summary) {
      return [];
    }

    return [
      { label: 'Abertos', value: summary.ticketsOpen },
      { label: 'Em progresso', value: summary.ticketsInProgress },
      { label: 'Resolvidos', value: summary.ticketsResolved },
      { label: 'Fechados', value: summary.ticketsClosed }
    ];
  });

  readonly backlogMessage = computed(() => {
    const summary = this.state().summary;
    if (!summary) {
      return '';
    }

    if (summary.ticketsUnassigned > 0) {
      return `${summary.ticketsUnassigned} chamados ainda não têm responsável. Esse é um bom ponto para discutir priorização e capacidade do time durante a entrevista.`;
    }

    return 'Todos os chamados já têm responsável definido, o que indica fluxo operacional mais controlado.';
  });
}
