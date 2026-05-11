import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from  '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JuegosService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey); 
  }

  async guardarResultado(nombreJuego: string, datos: any) {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (user) {
      return await this.supabase
        .from('log_juegos')
        .insert({
          usuario_id: user.id,  
          juego: nombreJuego,
          resultado: datos    
        });
    }

    throw new Error("No hay un usuario autenticado para guardar el resultado");
  }
   
 async obtenerResultados() {
    const { data: logs, error: logsError } = await this.supabase   // 1. Traemos todos los registros de juegos
      .from('log_juegos')
      .select('*');

    const { data: users, error: usersError } = await this.supabase  // 2. Traemos todos los usuarios para saber quién es quién
      .from('usuarios')
      .select('id, nombre, apellido');

    if (logsError) { //captamos error 
      console.error('Error al obtener resultados:', logsError);
      return [];
    }

    return logs.map(log => {   // 3. Mapeamos para fusionar los datos y mostrar el nombre completo en vez del ID
      const usuario = users?.find(u => u.id === log.usuario_id);
      return {
        ...log,
        nombre_jugador: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Jugador Anónimo'
      };
    });
  }


} 



