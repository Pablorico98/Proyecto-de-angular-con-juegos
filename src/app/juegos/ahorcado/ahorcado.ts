import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos';
import { ModalAviso } from '../../components/modal-aviso/modal-aviso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, ModalAviso],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class AhorcadoComponent implements OnInit, OnDestroy {
  private juegosService = inject(JuegosService);
  private router = inject(Router);

  private listaPalabras = ['ANGULAR', 'SUPABASE', 'TYPESCRIPT', 'BACKEND', 'DATABASE', 'FRONTEND'];
  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  
  palabraOculta = signal('');
  letrasSeleccionadas = signal<string[]>([]);
  intentosMaximos = 6;
  
  // Variables de tiempo
  tiempoInicio: number = 0;
  tiempoTranscurrido = signal<number>(0);
  intervaloTiempo: any;
  
  mostrarModalJuego = false;
  modalTitulo = '';
  modalMensaje = '';

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    this.detenerReloj();
  }

  iniciarJuego() {
    const indice = Math.floor(Math.random() * this.listaPalabras.length);
    this.palabraOculta.set(this.listaPalabras[indice]);
    this.letrasSeleccionadas.set([]);
    this.mostrarModalJuego = false;
    this.tiempoInicio = Date.now();
    this.iniciarReloj();
  }

  detenerReloj() {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }
  }

  iniciarReloj() {
    this.detenerReloj(); 
    this.intervaloTiempo = setInterval(() => {
      const segundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);
      this.tiempoTranscurrido.set(segundos);
    }, 1000);
  }

  palabraMostrada = computed(() => {
    return this.palabraOculta()
      .split('')
      .map(letra => this.letrasSeleccionadas().includes(letra) ? letra : '_')
      .join(' ');
  });

  intentosFallidos = computed(() => {
    return this.letrasSeleccionadas().filter(
      letra => !this.palabraOculta().includes(letra)).length;
  });

  seleccionarLetra(letra: string) {
    if (this.letrasSeleccionadas().includes(letra) || this.mostrarModalJuego) return;

    this.letrasSeleccionadas.update(prev => [...prev, letra]);
    this.verificarFinDeJuego();
  }

  async verificarFinDeJuego() {
    const gano = !this.palabraMostrada().includes('_');
    const perdio = this.intentosFallidos() >= this.intentosMaximos;

    if (gano || perdio) {
      this.detenerReloj(); 
      const tiempoTotal = this.tiempoTranscurrido();
      
      this.modalTitulo = gano ? '¡Felicidades, ganaste!' : 'Juego Terminado';
      this.modalMensaje = gano 
        ? `Adivinaste la palabra en ${tiempoTotal} segundos.` 
        : `Te quedaste sin intentos. La palabra era: ${this.palabraOculta()}`;
      
      this.mostrarModalJuego = true;

      try {
        await this.juegosService.guardarResultado('ahorcado', {
          gano: gano,
          intentos_fallidos: this.intentosFallidos(),
          letras_usadas: this.letrasSeleccionadas().length,
          tiempo_segundos: tiempoTotal
        });
      } catch (error) {
        console.error("Error al guardar la partida:", error);
      }
    }
  }

  salirDelJuego() {
    this.router.navigate(['/']);
  }
}