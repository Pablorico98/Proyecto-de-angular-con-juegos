import { HttpClient } from '@angular/common/http'; /* # Importamos la herramienta para hacer peticiones a internet */
import { inject, Injectable, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient); // Inyectamos la herramienta para hacer peticiones a internet
  private apiUrl = 'https://api.github.com/users/';

  traerDatos(usuario: string, signalDeDestino: WritableSignal<any>) {
    
    const peticion = this.http.get(this.apiUrl + usuario);

    peticion.subscribe((data) => {
      if (data) {
        signalDeDestino.set(data)
        console.log(data);
      }
    });
  }
}