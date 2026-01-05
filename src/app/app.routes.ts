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
  {
    path: 'perpetual-calendar',
    loadComponent: () =>
      import('./perpetual-calendar/perpetual-calendar').then((m) => m.PerpetualCalendar),
  },
  {
    path: 'age-calculator',
    loadComponent: () => import('./age-calculator/age-calculator').then((m) => m.AgeCalculator),
  },
];
