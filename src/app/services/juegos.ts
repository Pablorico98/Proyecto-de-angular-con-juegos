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
}