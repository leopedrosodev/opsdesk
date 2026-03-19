import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
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
          <input formControlName="fullName" [class.invalid]="hasFieldError('fullName')" />
        </label>
        <p *ngIf="hasFieldError('fullName')" class="error">{{ getFieldError('fullName') }}</p>

        <label>
          Email
          <input type="email" formControlName="email" [class.invalid]="hasFieldError('email')" />
        </label>
        <p *ngIf="hasFieldError('email')" class="error">{{ getFieldError('email') }}</p>

        <label>
          Senha
          <input type="password" formControlName="password" [class.invalid]="hasFieldError('password')" />
        </label>
        <p *ngIf="hasFieldError('password')" class="error">{{ getFieldError('password') }}</p>

        <section class="password-meter" *ngIf="passwordValue">
          <div class="meter-header">
            <span>Força da senha</span>
            <strong [class]="passwordStrength.tone">{{ passwordStrength.label }}</strong>
          </div>
          <div class="meter-track" aria-hidden="true">
            <span
              class="meter-fill"
              [class]="passwordStrength.tone"
              [style.width.%]="passwordStrength.percent"
            ></span>
          </div>
          <small class="hint">{{ passwordStrength.hint }}</small>
          <ul class="password-checklist">
            <li [class.met]="passwordRules.minLength">Pelo menos 8 caracteres</li>
            <li [class.met]="passwordRules.hasLowercase">Uma letra minuscula</li>
            <li [class.met]="passwordRules.hasUppercase">Uma letra maiuscula</li>
            <li [class.met]="passwordRules.hasNumber">Um numero</li>
            <li [class.met]="passwordRules.hasSpecialChar">Um simbolo</li>
          </ul>
        </section>

        <label>
          Confirmar senha
          <input
            type="password"
            formControlName="confirmPassword"
            [class.invalid]="hasFieldError('confirmPassword') || showPasswordMismatch"
          />
        </label>
        <p *ngIf="hasFieldError('confirmPassword')" class="error">{{ getFieldError('confirmPassword') }}</p>

        <p *ngIf="showPasswordMismatch" class="error">As senhas não coincidem.</p>

        <label>
          Perfil
          <select formControlName="role" [class.invalid]="hasFieldError('role')">
            <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
          </select>
        </label>
        <p *ngIf="hasFieldError('role')" class="error">{{ getFieldError('role') }}</p>

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

      label {
        display: grid;
        gap: 0.45rem;
      }

      input.invalid,
      select.invalid {
        border-color: var(--danger);
        box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.12);
      }

      .password-meter {
        display: grid;
        gap: 0.45rem;
      }

      .meter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;
      }

      .meter-header strong {
        padding: 0.15rem 0.55rem;
        border-radius: 999px;
        font-size: 0.82rem;
        line-height: 1;
        border: 1px solid currentColor;
      }

      .meter-track {
        height: 0.6rem;
        border-radius: 999px;
        background: color-mix(in srgb, var(--border) 78%, white);
        overflow: hidden;
      }

      .meter-fill {
        display: block;
        height: 100%;
        border-radius: inherit;
        transition: width 180ms ease, background-color 180ms ease;
      }

      .weak {
        color: #b42318;
        background: rgba(217, 45, 32, 0.14);
      }

      .medium {
        color: #b54708;
        background: rgba(247, 144, 9, 0.16);
      }

      .strong {
        color: #027a48;
        background: rgba(18, 183, 106, 0.16);
      }

      .hint {
        color: var(--muted);
      }

      .password-checklist {
        list-style: none;
        margin: 0;
        padding: 0;
        color: var(--muted);
        display: grid;
        gap: 0.25rem;
      }

      .password-checklist li::before {
        content: '•';
        display: inline-block;
        width: 1rem;
        color: color-mix(in srgb, var(--muted) 75%, white);
      }

      .password-checklist li.met {
        color: #027a48;
      }

      .password-checklist li.met::before {
        color: #12b76a;
      }

      .btn-primary[disabled] {
        background: color-mix(in srgb, var(--primary) 38%, var(--surface));
        color: color-mix(in srgb, white 72%, var(--text));
        cursor: not-allowed;
        box-shadow: none;
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

  form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: 'USER' as UserRole
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );

  get passwordValue(): string {
    return this.form.controls.password.value;
  }

  get showPasswordMismatch(): boolean {
    const confirm = this.form.controls.confirmPassword;
    return confirm.touched && this.form.hasError('passwordMismatch');
  }

  get passwordStrength(): PasswordStrength {
    return evaluatePasswordStrength(this.passwordValue);
  }

  get passwordRules(): PasswordRules {
    return evaluatePasswordRules(this.passwordValue);
  }

  hasFieldError(fieldName: RegisterFieldName): boolean {
    const field = this.form.controls[fieldName];
    return field.invalid && (field.touched || field.dirty);
  }

  getFieldError(fieldName: RegisterFieldName): string {
    const field = this.form.controls[fieldName];

    if (field.hasError('required')) {
      return FIELD_LABELS[fieldName] + ' e obrigatorio.';
    }

    if (field.hasError('email')) {
      return 'Informe um email valido.';
    }

    if (field.hasError('maxlength')) {
      return FIELD_LABELS[fieldName] + ' excede o tamanho permitido.';
    }

    if (field.hasError('minlength')) {
      return FIELD_LABELS[fieldName] + ' precisa ter pelo menos 8 caracteres.';
    }

    return 'Campo invalido.';
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao registrar usuário';
        this.loading = false;
      }
    });
  }
}

type PasswordStrength = {
  hint: string;
  label: 'Fraca' | 'Media' | 'Forte';
  percent: number;
  tone: 'weak' | 'medium' | 'strong';
};

type PasswordRules = {
  minLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

type RegisterFieldName = 'fullName' | 'email' | 'password' | 'confirmPassword' | 'role';

const FIELD_LABELS: Record<RegisterFieldName, string> = {
  fullName: 'Nome completo',
  email: 'Email',
  password: 'Senha',
  confirmPassword: 'Confirmacao de senha',
  role: 'Perfil'
};

function passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField)?.value;
    const confirmPassword = control.get(confirmPasswordField)?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      label: 'Fraca',
      percent: 0,
      tone: 'weak',
      hint: 'Use pelo menos 8 caracteres.'
    };
  }

  const rules = evaluatePasswordRules(password);
  let score = Object.values(rules).filter(Boolean).length;

  if (password.length >= 12) {
    score += 1;
  }

  if (score <= 2) {
    return {
      label: 'Fraca',
      percent: 33,
      tone: 'weak',
      hint: 'Adicione maiusculas, numeros e simbolos.'
    };
  }

  if (score <= 4) {
    return {
      label: 'Media',
      percent: 66,
      tone: 'medium',
      hint: 'Boa base. Uma senha maior e com simbolos fica mais forte.'
    };
  }

  return {
    label: 'Forte',
    percent: 100,
    tone: 'strong',
    hint: 'Senha forte para uso no cadastro.'
  };
}

function evaluatePasswordRules(password: string): PasswordRules {
  return {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password)
  };
}
