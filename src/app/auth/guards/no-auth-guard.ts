import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth'; 

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const tieneSesion = await authService.tieneSesionPromise();
  
  if (tieneSesion) {// Si ya hay un usuario logueado 
    router.navigate(['/']);  
    return false;
  }
  
  // Si no hay usuario 
  return true; 
};