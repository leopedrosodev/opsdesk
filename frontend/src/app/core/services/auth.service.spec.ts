import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth.model';

const mockAuthResponse: AuthResponse = {
  token: 'jwt-token-mock',
  userId: 1,
  fullName: 'Teste User',
  email: 'teste@opsdesk.com',
  role: 'USER'
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve criar o serviço', () => {
    expect(service).toBeTruthy();
  });

  it('login deve persistir token e usuário no localStorage', () => {
    service.login({ email: 'teste@opsdesk.com', password: '123456' }).subscribe((res) => {
      expect(res.token).toBe('jwt-token-mock');
      expect(localStorage.getItem('opsdesk_token')).toBe('jwt-token-mock');
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getCurrentUser()?.email).toBe('teste@opsdesk.com');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/auth/login'));
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);
  });

  it('logout deve limpar token e redirecionar para /login', () => {
    localStorage.setItem('opsdesk_token', 'jwt-token-mock');
    localStorage.setItem('opsdesk_user', JSON.stringify(mockAuthResponse));

    service.logout();

    expect(localStorage.getItem('opsdesk_token')).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('isAuthenticated deve retornar false quando não há token', () => {
    localStorage.removeItem('opsdesk_token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('getCurrentUser deve retornar null quando localStorage está vazio', () => {
    expect(service.getCurrentUser()).toBeNull();
  });
});
