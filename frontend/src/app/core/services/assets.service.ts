import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Asset, AssetRequest } from '../models/asset.model';
import { PageResult } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  list(page = 0, size = 20): Observable<PageResult<Asset>> {
    return this.http.get<PageResult<Asset>>(`${this.apiUrl}/assets`, { params: { page, size } });
  }

  create(payload: AssetRequest): Observable<Asset> {
    return this.http.post<Asset>(`${this.apiUrl}/assets`, payload);
  }

  update(id: number, payload: AssetRequest): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/assets/${id}`, payload);
  }
}
