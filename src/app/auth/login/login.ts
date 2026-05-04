import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth'; 
import { Router , RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  formLogin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async entrar() {
    if (this.formLogin.valid) {
      const { email, password } = this.formLogin.value;
      const { data, error } = await this.authService.iniciarSesion(email, password);

      if (error) {
        console.log("Error: " + error.message);
      } else {
        console.log("Sesión iniciada", data);
        this.router.navigate(['/']);
      }
    }
  }

completarCampos(email: string, clave: string) {
  this.formLogin.patchValue({
    email: email,
    password: clave
  });
}

}