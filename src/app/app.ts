import { Component, inject, signal } from '@angular/core'; // 
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth/auth'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public authService = inject(AuthService);
  
  protected readonly title = signal('sala-de-juegos');
}