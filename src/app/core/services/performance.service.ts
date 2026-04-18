import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PerformanceFilterOptions, PerformanceFilter, PerformanceChartResult } from '../models/performance.model';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  private apiUrl = `${environment.apiUrl}/performance`;

  constructor(private http: HttpClient) {}

  getFilterOptions(): Observable<PerformanceFilterOptions> {
    return this.http.get<PerformanceFilterOptions>(`${this.apiUrl}/filters`);
  }

  getChartData(filter: PerformanceFilter): Observable<PerformanceChartResult> {
    return this.http.post<PerformanceChartResult>(`${this.apiUrl}/chart-data`, filter);
  }
}