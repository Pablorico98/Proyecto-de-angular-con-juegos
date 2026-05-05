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
    
    this.usuarioId = this.authService.usuarioActual()?.id || '';  
    const data = await this.chatService.obtenerMensajes(); 
    this.mensajes.set(data);
    this.hacerScroll();
    this.chatService.canal     
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
        },
        (mensajeActual) => {
          this.mensajes.update((prev) => [...prev, mensajeActual.new]);
          this.hacerScroll();
        }
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.chatService.canal.unsubscribe();  
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