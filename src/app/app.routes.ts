import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto (cuando entras a localhost:4200 sin nada más)
  { 
    path: '', 
    loadComponent: () => import('./pages/bienvenida/bienvenida').then(m => m.Bienvenida) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login').then(m => m.Login) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./auth/registro/registro').then(m => m.Registro) 
  },
  { 
    path: 'sobre-mi', 
    loadComponent: () => import('./pages/sobre-mi/sobre-mi').then(m => m.SobreMi) 
  },
  // Ruta comodín (Wildcard) para atrapar cualquier error
  { 
    path: '**', 
    loadComponent: () => import('./pages/error/error').then(m => m.Error) 
  }
];