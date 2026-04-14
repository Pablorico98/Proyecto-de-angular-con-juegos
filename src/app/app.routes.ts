import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto (cuando entras a localhost:4200 sin nada más)
  { 
    path: '', 
    loadComponent: () => import('./bienvenida/bienvenida').then(m => m.Bienvenida) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./login/login').then(m => m.Login) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./registro/registro').then(m => m.Registro) 
  },
  { 
    path: 'sobre-mi', 
    loadComponent: () => import('./sobre-mi/sobre-mi').then(m => m.SobreMi) 
  },
  // Ruta comodín (Wildcard) para atrapar cualquier error
  { 
    path: '**', 
    loadComponent: () => import('./error/error').then(m => m.Error) 
  }
];