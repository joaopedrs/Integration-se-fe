import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AzurePersonalToken, CreateAzurePersonalTokenDto, UpdateAzurePersonalTokenDto } from '../models/azure-personal-token.model';

@Injectable({ providedIn: 'root' })
export class AzurePersonalTokenService {
  private apiUrl = `${environment.apiUrl}/azurepersonaltokens`; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<AzurePersonalToken[]> {
    return this.http.get<AzurePersonalToken[]>(this.apiUrl);
  }

  getById(id: number): Observable<AzurePersonalToken> {
    return this.http.get<AzurePersonalToken>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateAzurePersonalTokenDto): Observable<AzurePersonalToken> {
    return this.http.post<AzurePersonalToken>(this.apiUrl, data);
  }

  update(id: number, data: UpdateAzurePersonalTokenDto): Observable<AzurePersonalToken> {
    return this.http.put<AzurePersonalToken>(`${this.apiUrl}/${id}`, data);
  }

  delete(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: ids });
  }
}