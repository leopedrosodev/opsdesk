import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AddCommentRequest,
  CreateTicketRequest,
  PageResult,
  Ticket,
  TicketComment,
  TicketStatus,
  UpdateTicketRequest
} from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  list(page = 0, size = 20): Observable<PageResult<Ticket>> {
    return this.http.get<PageResult<Ticket>>(`${this.apiUrl}/tickets`, { params: { page, size } });
  }

  create(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, payload);
  }

  update(id: number, payload: UpdateTicketRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}`, payload);
  }

  updateStatus(id: number, status: TicketStatus): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/status`, { status });
  }

  assign(ticketId: number, assigneeId: number): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${ticketId}/assign/${assigneeId}`, {});
  }

  addComment(ticketId: number, payload: AddCommentRequest): Observable<TicketComment> {
    return this.http.post<TicketComment>(`${this.apiUrl}/tickets/${ticketId}/comments`, payload);
  }

  listComments(ticketId: number): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(`${this.apiUrl}/tickets/${ticketId}/comments`);
  }
}
