import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Runbook } from '../../core/models/runbook.model';
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
        <h2>Runbooks</h2>
        <div class="grid">
          <article class="card runbook" *ngFor="let runbook of runbooks()">
            <h3>{{ runbook.title }}</h3>
            <p>{{ runbook.description }}</p>
            <pre>{{ runbook.steps }}</pre>
          </article>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      pre {
        margin: 0;
        padding: 0.8rem;
        background: #f8fafc;
        border-radius: 10px;
        border: 1px solid var(--border);
        white-space: pre-wrap;
      }

      .runbook {
        padding: 0.75rem;
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
    this.runbooksService.list().subscribe((runbooks) => this.runbooks.set(runbooks));
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
