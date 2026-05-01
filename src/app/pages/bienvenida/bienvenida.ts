import { Component, inject } from '@angular/core';
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
  
  misTarjetas = [
    {
      titulo: 'Aprender Angular',
      subtitulo: 'Rutas y Lazy Loading',
      imagen: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=300', 
      link: '#'
    },
    {
      titulo: 'Base de Datos',
      subtitulo: 'Consultas SQL',
      imagen: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=300',
      link: '#'
    },
    {
      titulo: 'Diseño Web',
      subtitulo: 'CSS y Glassmorphism',
      imagen: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=300',
      link: '#'
    },
    {
      titulo: 'Lógica Backend',
      subtitulo: 'Creación de APIs',
      imagen: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300',
      link: '#'
    }
  ];
 irAlLogin() {
  this.modalService.cerrar();
    this.modalService.cerrar(); // Cerramos el modal antes de irnos
    this.router.navigate(['/login'])
}

cerrarModal() {
  this.modalService.cerrar();
}




}