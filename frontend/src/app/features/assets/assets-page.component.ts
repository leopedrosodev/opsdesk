import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Asset } from '../../core/models/asset.model';
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
        <h2>Inventário</h2>
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
export class AssetsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);

  assets = signal<Asset[]>([]);

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
    this.assetsService.list().subscribe((assets) => this.assets.set(assets));
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
