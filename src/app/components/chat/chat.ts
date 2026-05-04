import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  nuevoMensaje = '';
  mensajes = signal<any[]>([]);
  usuarioId = '';

  async ngOnInit() {
    
    this.usuarioId = this.authService.usuarioActual()?.id || ''; // Obtenemos el ID del usuario actual para diferenciar mensajes
    const data = await this.chatService.obtenerMensajes(); // 1. Traer mensajes ya existentes
    this.mensajes.set(data);
    this.chatService.canal    // 2. Suscribirse al canal de tiempo real 
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
        },
        (mensajeActual) => {
          this.mensajes.update((prev) => [...prev, mensajeActual.new]); // Actualizamos el signal con el nuevo mensaje
          this.hacerScroll();
        }
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.chatService.canal.unsubscribe(); // Desuscribirse al salir para evitar fugas de memoria 
  }

  async mandar() {
    if (this.nuevoMensaje.trim()) {
      await this.chatService.enviarMensaje(this.nuevoMensaje);
      this.nuevoMensaje = '';
    }
  }

  private hacerScroll() {
    setTimeout(() => {
      const scroll = document.querySelector('.mensajes-lista');
      if (scroll) scroll.scrollTop = scroll.scrollHeight;
    }, 50);
  }
}