import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  mostrarModal = signal<boolean>(false);

  abrir() {
    this.mostrarModal.set(true);
  }

  cerrar() {
    this.mostrarModal.set(false);
  }
}