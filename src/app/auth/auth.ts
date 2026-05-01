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

 
async registrarUsuario(email: string, pass: string, datosExtra: any) {
  return await this.supabase.auth.signUp({
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


