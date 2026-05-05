import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth'; 
import { ModalService } from '../../services/modal';  

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);

  if (authService.usuarioActual() !== null) {
    return true;  
  }

  modalService.abrir();
  return false; 
};