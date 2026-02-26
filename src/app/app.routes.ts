// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard], 
    children: [
      {
        path: 'parameters',
        loadComponent: () => import('./features/parameters/parameters.component').then(m => m.ParametersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      { path: '', redirectTo: 'parameters', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];