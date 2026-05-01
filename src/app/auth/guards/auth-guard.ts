import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth'; // Ajustá la ruta si tu servicio está en otro lado
import { ModalService } from '../../services/modal'; // Ajustá la ruta a tu modal.service

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);

  if (authService.usuarioActual() !== null) {
    return true; // Hay usuario, puede pasar al chat
  }

  modalService.abrir();
  return false; 
};