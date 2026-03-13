import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Asset } from '../../core/models/asset.model';
import { PageResult } from '../../core/models/ticket.model';
import { AssetsService } from '../../core/services/assets.service';

@Component({
  standalone: true,
  selector: 'app-assets-page',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="grid" style="grid-template-columns: 1.1fr 1.9fr; align-items: start;">
      <article class="card">
        <h2>Novo ativo</h2>
        <form class="grid" [formGroup]="form" (ngSubmit)="createAsset()">
          <label>
            Nome
            <input formControlName="name" />
          </label>

          <label>
            Tipo
            <input formControlName="type" />
          </label>

          <label>
            IP
            <input formControlName="ip" />
          </label>

          <label>
            Localização
            <input formControlName="location" />
          </label>

          <label>
            Tags (separadas por vírgula)
            <input formControlName="tags" />
          </label>

          <button class="btn-primary" [disabled]="form.invalid">Cadastrar ativo</button>
        </form>
      </article>

      <article class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h2 style="margin:0">Inventário</h2>
          <small style="color:var(--text-muted,#888)">{{ page().total }} no total</small>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>IP</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let asset of assets()">
              <td>#{{ asset.id }}</td>
              <td>{{ asset.name }}</td>
              <td>{{ asset.type }}</td>
              <td>{{ asset.ip || '-' }}</td>
              <td>{{ asset.tags.join(', ') || '-' }}</td>
            </tr>
          </tbody>
        </table>

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
      .btn-secondary:disabled { opacity: 0.4; cursor: default; }
    `
  ]
})
export class AssetsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);

  assets = signal<Asset[]>([]);
  currentPage = signal(0);
  page = signal<PageResult<Asset>>({ content: [], total: 0, page: 0, size: 20, totalPages: 0 });

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    type: ['', [Validators.required]],
    ip: [''],
    location: [''],
    tags: ['']
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.assetsService.list(this.currentPage()).subscribe((result) => {
      this.page.set(result);
      this.assets.set(result.content);
    });
  }

  goToPage(p: number): void {
    this.currentPage.set(p);
    this.load();
  }

  createAsset(): void {
    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue();
    const tags = raw.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    this.assetsService
      .create({
        name: raw.name,
        type: raw.type,
        ownerId: null,
        ip: raw.ip || null,
        location: raw.location || null,
        tags
      })
      .subscribe(() => {
        this.form.reset({ name: '', type: '', ip: '', location: '', tags: '' });
        this.load();
      });
  }
}
