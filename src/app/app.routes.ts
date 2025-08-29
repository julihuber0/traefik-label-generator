import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./label-generator/label-generator.component').then(m => m.LabelGeneratorComponent)
  }
];
