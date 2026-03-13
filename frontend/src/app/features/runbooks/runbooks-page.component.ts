import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Runbook } from '../../core/models/runbook.model';
import { PageResult } from '../../core/models/ticket.model';
import { AuthService } from '../../core/services/auth.service';
import { RunbooksService } from '../../core/services/runbooks.service';

@Component({
  standalone: true,
  selector: 'app-runbooks-page',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="grid" style="grid-template-columns: 1.1fr 1.9fr; align-items: start;">
      <article class="card" *ngIf="canCreate()">
        <h2>Novo runbook</h2>
        <form class="grid" [formGroup]="form" (ngSubmit)="createRunbook()">
          <label>
            Título
            <input formControlName="title" />
          </label>

          <label>
            Descrição
            <textarea formControlName="description" rows="3"></textarea>
          </label>

          <label>
            Passos
            <textarea formControlName="steps" rows="8"></textarea>
          </label>

          <button class="btn-primary" [disabled]="form.invalid">Publicar</button>
        </form>
      </article>

      <article class="card" [style.gridColumn]="canCreate() ? 'span 1' : '1 / -1'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h2 style="margin:0">Runbooks</h2>
          <small style="color:var(--text-muted,#888)">{{ page().total }} no total</small>
        </div>
        <div class="grid">
          <article class="card runbook" *ngFor="let runbook of runbooks()">
            <h3>{{ runbook.title }}</h3>
            <p>{{ runbook.description }}</p>
            <pre>{{ runbook.steps }}</pre>
          </article>
        </div>

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
  styles: [
    `
      pre {
        margin: 0;
        padding: 0.8rem;
        background: var(--surface-soft);
        border-radius: 10px;
        border: 1px solid var(--border);
        white-space: pre-wrap;
      }

      .runbook {
        padding: 0.75rem;
      }

      .btn-secondary:disabled {
        opacity: 0.4;
        cursor: default;
      }

      @media (max-width: 980px) {
        section {
          grid-template-columns: 1fr !important;
        }
      }
    `
  ]
})
export class RunbooksPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly runbooksService = inject(RunbooksService);
  private readonly auth = inject(AuthService);

  runbooks = signal<Runbook[]>([]);
  currentPage = signal(0);
  page = signal<PageResult<Runbook>>({ content: [], total: 0, page: 0, size: 20, totalPages: 0 });

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    steps: ['', [Validators.required]]
  });

  constructor() {
    this.load();
  }

  canCreate(): boolean {
    const role = this.auth.getCurrentUser()?.role;
    return role === 'ADMIN' || role === 'TECH';
  }

  load(): void {
    this.runbooksService.list(this.currentPage()).subscribe((result) => {
      this.page.set(result);
      this.runbooks.set(result.content);
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.load();
  }

  createRunbook(): void {
    if (!this.canCreate() || this.form.invalid) {
      return;
    }

    this.runbooksService.create(this.form.getRawValue()).subscribe(() => {
      this.form.reset({ title: '', description: '', steps: '' });
      this.load();
    });
  }
}
