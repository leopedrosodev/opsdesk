import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketsService } from '../../core/services/tickets.service';
import { Ticket, TicketPriority, TicketStatus } from '../../core/models/ticket.model';

@Component({
  standalone: true,
  selector: 'app-tickets-page',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="grid" style="grid-template-columns: 1.1fr 1.9fr; align-items: start;">
      <article class="card">
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
      </article>

      <article class="card">
        <h2>Chamados</h2>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ticket of tickets()">
              <td>#{{ ticket.id }}</td>
              <td>{{ ticket.title }}</td>
              <td><span class="badge">{{ ticket.priority }}</span></td>
              <td>{{ ticket.status }}</td>
              <td>
                <select [value]="ticket.status" (change)="changeStatus(ticket, $any($event.target).value)">
                  <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  `,
  styles: [
    `
      @media (max-width: 980px) {
        section {
          grid-template-columns: 1fr !important;
        }
      }
    `
  ]
})
export class TicketsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ticketsService = inject(TicketsService);

  tickets = signal<Ticket[]>([]);
  priorities: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    priority: 'MEDIUM' as TicketPriority
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.ticketsService.list().subscribe((tickets) => this.tickets.set(tickets));
  }

  createTicket(): void {
    if (this.form.invalid) {
      return;
    }

    this.ticketsService.create(this.form.getRawValue()).subscribe(() => {
      this.form.reset({ priority: 'MEDIUM', title: '', description: '' });
      this.load();
    });
  }

  changeStatus(ticket: Ticket, status: TicketStatus): void {
    this.ticketsService.updateStatus(ticket.id, status).subscribe((updated) => {
      this.tickets.update((list) => list.map((item) => (item.id === updated.id ? updated : item)));
    });
  }
}
