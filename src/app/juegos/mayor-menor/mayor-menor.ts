import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos';
import { ModalAviso } from '../../components/modal-aviso/modal-aviso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, ModalAviso],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenorComponent implements OnInit {
  private juegosService = inject(JuegosService);
  private router = inject(Router);

  // Estados del juego con Signals[cite: 1]
  cartaActual = signal<number>(0);
  proximaCarta = signal<number>(0);
  aciertos = signal<number>(0);
  rachaActual = signal<number>(0);
  
  mostrarModalJuego = false;
  modalTitulo = '';
  modalMensaje = '';

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.cartaActual.set(this.generarNumero());
    this.proximaCarta.set(this.generarNumero());
    this.aciertos.set(0);
    this.rachaActual.set(0);
    this.mostrarModalJuego = false;
  }

  generarNumero(): number {
    return Math.floor(Math.random() * 12) + 1; // Cartas del 1 al 12
  }

  async jugar(eleccion: 'mayor' | 'menor') {
    const actual = this.cartaActual();
    const proxima = this.proximaCarta();

    // Lógica: Si la próxima es igual, cuenta como acierto para evitar frustración
    const ganoRonda = (eleccion === 'mayor' && proxima >= actual) || 
                      (eleccion === 'menor' && proxima <= actual);

    if (ganoRonda) {
      this.aciertos.update(v => v + 1);
      this.rachaActual.update(v => v + 1);
      this.avanzarRonda();
    } else {
      await this.finalizarJuego();
    }
  }

  avanzarRonda() {
    this.cartaActual.set(this.proximaCarta());
    this.proximaCarta.set(this.generarNumero());
  }

  async finalizarJuego() {
    this.modalTitulo = '¡Perdiste!';
    this.modalMensaje = `Lograste un total de ${this.aciertos()} aciertos con una racha final de ${this.rachaActual()}.`;
    this.mostrarModalJuego = true;

    // Guardar estadísticas en Supabase
    await this.juegosService.guardarResultado('mayor-menor', {
      aciertos_totales: this.aciertos(),
      maxima_racha: this.rachaActual(),
      fecha: new Date().toISOString()
    });
  }

  salir() {
    this.router.navigate(['/']);
  }
}