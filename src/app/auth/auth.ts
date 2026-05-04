import { Injectable,signal, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private router = inject(Router); 
  usuarioActual = signal<User | null>(null);
  
  constructor() {
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    // Al iniciar, chequeamos si ya había una sesión guardada
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.usuarioActual.set(session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.usuarioActual.set(session?.user ?? null);
    });
  }

 
// auth.service.ts

async registrarUsuario(email: string, pass: string, datosExtra: { nombre: string, apellido: string, edad: number }) {
  const { data, error: authError } = await this.supabase.auth.signUp({  //Crear el usuario en Auth
    email: email,
    password: pass,
    options: {
      data: {
        nombre: datosExtra.nombre,
        apellido: datosExtra.apellido,
        edad: datosExtra.edad
      }
    }
    
  });
  if (authError) {// Si hubo error en el registro de mail/pass, cortamos acá
    return { data: null, error: authError };
  }
  if (data.user) {   // Si se creó bien el usuario, insertamos sus datos en la tabla pública
    const { error: dbError } = await this.supabase.from('usuarios').insert({
        id: data.user.id,  
        nombre: datosExtra.nombre,
        apellido: datosExtra.apellido,
        edad: datosExtra.edad,
        email: email
      });
    if (dbError) {
      return { data: null, error: dbError };
    }
  }

  return { data, error: null };
}

async iniciarSesion(email: string, pass: string) {
  return await this.supabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });
}
async cerrarSesion() {
    const { error } = await this.supabase.auth.signOut();
    if (!error) {
      this.usuarioActual.set(null); // Limpiamos el signal manualmente
      this.router.navigate(['/login']); // Redirigimos al login después de cerrar sesión
    }
  }
}


