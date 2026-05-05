import { Component , input} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  // Definimos los huecos que se van a llenar desde el componente padre
  titulo = input('Título por defecto');
  subtitulo = input('Subtítulo por defecto');
  imagen = input('URL por defecto');
  link = input('/');
}