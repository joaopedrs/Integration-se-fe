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
      {
        path: 'azure-personal-tokens',
        loadComponent: () => import('./features/azure-personal-tokens/azure-personal-tokens.component').then(m => m.AzurePersonalTokensComponent)
      },
      {
        path: 'logs',
        loadComponent: () => import('./features/system-logs/system-logs.component').then(m => m.SystemLogsComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'dashboard/performance',
        loadComponent: () => import('./features/dashboard/performance/performance.component').then(m => m.PerformanceComponent)
      },
      {
        path: 'squads',
        loadComponent: () => import('./features/squads/squads.component').then(m => m.SquadsComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'workitems',
        loadComponent: () => import('./features/workitems/workitems.component').then(m => m.WorkitemsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];