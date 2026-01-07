import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'utilisateurs',
    loadComponent: () => import('./components/utilisateurs/list/list')
      .then(m => m.ListComponent)
  },
  {
    path: 'utilisateurs/new',
    loadComponent: () => import('./components/utilisateurs/form/form')
      .then(m => m.FormComponent)
  },
  {
    path: 'utilisateurs/:id/edit',
    loadComponent: () => import('./components/utilisateurs/form/form')
      .then(m => m.FormComponent)
  },
  {
    path: 'cours',
    loadComponent: () => import('./components/cours/list/list')
      .then(m => m.CoursListComponent)
  },
  {
    path: 'cours/new',
    loadComponent: () => import('./components/cours/form/form')
      .then(m => m.FormComponent)
  },
  {
    path: 'cours/:id',
    loadComponent: () => import('./components/cours/detail/detail')
      .then(m => m.DetailComponent)
  },
  {
    path: 'cours/:id/edit',
    loadComponent: () => import('./components/cours/form/form')
      .then(m => m.FormComponent)
  },
  {
    path: 'projets',
    loadComponent: () => import('./components/projets/list/list')
      .then(m => m.ProjetsListComponent)
  },
  {
    path: 'projets/new',
    loadComponent: () => import('./components/projets/form/form')
      .then(m => m.ProjetFormComponent)
  },
  {
    path: 'projets/:id',
    loadComponent: () => import('./components/projets/detail/detail')
      .then(m => m.ProjetDetailComponent)
  },
  {
    path: 'projets/:id/edit',
    loadComponent: () => import('./components/projets/form/form')
      .then(m => m.ProjetFormComponent)
  },
  {
    path: 'soumissions',
    loadComponent: () => import('./components/soumissions/list/list')
      .then(m => m.SoumissionsListComponent)
  },
  {
    path: 'soumissions/new',
    loadComponent: () => import('./components/soumissions/form/form')
      .then(m => m.SoumissionFormComponent)
  },
  {
    path: 'soumissions/:id',
    loadComponent: () => import('./components/soumissions/detail/detail')
      .then(m => m.SoumissionDetailComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
