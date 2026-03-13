import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  function runGuard(): boolean | UrlTree {
    return TestBed.runInInjectionContext(() => authGuard());
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => localStorage.clear());

  it('deve permitir acesso quando o usuário está autenticado', () => {
    localStorage.setItem('opsdesk_token', 'valid-token');

    const result = runGuard();

    expect(result).toBeTrue();
  });

  it('deve redirecionar para /login quando não há token', () => {
    localStorage.removeItem('opsdesk_token');

    const result = runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
