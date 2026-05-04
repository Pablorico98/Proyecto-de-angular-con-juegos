import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase: SupabaseClient;
  public canal: RealtimeChannel;
  private authService = inject(AuthService);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
     
    this.canal = this.supabase.channel('table-db-changes'); //inicializamos el canal para escuchar cambios en la tabla de mensajes
  }

  async enviarMensaje(texto: string) {
    const usuario = this.authService.usuarioActual();
    if (!usuario) return;

    const nombreParaMostrar = usuario.user_metadata?.['nombre'] || 'Usuario Anónimo';

    const { error } = await this.supabase
      .from('mensajes')
      .insert({
        user_id: usuario.id,
        nombre_usuario: nombreParaMostrar,
        contenido: texto
      });

    if (error) console.error('Error al enviar:', error.message);
  }

  async obtenerMensajes() {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .order('created_at', { ascending: true }); 

    if (error) {
      console.error('Error al obtener mensajes:', error.message);
      return [];
    }
    return data;
  }
}