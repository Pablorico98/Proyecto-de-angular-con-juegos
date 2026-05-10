import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core'; // 
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs'; //  
import { PreguntadosService, Pregunta } from '../../services/preguntados';
import { JuegosService } from '../../services/juegos';
import { ModalService } from '../../services/modal';
import { ModalAviso  } from '../../components/modal-aviso/modal-aviso';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, ModalAviso, RouterLink],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.css']
})
export class PreguntadosComponent implements OnInit, OnDestroy { 
  // Inyección de servicios
  private preguntadosService = inject(PreguntadosService);
  public juegosService = inject(JuegosService); 
  public modalService = inject(ModalService);
  private router = inject(Router);

  // --- VARIABLES DE LÓGICA DE LISTA ---
  listaDesordenada: Pregunta[] = [];
  indicePreguntaActual: number = 0;

  // --- subscripcion para manejar la petición de preguntas ---
  private suscripcionPreguntas?: Subscription;  

  // --- SIGNALS DE ESTADO ---
  vidas = signal(3);
  puntos = signal(0);
  preguntaActual = signal<Pregunta | null>(null);
  opcionesMezcladas = signal<string[]>([]);
  
  // Signals para manejar la interfaz gráfica durante el delay
  respuestaSeleccionada = signal<string | null>(null);
  bloquearBotones = signal(false); 
  mensajeFinal = signal(''); // Para pasarlo al modal cuando (gane o pierda)

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    if (this.suscripcionPreguntas) {
      this.suscripcionPreguntas.unsubscribe(); //al destruir el componente, nos aseguramos de cancelar la suscripción para evitar fugas de memoria
    }
  }

  iniciarJuego() {
    // 1. Reseteamos los Signals a su estado de fábrica por si el jugador reinicia
    this.vidas.set(3);
    this.puntos.set(0);
    this.indicePreguntaActual = 0;
    this.bloquearBotones.set(false);
    this.respuestaSeleccionada.set(null);

    // 2. Traemos TODA la lista del JSON, la desordenamos una sola vez y la guardamos
    // Asignamos la petición a nuestra variable suscripcionPreguntas
    this.suscripcionPreguntas = this.preguntadosService.obtenerPreguntas().subscribe({
      next: (preguntas) => {
        this.listaDesordenada = this.mezclarArray([...preguntas]);
        this.cargarSiguientePregunta();
      },
      error: (err) => console.error('Error al cargar JSON:', err)
    });
  }

 cargarSiguientePregunta() {
    if (this.indicePreguntaActual >= this.listaDesordenada.length) {
      this.finalizarJuego('¡Completaste todas las preguntas!');
      return;
    }
    const pregunta = this.listaDesordenada[this.indicePreguntaActual]; // tomamos el objeto pregunta de la lista desordenada
    this.preguntaActual.set(pregunta); // Actualizamos el Signal de la pregunta actual
    const opciones = [pregunta.respuestaCorrecta, ...pregunta.respuestasIncorrectas]; //juntamos las opciones en un solo array
    this.opcionesMezcladas.set(this.mezclarArray(opciones)); // lo mezclamos y actualizamos el Signal de opciones
    this.respuestaSeleccionada.set(null);//reiniciamos los estados de la interfaz para la nueva pregunta
    this.bloquearBotones.set(false);
  }

  evaluarRespuesta(opcionElegida: string) {
  
    if (this.bloquearBotones()) return; //evitamos doble clics durante el delay

    // Bloqueamos la botonera y guardamos lo que eligió  
    this.bloquearBotones.set(true);
    this.respuestaSeleccionada.set(opcionElegida);
    const esCorrecta = opcionElegida === this.preguntaActual()?.respuestaCorrecta; //comparamos respuesta
    if (esCorrecta) {
      this.puntos.update(p => p + 1);
    } else {
      this.vidas.update(v => v - 1);
    }

    
    setTimeout(() => { //delay para que el usuario vea si acertó o no antes de avanzar
      if (this.vidas() <= 0) {
        this.finalizarJuego('¡Te quedaste sin vidas!');
      } else {// Avanzamos el índice y cargamos la siguiente
        this.indicePreguntaActual++;
        this.cargarSiguientePregunta();
      }
    }, 1500);
  }

  finalizarJuego(razon: string) {
    this.mensajeFinal.set(`Conseguiste ${this.puntos()} aciertos. ${razon}`);
    this.juegosService.guardarResultado('Preguntados', this.puntos());// Guardamos el resultado en Supabase usando el método genérico de JuegosService
    this.modalService.abrir(); //abirmos modal
  }

  // Métodos para el HTML del Modal (qué pasa cuando hace clic en los botones del modal)
  reiniciar() {
    this.modalService.cerrar();
    this.iniciarJuego();
  }
  salir() {
    this.modalService.cerrar();
    this.router.navigate(['/']); // Lo devolvemos a la bienvenida
  }

  
  private mezclarArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
}