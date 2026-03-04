import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/auth.model';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card card">
      <h1>Criar conta</h1>
      <p class="subtitle">Registre um usuário para acessar a plataforma.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid">
        <label>
          Nome completo
          <input formControlName="fullName" />
        </label>

        <label>
          Email
          <input type="email" formControlName="email" />
        </label>

        <label>
          Senha
          <input type="password" formControlName="password" />
        </label>

        <label>
          Perfil
          <select formControlName="role">
            <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
          </select>
        </label>

        <p *ngIf="error" class="error">{{ error }}</p>

        <button class="btn-primary" [disabled]="form.invalid || loading">
          {{ loading ? 'Criando...' : 'Criar conta' }}
        </button>
      </form>

      <small>
        Já possui conta? <a routerLink="/login">Entrar</a>
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error = '';

  roles: UserRole[] = ['USER', 'TECH', 'ADMIN'];

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: 'USER' as UserRole
  });

  submit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao registrar usuário';
        this.loading = false;
      }
    });
  }
}
