import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Squad, CreateUpdateSquad, ManageSquadLinks } from '../models/squad.model';

@Injectable({
  providedIn: 'root'
})
export class SquadService {
  private apiUrl = `${environment.apiUrl}/Squads`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Squad[]> {
    return this.http.get<Squad[]>(this.apiUrl);
  }

  getById(id: number): Observable<Squad> {
    return this.http.get<Squad>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateUpdateSquad): Observable<Squad> {
    return this.http.post<Squad>(this.apiUrl, data);
  }

  update(id: number, data: CreateUpdateSquad): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  updateSquadProducts(squadId: number, productIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${squadId}/products`, productIds);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  manageLinks(data: ManageSquadLinks): Observable<any> {
    return this.http.post(`${this.apiUrl}/manage-links`, data);
  }
}