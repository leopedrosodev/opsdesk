import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card card">
      <h1>Entrar no OpsDesk</h1>
      <p class="subtitle">Use seu email e senha para acessar o painel.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid">
        <label>
          Email
          <input type="email" formControlName="email" />
        </label>

        <label>
          Senha
          <input type="password" formControlName="password" />
        </label>

        <p *ngIf="error" class="error">{{ error }}</p>

        <button class="btn-primary" [disabled]="form.invalid || loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <small>
        Novo por aqui? <a routerLink="/register">Criar conta</a>
      </small>
    </section>
  `,
  styles: [
    `
      .auth-card {
        width: min(460px, 100%);
        margin: 2rem auto;
      }

      .subtitle {
        color: var(--muted);
      }
    `
  ]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao autenticar';
        this.loading = false;
      }
    });
  }
}
