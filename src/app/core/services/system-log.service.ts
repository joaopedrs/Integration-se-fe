import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SystemLog, PaginatedResponse, LogFilter } from '../models/system-log.model';

@Injectable({ providedIn: 'root' })
export class SystemLogService {
  private apiUrl = `${environment.apiUrl}/systemlogs`;

  constructor(private http: HttpClient) {}

  getLogs(filter: LogFilter): Observable<PaginatedResponse<SystemLog>> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize);

    if (filter.userId) params = params.set('userId', filter.userId);
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    if (filter.actionType) params = params.set('actionType', filter.actionType);
    if (filter.application) params = params.set('application', filter.application);
    if (filter.logLevel) params = params.set('logLevel', filter.logLevel);
    if (filter.description) params = params.set('description', filter.description);
    if (filter.ipAddress) params = params.set('ipAddress', filter.ipAddress);

    return this.http.get<PaginatedResponse<SystemLog>>(this.apiUrl, { params });
  }
}