// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_ID_KEY = 'logged_user_id';
  private readonly USER_NAME_KEY = 'logged_user_name';
  private readonly USER_ROLE_KEY = 'logged_user_role';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        this.saveSession(response);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_ID_KEY);
    sessionStorage.removeItem(this.USER_NAME_KEY);
    sessionStorage.removeItem(this.USER_ROLE_KEY);
    this.router.navigate(['/login']);
  }

  private saveSession(response: AuthResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, response.accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    sessionStorage.setItem(this.USER_ID_KEY, response.userId.toString());
    sessionStorage.setItem(this.USER_NAME_KEY, response.name);
    sessionStorage.setItem(this.USER_ROLE_KEY, response.role.toString());
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getLoggedUserId(): number | null {
    const id = sessionStorage.getItem(this.USER_ID_KEY);
    return id ? Number(id) : null;
  }

  getLoggedUserName(): string | null {
    return sessionStorage.getItem(this.USER_NAME_KEY);
  }

  getLoggedUserRole(): number | null {
    const role = sessionStorage.getItem(this.USER_ROLE_KEY);
    return role ? Number(role) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}