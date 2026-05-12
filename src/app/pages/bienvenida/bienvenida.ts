import { Component, inject ,signal} from '@angular/core';
import { RouterOutlet, RouterLink, Router} from '@angular/router'
import { Card } from '../../components/card/card';
import { ModalService } from '../../services/modal';
import { ModalAviso } from '../../components/modal-aviso/modal-aviso';


@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [Card,RouterLink, RouterOutlet, ModalAviso],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {
  public modalService = inject(ModalService);
  private router = inject(Router)
  bloquearBotonChat = signal(false);
  misTarjetas = [
   {
      titulo: 'Ahorcado',
      subtitulo: 'Adiviná la palabra oculta antes de perder tus vidas.',
      imagen: 'ahorcado.png',  
      link: '/juegos/ahorcado'
    },
    {
      titulo: 'Mayor o Menor',
      subtitulo: 'Adiviná si la próxima carta es mayor o menor que la actual.',
      imagen: 'mayor_menor.png',
      link: '/juegos/mayor-menor'
    },
    {
      titulo: 'Preguntados',
      subtitulo: 'Respondé preguntas de cultura general y pon a prueba tus conocimientos.',
      imagen: 'preguntados.png',
      link: '/juegos/preguntados'
    },
    {
      titulo: 'E-Card',
      subtitulo: 'Supera a la CPU en este juego de cartas con estrategia y suerte.',
      imagen: 'emperador.png',
      link: '/juegos/e-card'
    }
  ];

 esChatActivo(): boolean {
    return this.router.url.includes('/chat');
  }
  
 irAlLogin() {
  this.modalService.cerrar();
  this.router.navigate(['/login'])
}

cerrarModal() {
  this.modalService.cerrar();
}


async toggleChat(ruta: string) {
    if (this.bloquearBotonChat()) return; 
    this.bloquearBotonChat.set(true); 
    await this.router.navigate([ruta]); 
    setTimeout(() => {
      this.bloquearBotonChat.set(false);
    }, 500);
  }




}