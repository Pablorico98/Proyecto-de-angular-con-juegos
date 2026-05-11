import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard'; 
import { noAuthGuard } from './auth/guards/no-auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/bienvenida/bienvenida').then(m => m.Bienvenida),
    
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
    loadComponent: () => import('./auth/login/login').then(m => m.Login), 
    canActivate: [noAuthGuard]  
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./auth/registro/registro').then(m => m.Registro),
    canActivate: [noAuthGuard]  
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
  path: 'juegos/mayor-menor', 
  loadComponent: () => import('./juegos/mayor-menor/mayor-menor').then(m => m.MayorMenorComponent),
  canActivate: [authGuard] 
 },
 { path: 'juegos/preguntados', 
  loadComponent: () => import('./juegos/preguntados/preguntados').then(m => m.PreguntadosComponent),
  canActivate: [authGuard] 
 },
  { path: 'juegos/e-card', 
  loadComponent: () => import('./juegos/e-card/e-card').then(m => m.ECardComponent),
  canActivate: [authGuard] 
 },
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full'
  }
];