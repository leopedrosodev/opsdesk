import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TicketsService } from '../../core/services/tickets.service';
import { PageResult, Ticket, TicketComment, TicketPriority, TicketStatus } from '../../core/models/ticket.model';

@Component({
  standalone: true,
  selector: 'app-tickets-page',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="grid" style="grid-template-columns: 1.1fr 1.9fr; align-items: start;">

      <!-- Painel esquerdo: criação OU detalhe do chamado -->
      <article class="card">

        @if (selected()) {
          <!-- Detalhe do chamado selecionado -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h2 style="margin:0">#{{ selected()!.id }} Detalhe</h2>
            <button class="btn-secondary" (click)="closeDetail()">Fechar</button>
          </div>

          <p><strong>Título:</strong> {{ selected()!.title }}</p>
          <p><strong>Descrição:</strong> {{ selected()!.description }}</p>
          <p><strong>Prioridade:</strong> {{ selected()!.priority }}</p>
          <p><strong>Status:</strong> {{ selected()!.status }}</p>
          <p><strong>Responsável:</strong> {{ selected()!.assigneeId ?? 'Não atribuído' }}</p>

          <!-- Atribuir chamado (somente ADMIN/TECH) -->
          @if (canManage()) {
            <hr>
            <h3>Atribuir responsável</h3>
            <form class="grid" [formGroup]="assignForm" (ngSubmit)="assignTicket()">
              <label>
                ID do responsável
                <input type="number" formControlName="assigneeId" placeholder="Ex: 2" />
              </label>
              <button class="btn-primary" [disabled]="assignForm.invalid">Atribuir</button>
            </form>
          }

          <!-- Comentários -->
          <hr>
          <h3>Comentários ({{ comments().length }})</h3>

          @if (comments().length === 0) {
            <p style="color: var(--text-muted, #888)">Nenhum comentário ainda.</p>
          }

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;">
            @for (comment of comments(); track comment.id) {
              <div style="background:var(--card-bg, #f5f5f5); border-radius:6px; padding:0.6rem 0.8rem;">
                <small style="color:var(--text-muted, #888)">{{ comment.authorName }}</small>
                <p style="margin:0.25rem 0 0">{{ comment.content }}</p>
              </div>
            }
          </div>

          <form class="grid" [formGroup]="commentForm" (ngSubmit)="addComment()">
            <label>
              Novo comentário
              <textarea formControlName="content" rows="3" placeholder="Escreva um comentário..."></textarea>
            </label>
            <button class="btn-primary" [disabled]="commentForm.invalid">Comentar</button>
          </form>

        } @else {
          <!-- Formulário de criação -->
          <h2>Novo chamado</h2>
          <form class="grid" [formGroup]="form" (ngSubmit)="createTicket()">
            <label>
              Título
              <input formControlName="title" />
            </label>

            <label>
              Descrição
              <textarea formControlName="description" rows="5"></textarea>
            </label>

            <label>
              Prioridade
              <select formControlName="priority">
                <option *ngFor="let p of priorities" [value]="p">{{ p }}</option>
              </select>
            </label>

            <button class="btn-primary" [disabled]="form.invalid">Abrir chamado</button>
          </form>
        }
      </article>

      <!-- Tabela de chamados -->
      <article class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h2 style="margin:0">Chamados</h2>
          <small style="color:var(--text-muted,#888)">{{ page().total }} no total</small>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridade</th>
              <th>Status</th>
              @if (canManage()) {
                <th>Ações</th>
              }
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let ticket of tickets()"
              (click)="selectTicket(ticket)"
              [style.cursor]="'pointer'"
              [style.background]="selected()?.id === ticket.id ? 'var(--primary-subtle, #e8f4fd)' : ''"
            >
              <td>#{{ ticket.id }}</td>
              <td>{{ ticket.title }}</td>
              <td><span class="badge">{{ ticket.priority }}</span></td>
              <td>{{ ticket.status }}</td>
              @if (canManage()) {
                <td (click)="$event.stopPropagation()">
                  <select [value]="ticket.status" (change)="changeStatus(ticket, $any($event.target).value)">
                    <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                  </select>
                </td>
              }
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        @if (page().totalPages > 1) {
          <div style="display:flex; justify-content:center; align-items:center; gap:0.75rem; margin-top:1rem;">
            <button class="btn-secondary" [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">‹ Anterior</button>
            <span style="font-size:0.875rem">{{ currentPage() + 1 }} / {{ page().totalPages }}</span>
            <button class="btn-secondary" [disabled]="currentPage() >= page().totalPages - 1" (click)="goToPage(currentPage() + 1)">Próximo ›</button>
          </div>
        }
      </article>

    </section>
  `,
  styles: [`
    @media (max-width: 980px) {
      section { grid-template-columns: 1fr !important; }
    }
    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border-color, #ccc);
      border-radius: 6px;
      padding: 0.3rem 0.8rem;
      cursor: pointer;
      font-size: 0.85rem;
    }
    hr { border: none; border-top: 1px solid var(--border-color, #ddd); margin: 1rem 0; }
  `]
})
export class TicketsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ticketsService = inject(TicketsService);
  private readonly authService = inject(AuthService);

  tickets = signal<Ticket[]>([]);
  selected = signal<Ticket | null>(null);
  comments = signal<TicketComment[]>([]);
  currentPage = signal(0);
  page = signal<PageResult<Ticket>>({ content: [], total: 0, page: 0, size: 20, totalPages: 0 });

  priorities: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    priority: 'MEDIUM' as TicketPriority
  });

  assignForm = this.fb.nonNullable.group({
    assigneeId: [null as unknown as number, [Validators.required, Validators.min(1)]]
  });

  commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor() {
    this.load();
  }

  canManage(): boolean {
    const role = this.authService.getCurrentUser()?.role;
    return role === 'ADMIN' || role === 'TECH';
  }

  load(): void {
    this.ticketsService.list(this.currentPage()).subscribe((result) => {
      this.page.set(result);
      this.tickets.set(result.content);
    });
  }

  goToPage(p: number): void {
    this.currentPage.set(p);
    this.load();
  }

  selectTicket(ticket: Ticket): void {
    this.selected.set(ticket);
    this.comments.set([]);
    this.commentForm.reset({ content: '' });
    this.assignForm.reset({ assigneeId: null as unknown as number });
    this.ticketsService.listComments(ticket.id).subscribe((c) => this.comments.set(c));
  }

  closeDetail(): void {
    this.selected.set(null);
    this.comments.set([]);
  }

  createTicket(): void {
    if (this.form.invalid) return;

    this.ticketsService.create(this.form.getRawValue()).subscribe(() => {
      this.form.reset({ priority: 'MEDIUM', title: '', description: '' });
      this.load();
    });
  }

  changeStatus(ticket: Ticket, status: TicketStatus): void {
    this.ticketsService.updateStatus(ticket.id, status).subscribe((updated) => {
      this.tickets.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
      if (this.selected()?.id === updated.id) this.selected.set(updated);
    });
  }

  assignTicket(): void {
    const ticket = this.selected();
    if (!ticket || this.assignForm.invalid) return;

    const { assigneeId } = this.assignForm.getRawValue();
    this.ticketsService.assign(ticket.id, assigneeId).subscribe((updated) => {
      this.selected.set(updated);
      this.tickets.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
      this.assignForm.reset({ assigneeId: null as unknown as number });
    });
  }

  addComment(): void {
    const ticket = this.selected();
    if (!ticket || this.commentForm.invalid) return;

    const { content } = this.commentForm.getRawValue();
    this.ticketsService.addComment(ticket.id, { content }).subscribe((comment) => {
      this.comments.update((list) => [...list, comment]);
      this.commentForm.reset({ content: '' });
    });
  }
}
