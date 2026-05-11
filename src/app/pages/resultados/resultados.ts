import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit {
  private juegosService = inject(JuegosService);

  // Un Signal para cada tabla
  ahorcadoList = signal<any[]>([]);
  mayorMenorList = signal<any[]>([]);
  preguntadosList = signal<any[]>([]);
  eCardList = signal<any[]>([]);
  cargando = signal(true);

  ordenInverso = signal({// Signals para controlar el estado del orden  
    ahorcado: false,
    mayorMenor: false,
    preguntados: false,
    eCard: false
  });

  // Signals computados: se actualizan solos cuando cambia la lista o el interruptor
  ahorcadoDisplay = computed(() => 
    this.ordenInverso().ahorcado ? [...this.ahorcadoList()].reverse() : this.ahorcadoList()
  );
  
  mayorMenorDisplay = computed(() => 
    this.ordenInverso().mayorMenor ? [...this.mayorMenorList()].reverse() : this.mayorMenorList()
  );

  preguntadosDisplay = computed(() => 
    this.ordenInverso().preguntados ? [...this.preguntadosList()].reverse() : this.preguntadosList()
  );

  eCardDisplay = computed(() => 
    this.ordenInverso().eCard ? [...this.eCardList()].reverse() : this.eCardList()
  );


  async ngOnInit() {
    const logs = await this.juegosService.obtenerResultados();

    // 1. AHORCADO: Mejor desempeño = Ganó primero + luego el que lo hizo en menos tiempo
    const ahorcado = logs.filter(l => l.juego === 'ahorcado').sort((a, b) => {
        if (a.resultado.gano !== b.resultado.gano) {
          return b.resultado.gano ? 1 : -1; // Los que ganaron van arriba
        }
        return a.resultado.tiempo_segundos - b.resultado.tiempo_segundos; // Menor tiempo va arriba
    });
    this.ahorcadoList.set(ahorcado);

    // 2. MAYOR O MENOR: Mejor desempeño = Más aciertos
    const mayorMenor = logs.filter(l => l.juego === 'mayor-menor').sort((a, b) => {
        return b.resultado.aciertos_totales - a.resultado.aciertos_totales;
    });
    this.mayorMenorList.set(mayorMenor);

    // 3. PREGUNTADOS: Mejor desempeño = Más puntos (el resultado es directamente el número)
    const preguntados = logs.filter(l => l.juego === 'Preguntados').sort((a, b) => {
        return b.resultado - a.resultado;
    });
    this.preguntadosList.set(preguntados);

    // 4. E-CARD: Mejor desempeño = Más puntos (el resultado es directamente el número)
    const eCard = logs.filter(l => l.juego === 'E-Card').sort((a, b) => {
        return b.resultado - a.resultado;
    });
    this.eCardList.set(eCard);
    this.cargando.set(false);
  }

toggleOrden(juego: 'ahorcado' | 'mayorMenor' | 'preguntados' | 'eCard') {
    this.ordenInverso.update(estado => ({
      ...estado,
      [juego]: !estado[juego]
    }));
  }

}