import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth'; 
import { ModalService } from '../../services/modal';  

export const authGuard: CanActivateFn = async  (route, state) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);
  const tieneSesion = await authService.tieneSesionPromise();

  if (tieneSesion) {
    return true; // Hay usuario, puede pasar al chat
  }

  modalService.abrir();
  return false; 
};