import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { JuegosService } from '../../services/juegos';
import { ModalService } from '../../services/modal';
import { ModalAviso } from '../../components/modal-aviso/modal-aviso';

@Component({
  selector: 'app-e-card',
  standalone: true,
  imports: [CommonModule, ModalAviso, RouterLink],
  templateUrl: './e-card.html',
  styleUrls: ['./e-card.css']
})
export class ECardComponent implements OnInit {
  private juegosService = inject(JuegosService);
  public modalService = inject(ModalService);
  private router = inject(Router);

  // --- ESTADO GENERAL ---
  vidas = signal(3);
  puntos = signal(0);
  rachaVictorias = signal(0);
  bandoJugador = signal<'emperador' | 'esclavo' | null>(null);

  // --- MANOS (Nuestros arrays de cartas) ---
  manoJugador = signal<string[]>([]);
  manoCpu = signal<string[]>([]);

  // --- MESA (Para mostrar qué se jugó durante el delay) ---
  cartaJugada = signal<string | null>(null);
  cartaCpu = signal<string | null>(null);
  resultadoMano = signal<string>(''); // 'victoria', 'derrota', 'empate'
  bloquearMesa = signal(false);

  // --- CONFIGURACIÓN  DEL MODAL ---
  modalTipo = signal<'inicio' | 'fin' | 'racha'>('inicio');
  modalTitulo = signal('');
  modalMensaje = signal('');
  modalBtnConfirmar = signal('');
  modalBtnCancelar = signal('');

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.vidas.set(3);
    this.puntos.set(0);
    this.rachaVictorias.set(0);
    this.bandoJugador.set(null);
    this.limpiarMesa();
    this.pedirBandoInicial();
  }

  // 1. EL MODAL ARRANCA EL JUEGO
  pedirBandoInicial() {
    this.modalTipo.set('inicio');
    this.modalTitulo.set('E-Card: Elige tu Bando');
    this.modalMensaje.set('Emperador: Ganas 1 punto (Más seguro).\nEsclavo: Ganas 3 puntos (Más difícil).');
    this.modalBtnConfirmar.set('Bando Emperador');
    this.modalBtnCancelar.set('Bando Esclavo');
    this.modalService.abrir();
  }

  // 2. REPARTIMOS LAS CARTAS
  repartirCartas(bandoElegido: 'emperador' | 'esclavo') {
    this.bandoJugador.set(bandoElegido);
    
    // Armamos los mazos según las reglas de Kaiji
    const mazoEmperador = ['ciudadano', 'ciudadano', 'ciudadano', 'ciudadano', 'emperador'];
    const mazoEsclavo = ['ciudadano', 'ciudadano', 'ciudadano', 'ciudadano', 'esclavo'];

    if (bandoElegido === 'emperador') {
      this.manoJugador.set([...mazoEmperador]);
      this.manoCpu.set([...mazoEsclavo]);
    } else {
      this.manoJugador.set([...mazoEsclavo]);
      this.manoCpu.set([...mazoEmperador]);
    }
  }

  // 3. LA JUGADA (El clic en el HTML)
  jugarCarta(indiceCarta: number) {
    if (this.bloquearMesa()) return;
    this.bloquearMesa.set(true);

    // Sacamos la carta del jugador del array
    const cartaElegida = this.manoJugador()[indiceCarta];
    const nuevaManoJugador = [...this.manoJugador()];
    nuevaManoJugador.splice(indiceCarta, 1);
    this.manoJugador.set(nuevaManoJugador);
    this.cartaJugada.set(cartaElegida);

    // Turno CPU: Elige una carta al azar de su array y la saca
    const indiceCpu = Math.floor(Math.random() * this.manoCpu().length);
    const elegidaCpu = this.manoCpu()[indiceCpu];
    const nuevaManoCpu = [...this.manoCpu()];
    nuevaManoCpu.splice(indiceCpu, 1);
    this.manoCpu.set(nuevaManoCpu);
    this.cartaCpu.set(elegidaCpu);

    // Evaluamos quién ganó
    this.evaluarEnfrentamiento(cartaElegida, elegidaCpu);
  }

  // 4. LÓGICA DE PIEDRA, PAPEL O TIJERA ASIMÉTRICO
  evaluarEnfrentamiento(jugador: string, cpu: string) {
    let resultado = 'derrota';

    if (jugador === cpu) {
      resultado = 'empate'; // Ciudadano vs Ciudadano
    } else if (
      (jugador === 'emperador' && cpu === 'ciudadano') ||
      (jugador === 'ciudadano' && cpu === 'esclavo') ||
      (jugador === 'esclavo' && cpu === 'emperador')
    ) {
      resultado = 'victoria';
    }

    this.resultadoMano.set(resultado);

    // Aplicamos los efectos
    setTimeout(() => {
      if (resultado === 'empate') {
        this.limpiarMesa();

      } else if (resultado === 'victoria') { //repartimos puntos y aumentamos racha
        const puntosGanados = this.bandoJugador() === 'esclavo' ? 3 : 1;
        this.puntos.update(p => p + puntosGanados);
        this.rachaVictorias.update(r => r + 1);
        if (this.rachaVictorias() >= 3) {
          this.manejarRacha();
        } else { // Gana la ronda, se reinician los mazos completos
          this.limpiarMesa();
          this.repartirCartas(this.bandoJugador()!);
        }
      } else {
        // Derrota
        this.vidas.update(v => v - 1);
        this.rachaVictorias.set(0); // Pierde la racha
        
        if (this.vidas() <= 0) { // Fin del juego guardamos resultado y mostramos modal de fin
          this.finalizarJuego();
        } else {
          this.limpiarMesa();
          this.repartirCartas(this.bandoJugador()!);
        }
      }
    }, 2000); // 2 segundos de suspenso para ver la carta del rival
  }

  // 5. MANEJADOR DEL MODAL (El "cerebro" de los botones)
  manejarAccionConfirmar() {
    this.modalService.cerrar();
    
    if (this.modalTipo() === 'inicio') {
      this.repartirCartas('emperador'); // El botón Confirmar era "Emperador"
    } else if (this.modalTipo() === 'racha') {
      // Decidió cambiar de bando
      const nuevoBando = this.bandoJugador() === 'emperador' ? 'esclavo' : 'emperador';
      this.rachaVictorias.set(0); // La racha se reinicia al cambiar
      this.repartirCartas(nuevoBando);
      this.limpiarMesa();
    } else if (this.modalTipo() === 'fin') {
      this.iniciarJuego(); // Jugar de nuevo
    }
  }

  manejarAccionCancelar() {
    this.modalService.cerrar();
    
    if (this.modalTipo() === 'inicio') {
      this.repartirCartas('esclavo'); // El botón Cancelar era "Esclavo"
    } else if (this.modalTipo() === 'racha') {
      // Decidió seguir igual
      this.rachaVictorias.set(0); // Reiniciamos el contador de racha para el próximo aviso
      this.repartirCartas(this.bandoJugador()!);
      this.limpiarMesa();
    } else if (this.modalTipo() === 'fin') {
      this.router.navigate(['/']); // Salir
    }
  }

  // --- UTILIDADES ---
  manejarRacha() {
    this.modalTipo.set('racha');
    this.modalTitulo.set('¡Racha de 3 Victorias!');
    this.modalMensaje.set(`La casa está sudando frío. Estás jugando como ${this.bandoJugador()?.toUpperCase()}. ¿Querés cambiar de bando para cambiar tu puntuación?`);
    this.modalBtnConfirmar.set('Cambiar Bando');
    this.modalBtnCancelar.set('Seguir Igual');
    this.modalService.abrir();
  }

  finalizarJuego() {
    this.juegosService.guardarResultado('E-Card', this.puntos());
    this.modalTipo.set('fin');
    this.modalTitulo.set('¡Estás en bancarrota!');
    this.modalMensaje.set(`Perdiste tus 3 vidas. Conseguiste un total de ${this.puntos()} puntos.`);
    this.modalBtnConfirmar.set('Jugar de Nuevo');
    this.modalBtnCancelar.set('Salir al Menú');
    this.modalService.abrir();
  }

  limpiarMesa() {
    this.cartaJugada.set(null);
    this.cartaCpu.set(null);
    this.resultadoMano.set('');
    this.bloquearMesa.set(false);
  }



  
}