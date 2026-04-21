import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Definimos validaciones
  formRegistro: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]]
  });

  async registrar() {
    if (this.formRegistro.valid) {
      console.log("Iniciando proceso de registro...");
      const { email, password, nombre, apellido, edad } = this.formRegistro.value;
      
      try {
        const { data, error } = await this.authService.registrarUsuario(
          email, 
          password, 
          { nombre, apellido, edad }
        );
        if (error) {
          console.error("Supabase devolvió un error:", error.message);
        } else {
          console.log('Usuario registrado:', data);
          this.router.navigate(['/']); 
        }
      } catch (err) {
        console.error('Error inesperado:', err);
      }
    }
  }
}