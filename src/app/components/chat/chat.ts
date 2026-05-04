import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {
  private chatService = inject(ChatService);
  
  nuevoMensaje = '';
  mensajes = signal<any[]>([]);  

  async ngOnInit() {
    const data = await this.chatService.obtenerMensajes();
    this.mensajes.set(data);
  }

  async mandar() {
    if (this.nuevoMensaje.trim()) {
      await this.chatService.enviarMensaje(this.nuevoMensaje);
      this.nuevoMensaje = '';
      
      const data = await this.chatService.obtenerMensajes(); // Por ahora refrescamos a mano, luego entra el Realtime
      this.mensajes.set(data); 
    }
  }
}