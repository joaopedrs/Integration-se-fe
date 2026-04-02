import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  WorkItemCountByBu, 
  WorkItemCountByProduct, 
  WorkItemCountByColumn, 
  WorkItemFilter,
  PaginatedResponse,
  WorkItemDto 
} from '../models/work-item.model';

@Injectable({ providedIn: 'root' })
export class WorkItemService {
  private apiUrl = `${environment.apiUrl}/workitems`;

  constructor(private http: HttpClient) {}

  getCountByBu(filter?: WorkItemFilter): Observable<WorkItemCountByBu[]> {
    return this.http.get<WorkItemCountByBu[]>(`${this.apiUrl}/count-by-bu`, { params: this.buildParams(filter) });
  }

  getCountByProduct(filter?: WorkItemFilter): Observable<WorkItemCountByProduct[]> {
    return this.http.get<WorkItemCountByProduct[]>(`${this.apiUrl}/count-by-product`, { params: this.buildParams(filter) });
  }

  getCountByColumn(filter?: WorkItemFilter): Observable<WorkItemCountByColumn[]> {
    return this.http.get<WorkItemCountByColumn[]>(`${this.apiUrl}/count-by-column`, { params: this.buildParams(filter) });
  }

  getAgedCount(days: number, filter?: WorkItemFilter): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count-older-than/${days}`, { params: this.buildParams(filter) });
  }

  getWorkItems(filter?: WorkItemFilter): Observable<PaginatedResponse<WorkItemDto>> {
    return this.http.get<PaginatedResponse<WorkItemDto>>(`${this.apiUrl}`, { params: this.buildParams(filter) });
  }

  private buildParams(filter?: WorkItemFilter): HttpParams {
    let params = new HttpParams();
    if (!filter) return params;

    if (filter.pageNumber) params = params.append('PageNumber', filter.pageNumber);
    if (filter.pageSize) params = params.append('PageSize', filter.pageSize);
    
    if (filter.productIds) filter.productIds.forEach(id => params = params.append('ProductIds', id));
    if (filter.businessUnitIds) filter.businessUnitIds.forEach(id => params = params.append('BusinessUnitIds', id));
    if (filter.statuses) filter.statuses.forEach(id => params = params.append('Statuses', id));
    if (filter.providers) filter.providers.forEach(id => params = params.append('Providers', id));
    if (filter.boardColumns) filter.boardColumns.forEach(c => params = params.append('BoardColumns', c));
    if (filter.olderThanDays) params = params.append('OlderThanDays', filter.olderThanDays);

    return params;
  }
}