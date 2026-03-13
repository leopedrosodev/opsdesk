import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Runbook, RunbookRequest } from '../models/runbook.model';
import { PageResult } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class RunbooksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  list(page = 0, size = 20): Observable<PageResult<Runbook>> {
    return this.http.get<PageResult<Runbook>>(`${this.apiUrl}/runbooks`, { params: { page, size } });
  }

  create(payload: RunbookRequest): Observable<Runbook> {
    return this.http.post<Runbook>(`${this.apiUrl}/runbooks`, payload);
  }
}
