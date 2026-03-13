import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketsService } from './tickets.service';
import { PageResult, Ticket } from '../models/ticket.model';

const mockTicket: Ticket = {
  id: 1,
  title: 'Chamado de teste',
  description: 'Descrição do chamado',
  priority: 'MEDIUM',
  status: 'OPEN',
  creatorId: 1,
  assigneeId: null,
  createdAt: new Date().toISOString(),
  closedAt: null,
  assetIds: []
};

const mockPage: PageResult<Ticket> = {
  content: [mockTicket],
  total: 1,
  page: 0,
  size: 20,
  totalPages: 1
};

describe('TicketsService', () => {
  let service: TicketsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TicketsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('deve criar o serviço', () => {
    expect(service).toBeTruthy();
  });

  it('list deve chamar GET /tickets com parâmetros de paginação', () => {
    service.list(0, 20).subscribe((result) => {
      expect(result.content.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.content[0].title).toBe('Chamado de teste');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/tickets') && r.params.has('page'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('20');
    req.flush(mockPage);
  });

  it('create deve chamar POST /tickets e retornar o ticket criado', () => {
    service.create({ title: 'Chamado de teste', description: 'Descrição', priority: 'MEDIUM' }).subscribe((ticket) => {
      expect(ticket.id).toBe(1);
      expect(ticket.status).toBe('OPEN');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/tickets') && r.method === 'POST');
    expect(req.request.body.title).toBe('Chamado de teste');
    req.flush(mockTicket);
  });

  it('updateStatus deve chamar PATCH /tickets/:id/status', () => {
    service.updateStatus(1, 'RESOLVED').subscribe((ticket) => {
      expect(ticket.status).toBe('RESOLVED');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/tickets/1/status'));
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.status).toBe('RESOLVED');
    req.flush({ ...mockTicket, status: 'RESOLVED' });
  });
});
