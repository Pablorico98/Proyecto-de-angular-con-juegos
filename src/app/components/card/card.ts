import { Component , input} from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  // Definimos los huecos que se van a llenar desde el componente padre
  titulo = input('Título por defecto');
  subtitulo = input('Subtítulo por defecto');
  imagen = input('URL por defecto');
  link = input('#');
}