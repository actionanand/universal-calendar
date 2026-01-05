import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/angular-updates',
    pathMatch: 'full',
  },
  {
    path: 'angular-updates',
    loadComponent: () => import('./angular-updates/angular-updates').then((m) => m.AngularUpdates),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar').then((m) => m.Calendar),
  },
];
