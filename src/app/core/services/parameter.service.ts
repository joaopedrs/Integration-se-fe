import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Parameter, ParameterDto } from '../models/parameter.model';

@Injectable({ providedIn: 'root' })
export class ParameterService {
  private apiUrl = `${environment.apiUrl}/parameter`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Parameter[]> {
    return this.http.get<Parameter[]>(this.apiUrl);
  }

  getById(id: number): Observable<Parameter> {
    return this.http.get<Parameter>(`${this.apiUrl}/${id}`);
  }

  create(data: ParameterDto): Observable<Parameter> {
    return this.http.post<Parameter>(this.apiUrl, data);
  }

  update(id: number, data: ParameterDto): Observable<Parameter> {
    return this.http.put<Parameter>(`${this.apiUrl}/${id}`, data);
  }

  delete(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: ids });
  }
}