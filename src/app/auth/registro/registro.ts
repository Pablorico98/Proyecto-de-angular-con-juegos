import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal';
import { ModalAviso } from '../../components/modal-aviso/modal-aviso';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalAviso, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public router = inject(Router);
  public modalService = inject(ModalService);

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
    const { email, password, nombre, apellido, edad } = this.formRegistro.value;
    try {
      const { error } = await this.authService.registrarUsuario(
        email, 
        password, 
        { nombre, apellido, edad }
      );
      if (error) {
        console.error("Error detectado:", error.message);
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          this.modalService.abrir();
        }
      } else {
        this.router.navigate(['/']); 
      }
    } catch (err) {
      console.error('Error inesperado en el componente:', err);
    }
  }
}

irAlLogin() {
  this.modalService.cerrar(); // Reseteamos el Signal a false
  this.router.navigate(['/login']);
}


}