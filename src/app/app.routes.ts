import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'generate' },
  {
    path: 'generate',
    loadComponent: () => import('./label-generator/label-generator.component').then(m => m.LabelGeneratorComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
  }
];
