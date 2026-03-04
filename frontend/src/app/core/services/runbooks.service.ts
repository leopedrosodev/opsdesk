import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Runbook, RunbookRequest } from '../models/runbook.model';

@Injectable({ providedIn: 'root' })
export class RunbooksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  list(): Observable<Runbook[]> {
    return this.http.get<Runbook[]>(`${this.apiUrl}/runbooks`);
  }

  create(payload: RunbookRequest): Observable<Runbook> {
    return this.http.post<Runbook>(`${this.apiUrl}/runbooks`, payload);
  }
}
