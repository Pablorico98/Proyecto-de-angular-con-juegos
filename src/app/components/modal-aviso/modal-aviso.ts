import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-aviso',
  standalone: true,
  templateUrl: './modal-aviso.html',
  styleUrl: './modal-aviso.css'
})
export class ModalAviso {
  @Input() titulo: string = ''; 
  @Input() mensaje: string = '';
  @Input() textoConfirmar: string = 'Aceptar';
  @Input() textoCancelar: string = 'Cancelar';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar() { this.confirmar.emit(); }
  onCancelar() { this.cancelar.emit(); }
}