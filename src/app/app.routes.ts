import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard'; // Ruta según tu captura

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/bienvenida/bienvenida').then(m => m.Bienvenida),
    // Definimos los hijos de la página principal
    children: [
      { 
        path: 'chat', 
        loadComponent: () => import('./components/chat/chat').then(m => m.Chat),
        canActivate: [authGuard] 
      }
    ]
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
  { 
    path: 'juegos/ahorcado', 
    loadComponent: () => import('./juegos/ahorcado/ahorcado').then(m => m.AhorcadoComponent),
    canActivate: [authGuard]
  },

  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full'
  }
];